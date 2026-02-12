import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATABASE_NAME = 'roj-kuch-naya';
const COLLECTION_NAME = 'posts';
const QUIZ_LIMIT = 5;

export async function GET() {
  try {
    const db = await getDatabase();

    if (db.databaseName !== DATABASE_NAME) {
      throw new Error(`Connected to unexpected database: ${db.databaseName}`);
    }

    const questions = await db
      .collection(COLLECTION_NAME)
      .aggregate([
        { $match: { type: 'mcq' } },
        { $sample: { size: QUIZ_LIMIT } }
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      questions
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch quiz questions.'
      },
      { status: 500 }
    );
  }
}
