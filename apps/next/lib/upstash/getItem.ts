'use server'

import { Redis } from 'ioredis';
import { getClient } from './getClient'

export async function getItem({
  name,
  key,
  id
}: {
  name: string;
  key?: string;
  id?: string;
}) {
  // set client connection to redis
  let json = ''
  try {
    const conn = await getClient({ name }) as Redis
    if (!conn) return

    // get item from redis
    // key and id are optional
    const fullKey = key && id ? `${name}:${key}:${id}`
      : id ? `${name}:${id}`
        : `${name}:${key}`
    json = await conn.get(fullKey) as string
  } catch (e) {
    return
  }

  // parse json
  let item
  try {
    item = JSON.parse(json)
    console.log({ item })

  } catch (e) {
    console.error(e)
    return
  }

  return item
}