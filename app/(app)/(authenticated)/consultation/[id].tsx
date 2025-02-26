import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
const Page = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
};
export default Page;
