import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from './AuthProvider';

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string);

const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
    },
  },
};

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { authState } = useAuth();
  const [thread, setThread] = useState<any>(null);

  useEffect(() => {
    if (!authState?.authenticated) {
      return;
    }

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

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [authState?.authenticated]);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
