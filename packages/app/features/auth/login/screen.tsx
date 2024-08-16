import { useEffect, useState, useCallback } from 'react'
import { Auth, AuthConfig } from '../../../shared/Auth'
import { useRouter } from 'solito/navigation'

interface LoginProps {
  login: (data: { val: string }) => Promise<{ passcodeId: string } | { error: string }>
}

export function LoginScreen({ login }: LoginProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'' | 'resent' | 'resend' | 'sending' | 'error' | 'success'>('')
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = useCallback(async () => {
    setStatus('sending')
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter an email address')
      setStatus('error')
      return
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a correct email address')
      setStatus('error')
      return
    }

    try {
      const response = await login({ val: cleanEmail })
      if ('error' in response) {
        setError(response.error)
        setStatus('error')
      } else {
        router.push(`/auth/verify/${response.passcodeId}`)
        setStatus('success')
      }
    } catch (e) {
      setError(`Error: ${e instanceof Error ? e.message : String(e)}`)
      setStatus('error')
    }
  }, [email, login, router])

  useEffect(() => {
    if (status === 'sending') {
      handleLogin()
    }
  }, [status, handleLogin])

  const authConfig: AuthConfig = {
    title: 'Log In',
    placeholder: 'email',
    description: 'Enter your email to receive a security code',
    buttonText: 'Send',
    afterText: "You'll receive a security code by email",
    linkText: 'I NEED TO SIGN UP',
    href: '/auth/signup',
    handler: () => setStatus('sending'),
    setVal: setEmail,
    val: email,
    status,
    error
  }

  return <Auth authConfig={authConfig} />
}