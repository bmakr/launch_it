'use client'

import { ProfileScreen } from 'app/features/profile/screen.web'
import { getSession, logout } from 'lib'

export default function Profile() {
  return (
    <>
      <ProfileScreen getSession={getSession} logout={logout} />
    </>
  )
}
