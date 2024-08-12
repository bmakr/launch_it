'use server'

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get("email"), name: "John" };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function signup() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}


export async function verify({ val, id }: { val: string, id: string; }) {
  const res = await fetch(`${process.env.API_URL}${process.env.API_ENDPOINT_SIGNUP}${id}`, {
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
  console.log({ user })

  // Create the session
  // const expires = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
  const encrypted = await encrypt({ user, id });

  // Save the session in a cookie
  cookies().set('session', encrypted, {
    // expires, 
    // httpOnly: true
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30d
    path: "/",
  });

  return response
}