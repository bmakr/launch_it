'use server'

import { KeyValues, Passcode, RedisInstance } from 'types'
import { 
  getItem, setItem, deleteItem, nowInSeconds, createId 
} from 'lib'

export async function createPasscode({ userId }: { 
  userId: string
}): Promise<Passcode> {
  return {
    id: createId(),
    createdAt: nowInSeconds(),
    code: Math.floor(100000 + Math.random() * 900000).toString(),
    userId
  }
}

export async function savePasscode({
  passcode 
}: {
  passcode: Passcode
}): Promise<void> {
  const createSessionRes = await setItem({
    name: RedisInstance.Passcodes,
    id: passcode.id,
    payload: JSON.stringify(passcode)
  })
  if (!createSessionRes) {
    throw new Error('Error saving passcode')
  }
}

export async function getPasscode({
  id
}: {
  id: string
}): Promise<Passcode> {
  const passcode = await getItem({ name: RedisInstance.Passcodes, id }) as Passcode
  if (!passcode || !passcode.code) {
    throw new Error('Passcode not found')
  }
  return passcode
}

export async function deletePasscode({ 
  id 
}: { 
  id: string 
}): Promise<void> {
  await deleteItem({ 
    name: RedisInstance.Passcodes, 
    id 
  })
}

export async function updateActiveUserIdsOnPasscodes({
  userId,
  passcodeId
}: {
  userId: string;
  passcodeId: string;
}): Promise<void> {
  const current = await getItem({ 
    name: RedisInstance.Passcodes, 
    key: 'activeUserIdsKv'
  }) || {}
  const activeUserIdsKv = { 
    ...current, 
    [userId]: passcodeId 
  }
  
  const res = await setItem({ name: RedisInstance.Passcodes, key: 'activeUserIdsKv', payload: JSON.stringify(activeUserIdsKv) })
  if (!res) {
    throw new Error('Failed to update active user IDs')
  }
}

export async function deleteExistingPasscode({
  userId
}: {
  userId: string
}): Promise<void> {
  const stored = await getItem({ 
    name: RedisInstance.Passcodes, key: 'activeUserIdsKv' 
  }) as KeyValues
  if (!stored) return
  if (!stored[userId]) return

  // delete passcode
  const id = stored[userId]
  await deletePasscode({ id })

  // update index
  delete stored[userId]
  const updated = { ...stored }
  await setItem({ 
    name: RedisInstance.Passcodes, 
    key: 'activeUserIdsKv',
    payload: JSON.stringify(updated) 
  })
}