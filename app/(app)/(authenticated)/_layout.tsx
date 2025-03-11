import { useAuth } from '@/providers/AuthProvider';
import { Stack, Redirect, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatProvider from '@/providers/ChatProvider';
import VideoProvider from '@/providers/VideoProvider';
import { AppointmentProvider } from '@/providers/AppointmentProvider';

const Layout = () => {
  const { authState } = useAuth();
  const router = useRouter();

  if (!authState?.authenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ChatProvider>
      <VideoProvider>
        <AppointmentProvider>
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
            <Stack.Screen
              name="chat/[id]/index"
              options={{ headerBackTitle: 'Chats', title: '' }}
            />
            <Stack.Screen name="chat/[id]/manage" options={{ title: 'Manage Chat' }} />
            <Stack.Screen
              name="consultation/schedule"
              options={{ title: 'Schedule Consultation', headerBackTitle: 'Back' }}
            />
          </Stack>
        </AppointmentProvider>
      </VideoProvider>
    </ChatProvider>
  );
};
export default Layout;
