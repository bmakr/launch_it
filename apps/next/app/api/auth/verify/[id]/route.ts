import { Params, Session } from 'types'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
import { 
  getBody,
  nowInSeconds
} from 'lib'

/*
  get session id from params
  get passcode input val from body
  validate val exists

  get session
  validate input agains session.passcode 
  validate expiration
  get user from session.userID
  return user
*/
export async function POST(req: NextRequest, { params }: Params) {
  // validate
  let redis, sessionId, input
  try {
    redis = Redis.fromEnv()
    if (!redis) return NextResponse.json({ error: 'Internal error: redis' }, { status: 500 })
    
    //validate id from params
    sessionId = params.id
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Internal error: params' }, { status: 500 }
      )
    }

    // get input code from body
    const body = await getBody({ req })
    const { val } = body
    if (!val) {
      return NextResponse.json(
        { error: 'Internal error: /verify:No val in body', status: 500 }
      )
    }

    input = Number(val)
    if (isNaN(input)) {
      return NextResponse.json(
        { error: 'Internal error: /verify:Val NaN', status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    console.error('Error in /verify:validation', error)
    return NextResponse.json(
      { error: 'Internal server error /verify:validation' }, 
      { status: 500 }
    )
  }

  // get session
  let user, numericalId
  try {
    numericalId = Number(sessionId)
    if (isNaN(numericalId)) {
      return NextResponse.json(
        { error: 'Invalid session ID', status: 400 }
      )
    }
    
    const session = await redis.get(`sessions:${sessionId}`) as Session
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found', status: 404 }
      )
    }

    const { passcode, userId, createdAt } = session

    if (!passcode || ! userId || !createdAt) {
      return NextResponse.json(
        { error: 'Internal Error: /verify:deconstructing session', status: 400 }
      )
    }    

    // check input against saved passcode
    if (input !== passcode) {
      return NextResponse.json(
        { error: 'Invalid code. Please re-check the code', status: 400 }
      )
    }

    // check expiration
    const PASSCODE_EXPIRATION_TIME = 300; // 5 minutes in seconds
    if (nowInSeconds() - createdAt > PASSCODE_EXPIRATION_TIME) {
      return NextResponse.json(
        { error: 'Passcode has expired', status: 400 }
      )
    } 

    // get user
    user = await redis.get(`users:${userId}`)

    if (!user) return NextResponse.json(
      { error: 'Internal error: /verify:get user', status: 500 }
    )

  } catch(e) {
    console.error('Error in /verify:session', e)
    return NextResponse.json(
      { error: 'Internal server error /verify:session' }, 
      { status: 500 }
    )
  }

  // success
  return NextResponse.json({ user, id: numericalId }, { status: 200 })
}

