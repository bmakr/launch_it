import { createId, getItem, nowInSeconds, sendEmail, setItem } from 'lib'
import { KeyValues, Passcode } from 'types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // get body
  let body
  try {
    body = await req.json()
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: body' }, { status: 400 })
  }

  console.log({ body })

  // check if val exists
  if (!body.val) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // validate email
  const email = body.val
  function validate({ email }: { email: string }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const validated = validate({ email })
  if (!validated) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // check for existing email in users:emailsKv
  let emailsKv: KeyValues = {}
  try {
    emailsKv = await getItem({
      name: `users`,
      key: 'emailsKv',
    }) as KeyValues
  } catch (e) {
    return NextResponse.json({ error: 'Internal Error: fetching emailsKv in login.' }, { status: 400 })
  }

  console.log({ emailsKv })
  if (!emailsKv) {
    return NextResponse.json({ error: 'Internal Error: getItem emailsKv in /login.' }, { status: 400 })
  }

  if (!emailsKv[email]) {
    return NextResponse.json({ error: 'That email addess does not exist in our db' }, { status: 400 })
  }

  // get userId from users:emailsKv
  let userId
  try {
    userId = emailsKv[email]
    console.log({ userId })
    if (!userId) {
      return NextResponse.json({ error: 'Internal error: /login userId = response[email]' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /login getItem users:emailsKv' }, { status: 500 })
  }

  // look for existing sessionId in sessions:activeUserIdsKv
  let sessionId, activeUserIdsKv
  try {
    activeUserIdsKv = await getItem({
      name: 'sessions',
      key: 'activeUserIdsKv'
    })

    if (activeUserIdsKv[userId]) {
      sessionId = activeUserIdsKv[userId]
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /login getItem sessions:activeUserIdsKv' }, { status: 500 })
  }

  // if active session exists set to active: false
  if (sessionId) {
    let session
    try {
      session = await getItem({
        name: 'sessions',
        id: sessionId
      })
      if (!session) {
        return NextResponse.json({ error: 'Internal error: /login getItem sessions:sessionId' }, { status: 500 })
      }
    } catch (e) {
      console.log({ error: e })
      return NextResponse.json({ error: 'Internal error: /login getItem sessions:sessionId' }, { status: 500 })
    }

    // update session
    session.active = false
    try {
      const res = await setItem({
        name: 'sessions',
        id: sessionId,
        payload: JSON.stringify(session)
      })
      if (!res) {
        return NextResponse.json({ error: 'Internal error: /login setItem sessions:sessionId' }, { status: 500 })
      }
    } catch (e) {
      console.log({ error: e })
      return NextResponse.json({ error: 'Internal error: /login setItem sessions:sessionId' }, { status: 500 })
    }
  }

  // remove session from activeUserIdsKv
  try {
    delete activeUserIdsKv[userId]
    await setItem({
      name: 'sessions',
      key: 'activeUserIdsKv',
      payload: JSON.stringify(activeUserIdsKv)
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error: /login setItem sessions:activeUserIdsKv' }, { status: 500 })
  }

  // create a passcode
  const passcode: Passcode = {
    id: createId(),
    createdAt: nowInSeconds(),
    code: Math.floor(100000 + Math.random() * 900000).toString(),
    userId
  }

  // save passcode
  try {
    const res = await setItem({
      name: `passcodes`,
      id: passcode.id,
      payload: JSON.stringify(passcode)
    })
    if (!res) {
      return NextResponse.json({ error: 'Internal error: /login setItem passcode' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /login save passcode' }, { status: 500 })
  }


  // send email
  try {
    const emailRes = await sendEmail({
      transactionalId: 'clyzxp02l047ik84p9gx7nhd1',
      to: email,
      dataVariables: {
        passcode: passcode.code,
        url: `https://actualed.com/auth/verify/${passcode.id}`
      }
    })
    console.log({ emailRes })
    const { success, message } = emailRes as { success: boolean; message: string; }
    console.log({ success, message })
    if (!success) {
      return NextResponse.json({ error: `Internal error: /login send email ${message}` }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: `Internal error: /login send email generic ${e}` }, { status: 500 })
  }

  // return passcode id to client
  return NextResponse.json({ passcodeId: passcode.id })
}
