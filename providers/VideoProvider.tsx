/**
 * VideoProvider.tsx
 *
 * This provider integrates Stream Video functionality into the application.
 * It manages the connection to Stream's video service, handling user authentication
 * and providing the video client to child components for video calling features.
 */
import { useAuth } from '@/providers/AuthProvider';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-native-sdk';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Get the Stream API key from environment variables
const apiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string;

/**
 * Provider component that initializes and manages the Stream Video connection
 * Connects the current user to Stream Video using their authentication details
 */
export default function VideoProvider({ children }: PropsWithChildren) {
  // State to hold the Stream Video client instance
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  // Get authentication state from AuthProvider
  const { authState } = useAuth();

  // Initialize and connect to Stream Video when the user is authenticated
  useEffect(() => {
    // Skip if auth state is not available
    if (!authState) {
      return;
    }

    /**
     * Initialize the Stream Video client with the current user's credentials
     */
    const initVideoClient = async () => {
      const user = {
        id: authState.user_id!,
        name: authState.email!,
      };

      const client = new StreamVideoClient({ apiKey, token: authState.token!, user });
      setVideoClient(client);
    };

    initVideoClient();

    // Cleanup function to disconnect user when component unmounts
    // or when authentication state changes
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [authState?.authenticated]);

  // Show loading indicator while connecting to Stream Video
  if (!videoClient) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Provide Stream Video context to child components
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
