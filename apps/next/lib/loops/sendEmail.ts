'use server'

import { LoopsClient } from 'loops';

interface SendEmailOptions {
  to: string;
  transactionalId: string;
  dataVariables?: Record<string, string | number>;
  addToAudience?: boolean;
}

interface LoopsOptions {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, string | number>;
  mailingLists?: Record<string, boolean>;
  addToAudience?: boolean;
}

export async function sendEmail({
  to,
  transactionalId,
  dataVariables,
  addToAudience = false
}: SendEmailOptions): Promise<void> {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  
  if (!LOOPS_API_KEY) {
    throw new Error('LOOPS_API_KEY is not set in the environment variables');
  }

  const loops = new LoopsClient(LOOPS_API_KEY);

  const options: LoopsOptions = {
    transactionalId,
    email: to,
    addToAudience,
    ...(dataVariables && { dataVariables })
  };

  try {
    await loops.sendTransactionalEmail(options);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}