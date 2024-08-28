import { Anchor, Image, XStack, View } from '@my/ui'

export function Header() {
  return (
    <XStack w={400} mx='auto' mt='$6'>
      <Anchor href='/'>
        <View
          mt={100}
          bg='white'
          bw={.5}
          boc='white'
          ai='center'
          jc='center'
        >
          <Image src='/logo-blue.png' alt='Actual Logo' w='$7' h='$3' />
        </View>

      </Anchor>
    </XStack>
  )
}
