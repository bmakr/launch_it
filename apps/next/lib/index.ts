// next
export { getBody } from './next'

// auth
export { signup, verify, login, logout, getSession, updateSession, resend } from './auth'

// loops
export { sendVerificationEmail } from './loops'

// validations
export { validateEmail, validateId, validatePasscode } from './validations'

// helpers
export function createId() {
  return crypto.randomUUID().toString()
}

export function nowInSeconds() {
  const now = Date.now()
  return Math.floor(now/1000)
}

export function createPasscode() {
  return Math.floor(100000 + Math.random() * 900000)
}
