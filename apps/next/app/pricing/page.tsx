'use client'

import { PricingScreen } from 'app/features/pricing/screen'
import { Session } from 'types'
import { getSession } from 'lib'
import { useEffect, useState } from 'react'
import { Spinner } from 'tamagui'

export default function Products() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')

  //get session id from cookie
  useEffect(() => {
    async function saveSessionIdToLocalStorage() {
      const session = await getSession() as Session
      localStorage.setItem('sessionId', session.id)
      setStatus('success')
    }
    saveSessionIdToLocalStorage()
  }, [])

  return (
    <>
      {status === 'success' ? (
        <PricingScreen />
      ) : <Spinner />}
    </>
  )
}
