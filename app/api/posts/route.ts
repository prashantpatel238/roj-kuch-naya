import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { getPostsCollection, isPostCategory, isPostLanguage } from '@/lib/models/post';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;
const DEFAULT_PAGE = 1;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get('category');
    const language = params.get('language');
    const page = clampPage(Number(params.get('page') ?? DEFAULT_PAGE));
    const limit = clampLimit(Number(params.get('limit') ?? DEFAULT_LIMIT));

    if (!category || !isPostCategory(category)) {
      return NextResponse.json({ message: 'Valid category is required.' }, { status: 400 });
    }

    if (language && !isPostLanguage(language)) {
      return NextResponse.json({ message: 'Invalid language.' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = getPostsCollection(db);

    const filter = {
      category,
      ...(language ? { language } : {}),
      status: 'published' as const
    };

    const skip = (page - 1) * limit;

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
        .skip(skip)
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

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
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

function clampPage(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_PAGE;
  }

  return Math.floor(value);
}
