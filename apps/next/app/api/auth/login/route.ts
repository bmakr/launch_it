import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { 
  createPasscode, getBody, nowInSeconds, sendVerificationEmail, validateEmail
} from 'lib'
import { Session } from 'types'

/*
  login route
  POST /api/auth/login
  input body: { val: string } as stringified JSON
  output: { passcodeId: string } as JSON

  validate email
  check for existing email
  If email is not in db, return error

  Send email with passcode
  Save new session
  If previous session exists, delete it
  Update user
*/
export async function POST(req: NextRequest) {
  // validate
  let redis, email, userId
  try {
    redis = Redis.fromEnv()
    if (!redis) return NextResponse.json({ error: 'Internal error: redis' }, { status: 500 })
    const body = await getBody({ req })
    const { val } = body

    // Validate email
    email = val
    await validateEmail({ email })

    // Check for existing email
    userId = await redis.get(`users:emails:${email}`)
    if (!userId) {
      return NextResponse.json({ error: 'That email is not in our db. Try again.', status: 400 })
    }

    userId = Number(userId)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Internal error. /login:userId NaN', status: 500 })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: `Internal error: /login:validation:${e}` }, { status: 500 })
  }

  // send email optimistically
  let passcode, sessionId
  try {
    passcode = createPasscode()
    sessionId = await redis.incr('sessions:id:counter')
    await await sendVerificationEmail({
      email,
      passcode,
      sessionId
    })      
  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: `Internal error: sending email /login:${e}` }, { status: 500 })
  }

  // create new session
  // delete existing session if present
  // update user with new sessionId
  try {
    // get existing session id for user
    const existingSessionId = redis.get(`sessions:sessionIdByUserId:${userId}`)
    const session: Session = { userId, passcode, createdAt: nowInSeconds() }

    // execute pipeline to create new session and delete old
    const pipe = redis.pipeline()
    pipe.del(`sessions:${existingSessionId}`) // delete existing session
    pipe.set(`sessions:sessionIdByUserId:${userId}`, sessionId) // userId index
    pipe.set(`sessions:${sessionId}`, session) // save session
    await pipe.exec()
  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: `Internal error: /login:create,delete session:${e}` }, { status: 500 })
  }

  // success
  return NextResponse.json({ id: sessionId })
}

