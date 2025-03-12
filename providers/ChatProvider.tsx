/**
 * ChatProvider.tsx
 *
 * This provider integrates Stream Chat functionality into the application.
 * It manages the connection to Stream's chat service, handling user authentication
 * and providing the chat client to child components.
 */
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from './AuthProvider';

// Initialize the Stream Chat client with the API key from environment variables
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string);

/**
 * Custom theme configuration for the Stream Chat UI components
 * Makes channel previews have a transparent background to match app styling
 */
const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
    },
  },
};

/**
 * Provider component that initializes and manages the Stream Chat connection
 * Connects the current user to Stream Chat using their authentication details
 */
export default function ChatProvider({ children }: PropsWithChildren) {
  // Track whether the chat client is ready (connected)
  const [isReady, setIsReady] = useState(false);
  // Get authentication state from AuthProvider
  const { authState } = useAuth();

  // Connect to Stream Chat when the user is authenticated
  useEffect(() => {
    // Skip if user is not authenticated
    if (!authState?.authenticated) {
      return;
    }

    /**
     * Connect the current user to Stream Chat using their ID and token
     */
    const connectUser = async () => {
      await client.connectUser(
        {
          id: authState.user_id!,
          name: authState.email!,
        },
        authState.token!
      );
      setIsReady(true);
    };

    connectUser();

    // Cleanup function to disconnect user when component unmounts
    // or when authentication state changes
    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [authState?.authenticated]);

  // Show loading indicator while connecting to Stream Chat
  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Provide Stream Chat context to child components
  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
