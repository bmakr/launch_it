import { API_URL, API_ENDPOINT_LOGIN } from 'app/lib'
import { Response } from 'packages/app/shared'

export async function login({ val }: { val: string }): Promise<Response> {
  let response: Response
  const endpoint = `${API_URL}/${API_ENDPOINT_LOGIN}`
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ val })
    })

    response = await res.json()

  } catch (e) {
    console.log({ error: e })
    return { error: JSON.stringify(e) }
  }

  return response
}
