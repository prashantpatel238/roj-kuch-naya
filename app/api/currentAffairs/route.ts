import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATABASE_NAME = 'roj-kuch-naya';
const COLLECTION_NAME = 'posts';
const RESULT_LIMIT = 3;

export async function GET() {
  try {
    const db = await getDatabase();

    if (db.databaseName !== DATABASE_NAME) {
      throw new Error(`Connected to unexpected database: ${db.databaseName}`);
    }

    const rawItems = await db
      .collection(COLLECTION_NAME)
      .find(
        {},
        {
          projection: {
            _id: 1,
            title: 1,
            summary: 1,
            metaDescription: 1,
            date: 1,
            createdAt: 1,
            slug: 1
          }
        }
      )
      .sort({ date: -1 })
      .limit(RESULT_LIMIT)
      .toArray();

    const items = rawItems.map((item) => ({
      _id: String(item._id),
      title: item.title ?? 'Untitled',
      summary:
        item.summary ??
        item.metaDescription ??
        'Quick update from today’s current affairs feed.',
      date: item.date ?? item.createdAt ?? null,
      slug: item.slug ?? null
    }));

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch current affairs documents.'
      },
      { status: 500 }
    );
  }
}
