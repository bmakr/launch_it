import { Spinner, View } from '@my/ui'
import { useEffect, useState } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export function PricingTable() {
  const [id, setId] = useState('')

  //get session id from local storage
  useEffect(() => {
    const id = localStorage.getItem('sessionId') as string
    setId(id)
  }, [])

  return (
    <View h={1000}>
      {id ? (
        <>
          <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
          <stripe-pricing-table
            pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_TEST_KEY as string}
            client-reference-id={id}
          />
        </>

      ) : (
        <Spinner />
      )}

    </View>
  )
}
