import { db } from './db';
import { utilizatori } from './schema';

async function main() {
  console.log('🧪 Testare conexiune bază de date...');
  
  try {
    const users = await db.select().from(utilizatori).all();
    console.log(`✅ Conexiune reușită! Tabelul 'utilizatori' a fost accesat.`);
    console.log(`📊 Număr de utilizatori găsiți: ${users.length}`);
  } catch (error) {
    console.error('❌ Eroare la testarea conexiunii:', error);
    process.exit(1);
  }
}

main();
