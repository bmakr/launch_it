import { H1, Text, YStack } from '@my/ui'
import { Header, SubscribeButton } from '../../shared'

export function PricingScreen() {

  return (
    <>
      <Header />
      <YStack mt={100} jc='center' ai='center' ac='center' h='$15'>
        <H1>Choose a Plan</H1>
        <Text>Next-Level Learning</Text>
      </YStack>
      <SubscribeButton />
    </>
  )
}
