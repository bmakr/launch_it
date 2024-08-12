import { NextRequest, NextResponse } from 'next/server'
import { 
  createId, getItem, nowInSeconds, setItem, sendEmail 
} from 'lib'
import { KeyValues, Passcode, User } from 'types'

const LOOPS_LIST_ID_FREE = process.env.LOOPS_LIST_ID_FREE as string
const LOOPS_LIST_ID_ALL= process.env.LOOPS_LIST_ID_ALL as string

export async function POST(req: NextRequest) {
  // get body
  let body
  try {
    body = await req.json()
  } catch (e) {
    // respond with error
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

  // check for existing email in users
  let emailsKv: KeyValues = {}
  try {
    emailsKv = await getItem({
      name: `users`,
      key: 'emailsKv',
    }) as KeyValues

    if (emailsKv && emailsKv[email]) {
      return NextResponse.json({ error: 'Email already registered. Please log in.' }, { status: 400 })
    }

    // if emailsKv doesn't exist, create it
    if (!emailsKv) {
      emailsKv = {}
    }
  } catch (e) {
    return NextResponse.json({ error: 'Internal Error: fetching emailsKv in signup.' }, { status: 400 })
  }

  // create user
  const user = {
    id: createId(),
    createdAt: nowInSeconds(),
    email,
    roles: ['free']
  } as User

  // save user
  try {
    const setUserRes = await setItem({ name: 'users', id: user.id, payload: JSON.stringify(user) })
    if (!setUserRes) {
      return NextResponse.json({ error: 'Internal error: /signup setItem user' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /signup save user' }, { status: 500 })
  }

  // save index users:emailsKv
  try {
    const setEmailKvRes = await setItem({
      name: `users`,
      key: 'emailsKv',
      payload: JSON.stringify({
        ...emailsKv,
        [email]: user.id
      })
    })
    if (!setEmailKvRes) {
      return NextResponse.json({ error: 'Internal error: /signup setItem users:emailsKv' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: saving emailsKv - setItem' }, { status: 500 })
  }

  // create a passcode
  const passcode: Passcode = {
    id: createId(),
    createdAt: nowInSeconds(),
    code: Math.floor(100000 + Math.random() * 900000).toString(),
    userId: user.id
  }

  // save passcode
  try {
    const createSessionRes = await setItem({
      name: `sessions`,
      key: 'passcode',
      id: passcode.id,
      payload: JSON.stringify(passcode)
    })
    if (!createSessionRes) {
      return NextResponse.json({ error: 'Internal error: /signup setItem sessions:passcode' }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: 'Internal error: /signup save passcode' }, { status: 500 })
  }

  // send email
  try {
    const emailRes = await sendEmail({
      transactionalId: process.env.LOOPS_SIGNUP_ID as string,
      to: email,
      addToAudience: true,
      dataVariables: {
        passcode: passcode.code,
        url: `https://actualed.com/auth/verify/${passcode.id}`
      }
    })
    console.log({ emailRes })
    const { success, message } = emailRes as { success: boolean; message: string; }
    console.log({ success, message })
    if (!success) {
      return NextResponse.json({ error: `Internal error: /signup send email ${message}` }, { status: 500 })
    }
  } catch (e) {
    console.log({ error: e })
    return NextResponse.json({ error: `Internal error: /signup send email generic ${e}` }, { status: 500 })
  }

  // return passcode id to client
  return NextResponse.json({ passcodeId: passcode.id })
}
