import { View } from 'react-native';
import { Thread, Channel } from 'stream-chat-expo';
import { selectedThreadAtom, selectedChannelAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';
import { Stack } from 'expo-router';

const Page = () => {
  const [selectedThread, setSelectedThread] = useAtom(selectedThreadAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);

  return (
    <View className="flex-1 pb-safe bg-white">
      <Stack.Screen options={{ title: 'Thread' }} />
      <Channel channel={selectedChannel} thread={selectedThread} threadList>
        <Thread />
      </Channel>
    </View>
  );
};
export default Page;
