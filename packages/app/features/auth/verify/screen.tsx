
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'solito/navigation'
import { Auth, AuthConfig } from '../../../shared/Auth'

interface VerifyScreenProps {
  verify: (params: { val: string; id: string }) => Promise<{ error?: string }>
  resend: ({ id }: { id: string; }) => Promise<{ passcodeId: string; } | { error: string }>
}

export function VerifyScreen({ verify, resend }: VerifyScreenProps) {
  const router = useRouter()
  const { id }: { id: string } = useParams()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'sending' | 'resend' | 'resent' | '' | 'error' | 'success'>('')
  const [error, setError] = useState('')

  const validate = useCallback((val: string): boolean => {
    if (val.length !== 6) {
      setError('Please enter a 6-digit code')
      setStatus('error')
      return false
    }
    return true
  }, [])

  useEffect(() => {
    if (status === 'success') {
      router.push('/profile')
    }
  }, [status, router])

  const handleVerify = useCallback(async () => {
    setError('')

    const cleanCode = code.trim()
    if (!validate(cleanCode)) {
      setError('Please enter a 6-digit code')
      return
    }

    try {
      const response = await verify({ val: cleanCode, id: id as string })
      if (response.error) {
        throw new Error(response.error)
      }
      setStatus('success')
    } catch (e) {
      setError(`Error: ${e instanceof Error ? e.message : String(e)}`)
      setStatus('error')
    }
  }, [code, verify, router])


  const resendHandler = useCallback(() => {
    setStatus('resend')
    async function resendPasscode() {
      try {
        const res = await resend({ id })
        if (res) {
          setStatus('resent')
          setError('')
        }
      } catch (e) {
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`)
        setStatus('error')
      }
    }
    resendPasscode()
  }, [])

  useEffect(() => {
    if (status === 'sending') {
      handleVerify()
    }
  }, [status, handleVerify])

  const authConfig: AuthConfig = {
    title: 'Check Your Email',
    description: 'Enter the security code below',
    placeholder: 'Enter code',
    buttonText: 'Verify',
    afterText: 'We sent you a security code by email',
    linkText: 'RESEND SECURITY CODE',
    resend: () => resendHandler(),
    handler: () => setStatus('sending'),
    setVal: setCode,
    val: code,
    error,
    status,
  }

  return <Auth authConfig={authConfig} />
}
