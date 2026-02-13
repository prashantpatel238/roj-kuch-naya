import mongoose from 'mongoose';
import { getDatabase } from '../lib/db/mongodb.ts';

const TARGET_DB_NAME = 'roj-kuch-naya';
const POSTS_COLLECTION = 'posts';

/**
 * One-time manual cleanup script.
 * Deletes every document in the "posts" collection from the target database.
 */
async function cleanPostsCollection(): Promise<void> {
  try {
    const connectedDb = await getDatabase();
    const db =
      connectedDb.databaseName === TARGET_DB_NAME
        ? connectedDb
        : mongoose.connection.getClient().db(TARGET_DB_NAME);
    const collection = db.collection(POSTS_COLLECTION);

    const { deletedCount } = await collection.deleteMany({});

    console.log(
      `✅ Cleanup complete: deleted ${deletedCount ?? 0} document(s) from ${TARGET_DB_NAME}.${POSTS_COLLECTION}.`
    );
  } catch (error) {
    console.error('❌ Failed to clean posts collection.', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void cleanPostsCollection();
