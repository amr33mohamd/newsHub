import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  return token ? { isAuth: true, token } : { isAuth: false, token: null };
});

export const requireAuth = cache(async () => {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/login');
  }

  return session;
});

export const getSession = cache(async () => verifySession());
