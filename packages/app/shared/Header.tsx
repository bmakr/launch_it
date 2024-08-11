import { Anchor, Image, XStack } from "@my/ui";

export function Header() {
  return (
    <XStack w={400} mx='auto' mt='$6'>
      <Anchor href='/'>
        <Image src="/logo-blue.png" alt="Actual Logo" w="$5" h="$2" />
      </Anchor>
    </XStack>
  )
}
