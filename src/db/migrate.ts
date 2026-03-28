// @ts-nocheck
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';
import path from 'path';

async function main() {
  console.log('⏳ Pornire migrare bază de date...');
  
  try {
    await migrate(db, { 
      migrationsFolder: path.join(process.cwd(), 'drizzle') 
    });
    console.log('✅ Migrare finalizată cu succes!');
  } catch (error) {
    console.error('❌ Eroare în timpul migrării:', error);
    process.exit(1);
  }
}

main();
