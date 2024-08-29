'use client'

import {
  VerifyScreen
} from 'app/features/auth/verify/screen'
import { verify, resend } from 'lib'
import { setCookie } from 'lib'

export default function Verify() {
  return <VerifyScreen setCookie={setCookie} />
}
