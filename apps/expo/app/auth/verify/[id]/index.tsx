import { VerifyScreen } from 'app/features/auth/verify/screen'
import { Stack } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setCookie({ id }: { id: number }) {
  try {
    await AsyncStorage.setItem('session', JSON.stringify({ id }));
  } catch (error) {
    console.log(error)
  }
}


export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Verify',
        }}
      />
      <VerifyScreen setCookie={setCookie} />
    </>
  )
}
