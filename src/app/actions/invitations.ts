'use server';

import { db } from '@/db/index';
import { invitatii, utilizatori, companii } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function sendInvitation(email: string, rol: 'ANGAJAT' | 'MANAGER' | 'CONTABIL') {
  const session = await getSession();
  if (!session || (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER')) {
    throw new Error('Neautorizat');
  }

  const companie_id = session.user.companie_id;
  if (!companie_id && session.user.rol !== 'ADMIN') {
    throw new Error('Trebuie să fii asociat unei firme pentru a trimite invitații.');
  }

  // Dacă e ADMIN și nu are companie_id, ar trebui să specifice una (viitor)
  // Momentan presupunem că MANAGER-ul trimite invitații
  const targetCompanyId = companie_id as number;

  try {
    await db.insert(invitatii).values({
      email,
      companie_id: targetCompanyId,
      rol,
      inviter_id: session.user.id,
    });

    revalidatePath('/utilizatori');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyInvitations() {
  const session = await getSession();
  if (!session) return [];

  return await db.query.invitatii.findMany({
    where: and(
        eq(invitatii.email, session.user.email),
        eq(invitatii.status, 'PENDING')
    ),
    with: {
      companie: true,
      inviter: true,
    }
  });
}

export async function acceptInvitation(invitationId: number) {
  const session = await getSession();
  if (!session) throw new Error('Neautorizat');

  const [invitation] = await db.select()
    .from(invitatii)
    .where(eq(invitatii.id, invitationId))
    .limit(1);

  if (!invitation || invitation.email !== session.user.email) {
    throw new Error('Invitație invalidă.');
  }

  try {
    // 1. Actualizăm utilizatorul
    await db.update(utilizatori)
      .set({
        companie_id: invitation.companie_id,
        rol: invitation.rol
      })
      .where(eq(utilizatori.id, session.user.id));

    // 2. Marcăm invitația ca acceptată
    await db.update(invitatii)
      .set({ status: 'ACCEPTED' })
      .where(eq(invitatii.id, invitationId));

    revalidatePath('/dashboard');
    revalidatePath('/welcome');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
