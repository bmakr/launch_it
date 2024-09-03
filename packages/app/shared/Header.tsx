import { XStack, View, Image } from '@my/ui'
import { Link } from 'solito/link'
import { HEADER_LOGO } from 'app/lib/data'

export function Header() {
  return (
    <XStack w={400} mx='auto' px={20} bg='$background'>
      <Link href='/'>
        <View
          mt={50}
          bg='white'
          bw={.5}
          boc='white'
          ai='center'
          jc='center'
        >
          <Image
            src={HEADER_LOGO}
            alt="Actualed Logo"
            height='$3'
            width='$7'
          />
        </View>
      </Link>
    </XStack>
  )
}
