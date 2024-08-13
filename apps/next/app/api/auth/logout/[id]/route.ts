import { Params } from 'types'
import { NextRequest, NextResponse } from 'next/server'
import { getItem, nowInSeconds, setItem } from 'lib'

export async function POST(_: NextRequest, { params }: Params) {
  // get user id
  const { id } = params
  console.log('auth/logout user id', { id })

  // get session from user id
  console.log('getItem activeUserIdsKv')
  let sessionId, activeUserIdsKv
  try {
    activeUserIdsKv = await getItem({
      name: 'sessions',
      key: 'activeUserIdsKv',
    })
    console.log({ activeUserIdsKv })
    console.log(activeUserIdsKv[id])
    if (!activeUserIdsKv[id]) {
      return NextResponse.json({ error: 'activeUserIdsKv[id] not found' }, { status: 500 })
    }

    // get session id
    sessionId = activeUserIdsKv[id]
    console.log('activeUserIdsKv[id]', { sessionId })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error: getItem activeUserIdsKv' }, { status: 500 })
  }

  // check for activeUserIdsKv
  if (!activeUserIdsKv) {
    return NextResponse.json({ error: 'activeUserIdsKv not found' }, { status: 500 })
  }

  // remove userId from activeUserIdsKv
  delete activeUserIdsKv[id]
  console.log('activeUserIdsKv after delete', { activeUserIdsKv })

  // save updated activeUserIdsKv
  try {
    await setItem({
      name: 'sessions',
      key: 'activeUserIdsKv',
      payload: JSON.stringify(activeUserIdsKv),
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error: setItem activeUserIdsKv' }, { status: 500 })
  }

  // get session
  let session
  try {
    session = await getItem({
      name: 'sessions',
      id: sessionId,
    })
    console.log('getItem session', { session })
    // check if session exists
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Internal error: getItem session' }, { status: 500 })
  }

  // update session
  session.loggedOutAt = nowInSeconds()
  session.active = false
  // save session
  try {
    const res = await setItem({
      name: 'sessions',
      id: sessionId,
      payload: JSON.stringify(session),
    })
    console.log('set session in logout', { res })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error: setItem session' }, { status: 500 })
  }

  return NextResponse.json({ status: 200 })
}
