import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { MessageList, Channel, useChatContext, MessageInput } from 'stream-chat-expo';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client } = useChatContext();
  const channel = client.channel('messaging', id);
  const { isTherapist } = useAuth();

  if (!channel) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 pb-safe">
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
        <MessageList />
        <MessageInput />
      </Channel>
    </View>
  );
};
export default Page;
