import { Text } from "@my/ui"
import { Link } from 'solito/link'

export default function Create() {
  return (
    <>
      <Text mt={50} mx={10}>Create</Text>
      <Link href='/'>
        <Text>
          Home
        </Text>
      </Link>
    </>
  )
}