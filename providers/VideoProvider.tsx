import { useAuth } from '@/providers/AuthProvider';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-native-sdk';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const apiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string;

export default function VideoProvider({ children }: PropsWithChildren) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const { authState } = useAuth();

  useEffect(() => {
    if (!authState) {
      return;
    }

    const initVideoClient = async () => {
      const user = {
        id: authState.user_id!,
        name: authState.email!,
      };

      const client = new StreamVideoClient({ apiKey, token: authState.token!, user });
      setVideoClient(client);
    };

    initVideoClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [authState?.authenticated]);

  if (!videoClient) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
