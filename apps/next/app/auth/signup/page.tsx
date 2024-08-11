'use client'

import { SignupScreen } from 'app/features/auth/signup/screen'

const ENDPOINT = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT as string

async function signup({ email }: { email: string; }) {
  // Create a user && send a verification email
  const res = await fetch(ENDPOINT, {
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

export default function Signup() {
  return (
    <>
      <SignupScreen signup={signup} />
    </>
  )
}
