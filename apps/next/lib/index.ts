// next
export { getBody } from './next'

// auth
export { signup, verify, login, logout, getSession, updateSession, resend } from './auth'

// upstash
export { 
  getItem, setItem, deleteItem, createUser, getUser, saveUser, updateEmailsKv, getEmailsKv, createPasscode, savePasscode, getPasscode, deletePasscode, updateActiveUserIdsOnPasscodes, deleteExistingPasscode,
  createSession, saveSession, deactivateExistingSession, updateActiveUserIdsOnSessions
} from './upstash'

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