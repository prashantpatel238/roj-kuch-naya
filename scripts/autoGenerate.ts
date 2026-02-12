import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const MONGODB_DB = process.env.MONGODB_DB || 'roj-kuch-naya';
const POSTS_COLLECTION = 'posts';

interface GeneratedPost {
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function parseJsonResponse(raw: string): Omit<GeneratedPost, 'slug'> {
  const trimmed = raw.trim();

  // Handle both plain JSON and markdown fenced JSON.
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fencedMatch ? fencedMatch[1] : trimmed;

  const parsed = JSON.parse(jsonText) as Partial<Omit<GeneratedPost, 'slug'>>;

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

function buildFallbackPost(): GeneratedPost {
  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);

  const title = `दिल्ली अपडेट: ${isoDate} की बड़ी खबरें`;
  const content = [
    `दिल्ली में ${isoDate} को नागरिक सुविधाओं और ट्रैफिक प्रबंधन से जुड़े कई महत्वपूर्ण अपडेट सामने आए। स्थानीय प्रशासन ने प्रमुख मार्गों पर जाम कम करने के लिए अतिरिक्त इंतज़ाम करने की बात कही है।`,
    'शहर के अलग-अलग इलाकों में सार्वजनिक सेवाओं को बेहतर बनाने के लिए विभागीय टीमें सक्रिय हैं। अधिकारियों के अनुसार, नागरिकों से मिले फीडबैक के आधार पर प्राथमिक क्षेत्रों में त्वरित सुधार की प्रक्रिया जारी है।',
    'विशेषज्ञों का मानना है कि नियमित मॉनिटरिंग और समय पर सूचना साझा करने से लोगों को राहत मिलेगी। आने वाले दिनों में इन पहलों के असर को लेकर नई जानकारी जारी की जा सकती है।'
  ].join('\n\n');

  return {
    title,
    slug: toSlug(`${title}-${Date.now()}`),
    content,
    metaTitle: `दिल्ली न्यूज अपडेट ${isoDate}`.slice(0, 60),
    metaDescription:
      'दिल्ली की ताज़ा खबरें, ट्रैफिक और नागरिक सुविधाओं से जुड़े प्रमुख अपडेट का संक्षिप्त सार पढ़ें।'.slice(
        0,
        155
      )
  };
}

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log('✅ MongoDB connected');
}

async function generatePostWithOpenAI(): Promise<GeneratedPost> {
  if (!AI_API_KEY) {
    throw new Error('Missing environment variable: AI_API_KEY or OPENAI_API_KEY');
  }

  const openai = new OpenAI({ apiKey: AI_API_KEY });
  const prompt =
    'Write one short, SEO-friendly Hindi news post about Delhi with fields: title, content (3 short paragraphs), metaTitle (max 60 chars), metaDescription (max 155 chars). Return strict JSON only.';

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
    slug: toSlug(parsed.title)
  };
}

async function savePost(post: GeneratedPost) {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB connection is not initialized.');
  }

  const collection = db.collection(POSTS_COLLECTION);

  const now = new Date();
  const result = await collection.updateOne(
    { slug: post.slug },
    {
      $set: {
        title: post.title,
        slug: post.slug,
        category: 'daily',
        language: 'hi',
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        imageUrl:
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        createdAt: now
      }
    },
    { upsert: true }
  );

  const action = result.upsertedCount > 0 ? 'inserted' : 'updated';
  console.log(`✅ Post ${action}: ${post.slug}`);
}

async function main() {
  // In PR builds/secrets-restricted environments (e.g. fork PRs), skip gracefully.
  if (!MONGODB_URI) {
    console.warn('⚠️ Skipping auto generation: required secret MONGODB_URI is missing.');
    return;
  }

  try {
    await connectMongo();

    let generatedPost: GeneratedPost;

    console.log(`ℹ️ OpenAI request mode: ${AI_API_KEY ? 'enabled' : 'disabled (fallback mode)'}`);

    if (!AI_API_KEY) {
      console.warn('⚠️ AI_API_KEY/OPENAI_API_KEY missing. Falling back to template-based generated post.');
      generatedPost = buildFallbackPost();
    } else {
      try {
        generatedPost = await generatePostWithOpenAI();
      } catch (error) {
        if (isQuotaError(error)) {
          console.warn('⚠️ OpenAI quota exceeded (429). Falling back to template-based generated post.');
          generatedPost = buildFallbackPost();
        } else {
          throw error;
        }
      }
    }

    await savePost(generatedPost);
  } catch (error) {
    console.error('❌ Auto generation failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
