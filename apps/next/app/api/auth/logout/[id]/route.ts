import { Params } from 'types'
import { NextRequest, NextResponse } from 'next/server'
import { deactivateExistingSession } from 'lib'

export async function POST(
  _: NextRequest, { params }: Params
) {
  // get user id
  const { id } = params

  // deactivate existing session
  // update session
  // and remove from activeUserIdsKv
  try {
    await deactivateExistingSession({ userId: id })

    // success
    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
