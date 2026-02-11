import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const AI_API_KEY = process.env.AI_API_KEY;
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

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log('✅ MongoDB connected');
}

async function generatePost(): Promise<GeneratedPost> {
  if (!AI_API_KEY) {
    throw new Error('Missing environment variable: AI_API_KEY');
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
  if (!MONGODB_URI || !AI_API_KEY) {
    console.warn(
      '⚠️ Skipping auto generation: required secrets are missing (MONGODB_URI and/or AI_API_KEY).'
    );
    return;
  }

  try {
    await connectMongo();
    const generatedPost = await generatePost();
    await savePost(generatedPost);
  } catch (error) {
    console.error('❌ Auto generation failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
