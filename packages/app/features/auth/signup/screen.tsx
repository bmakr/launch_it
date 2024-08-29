import { Auth, AuthConfig } from '../../../shared/Auth'
import { useRouter } from 'solito/navigation'
import { useEffect, useState, useCallback } from 'react'
import { signup } from 'app/lib'

interface SignupProps {
  signup: ({ email }: { email: string; }) => Promise<{ id: string } | { error: string }>
}

export function SignupScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'' | 'sending' | 'error' | 'success'>('')
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignup = useCallback(async () => {
    setError('')

    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail) {
      setError('Please enter an email address')
      setStatus('error')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a correct email address')
      setStatus('error')
      return
    }

    try {
      const response = await signup({ email: trimmedEmail })
      if ('error' in response) {
        setError(response.error)
        setStatus('error')
      } else {
        router.push(`/auth/verify/${response.id}`)
        setStatus('success')
      }
    } catch (e) {
      setError(`Error: ${e instanceof Error ? e.message : String(e)}`)
      setStatus('error')
    }
  }, [email, signup, router])

  useEffect(() => {
    if (status === 'sending') {
      handleSignup()
    }
  }, [status, handleSignup])

  const authConfig: AuthConfig = {
    title: 'Sign Up',
    placeholder: 'email',
    description: 'Next-Level Learning',
    buttonText: 'Sign Up',
    afterText: 'Free to Join. Unsubscribe anytime.',
    linkText: 'I ALREADY HAVE AN ACCOUNT',
    href: '/auth/login',
    handler: () => setStatus('sending'),
    val: email,
    setVal: setEmail,
    status,
    error,
  }

  return <Auth authConfig={authConfig} />
}