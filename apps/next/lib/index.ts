export { signup, verify, login, logout } from './auth'
export { getItem, setItem, deleteItem } from './upstash'
export { sendEmail } from './email'

export function createId() {
  return crypto.randomUUID().toString()
}

export function nowInSeconds() {
  const now = Date.now()
  return Math.floor(now/1000)
}
