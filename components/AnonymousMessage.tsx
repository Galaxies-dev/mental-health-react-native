/**
 * AnonymousMessage.tsx
 *
 * This component renders a chat message bubble with a simplified, anonymous style.
 * It uses the Stream Chat SDK's message context to access message data and
 * applies different styling based on whether the message is from the current user.
 */
import { useMessageContext } from 'stream-chat-expo';
import { View, Text } from 'react-native';

/**
 * AnonymousMessage component that renders a styled message bubble
 *
 * @returns A styled message bubble that displays the message text
 * with different styling and positioning based on the sender
 */
export const AnonymousMessage = () => {
  // Get message data and check if it's from the current user
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
