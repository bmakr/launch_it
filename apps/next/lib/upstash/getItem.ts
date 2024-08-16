'use server'

import { Redis } from 'ioredis';
import { getClient } from './getClient'
import { RedisInstance } from 'types';

export async function getItem({
  name,
  key,
  id
}: {
  name: RedisInstance;
  key?: string;
  id?: string;
}) {
  // get client connection to redis
  let json = ''
  try {
    const conn = await getClient({ name }) as Redis
    if (!conn) return

    // Construct the full key based on provided parameters
    const fullKey = [name, key, id].filter(Boolean).join(':')
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