'use server'

export async function signup({ email }: { email: string; }) {
  // Create a user && send a verification email
  try {
    const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_SIGNUP}`
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
