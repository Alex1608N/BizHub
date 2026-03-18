import { db } from './db';
import { auditLogs, produse } from './schema';
import { auditLog } from '../lib/audit';
import { eq } from 'drizzle-orm';

async function testAudit() {
  console.log('--- Test Audit Engine ---');

  try {
    // 1. Simulam un CREATE
    console.log('Simulare CREATE produs...');
    const [newProduct] = await db.insert(produse).values({
      nume: 'Produs Test Audit ' + Date.now(),
      pret: 1000,
      stoc: 10
    }).returning();

    await auditLog(db, {
      user_id: null,
      actiune: 'CREATE',
      tabel: 'produse',
      date_noi: newProduct
    });

    // 2. Simulam un UPDATE
    console.log('Simulare UPDATE produs...');
    const [updatedProduct] = await db.update(produse)
      .set({ stoc: 20 })
      .where(eq(produse.id, newProduct.id))
      .returning();

    await auditLog(db, {
      user_id: null,
      actiune: 'UPDATE',
      tabel: 'produse',
      date_vechi: newProduct,
      date_noi: updatedProduct
    });

    // 3. Verificam logurile
    const logs = await db.select().from(auditLogs);
    console.log('Loguri gasite in DB:', logs.length);
    console.log(JSON.stringify(logs.slice(-2), null, 2));

    if (logs.length >= 2) {
      console.log('✅ Audit Engine functioneaza corect!');
    } else {
      console.log('❌ Audit Engine nu a salvat logurile.');
    }

  } catch (error) {
    console.error('Eroare in timpul testului:', error);
  }
}

testAudit();
