import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { utilizatori, sesiuni } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number) {
  const sessionId = crypto.randomUUID(); // folosim standardul web crypto pentru id
  const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 zile

  await db.insert(sesiuni).values({
    id: sessionId,
    user_id: userId,
    data_expirare: expirationDate,
  });

  const cookieStore = await cookies();
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expirationDate,
  });

  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) return null;

  const session = await db.query.sesiuni.findFirst({
    where: eq(sesiuni.id, sessionId),
    with: {
      user: true, // va trebui sa adaugam relatia in schema daca nu exista
    }
  });

  if (!session || session.data_expirare < new Date()) {
    return null;
  }

  return session;
}
