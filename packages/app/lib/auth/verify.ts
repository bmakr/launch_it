import { cookies } from 'next/headers'
import { encrypt } from './encryption'
import { Platform } from 'react-native'

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

  // if web save the session in a cookie
  if (Platform.OS === 'web') {
    cookies().set('session', encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30d
      path: '/',
    }) 
  } else {
      // handle session on device for native
  }

  return response
}