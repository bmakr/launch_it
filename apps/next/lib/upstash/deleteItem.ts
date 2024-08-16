'use server'

import { Redis } from 'ioredis'
import { getClient } from '.'
import { RedisInstance } from 'types'

interface DeleteItemParams {
  name: RedisInstance;
  key?: string;
  id: string;
}

export async function deleteItem({
  name,
  key,
  id,
}: DeleteItemParams): Promise<number | undefined> {
  let conn: Redis;

  try {
    conn = await getClient({ name }) as Redis;
    if (!conn) {
      console.log('Failed to establish Redis connection')
      return
    }

    const fullKey = key ? `${name}:${key}:${id}` : `${name}:${id}`;
    const result = await conn.del(fullKey);
    return result;
  } catch (error) {
    console.error('Error in deleteItem:', error);
    return;
  }
}
