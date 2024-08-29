import { SignupScreen } from 'app/features/auth/signup/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Signup',
        }}
      />
      <SignupScreen />
    </>
  )
}
