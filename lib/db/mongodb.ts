import { MongoClient } from 'mongodb';
import { env } from '@/lib/config/env';

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
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
