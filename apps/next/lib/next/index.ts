import { NextRequest } from "next/server";

export async function getBody({ req }: { req: NextRequest }) {
  let body;
  try {
      body = await req.json()
      return body
  } catch(error) {
      // respond with error
      console.log({ error })
      throw new Error('Internal error /getBody')
  }
}