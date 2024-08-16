import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import {
  View,
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  useToastController,
  SwitchThemeButton,
  XStack,
  YStack,
  Text,
  Image,
} from '@my/ui'
import { Footer } from 'app/shared'

const TOAST_MESSAGES = {
  loggedOut: 'You have been logged out',
  expired: 'Your session has expired. Please log in',
}

export function HomeScreen() {
  const toast = useToastController()
  const linkProps = useLink({ href: `/auth/signup` })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const toastParam = params.get('toast')
      if (toastParam && TOAST_MESSAGES[toastParam]) {
        toast.show('Actual Alert', {
          message: TOAST_MESSAGES[toastParam],
        })
      }
    }
  }, [toast])

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background" w={400} mx="auto">
      <Header />
      <Logo />
      <Content />
      <Actions linkProps={linkProps} />
      <Footer />
    </YStack>
  )
}

function Header() {
  return (
    <XStack
      pos="absolute"
      w="100%"
      t="$6"
      gap="$6"
      jc="flex-start"
      fw="wrap"
      $sm={{ pos: 'relative', t: 0 }}
    >
      {Platform.OS === 'web' && (
        <View ml="auto" h={100}>
          <SwitchThemeButton />
        </View>
      )}
    </XStack>
  )
}

function Logo() {
  return (
    <View mt={100} bg="white" w="$10" h="$5" ai="center" jc="center">
      <Image ai="center" src="/logo-blue.png" alt="Actual Logo" w="$10" h="$5" />
    </View>
  )
}

function Content() {
  return (
    <YStack gap="$4">
      <H1 ta="center" col="$color12">
        Welcome to Actual.
      </H1>
      <Paragraph col="$color10" ta="center">
        Actionable Knowledge in the Palm of Your Hand
      </Paragraph>
      <Separator />
      <Paragraph ta="center">
        Are you ready for next-level intelligence?
      </Paragraph>
      <Separator />
    </YStack>
  )
}

function Actions({ linkProps }) {
  return (
    <>
      <Button {...linkProps}>SIGN UP</Button>
      <Anchor href="/auth/login" textDecorationLine="none">
        <Text col="$gray7">I ALREADY HAVE AN ACCOUNT</Text>
      </Anchor>
    </>
  )
}
