'use server'

const API_URL = process.env.API_URL
const API_ENDPOINT_RESEND = process.env.API_ENDPOINT_RESEND

if (!API_URL || !API_ENDPOINT_RESEND ) {
  throw new Error('Environment variable is not set')
}

export async function resend({ id }: { id: string; }): Promise<{ id: string; } | { error: string }> {
  // call resend endpoint
  try {
    const endpoint = `${API_URL}/${API_ENDPOINT_RESEND}/${id}`
    const res = await fetch(endpoint, {
      method: 'POST',
    })
    const response = await res.json()
    return response
  } catch (e) {
    console.log('resend()', { e })
    return { error: String(e) }
  }
}
