'use server'

import { sendEmail } from './sendEmail';

// Ensure the environment variable is set
const LOOPS_SIGNUP_ID = process.env.LOOPS_SIGNUP_ID as string
const API_URL = process.env.API_URL as string
const API_ENDPOINT_VERIFY = process.env.API_ENDPOINT_VERIFY as string
if (!LOOPS_SIGNUP_ID || !API_URL || !API_ENDPOINT_VERIFY) {
  throw new Error('Environment variable is not set');
}

interface VerificationEmailParams {
  email: string;
  passcode: number;
  sessionId: number;
}

/**
 * Sends a verification email to the user.
 * @param {VerificationEmailParams} params - The email and passcode information.
 * @throws {Error} If the send fails.
 */
export async function sendVerificationEmail({
  email, 
  passcode,
  sessionId
}: VerificationEmailParams): Promise<void> {
  try {
    return await sendEmail({
      transactionalId: LOOPS_SIGNUP_ID,
      to: email,
      addToAudience: true,
      dataVariables: {
        passcode: passcode,
        url: `${API_URL}/verify/${sessionId}`
      }
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email. Please try again later.');
  }
}
