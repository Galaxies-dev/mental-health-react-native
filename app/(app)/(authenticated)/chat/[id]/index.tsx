import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { MessageList, Channel, useChatContext, MessageInput } from 'stream-chat-expo';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { selectedThreadAtom, selectedChannelAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';
import { useRouter } from 'expo-router';
import { AnonymousMessage } from '@/components/AnonymousMessage';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client } = useChatContext();
  const channel = client.channel('messaging', id);
  const { isTherapist } = useAuth();
  const [selectedThread, setSelectedThread] = useAtom(selectedThreadAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const router = useRouter();

  if (!channel) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Handle thread selection through atoms
  const handleThreadSelect = (thread: any) => {
    setSelectedThread(thread);
    setSelectedChannel(channel);
    router.push(`/chat/${id}/thread`);
  };

  return (
    <View className="flex-1 pb-safe bg-white">
      <Stack.Screen
        options={{
          title: channel?.data?.name,
          headerRight: () => (
            <>
              {isTherapist && (
                <Link href={`/chat/${id}/manage`}>
                  <Text>Manage</Text>
                </Link>
              )}
            </>
          ),
        }}
      />

      <Channel channel={channel}>
        {/* For custom message UI: MessageSimple={AnonymousMessage} */}
        <MessageList onThreadSelect={handleThreadSelect} />
        <MessageInput />
      </Channel>
    </View>
  );
};
export default Page;
