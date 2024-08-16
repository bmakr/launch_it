'use server'

import { cookies } from 'next/headers'

export async function logout({ id }: { id: string; }) {
  let response
  try {
    // call logout endpoint
    const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_LOGOUT}/${id}`
    const res = await fetch(endpoint, {
      method: 'POST',
    })

    response = await res.json()
    // delete session coookie
    await cookies().delete('session')
    return response
  } catch (e) {
    console.log('logout()', { e })
    response = { error: e }
  }
}
