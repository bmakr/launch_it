'use server'

import { cookies } from 'next/headers'
import { encrypt } from './encryption'

export async function setCookie({ 
  id 
}: { 
  id: string; 
}) {

  const encrypted = await encrypt({ id });

  // Save the session in a cookie
  cookies().set('session', encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30d
    path: '/',
  });

  return { id }
}