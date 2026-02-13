import mongoose, { type Connection, type mongo } from 'mongoose';
import { env } from '../config/env.ts';
import { ensurePostIndexes } from '../models/post.ts';

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnectionPromise: Promise<Connection> | undefined;
  // eslint-disable-next-line no-var
  var mongoIndexesPromise: Promise<void> | undefined;
}

function connectToDatabase(): Promise<Connection> {
  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = mongoose
      .connect(env.MONGODB_URI, { dbName: env.MONGODB_DB })
      .then((instance) => instance.connection);
  }

  return global.mongooseConnectionPromise;
}

export async function getDatabase(): Promise<mongo.Db> {
  const connection = await connectToDatabase();

  if (!connection.db) {
    throw new Error('MongoDB connection is not initialized.');
  }

  return connection.db;
}

export async function initializeDatabaseIndexes() {
  if (!global.mongoIndexesPromise) {
    global.mongoIndexesPromise = (async () => {
      const db = await getDatabase();
      await ensurePostIndexes(db);
    })();
  }

  await global.mongoIndexesPromise;
}
