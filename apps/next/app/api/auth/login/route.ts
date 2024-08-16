import { 
  createPasscode, getBody, getEmailsKv, savePasscode, sendVerificationEmail, validateEmail, deleteExistingPasscode, deactivateExistingSession
} from 'lib'
import { NextRequest, NextResponse } from 'next/server'

/*
  login route
  POST /api/auth/login
  input body: { val: string } as stringified JSON
  output: { passcodeId: string } as JSON

  1. validate email
  2. check for existing email
  3. If email is not in db, return error
  4. If passcode exists, delete it (use activeUserIdsKvPasscodes)
  5. Deactivate existing session, if it exists (use activeUserIdsKvSessions)
  6. Create and save new passcode
  7. Send email with passcode
*/
export async function POST(req: NextRequest) {
  try {
    const body = await getBody({ req })
    const { val } = body

    // Validate email
    const email = val
    await validateEmail({ email })

    // Check for existing email in users:emailsKv
    const emailsKv = await getEmailsKv()

    const userId = emailsKv[email]
    if (!userId) {
      throw new Error('That email address does not exist in our database, please sign up')
    }

    // if existing passcode then delete it
    await deleteExistingPasscode({ userId })

    // if it exists
    // set existing session to active: false 
    await deactivateExistingSession({ userId }) 

    // Create and save passcode
    const passcode = await createPasscode({ userId })
    await savePasscode({ passcode })

    // Send email with passcode
    await await sendVerificationEmail({
      email,
      passcode
    })

    return NextResponse.json({ passcodeId: passcode.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

