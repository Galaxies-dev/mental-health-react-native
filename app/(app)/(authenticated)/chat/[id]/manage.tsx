import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';
import { useEffect, useState } from 'react';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client } = useChatContext();
  const channel = client.channel('messaging', id);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await client.queryUsers({ role: 'user' });
      setUsers(users.users);
    };
    loadUsers();
  }, []);

  const addUserToChannel = async (userId: string) => {
    const result = await channel.addMembers([userId], {
      text: 'Welcome a new member!',
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg text-gray-800 dark:text-white">{item.name}</Text>
            <TouchableOpacity
              onPress={() => addUserToChannel(item.id)}
              className="bg-blue-500 px-4 py-2 rounded-lg">
              <Text className="text-white">Add to Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
export default Page;
