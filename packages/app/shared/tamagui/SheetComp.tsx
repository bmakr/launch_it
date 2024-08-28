import { useState } from 'react'
import { Sheet, View, AnimatePresence } from 'tamagui'

export function SheetComp({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}) {
  const [position, setPosition] = useState(0)
  const snapPoints = [95, 50, 25]

  return (
    <AnimatePresence>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={'percent'}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation='medium'
      >

        <Sheet.Overlay
          animation='lazy'
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />

        <View
          className='bg-cube'
        // opacity={.25}
        >
          <Sheet.Frame
            padding='$4'
            gap='$5'
            theme='light'
            bg='$background'
          >


            {children}

          </Sheet.Frame>
        </View>

      </Sheet>


    </AnimatePresence >
  )
}
