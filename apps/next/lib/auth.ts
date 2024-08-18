'use server'

import { error } from "console";
import { SignJWT, jwtVerify } from "jose";
import { nowInSeconds } from "lib";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 year from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login({ val }: { val: string }) {
  let response
  const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_LOGIN}`
  console.log({ endpoint})
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ val })
    })

    console.log({ res })

    response = await res.json()
    console.log({ response })

  } catch (e) {
    console.log({ error: e })
    return { error: e }
  }

  return response
}

export async function logout({ id }: { id: string; }) {
  // Save loggedoutat in db
  let response
  try {
    // call logout endpoint
    const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_LOGOUT}/${id}`
    const res = await fetch(endpoint, {
      method: 'POST',
    })
    response = await res.json()
  } catch (e) {
    console.log('logout()', { e })
    response = { error: e }
  }

  if (response.error) {
    console.log('logout()', { response })
    return response
  }

  // delete session coookie
  cookies().delete('session')

  return response
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null
  try {
    const decrypted = await decrypt(session)
    const now = nowInSeconds()

    if (decrypted.payload?.exp && now < decrypted.payload.exp) {
      return { error: 'Session expired' }
    }
    return decrypted
  } catch (e: any) {
    console.error(e)
    return null
  }
  
}

// export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;
//   if (!session) return;

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });
//   return res;
// }


export async function verify({ val, id }: { val: string, id: string; }) {
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
    // expires, 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30d
    path: "/",
  });

  return response
}

export async function signup({ email }: { email: string; }) {
  // Create a user && send a verification email
  const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_SIGNUP}`
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      val: email
    })
  })

  const response = await res.json()
  if (response.error) {
    return response
  }

  return response
}