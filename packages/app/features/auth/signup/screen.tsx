import { Auth, AuthConfig } from '../../../shared/Auth'
import { useRouter } from 'solito/navigation'
import { useEffect, useState } from 'react'

export function SignupScreen({ signup }: { signup: any }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'sending' | '' | 'error' | 'success'>('')
  const [error, setError] = useState('')

  // validate the input
  function validate({ email }: { email: string }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // trigger useEffect
  async function handler() {
    setStatus('sending')
  }

  // send the write request
  useEffect(() => {
    if (status !== 'sending') return // skip unless sending
    // check the input
    if (!email) {
      setError('Please enter an email address')
      setStatus('error')
      return
    }

    // prep the input
    const cleanEmail = email.trim().toLowerCase()

    // validate the input
    const validated = validate({ email: cleanEmail })
    if (!validated) {
      setError('Please enter a correct email address')
      setStatus('error')
      return
    }

    // send the request
    async function sendRequest() {
      try {
        const response = await signup({ email: cleanEmail })
        // check for error
        if (response.error) {
          setError(response.error)
          setStatus('error')
          return
        }
        // success
        router.push(`/auth/verify/${response.passcodeId}`)
      } catch (e) {
        setError(`Error: ${e}`)
        setStatus('error')
      }
    }

    sendRequest()
  }, [status])

  const authConfig: AuthConfig = {
    title: 'Sign Up',
    placeholder: 'email',
    description: 'Next-Level Learning',
    buttonText: 'Sign Up',
    afterText: 'Free to Join. Unsubscribe anytime.',
    linkText: 'I ALREADY HAVE AN ACCOUNT',
    href: '/auth/login',
    handler,
    val: email,
    setVal: setEmail,
    status,
    error,
  }

  return (
    <Auth authConfig={authConfig} />
  )
}