import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compliance-saas';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Collection names
export const Collections = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  COMPLIANCE_DATA: 'compliance_data',
  TASKS: 'tasks',
  ALERTS: 'alerts',
} as const;
