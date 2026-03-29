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

  // Inregistram utilizatorul in Supabase Auth
  // Trigger-ul SQL 'on_auth_user_created' va crea automat profilul in tabelul 'utilizatori'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: nume }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return { error: error.message };
  }

  // Redirect la dashboard - sesiunea va fi activa automat
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
