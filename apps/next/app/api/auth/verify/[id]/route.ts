'use server'

import { Params, Passcode, User } from 'types'
import { NextRequest, NextResponse } from 'next/server'
import { deleteItem, getItem, nowInSeconds, setItem } from 'lib'

export async function POST(
  req: NextRequest, 
  { params }: Params
) {
  // get id from request
  const { id } = params as { id: string }
  // validate id
  if (!id) {
    return NextResponse.json({ error: 'ID is a required param' }, { status: 400 })
  }
  if (id.length !== 36) {
    return NextResponse.json({ error: 'ID must be 36 chars' }, { status: 400 })
  }

  // get body
  let body
  try {
    body = await req.json()
  } catch (e) {
    // respond with error
    console.log({ error: e })
    return NextResponse.json({ error: 'Body is required' }, { status: 400 })
  }

  console.log({ body })

  // validate val
  
  if (!body.val) {
    return NextResponse.json({ error: 'Passcode (val) is required' }, { status: 400 })
  }

  const { val } = body

  if (val.length !== 6) {
    return NextResponse.json({ error: 'Passcode (val) must be 6 chars' }, { status: 400 })
  }

  // get passcode from db
  let code = ''
  let userId = ''
  let createdAt = 0
  try {
    const passcode = await getItem({ 
      name: 'passcodes', 
      id 
    }) as Passcode
    if (!passcode || !passcode.code) {
      return NextResponse.json({ error: 'Passcode id not found in db' }, { status: 404 })
    }
    code = passcode.code
    userId = passcode.userId
    createdAt = passcode.createdAt
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /get passcode from db' }, { status: 500 })
  }

  // compare passcode
  if (code !== val) {
    return NextResponse.json({ error: 'Passcode does not match' }, { status: 400 })
  }

  // check time difference to now for 5 minutes
  const now = nowInSeconds()
  if (now - createdAt > 300) {
    console.log({ now, createdAt })
    console.log(now - createdAt)
    return NextResponse.json({ error: 'Passcode has expired' }, { status: 400 })
  }

  // retrieve user from db
  let user: User | undefined
  try {
    user = await getItem({ name: 'users', id: userId }) as User
    if (!user) {
      return NextResponse.json({ error: 'Internal error: User not found' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /get user from db' }, { status: 500 })
  }

  // delete passcode from db
  try {
    await deleteItem({ 
      name: 'passcodes', 
      id 
    })
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: failed to delete passcode from db' }, { status: 500 })
  }

  // create session
  const session = {
    id,
    createdAt: nowInSeconds(),
    loggedOutAt: 0,
    userId: user.id,
    active: true,
  }

  // save session
  try {
    const res = await setItem({ name: 'sessions', id, payload: JSON.stringify(session) })
    if (!res) {
      return NextResponse.json({ error: 'Internal error: failed to save session' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /save session' }, { status: 500 })
  }

  // get activeUserIdsKv index from sessions
  let activeUserIdsKv
  try {
    const current = await getItem({ name: 'sessions', key: 'activeUserIdsKv'})
    // create if doesn't exist
    if (!current) {
      activeUserIdsKv = {
        [user.id]: session.id
      }
    } else {
      activeUserIdsKv = {
        ...current,
        [user.id]: session.id
      }
    }
    if (!activeUserIdsKv) {
      return NextResponse.json({ error: 'Internal error: failed to get session index session:activeUserIdsKv by user id' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /save session index by user id' }, { status: 500 })
  }

  // update activeUserIdsKv index
  try {
    const res = await setItem({ name: 'sessions', key: 'activeUserIdsKv', payload: JSON.stringify(activeUserIdsKv) })
    if (!res) {
      return NextResponse.json({ error: 'Internal error: failed to save session index by user id' }, { status: 500 })
    } 
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /save session index by user id' }, { status: 500 })
  }

  return NextResponse.json({ user }, { status: 200 })
}
