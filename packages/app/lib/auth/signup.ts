import { API_ENDPOINT_SIGNUP, API_URL } from "../data";

export async function signup({ email }: { email: string; }) {
  // Create a user && send a verification email
  try {
    const endpoint = `${API_URL}/${API_ENDPOINT_SIGNUP}`
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        val: email
      })
    })
  
    const response = await res.json()
    return response
  } catch (e) {
    console.log('signup()', { e })
    return { error: e }
  } 
}
