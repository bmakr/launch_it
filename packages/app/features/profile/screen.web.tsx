import { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { Button, H1, Spinner, Text, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { Header } from '../../shared'

export function ProfileScreen({
  getSession,
  logout,
  interval = 1000
}: {
  getSession: any;
  logout: any;
  interval?: number;
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'logout' | 'loading' | 'error' | 'success'>('loading')
  const [sessionId, setSessionId] = useState('')
  const [error, setError] = useState('')

  // check for cookie
  useEffect(() => {
    let intervalId
    async function checkSession() {
      const session = await getSession()
      if (session === null) {
        setTimeout(() => {
          if (intervalId) {
            router.push('/?toast=login')
            return
          }
        }, 1000)
      }
      if (session?.error) {
        console.log('session.error', session.error)
        setError(session.error)
        setStatus('error')
        clearInterval(intervalId)
      }
      if (session?.id) {
        setSessionId(session.id)
        setUser(session.user)
        setStatus('success')
        clearInterval(intervalId)
      }
    };

    // Set up interval for recurring checks
    intervalId = setInterval(checkSession, interval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // on error redirect to login
  useEffect(() => {
    if (status !== 'error') return
    router.push(`/?toast=expired`)
  }, [status])

  // trigger logout effect
  function handler() {
    setStatus('logout')
  }

  // logout
  useEffect(() => {
    if (status !== 'logout') return
    async function logoutUser() {
      await logout({ id: user.id })

      router.push(`/?toast=loggedOut`)
    }
    logoutUser()
  }, [status])

  return (
    <>
      <Header />
      {error && (
        <Text
          mt='$10'
          ta='center'
          col='$red9'
        >
          Error: {error}
        </Text>
      )}
      {status === 'success' && (
        <YStack f={1} jc="center" ai="center" ac='center' bg="$background">
          <H1>
            Thank you for signing up!
          </H1>
          <Text>
            We'll be releasing videos weekly. Stay tuned for more content.
          </Text>
          <Button mt='$20' icon={ChevronLeft} onPress={handler}>
            Logout
          </Button>
        </YStack>
      )}
      {status === 'loading' && (
        <YStack ai='center'>
          <Spinner mt={100} />
        </YStack>
      )}
    </>
  );
}