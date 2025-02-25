import { useMessageContext } from 'stream-chat-expo';
import { View, Text } from 'react-native';

export const AnonymousMessage = () => {
  const { message, isMyMessage } = useMessageContext();

  return (
    <View
      className={`
        ${isMyMessage ? 'self-end' : 'self-start'}
        ${isMyMessage ? 'bg-[#ADD8E6]' : 'bg-[#ededed]'}
        p-2.5 m-2.5 rounded-[10px] w-[70%]
      `}>
      <Text>{message.text}</Text>
    </View>
  );
};
