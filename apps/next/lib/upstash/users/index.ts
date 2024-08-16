'use server'

import { KeyValues, User } from 'types'
import { createId, nowInSeconds, getItem, setItem } from 'lib'
import { RedisInstance } from 'types'

export async function getEmailsKv(): Promise<KeyValues> {
  try {
    const emailsKv = await getItem({ name: RedisInstance.Users, key: 'emailsKv' }) as KeyValues
    return emailsKv || {}
  } catch (error) {
    throw new Error('Error fetching emailsKv in signup')
  }
}

export async function createUser({
  email
}: {
  email: string
}): Promise<User> {
  return {
    id: createId(),
    createdAt: nowInSeconds(),
    email,
    roles: ['free']
  }
}

export async function getUser({
  id
}:{
  id: string
}): Promise<User> {
  const user = await getItem({ name: RedisInstance.Users, id }) as User
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export async function saveUser({
  user
}: {
  user: User
}): Promise<void> {
  const setUserRes = await setItem({ name: RedisInstance.Users, id: user.id, payload: JSON.stringify(user) })
  if (!setUserRes) {
    throw new Error('Error saving user')
  }
}

export async function updateEmailsKv({
  emailsKv,
  email,
  userId
} : {
  emailsKv: KeyValues, email: string, userId: string
}): Promise<void> {
  const updatedEmailsKv = { ...emailsKv, [email]: userId }
  const setEmailKvRes = await setItem({
    name: RedisInstance.Users,
    key: 'emailsKv',
    payload: JSON.stringify(updatedEmailsKv)
  })
  if (!setEmailKvRes) {
    throw new Error('Error updating emailsKv')
  }
}