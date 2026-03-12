import { db } from './db';
import { utilizatori, unitati } from './schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Pornire proces de seed...');

  try {
    // 1. Inserare unități de măsură
    console.log('📦 Inserare unități de măsură...');
    const unitatiDate = [
      { nume: 'Bucăți', simbol: 'Buc' },
      { nume: 'Kilograme', simbol: 'Kg' },
      { nume: 'Litri', simbol: 'L' },
    ];

    for (const unitate of unitatiDate) {
      await db.insert(unitati).values(unitate).onConflictDoNothing();
    }
    console.log('✅ Unități de măsură inserate.');

    // 2. Inserare utilizator Admin
    console.log('👤 Creare utilizator Admin...');
    const parolaHash = await bcrypt.hash('admin123', 10);
    
    await db.insert(utilizatori).values({
      nume: 'Administrator',
      email: 'admin@practica.ro',
      parola_hash: parolaHash,
      rol: 'ADMIN',
    }).onConflictDoNothing();
    console.log('✅ Utilizator Admin creat (Email: admin@practica.ro, Parolă: admin123).');

    console.log('✨ Procesul de seed s-a încheiat cu succes!');
  } catch (error) {
    console.error('❌ Eroare în timpul procesului de seed:', error);
    process.exit(1);
  }
}

main();
