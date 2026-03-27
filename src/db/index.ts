import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env');
}

// In development, we use a global variable to prevent too many connections
// during Next.js Hot Module Replacement (HMR).
let db: any;

if (process.env.NODE_ENV === 'production') {
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  // @ts-ignore
  if (!global.db) {
    const client = postgres(connectionString);
    // @ts-ignore
    global.db = drizzle(client, { schema });
  }
  // @ts-ignore
  db = global.db;
}

export { db };
