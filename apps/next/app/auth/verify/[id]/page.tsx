'use client'

import { VerifyScreen } from 'app/features/auth/verify/screen'
import { verify } from 'lib'

export default function Verify() {
  return (
    <>
      <VerifyScreen verify={verify} />
    </>
  )
}
