import Redis from 'ioredis'

const urls: { [key: string]: string; } = {
  users: process.env.UPSTASH_USERS_REDIS_URL as string,
  sessions: process.env.UPSTASH_SESSIONS_REDIS_URL as string,
  passcodes: process.env.UPSTASH_PASSCODES_REDIS_URL as string,
}

export async function getClient({ 
  name 
}: { 
  name: string; 
}) {
  // set and return client connection to redis
  try {
    const conn = await new Redis(urls[name])
    if(!conn) return
    return conn
  } catch(e) {
    console.log({ error: e })
    return
  }
}
