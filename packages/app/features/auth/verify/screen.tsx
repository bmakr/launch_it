import { useEffect, useState } from 'react'
import { Auth, AuthConfig } from '../../../shared/Auth'
import { useRouter, useParams } from 'solito/navigation'

export function VerifyScreen({
  verify,
}: {
  verify: any
}) {
  const router = useRouter()
  const { id } = useParams()
  // const { id } = useParams()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'sending' | 'resend' | '' | 'error' | 'success'>('')
  const [error, setError] = useState('')
  // const [sessionId, setSessionId] = useState('')

  // validate the input
  function validate({ val }: { val: string }) {
    if (val.length < 6 || val.length > 6) {
      setError('Please enter a 6-digit code')
      setStatus('error')
      return true
    }
  }

  // handle success
  useEffect(() => {
    if (status !== 'success') return
    router.push(`/profile`)
  }, [status])

  // handle sending
  useEffect(() => {
    if (status !== 'sending') return
    // prep the input
    const cleanCode = code.trim()
    // validate the input
    validate({ val: cleanCode })

    // send the request
    async function sendRequest() {
      let response
      try {
        response = verify({ val: cleanCode, id })
      } catch (e) {
        setError(`Error: ${e}`)
        setStatus('error')
        return
      }

      // handle the response
      if (response.error) {
        setError(response.error)
        setStatus('error')
        return
      }

      // success
      setStatus('success')
    }

    sendRequest()
  }, [status])

  function handler() {
    setStatus('sending')
  }

  // handle resend
  useEffect(() => {
    if (status !== 'resend') return
    // TODO: implement resend
  }, [status])

  function resend() {
    setStatus('resend')
  }

  const authConfig: AuthConfig = {
    title: 'Check Your Email',
    description: 'Enter the security code below',
    placeholder: 'Enter code',
    buttonText: 'Verify',
    afterText: 'We sent you a security code by email',
    linkText: 'RESEND SECURITY CODE',
    resend,
    handler,
    setVal: setCode,
    val: code,
    error: error,
    status,
  }

  return (
    <Auth authConfig={authConfig} />
  )
}