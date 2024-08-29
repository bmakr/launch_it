'use server'

import { cookies } from 'next/headers'

export async function logout() {
  try {
    // delete session coookie
    await cookies().delete('session')
    return
  } catch (e) {
    console.log('logout()', { e })
    return { error: e }
  }
}
