import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { getPostsCollection, isPostCategory, isPostLanguage } from '@/lib/models/post';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 24;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get('category') ?? '';
    const language = params.get('language') ?? 'en';
    const limit = clampLimit(Number(params.get('limit') ?? DEFAULT_LIMIT));
    const offset = Math.max(0, Number(params.get('offset') ?? 0));

    if (!isPostCategory(category)) {
      return NextResponse.json({ message: 'Invalid category.' }, { status: 400 });
    }

    if (!isPostLanguage(language)) {
      return NextResponse.json({ message: 'Invalid language.' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = getPostsCollection(db);

    const filter = {
      category,
      language,
      status: 'published' as const
    };

    const [rawItems, total] = await Promise.all([
      collection
        .find(filter, {
          projection: {
            title: 1,
            slug: 1,
            category: 1,
            language: 1,
            metaDescription: 1,
            imageUrl: 1,
            createdAt: 1
          }
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter)
    ]);

    const items = rawItems.map((item) => ({
      _id: String(item._id),
      title: item.title,
      slug: item.slug,
      category: item.category,
      language: item.language,
      metaDescription: item.metaDescription,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt
    }));

    return NextResponse.json({
      items,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + rawItems.length < total
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to fetch posts.'
      },
      { status: 500 }
    );
  }
}

function clampLimit(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(MAX_LIMIT, Math.floor(value));
}
