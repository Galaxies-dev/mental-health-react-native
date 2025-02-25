import { useAuth } from '@/providers/AuthProvider';
import { Stack, Redirect } from 'expo-router';
import { Platform } from 'react-native';

const Layout = () => {
  const { authState } = useAuth();

  if (authState?.authenticated) {
    return <Redirect href="/(app)/(authenticated)/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
      <Stack.Screen
        name="register"
        options={{ title: 'Create Account', headerShown: Platform.OS !== 'web' }}
      />
    </Stack>
  );
};
export default Layout;
