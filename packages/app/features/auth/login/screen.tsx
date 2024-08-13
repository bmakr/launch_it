import { useEffect, useState } from 'react'
import { Auth, AuthConfig } from '../../../shared/Auth'
import { useRouter } from 'solito/navigation'

export function LoginScreen({ login }: { login: any }) {
  const router = useRouter()
  const [val, setVal] = useState('')
  const [status, setStatus] = useState<'sending' | '' | 'error' | 'success'>('')
  const [error, setError] = useState('')

  // trigger useEffect
  function handler({ val }: { val: string }) {
    setStatus('sending')
  }
  // validate the input
  function validate({ email }: { email: string }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // send the request
  useEffect(() => {
    if (status !== 'sending') return // skip unless sending

    // check the input
    if (!val) {
      setError('Please enter an email address')
      setStatus('error')
      return
    }

    // prep the input
    const cleanEmail = val.trim().toLowerCase()

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
        const response = await login({ val: cleanEmail })
        console.log({ response })
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

    sendRequest() // send the request
  }, [status])

  const authConfig: AuthConfig = {
    title: 'Log In',
    placeholder: 'email',
    description: 'Enter your email to receive a security code',
    buttonText: 'Send',
    afterText: 'You\'ll receive a security code by email',
    linkText: 'I NEED TO SIGN UP',
    href: '/auth/signup',
    handler,
    setVal,
    val,
    status,
    error
  }

  return (
    <Auth authConfig={authConfig} />
  )
}
