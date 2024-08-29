import { VerifyScreen } from 'app/features/auth/verify/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Verify',
        }}
      />
      <VerifyScreen />
    </>
  )
}
