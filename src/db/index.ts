import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env');
}

// Prevent multiple connections to the database in development and production
const globalForDb = global as unknown as { db: any };

let client: any;
let db: any;

if (!globalForDb.db) {
  client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
  if (process.env.NODE_ENV !== 'production') {
    globalForDb.db = db;
  }
} else {
  db = globalForDb.db;
}

export { db };
