'use server'

import { getClient } from '.'

export async function setItem({
  name,
  key,
  id,
  payload
}: {
  name: string;
  key?: string;
  id?: string;
  payload: string;
}) {
  // set client connection to redis
  try {
    const conn = await getClient({ name })
    if (!conn) return

    // key and id are optional
    const fullKey = id && key ? `${name}:${key}:${id}` :
      id ?  `${name}:${id}` 
        : `${name}:${key}`

    const res = await conn.set(fullKey, payload)
    if (res) return true
  } catch (e) {
    console.log({ error: e })
    return
  }
}