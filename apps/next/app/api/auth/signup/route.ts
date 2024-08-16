import { NextRequest, NextResponse } from 'next/server'
import { 
  getEmailsKv, validateEmail, createUser, saveUser, updateEmailsKv, createPasscode, savePasscode, sendVerificationEmail,
  getBody,
  updateActiveUserIdsOnPasscodes
} from 'lib'

/*
  signup route
  POST /api/auth/signup
  input body: { val: string } as stringified JSON
  output: { passcodeId: string } as JSON

  1. validate email
  2. check if email is already registered
  3. create user
  4. save user
  5. update emailsKv secondary index [email: userId]
  6. create passcode
  7. save passcode
  8. update secondary index [userId: passcodeId]
  9. send verification email
  10. return passcodeId
*/
export async function POST(req: NextRequest) {
  try {
    const body = await getBody({ req })
    const { val } = body
    const email = val

    await validateEmail({ email })

    const emailsKv = await getEmailsKv()
    if (emailsKv[email]) {
      return NextResponse.json({ error: 'Email already registered. Please log in.' }, { status: 400 })
    }

    // create and save user
    const user = await createUser({ email })
    await saveUser({ user })
    // update db index
    await updateEmailsKv({ 
      emailsKv, email, userId: user.id
    })

    // create passcode and save it for verification
    const passcode = await createPasscode({ userId: user.id })
    await savePasscode({ passcode })
    // save userId index on passcodes
    await updateActiveUserIdsOnPasscodes({ userId: user.id, passcodeId: passcode.id })

    // send verification email
    await sendVerificationEmail({ email, passcode })

    // success
    return NextResponse.json(
      { passcodeId: passcode.id }
    )
  } catch (error) {
    console.error('Error in /signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
