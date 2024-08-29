import { API_URL, API_ENDPOINT_VERIFY } from 'app/lib'

export async function verify({ 
  val, 
  id 
}: { 
  val: string, 
  id: string; 
}) {
  const endpoint = `${API_URL}/${API_ENDPOINT_VERIFY}/${id}`
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      val
    })
  })

  const response = await res.json()

  if (response.error) {
    return response
  }

  return response
}