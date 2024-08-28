import { Button, XStack, Text, YStack } from '@my/ui'
import { SheetComp, IconComp } from '../tamagui'
import { useState } from 'react'
import { PricingController } from './PricingController'

export function SubscribeButton() {

  const [open, setOpen] = useState(false)

  return (
    <YStack w={400} mx='auto' jc='center' ac='center' h={150}>
      <Button
        key='subscribe-button'
        bg='$blue11'
        w='90%'
        alignSelf='center'
        h='$6'
        onPress={() => setOpen(true)}
        hoverStyle={{
          bg: '$blue9'
        }}
      >
        <XStack gap='$2'>
          <IconComp
            name='plus'
            size='$1'
            col='white'
          />
          <Text
            col='white'
            ls={4}
            fow='300'
          >
            UPGRADE
          </Text>
        </XStack>
      </Button>


      <SheetComp
        setOpen={setOpen}
        open={open}
      >
        <PricingController
          setOpen={setOpen}
        />
      </SheetComp>
    </YStack>
  )
}
