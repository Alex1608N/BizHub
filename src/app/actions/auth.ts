'use server';

import { db } from '@/db/index';
import { utilizatori } from '@/db/schema';
import { count } from 'drizzle-orm';
import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nume = formData.get('nume') as string;

  if (!email || !password || !nume) {
    return { error: 'Toate câmpurile sunt obligatorii.' };
  }

  const supabase = await createClient();

  // 1. Inregistram utilizatorul in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: nume }
    }
  });

  if (authError || !authData.user) {
    console.error('Sign up error:', authError?.message);
    return { error: authError?.message || 'Eroare la crearea contului.' };
  }

  // 2. Determinăm rolul: primul user = ADMIN, restul = ANGAJAT
  const [userCount] = await db.select({ value: count() }).from(utilizatori);
  const role = userCount.value === 0 ? 'ADMIN' : 'ANGAJAT';

  // 3. Salvăm profilul în tabelul nostru 'utilizatori'
  try {
    await db.insert(utilizatori).values({
      id: authData.user.id,
      email,
      nume,
      rol: role as any,
    });
  } catch (dbError) {
    console.error('Error creating user profile in DB:', dbError);
    return { error: 'Contul a fost creat în Auth, dar a apărut o eroare la profil.' };
  }

  redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Toate câmpurile sunt obligatorii.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { error: 'Email sau parolă incorectă.' };
  }

  redirect('/dashboard');
}
