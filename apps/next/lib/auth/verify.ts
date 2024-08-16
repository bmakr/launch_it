'use server'

import { cookies } from 'next/headers'
import { encrypt } from './encryption'

export async function verify({ 
  val, 
  id 
}: { 
  val: string, 
  id: string; 
}) {
  const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_VERIFY}/${id}`
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      val
    })
  })

  const response = await res.json()

  if (response.error) {
    return response
  }

  const { user } = response

  // Create the session
  // const expires = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
  const encrypted = await encrypt({ user, id });

  // Save the session in a cookie
  cookies().set('session', encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30d
    path: '/',
  });

  return response
}