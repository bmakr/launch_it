import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <ScrollView>
        <HomeScreen />
      </ScrollView>
    </>
  )
}
