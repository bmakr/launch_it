'use client'

import { HomeScreen } from 'app/features/home/screen'
import { getSession } from 'lib'
import { useEffect, useState } from 'react'
import { Spinner, View } from '@my/ui'
import { useRouter } from 'next/navigation'
import { Header } from 'app/shared'

export default function Home() {
  const [status, setStatus] = useState('loading')
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const session = await getSession()
      if (session) {
        router.push('/profile')
      }
    }

    checkSession()
  }, [])


  return (
    <>
      {status === 'loading' && (
        <View>
          <Header />
          <Spinner mt={100} />
        </View>
      )}
      {status !== 'loading' && (
        <HomeScreen />
      )}
    </>

  )
}
