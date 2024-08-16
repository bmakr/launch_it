'use server'

import Redis from 'ioredis';
import { RedisInstance } from 'types'

// Define the structure for the Redis URLs
interface RedisUrls {
  [RedisInstance.Users]: string;
  [RedisInstance.Sessions]: string;
  [RedisInstance.Passcodes]: string;
}

// Create the URLs object with type checking
const urls: RedisUrls = {
  [RedisInstance.Users]: process.env.UPSTASH_USERS_REDIS_URL as string,
  [RedisInstance.Sessions]: process.env.UPSTASH_SESSIONS_REDIS_URL as string,
  [RedisInstance.Passcodes]: process.env.UPSTASH_PASSCODES_REDIS_URL as string,
};

// Create a cache to store Redis connections
const connectionCache: { [key in RedisInstance]?: Redis } = {};

export async function getClient({ 
  name
} : {
  name: RedisInstance
}): Promise<Redis | null> {
  try {
    // Check if a connection already exists in the cache
    if (connectionCache[name]) {
      return connectionCache[name]!;
    }

    // Ensure the URL exists for the given instance
    if (!urls[name]) {
      throw new Error(`No URL found for Redis instance: ${name}`);
    }

    // Create a new Redis connection
    const conn = new Redis(urls[name]);

    // Test the connection
    await conn.ping();

    // Store the connection in the cache
    connectionCache[name] = conn;

    return conn;
  } catch (error) {
    console.error(`Error connecting to Redis (${name}):`, error);
    return null;
  }
}
