// @ts-nocheck
import { db } from './index';
import { utilizatori, unitati, categorii, produse } from './schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Pornire proces de seed...');

  try {
    // 1. Inserare unități de măsură
    console.log('📦 Inserare unități de măsură...');
    const unitatiDate = [
      { id: 1, nume: 'Bucăți', simbol: 'Buc' },
      { id: 2, nume: 'Kilograme', simbol: 'Kg' },
      { id: 3, nume: 'Litri', simbol: 'L' },
    ];

    for (const unitate of unitatiDate) {
      await db.insert(unitati).values(unitate).onConflictDoNothing();
    }
    console.log('✅ Unități de măsură inserate.');

    // 2. Inserare categorii
    console.log('📂 Inserare categorii...');
    const categoriiDate = [
      { id: 1, nume: 'Băuturi', descriere: 'Cafea, ceai, sucuri' },
      { id: 2, nume: 'Alimente de bază', descriere: 'Făină, zahăr, ulei' },
      { id: 3, nume: 'Echipamente', descriere: 'Căni, espressoare' },
    ];

    for (const cat of categoriiDate) {
      await db.insert(categorii).values(cat).onConflictDoNothing();
    }
    console.log('✅ Categorii inserate.');

    // 3. Inserare produse de test
    console.log('🍎 Inserare produse de test...');
    const produseDate = [
      { nume: 'Cafea Arabica 1kg', descriere: 'Boabe proaspăt prăjite', pret: 8500, stoc: 15, categorie_id: 1, unitate_id: 2 },
      { nume: 'Lapte UHT 1.5%', descriere: 'Cutie 1L', pret: 650, stoc: 24, categorie_id: 1, unitate_id: 3 },
      { nume: 'Cănă Ceramică Albă', descriere: 'Capacitate 300ml', pret: 1200, stoc: 50, categorie_id: 3, unitate_id: 1 },
    ];

    for (const prod of produseDate) {
      await db.insert(produse).values(prod).onConflictDoNothing();
    }
    console.log('✅ Produse inserate.');

    // 4. Inserare utilizator Admin
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
