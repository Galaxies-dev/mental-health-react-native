import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BlurTabBarBackground from '@/components/TabBarBackground.ios';
import { HapticTab } from '@/components/HapticTab';
import { useAuth } from '@/providers/AuthProvider';
import { TouchableOpacity } from 'react-native';
// https://github.com/EvanBacon/expo-router-forms-components/blob/main/components/ui/Tabs.tsx
export default function TabLayout() {
  const { onLogout } = useAuth();

  return (
    <Tabs
      screenOptions={
        process.env.EXPO_OS === 'ios'
          ? {
              tabBarActiveTintColor: '#0d6c9a',
              tabBarInactiveTintColor: '#8E8E93',
              headerShown: true,
              tabBarButton: HapticTab,
              tabBarBackground: BlurTabBarBackground,
              tabBarStyle: {
                position: 'absolute',
              },
            }
          : {
              tabBarActiveTintColor: '#0d6c9a',
              tabBarInactiveTintColor: '#8E8E93',
              headerShown: true,
            }
      }>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={onLogout} className="mr-4">
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarLabel: 'Chats',
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
