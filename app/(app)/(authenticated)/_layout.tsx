import { useAuth } from '@/providers/AuthProvider';
import { Stack, Redirect, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatProvider from '@/providers/ChatProvider';

const Layout = () => {
  const { authState } = useAuth();
  const router = useRouter();

  if (!authState?.authenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/create-chat"
          options={{
            presentation: 'modal',
            title: 'Create Chat',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.dismissAll()}>
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="chat/[id]/index" options={{ headerBackTitle: 'Chats', title: '' }} />
        <Stack.Screen name="chat/[id]/manage" options={{ title: 'Manage Chat' }} />
      </Stack>
    </ChatProvider>
  );
};
export default Layout;
