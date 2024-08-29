import { XStack, View, Image } from '@my/ui'
import { Link } from 'solito/link'

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
            src="https://imagedelivery.net/6mgEv1oiFiEZf73JB3qb6A/e8435582-1bdb-4733-bf79-4383478c4000/public"
            alt="Actualed Logo"
            height='$3'
            width='$7'
          />
        </View>
      </Link>
    </XStack>
  )
}
