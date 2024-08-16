'use server'

import { nowInSeconds } from 'lib'
import { getItem, setItem } from '../..'
import { RedisInstance, Session } from 'types'

export async function createSession({
  id,
  userId
}: {
  id: string;
  userId: string;
}): Promise<Session> {
  return {
    id,
    createdAt: nowInSeconds(),
    loggedOutAt: 0,
    userId,
    active: true,
  }
}

export async function saveSession({
  session
}: {
  session: Session
}): Promise<void> {
  const res = await setItem({ 
    name: RedisInstance.Sessions, 
    id: session.id, 
    payload: JSON.stringify(session) 
  })
  if (!res) {
    throw new Error('Failed to save session')
  }
}

export async function updateActiveUserIdsOnSessions({
  userId,
  sessionId
}: {
  userId: string;
  sessionId?: string;
}): Promise<void> {
  const current = await getItem({ 
    name: RedisInstance.Sessions, 
    key: 'activeUserIdsKv'
  }) || {}
  const activeUserIdsKv = { 
    ...current, 
    [userId]: sessionId 
  }
  
  const res = await setItem({ 
    name: RedisInstance.Sessions, 
    key: 'activeUserIdsKv', 
    payload: JSON.stringify(activeUserIdsKv) 
  })

  if (!res) {
    throw new Error('Failed to update active user IDs')
  }
}

export async function deactivateExistingSession({
  userId
}: {
  userId: string;
}): Promise<void> {
  const activeUserIdsKv = await getItem({ 
    name: RedisInstance.Sessions, 
    key: 'activeUserIdsKv'
  })
  if (!activeUserIdsKv) return

  // get session id
  const sessionId = activeUserIdsKv[userId]

  // get session
  if (sessionId) {
    const session = await getItem({ 
      name: RedisInstance.Sessions, 
      id: sessionId
    }) as Session

    // deactivate session
    session.active = false
    session.loggedOutAt = nowInSeconds()
    await setItem({ 
      name: RedisInstance.Sessions, 
      id: session.id, 
      payload: JSON.stringify(session) 
    })

    // remove userId from activeUserIdsKv
    delete activeUserIdsKv[userId]
    await setItem({ 
      name: RedisInstance.Sessions, 
      key: 'activeUserIdsKv', 
      payload: JSON.stringify(activeUserIdsKv) 
    })
  }
}