'use server'

import { LoopsClient } from 'loops'

type Options = {
  transactionalId: string;
  email: string;
  dataVariables?: {
    [key: string]: string | number;
  };
  mailingLists?: { [key: string]: boolean;};
  addToAudience?: boolean;
}

export async function sendEmail({
  dataVariables,
  transactionalId,
  to,
  addToAudience
}: {
  to: string;
  transactionalId: string;
  dataVariables?: {
    [key: string]: string | number;
  };
  addToAudience?: boolean;
  }) {
  // initialize loops client
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY as string
  const loops = new LoopsClient(LOOPS_API_KEY)

  const options: Options = {
    transactionalId,
    email: to,
    addToAudience: addToAudience || false
  }

  if (dataVariables) {
    options.dataVariables = dataVariables
  }

  // send email
  // on error return response
  let response
  try {
    response = await loops.sendTransactionalEmail(options)
  } catch (e) {
    console.error(e)
    return response
  }

  // on successful connection return response
  // for processing in the calling function
  return response
}
