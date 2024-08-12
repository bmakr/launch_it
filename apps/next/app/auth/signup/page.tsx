'use client'

import { SignupScreen } from 'app/features/auth/signup/screen'
import { signup } from '../../../lib'

export default function Signup() {
  return <SignupScreen signup={signup} />
}
