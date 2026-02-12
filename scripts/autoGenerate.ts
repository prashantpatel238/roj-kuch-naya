import crypto from 'crypto';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const MONGODB_DB = process.env.MONGODB_DB || 'roj-kuch-naya';
const POSTS_COLLECTION = 'posts';
const CATEGORIES = ['daily', 'trending', 'rochak'] as const;
const LANGUAGES = ['hi', 'en'] as const;

type Category = (typeof CATEGORIES)[number];
type Language = (typeof LANGUAGES)[number];

interface GeneratedPost {
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  category: Category;
  language: Language;
}

function toSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  if (!slug) {
    return `post-${Date.now()}`;
  }

  return slug;
}

function normalizeForHash(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function buildDedupeHash(post: Pick<GeneratedPost, 'title' | 'content' | 'category' | 'language'>): string {
  const normalized = [post.category, post.language, normalizeForHash(post.title), normalizeForHash(post.content)]
    .join('|')
    .slice(0, 3000);

  return crypto.createHash('sha256').update(normalized).digest('hex');
}


function buildImageKeywords(post: Pick<GeneratedPost, 'title' | 'content' | 'category'>): string {
  const source = `${post.title} ${post.content}`.toLowerCase();
  const words = source
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6);

  if (words.length === 0) {
    return post.category;
  }

  return words.join(',');
}

function getImageForPost(post: Pick<GeneratedPost, 'title' | 'content' | 'category' | 'language'>): string {
  const keywords = buildImageKeywords(post);
  const seed = buildDedupeHash(post).slice(0, 12);
  const prompt = `${post.category} ${keywords}`;

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1600&height=900&seed=${seed}&nologo=true`;
}


function parseJsonResponse(raw: string): Omit<GeneratedPost, 'slug' | 'category' | 'language'> {
  const trimmed = raw.trim();

  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fencedMatch ? fencedMatch[1] : trimmed;

  const parsed = JSON.parse(jsonText) as Partial<Omit<GeneratedPost, 'slug' | 'category' | 'language'>>;

  if (!parsed.title || !parsed.content || !parsed.metaTitle || !parsed.metaDescription) {
    throw new Error('OpenAI response JSON missing required fields.');
  }

  return {
    title: parsed.title,
    content: parsed.content,
    metaTitle: parsed.metaTitle,
    metaDescription: parsed.metaDescription
  };
}

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const e = error as { status?: number; code?: string; type?: string; error?: { code?: string; type?: string } };

  return (
    e.status === 429 ||
    e.code === 'insufficient_quota' ||
    e.type === 'insufficient_quota' ||
    e.error?.code === 'insufficient_quota' ||
    e.error?.type === 'insufficient_quota'
  );
}

function buildFallbackPost(category: Category, language: Language): GeneratedPost {
  const isoDate = new Date().toISOString().slice(0, 10);

  if (language === 'hi') {
    const titleMap: Record<Category, string> = {
      daily: `दैनिक जानकारी अपडेट: ${isoDate}`,
      trending: `आज के ट्रेंडिंग विषय: ${isoDate}`,
      rochak: `रोचक जानकारी और तथ्य: ${isoDate}`
    };

    const title = titleMap[category];

    return {
      title,
      slug: toSlug(`${category}-hi-${title}`),
      category,
      language,
      content:
        `यह ${category} श्रेणी के लिए ${isoDate} का जानकारीपूर्ण सार है। इसमें उपयोगी, सुरक्षित और तटस्थ अपडेट शामिल हैं।\n\n` +
        'इस सामग्री का उद्देश्य केवल सामान्य जानकारी देना है ताकि पाठकों को एक स्थान पर स्पष्ट और सरल जानकारी मिल सके।\n\n' +
        'डेटा दोहराव से बचाने के लिए सिस्टम समान सामग्री को अपडेट करता है और नई जानकारी आने पर ही नया कंटेंट जोड़ता है।',
      metaTitle: `${title}`.slice(0, 60),
      metaDescription: `दिल्ली ${category} श्रेणी की जानकारी (${isoDate}) का संक्षिप्त सार।`.slice(0, 155)
    };
  }

  const titleMap: Record<Category, string> = {
    daily: `Daily Information Update: ${isoDate}`,
    trending: `Today's Trending Topics: ${isoDate}`,
    rochak: `Interesting Insights & Facts: ${isoDate}`
  };

  const title = titleMap[category];

  return {
    title,
    slug: toSlug(`${category}-en-${title}`),
    category,
    language,
    content:
      `This is a concise ${category} information summary (${isoDate}). It contains neutral and practical updates for readers.\n\n` +
      'The goal is to provide safe, easy-to-read informational content without sensational language.\n\n' +
      'To avoid duplicate information, identical generated entries are updated rather than inserted repeatedly.',
    metaTitle: `${title}`.slice(0, 60),
    metaDescription: `Quick ${category} information update for Delhi (${isoDate}).`.slice(0, 155)
  };
}

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log('✅ MongoDB connected');
}

async function generatePostWithOpenAI(category: Category, language: Language): Promise<GeneratedPost> {
  if (!AI_API_KEY) {
    throw new Error('Missing environment variable: AI_API_KEY or OPENAI_API_KEY');
  }

  const openai = new OpenAI({ apiKey: AI_API_KEY });
  const langText = language === 'hi' ? 'Hindi' : 'English';
  const categoryHint: Record<Category, string> = {
    daily: 'daily useful information',
    trending: 'currently trending topics',
    rochak: 'interesting facts and informative insights'
  };

  const prompt = `Write one short, SEO-friendly ${langText} informational post for category "${category}" (${categoryHint[category]}). Topic can be from any safe domain and is not restricted to any specific place. Avoid adult/restricted content, violence, fights/conflicts, hate, crime glorification, or strongly negative themes. Keep tone neutral and useful. Return strict JSON only with fields: title, content (3 short paragraphs), metaTitle (max 60 chars), metaDescription (max 155 chars).`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const raw = response.choices[0]?.message?.content?.trim();

  if (!raw) {
    throw new Error('OpenAI returned empty content.');
  }

  const parsed = parseJsonResponse(raw);

  return {
    ...parsed,
    category,
    language,
    slug: toSlug(`${category}-${language}-${parsed.title}`)
  };
}

async function savePost(post: GeneratedPost) {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB connection is not initialized.');
  }

  const collection = db.collection(POSTS_COLLECTION);
  const dedupeHash = buildDedupeHash(post);
  const now = new Date();

  const result = await collection.updateOne(
    {
      $or: [{ dedupeHash }, { slug: post.slug }]
    },
    {
      $set: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        language: post.language,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        dedupeHash,
        imageUrl: getImageForPost(post),
        status: 'published',
        createdAt: now
      }
    },
    { upsert: true }
  );

  const action = result.upsertedCount > 0 ? 'inserted' : 'updated';
  console.log(`✅ Post ${action}: [${post.category}/${post.language}] ${post.slug}`);
}

async function generateAndSave(category: Category, language: Language) {
  let usedOpenAI = false;
  let generatedPost: GeneratedPost;

  if (!AI_API_KEY) {
    generatedPost = buildFallbackPost(category, language);
  } else {
    try {
      generatedPost = await generatePostWithOpenAI(category, language);
      usedOpenAI = true;
    } catch (error) {
      if (isQuotaError(error)) {
        console.warn('⚠️ OpenAI quota exceeded (429). Falling back to template-based generated post.');
        generatedPost = buildFallbackPost(category, language);
      } else {
        throw error;
      }
    }
  }

  console.log(`ℹ️ Content source [${category}/${language}]: ${usedOpenAI ? 'openai' : 'fallback-template'}`);
  await savePost(generatedPost);
}

async function main() {
  if (!MONGODB_URI) {
    console.warn('⚠️ Skipping auto generation: required secret MONGODB_URI is missing.');
    return;
  }

  try {
    await connectMongo();

    console.log(`ℹ️ OpenAI request mode: ${AI_API_KEY ? 'enabled' : 'disabled (fallback mode)'}`);

    for (const category of CATEGORIES) {
      for (const language of LANGUAGES) {
        await generateAndSave(category, language);
      }
    }
  } catch (error) {
    console.error('❌ Auto generation failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
