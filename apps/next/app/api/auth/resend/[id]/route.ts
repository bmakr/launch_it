import { deletePasscode, getPasscode, createPasscode } from 'lib';
import { NextRequest, NextResponse } from 'next/server';
import { Params } from 'types';

export async function POST(_: NextRequest, { params }: Params) {
  try {
    // Extract passcode ID from params
    const { id } = params;

    // Fetch passcode from database and extract userId
    const { userId } = await getPasscode({ id });

    // Delete the existing passcode
    await deletePasscode({ id });

    // Generate a new passcode for the user
    const newPasscode = await createPasscode({ userId });

    // Return the new passcode ID in the response
    return NextResponse.json({ passcodeId: newPasscode.id }, { status: 201 });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in POST /resend:', error);

    // Return a generic error response to the client
    return NextResponse.json(
      { error: 'Internal Error: /resend' }, 
      { status: 500 }
    );
  }
}