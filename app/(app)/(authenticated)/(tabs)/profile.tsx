import { View, Text, Pressable, Image } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

const Page = () => {
  const { client } = useChatContext();
  const { signOut } = useAuth();

  const user = client.user;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 bg-white p-4 justify-center">
      {/* User Info Section */}
      <View className="items-center mb-8">
        <Text className="text-xl font-bold">{user?.name || 'User'}</Text>
        <Text className="text-gray-500">@{user?.id || 'username'}</Text>
      </View>

      {/* User Details */}
      <View className="bg-gray-50 rounded-lg p-4 mb-8">
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Last Active</Text>
          <Text>
            {user?.last_active ? new Date(user.last_active).toLocaleDateString() : 'Not available'}
          </Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable className="bg-red-500 p-4 rounded-lg" onPress={handleSignOut}>
        <Text className="text-white text-center font-semibold">Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Page;
