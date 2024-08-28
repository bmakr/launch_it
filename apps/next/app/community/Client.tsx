'use client'

import { useEffect } from 'react'
import { User } from 'types'
// import {
//   CommunityScreen
// } from 'app/features/community/screen.web'

export function ClientComponent({ isEmailInDb }: { isEmailInDb: any }) {
  useEffect(() => {
    console.log({ isEmailInDb })
  }, [isEmailInDb])

  return <div>Community</div>
}