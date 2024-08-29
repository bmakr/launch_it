'use server'

import { cookies } from 'next/headers'

export async function logout({ id }: { id: string; }) {
  let response
  try {
    // delete session coookie
    await cookies().delete('session')
    return response
  } catch (e) {
    console.log('logout()', { e })
    response = { error: e }
  }
}
