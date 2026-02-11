import { MongoClient } from 'mongodb';
import { env } from '@/lib/config/env';
import { ensurePostIndexes } from '@/lib/models/post';

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var mongoIndexesPromise: Promise<void> | undefined;
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global.mongoClientPromise) {
    client = new MongoClient(env.MONGODB_URI, options);
    global.mongoClientPromise = client.connect();
  }

  clientPromise = global.mongoClientPromise;
} else {
  client = new MongoClient(env.MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function getDatabase() {
  const connectedClient = await clientPromise;
  return connectedClient.db(env.MONGODB_DB);
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
