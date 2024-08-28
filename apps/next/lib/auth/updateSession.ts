'use server'

import { NextRequest, NextResponse } from 'next/server'
import { decrypt, encrypt } from './encryption'
import { KeyValues } from 'types'

export async function updateSession(req: NextRequest): Promise<NextResponse | undefined> {
  const sessionCookie = req.cookies.get('session');
  
  if (!sessionCookie?.value) {
    return;
  }

  try {
    // Decrypt and parse the session data
    const sessionData: KeyValues = await decrypt(sessionCookie.value)

    // Create a new response
    const response = NextResponse.next();

    // Set the updated session cookie
    response.cookies.set({
      name: 'session',
      value: await encrypt(sessionData),
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000), // Refresh the session so it doesn't expire
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'strict', // Protect against CSRF attacks
    });

    return response;
  } catch (error) {
    console.error('Error updating session:', error);
    // Handle error (e.g., invalid session data)
    return NextResponse.next();
  }
}
