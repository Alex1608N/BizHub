import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env');
}

const globalForDb = global as unknown as { 
  client: postgres.Sql<{}> | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

let client: postgres.Sql<{}>;
let db: ReturnType<typeof drizzle<typeof schema>>;

if (process.env.NODE_ENV === 'production') {
  client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
} else {
  if (!globalForDb.db) {
    globalForDb.client = postgres(connectionString, { prepare: false });
    globalForDb.db = drizzle(globalForDb.client, { schema });
  }
  client = globalForDb.client!;
  db = globalForDb.db!;
}

export { db };
