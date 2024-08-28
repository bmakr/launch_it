import { Circle, ScrollView } from 'tamagui'
import { PricingTable } from './PricingTable'
import { IconComp } from '../tamagui'

export function PricingController({
  setOpen,
}: {
  setOpen: (isOpen: boolean) => void
}) {
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <Circle
        onPress={() => setOpen(false)}
        size='$4'
        bg='$blue10'
        cursor='pointer'
        hoverStyle={{
          bg: '$blue7'
        }}
      >
        <IconComp name='close' col='white' />
      </Circle>
      <PricingTable />
    </ScrollView>
  )
}
