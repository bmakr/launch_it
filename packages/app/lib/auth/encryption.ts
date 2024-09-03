'use server'

import { SignJWT, jwtVerify } from 'jose'
import { createSecretKey } from 'crypto'
import { KeyValues } from 'app/shared/types'

// get the secret key from the environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string
if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not set in the environment variables')
}

const key = createSecretKey(Buffer.from(JWT_SECRET_KEY, 'utf-8'))

export async function encrypt(payload: KeyValues): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1y')
    .sign(key);
}

export async function decrypt(token: string): Promise<KeyValues> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}
