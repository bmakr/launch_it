import {
  View,
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  SwitchThemeButton,
  SwitchRouterButton,
  XStack,
  YStack,
  Text,
  Image,
  Toast
} from '@my/ui'
import { ChevronDown, ChevronUp, X, ArrowRightCircle, } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { useLink, useSearchParams } from 'solito/navigation'
import { Footer } from 'app/shared'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  // pages mode is for next routing purposes so we don't need it
  // const linkTarget = pagesMode ? '/pages-example-user' : '/user' 
  const toast = useToastController()

  // trigger toast
  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const toastParams = params?.get('toast')
    if (toastParams === 'loggedOut' || toastParams === 'expired') {
      // const toastController = useToastController()
      // toastController.show('You have been logged out')
      const toastMessagesKv = {
        loggedOut: 'You have been logged out',
        expired: 'Your session has expired. Please log in',
      }
      toast.show('Actual Alert', {
        message: toastMessagesKv[toastParams],
        // native: false,
      })
    }
  }, [])

  const linkProps = useLink({
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
          mt={100}
          bg="white"
          w='$10'
          h='$5'
          ai='center'
          jc='center'
        >
          <Image ai='center' src="/logo-blue.png" alt="Actual Logo" w="$10" h="$5" />
        </View>

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

        <Button {...linkProps}>SIGN UP</Button>
        <Anchor href='/auth/login' textDecorationLine='none'>
          <Text col='$gray7'>I ALREADY HAVE AN ACCOUNT</Text>
        </Anchor>

        <Footer />

      </YStack>
    </>
  )
}
