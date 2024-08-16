import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'solito/navigation'
import { Button, H1, Spinner, Text, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { Header } from '../../shared'

interface ProfileScreenProps {
  getSession: () => Promise<any>;
  logout: (params: { id: string }) => Promise<void>;
  interval?: number;
}

export function ProfileScreen({ getSession, logout, interval = 1000 }: ProfileScreenProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'logout' | 'loading' | 'error' | 'success'>('loading')
  const [error, setError] = useState('')

  const checkSession = useCallback(async () => {
    try {
      const session = await getSession()
      if (session.error) {
        throw new Error(session.error)
      }
      if (session && session.id) {
        setUser(session.user)
        setStatus('success')
        return true
      }
      return false
    } catch (err) {
      setError(err.message)
      setStatus('error')
      return true
    }
  }, [getSession])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const shouldClearInterval = await checkSession()
      if (shouldClearInterval) {
        clearInterval(intervalId)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [checkSession, interval])

  useEffect(() => {
    if (status === 'error') {
      router.push(`/?toast=expired`)
    }
  }, [status, router])

  const handleLogout = useCallback(async () => {
    setStatus('logout')
    try {
      await logout({ id: user.id })
      router.push(`/?toast=loggedOut`)
    } catch (err) {
      setError('Logout failed')
      setStatus('error')
    }
  }, [logout, user, router])

  return (
    <>
      <Header />
      {error && (
        <Text mt='$10' ta='center' col='$red9'>
          Error: {error}
        </Text>
      )}
      {status === 'success' && (
        <YStack f={1} jc="center" ai="center" ac='center' bg="$background">
          <H1>Thank you for signing up!</H1>
          <Text>We'll be releasing videos weekly. Stay tuned for more content.</Text>
          <Button mt='$20' icon={ChevronLeft} onPress={handleLogout}>
            Logout
          </Button>
        </YStack>
      )}
      {status === 'loading' && (
        <YStack ai='center'>
          <Spinner />
        </YStack>
      )}
    </>
  )
}
