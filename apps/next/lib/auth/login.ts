'use server'

export async function login({ val }: { val: string }) {
  let response
  const endpoint = `${process.env.API_URL}/${process.env.API_ENDPOINT_LOGIN}`
  console.log({ endpoint})
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ val })
    })

    console.log({ res })

    response = await res.json()
    console.log({ response })

  } catch (e) {
    console.log({ error: e })
    return { error: e }
  }

  return response
}
