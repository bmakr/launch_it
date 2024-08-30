import { Tabs } from 'expo-router'
export default function HomeLayout() {

  return (
    <Tabs>
      <Tabs.Screen name="profile"
        options={{
          href: '/profile',
          headerShown: false,
          tabBarLabel: 'profile',
          // tabBarIcon: ({color, size}) => (
          //   <IconComp 
          //     type="material" 
          //     name="play-arrow" 
          //     size={size} 
          //     color={color}
          //   />
          // ),
        }}
      />
      <Tabs.Screen name="play"
        options={{
          headerShown: false,
          tabBarLabel: 'play',
          // tabBarIcon: ({color, size}) => (
          //   <IconComp 
          //     type="material" 
          //     name="play-arrow" 
          //     size={size} 
          //     color={color}
          //   />
          // ),
        }}
      />
      <Tabs.Screen name="create"
        options={{
          tabBarLabel: 'create',
          headerShown: false,
          // tabBarIcon: ({color, size}) => (
          //   <IconComp 
          //     type="material" 
          //     name="add" 
          //     size={size} 
          //     color={color}
          //   />
          // ),
        }}
      />
      {/* <Tabs.Screen name="home" 
        options={{
          href: '/home',
          headerShown: false,
          tabBarLabel: 'home',
          tabBarIcon: ({color, size}) => (
            <IconComp 
              type="material" 
              name="home" 
              size={size} 
              color={color}
            />
          ),
        }} 
      /> */}
      {/* <Tabs.Screen name="browse" 
        options={{
          href: '/browse',
          headerShown: false,
          tabBarLabel: 'browse',
          tabBarIcon: ({color, size}) => (
            <IconComp 
              type="material" 
              name="message" 
              size={size} 
              color={color}
            />
          ),
        }} 
      /> */}
      {/* <Tabs.Screen name="progress" 
        options={{
          href: '/progress',
          headerShown: false,
          tabBarLabel: 'progress',
          tabBarIcon: ({color, size}) => (
            <IconComp 
              type="material" 
              name="insights" 
              size={size} 
              color={color}
            />
          ),
        }} 
      /> */}
    </Tabs>
  )
}
