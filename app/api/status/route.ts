import { NextResponse } from 'next/server';
import { getDatabase, initializeDatabaseIndexes } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    await initializeDatabaseIndexes();

    return NextResponse.json(
      {
        success: true,
        database: 'connected',
        indexes: 'ready',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        database: 'disconnected',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
