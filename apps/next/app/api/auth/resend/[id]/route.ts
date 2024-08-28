import { createPasscode, nowInSeconds, sendVerificationEmail } from 'lib'
import { NextRequest, NextResponse } from 'next/server'
import { Params, Session } from 'types'
import { Redis } from '@upstash/redis'

/*
  validate session id
  send email optimistically
  create new session
  delete existing session
*/
export async function POST(_: NextRequest, { params }: Params) {
  // validate
  let redis, existingSessionId
  try {
    redis = Redis.fromEnv()
    if (!redis) return NextResponse.json({ error: 'Internal error: redis' }, { status: 500 })
    // Extract session id from params
    const { id } = params;
    existingSessionId = Number(id)
    if (isNaN(existingSessionId)) return NextResponse.json({ error: 'Internal error. /resend:params.id NaN'})
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in POST /resend:', error);

    // Return a generic error response to the client
    return NextResponse.json(
      { error: 'Internal Error: /resend' }, 
      { status: 500 }
    );
  }

  // send email optimistically
  let passcode, sessionId, userId
  try {
    passcode = createPasscode()
    const pipe = redis.pipeline()
    pipe.get(`sessions:${existingSessionId}`) // existingSession 0
    pipe.incr('sessions:id:counter') // sessionId 1
    const results = await pipe.exec()
    const existingSession = results[0]
    sessionId = results[1]
    userId = existingSession.userId
    const user = await redis.get(`users:${userId}`)
    const { email } = user
    
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
  try {
    // get existing session id for user
    const existingSessionId = redis.get(`sessions:sessionIdByUserId:${userId}`)
    const session: Session = { userId, passcode, createdAt: nowInSeconds() }

    // execute pipeline to create new session and delete old
    const pipe = redis.pipeline()
    pipe.del(`sessions:${existingSessionId}`) // delete existing session
    pipe.set(`sessions:sessionIdbyUserId:${userId}`, sessionId) // userId index
    pipe.set(`sessions:${sessionId}`, session) // save session
    await pipe.exec()
  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: `Internal error: /login:create,delete session:${e}` }, { status: 500 })
  }

  // success
  return NextResponse.json({ id: sessionId })

}