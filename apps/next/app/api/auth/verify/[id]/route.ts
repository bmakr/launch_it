'use server'

import { Params, Passcode } from 'types'
import { NextRequest, NextResponse } from 'next/server'
import { 
  deletePasscode, getBody, getPasscode, getUser, validateId, validatePasscode, createSession, saveSession, updateActiveUserIdsOnSessions
} from 'lib'


export async function POST(req: NextRequest, { params }: Params) {
  try {
    //validate id from params
    const id = params.id
    validateId({ id })

    // get input code from body
    const body = await getBody({ req })
    const { val } = body
    const input = val
    
    // get passcode
    const passcode: Passcode = await getPasscode({ id })
    const { code, createdAt, userId } = passcode

    // validate user input
    validatePasscode({ 
      input,
      stored: code,
      createdAt
    })

    // passcode validated, delete it in db
    await deletePasscode({ id })
    
    // get user 
    const user = await getUser({ id: userId  })
    
    // create session and save it
    const session = await createSession({ 
      id, userId: user.id 
    })
    await saveSession({ session })
    // save userId index on sessions
    await updateActiveUserIdsOnSessions({ 
      userId: user.id, 
      sessionId: session.id
    })
    
    // success
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error(error)
    console.error('Error in /verify:', error)
    return NextResponse.json(
      { error: 'Internal server error /verify' }, 
      { status: 500 }
    )
  }
}

