import { db } from '@/db/index';
import { utilizatori } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from './supabase';
import { cache } from 'react';

export const getSession = cache(async () => {
  const supabase = await createClient();
  
  // 1. Luam user-ul din sesiunea Supabase (verificare real-time)
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  // 2. Cautam profilul user-ului in tabelul nostru 'utilizatori'
  const [userProfile] = await db.select()
    .from(utilizatori)
    .where(eq(utilizatori.id, authUser.id))
    .limit(1);

  if (!userProfile) {
    return null;
  }

  return {
    user: userProfile,
    // Sesiunea expira cand expira token-ul Supabase, nu mai hardcodam aici.
  };
});
