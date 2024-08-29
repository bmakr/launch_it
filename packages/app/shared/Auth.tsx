import {
  H1, Text, YStack, Input, Button, XStack,
  View,
  Paragraph
} from '@my/ui'
import { Header } from './Header'
import { Footer } from './Footer'
import { Link } from 'solito/link'

type Handler = ({
  val,
}: {
  val: string;
}) => void;
export type AuthConfig = {
  title: 'Log In' | 'Sign Up' | 'Check Your Email';
  description: string;
  placeholder: 'email' | 'Enter code';
  buttonText: 'Send' | 'Sign Up' | 'Verify';
  afterText: string;
  linkText?: 'I NEED TO SIGN UP' | 'I ALREADY HAVE AN ACCOUNT' | 'RESEND SECURITY CODE';
  href?: '/auth/login' | '/auth/signup';
  resend?: () => void;
  handler: Handler;
  setStatus?: React.Dispatch<React.SetStateAction<'sending' | '' | 'error' | 'success'>>;
  setVal: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  status: 'sending' | 'resend' | 'resent' | '' | 'error' | 'success';
  error: string;
}

export function Auth({ authConfig }: { authConfig: AuthConfig }) {
  const {
    title, description, placeholder, afterText, buttonText, linkText, href, resend, handler, val, setVal, status, error
  } = authConfig

  return (
    <View bg='$background' h='100%'>
      <View height={150}>
        <Header />
      </View>
      <YStack
        mt={50}
        f={1}
        jc="center"
        ai="center"
        gap="$8"
        p="$4"
        bg="$background"
        w={400}
        mx='auto'
      >
        <YStack gap='$2' ac='flex-start' w='100%'>
          <H1>{title}</H1>
          <Text>{description}</Text>
        </YStack>
        {status === 'error' && <Paragraph style={{ color: 'red' }}>{error}</Paragraph>}
        <XStack gap="$2" w='100%' flexWrap="wrap">
          <Input
            minWidth={225}
            placeholder={placeholder}
            onChangeText={(text) => setVal(text)}
          />
          <Button onPress={() => handler({ val })}>{buttonText}</Button>
        </XStack>
        <XStack w='100%'>
          <Text fos='$3' col='$gray9'>
            {afterText}
          </Text>
        </XStack>

        {linkText && href ? (
          <Link href={href} style={{ textDecoration: 'none' }}>
            <Text col='$gray7'>{linkText}</Text>
          </Link>
        ) : (
          <View onPress={resend} cursor='pointer'>
            <Text col='$gray7'>RESEND SECURITY CODE</Text>
          </View>
        )}

        <Footer />
      </YStack>
    </View>
  )
}
