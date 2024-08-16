'use client'

import {
  LoginScreen
} from 'app/features/auth/login/screen'
import { login } from 'lib'

export default function Login() {
  return <LoginScreen login={login} />
}
