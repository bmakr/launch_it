'use server'

import { cookies } from 'next/headers'
import { decrypt } from './encryption'
import { nowInSeconds } from 'lib'
import { JWTPayload } from 'types'

export async function getSession(): Promise<JWTPayload | { error: string } | null> {
  const sessionCookie = cookies().get('session');
  
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decrypted = await decrypt(sessionCookie.value) as JWTPayload;
    const now = nowInSeconds();

    // Check if the jwt has expired
    if (decrypted.payload?.exp && now >= decrypted.payload.exp) {
      return { error: 'Session expired' };
    }

    return decrypted;
  } catch (error) {
    console.error('Error decrypting session:', error);
    return null;
  }
} 
