'use server'

import { getClient } from '.'
import { RedisInstance } from 'types'

/**
 * Sets an item in Redis with a specified key and payload.
 * @param {Object} params - The parameters for setting the item.
 * @param {RedisInstance} params.name - The name of the Redis instance.
 * @param {string} [params.key] - Optional key component.
 * @param {string} [params.id] - Optional ID component.
 * @param {string} params.payload - The data to be stored.
 * @returns {Promise<boolean|undefined>} True if successful, undefined if failed.
 */
export async function setItem({
  name,
  key,
  id,
  payload
}: {
  name: RedisInstance;
  key?: string;
  id?: string;
  payload: string;
}): Promise<boolean | undefined> {
  try {
    // Get Redis client connection
    const conn = await getClient({ name })
    if (!conn) {
      console.log('Failed to establish Redis connection')
      return
    }

    // Construct the full key based on provided parameters
    const fullKey = [name, key, id].filter(Boolean).join(':')

    // Set the item in Redis
    const res = await conn.set(fullKey, payload)
    
    return res === 'OK'
  } catch (error) {
    console.error('Error setting item in Redis:', error)
    return
  }
}
