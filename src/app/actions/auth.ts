'use server';

import { db } from '@/db';
import { utilizatori } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Toate câmpurile sunt obligatorii.' };
  }

  try {
    const user = await db.query.utilizatori.findFirst({
      where: eq(utilizatori.email, email),
    });

    if (!user) {
      return { error: 'Email sau parolă incorectă.' };
    }

    const isPasswordValid = await verifyPassword(password, user.parola_hash);

    if (!isPasswordValid) {
      return { error: 'Email sau parolă incorectă.' };
    }

    await createSession(user.id);
    
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'A apărut o eroare la autentificare.' };
  }

  redirect('/dashboard');
}
