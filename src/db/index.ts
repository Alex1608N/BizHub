import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env');
}

// Prevent multiple connections to the database in development and production
let client: any;
let db: any;

if (!global.db) {
  client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
  if (process.env.NODE_ENV !== 'production') {
    global.db = db;
  }
} else {
  db = global.db;
}

export { db };
