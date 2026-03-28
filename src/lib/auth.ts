import { db } from '@/db/index';
import { utilizatori } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from './supabase';
import { cache } from 'react';

export const getSession = cache(async () => {
  const supabase = await createClient();
  
  // 1. Luam user-ul din sesiunea Supabase
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    // console.log('DEBUG: No authUser found in Supabase', error?.message);
    return null;
  }

  // 2. Cautam profilul user-ului in tabelul nostru 'utilizatori'
  const [userProfile] = await db.select()
    .from(utilizatori)
    .where(eq(utilizatori.id, authUser.id))
    .limit(1);

  if (!userProfile) {
    // console.log('DEBUG: No profile found for UUID:', authUser.id);
    return null;
  }

  // console.log('DEBUG: Session found for:', userProfile.email);
  return {
    user: userProfile,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), 
  };
});
