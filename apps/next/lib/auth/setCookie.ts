'use server'

import { cookies } from 'next/headers'
import { encrypt } from './encryption'
import { User } from 'types';

export async function setCookie({ 
  user, 
  id 
}: { 
  user: User; 
  id: string; 
}) {
  const encrypted = await encrypt({ user, id });

  // Save the session in a cookie
  cookies().set('session', encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30d
    path: '/',
  });

  return { user, id }
}