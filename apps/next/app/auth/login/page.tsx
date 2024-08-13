'use client'

import { login } from 'lib'

import { LoginScreen } from 'app/features/auth/login/screen'

export default function Login() {
  return (
    <>
      <LoginScreen login={login} />
    </>
  )
}
