'use server';

import { db } from '@/db/index';
import { companii } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function getCompany(companyId?: number) {
  const session = await getSession();
  if (!session) return null;

  try {
    if (companyId) {
      const company = await db.query.companii.findFirst({
        where: eq(companii.id, companyId)
      });
      return company || null;
    }
    const company = await db.query.companii.findFirst();
    return company || null;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export async function updateCompanyAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.rol)) {
    return { error: 'Neautorizat. Doar administratorii pot modifica setările firmei.' };
  }

  const nume = formData.get('nume') as string;
  const cui = formData.get('cui') as string;
  const reg_com = formData.get('reg_com') as string;
  const adresa = formData.get('adresa') as string;
  const iban = formData.get('iban') as string;
  const banca = formData.get('banca') as string;
  const telefon = formData.get('telefon') as string;
  const email = formData.get('email') as string;
  const logo_url = formData.get('logo_url') as string;

  if (!nume) {
    return { error: 'Numele firmei este obligatoriu.' };
  }

  // Validare minimală CUI (format cifre, opțional prefix RO)
  if (cui && !/^(RO|ro)?\d{2,10}$/.test(cui.replace(/\s/g, ''))) {
    return { error: 'Format CUI invalid (ex: RO12345678).' };
  }

  try {
    const existingCompany = await db.query.companii.findFirst();

    const data = {
      nume, cui, reg_com, adresa, iban, banca, telefon, email, logo_url
    };

    if (existingCompany) {
      await db.update(companii).set(data).where(eq(companii.id, existingCompany.id));
    } else {
      await db.insert(companii).values(data);
    }

    revalidatePath('/settings');
    revalidatePath('/', 'layout');
    return { success: 'Datele firmei au fost salvate cu succes.' };
  } catch (error) {
    console.error('Error updating company:', error);
    return { error: 'A apărut o eroare la salvarea datelor.' };
  }
}
