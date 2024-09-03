import {
  View,
  useToastController,
  SwitchThemeButton,
  H1,
  Text,
  XStack,
  YStack,
  Image,
  Paragraph,
  Separator,
  Button
} from '@my/ui'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import { Footer } from 'app/shared'
import { useSearchParams } from 'solito/navigation'
import { Link } from 'solito/link'
import { HOME_LOGO } from 'app/lib/data'

type SearchParams = {
  toast?: string;
}

export function HomeScreen() {
  const toast = useToastController()
  const params = useSearchParams<SearchParams>()

  const isExpo = !!process.env.EXPO_ROUTER_APP_ROOT
  const isProduction = process.env.NODE_ENV === 'production'
  console.log(`Running in Expo: ${isExpo}`)
  console.log(`Running production: ${isProduction}`)

  // trigger toast
  useEffect(() => {
    const toastParams = params?.get('toast')
    if (toastParams === 'loggedOut' || toastParams === 'expired' || toastParams === 'login') {
      const toastMessagesKv = {
        loggedOut: 'You have been logged out',
        expired: 'Your session has expired. Please log in',
        login: 'Please log in to access that page'
      }
      toast.show('Actualed Alert', {
        message: toastMessagesKv[toastParams],
        // native: false,
      })
    }
  }, [])

  const signupLinkProps = useLink({
    href: `/auth/signup`,
  })

  return (
    <>
      <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background" w={400} mx='auto'>
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
            <>
              <View ml='auto' h={100}>
                <SwitchThemeButton />
              </View>
            </>
          )}
        </XStack>

        <View
          mt={125}
          bg="white"
          w='$10'
          h='$5'
          ai='center'
          jc='center'
        >
          <Image
            ai='center'
            src={HOME_LOGO}
            alt="Actualed Logo"
            w="$10"
            h="$5"
          />
        </View>

        <YStack gap="$4">
          <H1 ta="center" col="$color12">
            Welcome to Actual.
          </H1>
          <Paragraph col="$color10" ta="center">
            Learn Faster from the Palm of Your Hand
          </Paragraph>
          <Separator />
          <Paragraph ta="center">
            Are you ready for next-level intelligence?
          </Paragraph>
          <Separator />
        </YStack>

        <Button {...signupLinkProps}>SIGN UP</Button>
        <Link href='/auth/login'>
          <Text style={{ textDecoration: 'none' }} col='$gray7'>
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </Link>

        <Footer />

      </YStack>
    </>
  )
}
