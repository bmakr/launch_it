import { Redis } from "ioredis";
import { getClient } from "."

export async function deleteItem({
  name,
  key,
  id,
}: {
  name: string;
  key?: string
  id: string
}) {
  let conn: Redis
  try {
    conn = await getClient({ name }) as Redis
    if (!conn) return
  } catch (e) {
    console.log({ error: e })
    return
  }

  // key is optional
  const fullKey = key ? `${name}:${key}:${id}` : `${name}:${id}`
  try {
    const res = await conn.del(fullKey)
    return res
  } catch (e) {
    console.log({ error: e })
    return
  }
}
