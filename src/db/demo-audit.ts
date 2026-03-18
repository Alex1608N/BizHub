import { db } from './db';
import { auditLogs, produse, utilizatori } from './schema';
import { auditLog } from '../lib/audit';
import { eq, desc } from 'drizzle-orm';

async function runDemo() {
  console.log('\n🚀 --- DEMO: BIZHUB AUDIT ENGINE --- 🚀');
  
  // 1. Identificam un user (sau folosim Admin-ul de la seed)
  const user = await db.query.utilizatori.findFirst();
  const userId = user?.id || 1;
  const userName = user?.nume || 'Admin';

  console.log(`👤 Utilizator logat: ${userName} (ID: ${userId})`);

  try {
    // 2. ACTIUNE: Creare Produs
    console.log('\n📦 Pas 1: Se adauga un produs nou in catalog...');
    const [p1] = await db.insert(produse).values({
      nume: 'Laptop Gaming Pro',
      pret: 450000, // 4500.00 RON
      stoc: 5
    }).returning();

    await auditLog(db, {
      user_id: userId,
      actiune: 'CREATE',
      tabel: 'produse',
      date_noi: p1
    });

    // 3. ACTIUNE: Update Stoc (Vanzare)
    console.log('📉 Pas 2: Se inregistreaza o vanzare (stoc scade de la 5 la 3)...');
    const [p2] = await db.update(produse)
      .set({ stoc: 3 })
      .where(eq(produse.id, p1.id))
      .returning();

    await auditLog(db, {
      user_id: userId,
      actiune: 'UPDATE',
      tabel: 'stoc',
      date_vechi: { id: p1.id, stoc: p1.stoc },
      date_noi: { id: p2.id, stoc: p2.stoc }
    });

    // 4. ACTIUNE: Stergere Produs (Eroare sau Retur)
    console.log('🗑️ Pas 3: Se sterge produsul (simulare curatare catalog)...');
    await db.delete(produse).where(eq(produse.id, p1.id));
    
    await auditLog(db, {
      user_id: userId,
      actiune: 'DELETE',
      tabel: 'produse',
      date_vechi: p2
    });

    // 5. AFISARE TIMELINE (Audit Trail)
    console.log('\n📜 --- TIMELINE DE AUDIT (Ultimele 3 actiuni) ---');
    const logs = await db.query.auditLogs.findMany({
      limit: 3,
      orderBy: [desc(auditLogs.id)],
      with: {
        user: true
      }
    });

    logs.forEach(log => {
      const time = new Date().toLocaleTimeString(); // SQLite timestamp e UTC, simulam local
      console.log(`[${time}] ${log.user?.nume || 'Sistem'} -> ${log.actiune} pe ${log.tabel}`);
      if (log.date_vechi) console.log(`   🔸 Vechi: ${log.date_vechi.substring(0, 50)}...`);
      if (log.date_noi) console.log(`   🔹 Noi:   ${log.date_noi.substring(0, 50)}...`);
      console.log('   -------------------------------------------------');
    });

    console.log('\n✅ Demo finalizat cu succes! Datele sunt salvate local in practica.db');

  } catch (error) {
    console.error('❌ Eroare in demo:', error);
  }
}

runDemo();
