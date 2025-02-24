import { useAuth } from '@/providers/AuthProvider';
import { Stack, Redirect, Slot } from 'expo-router';

const Layout = () => {
  const { authState } = useAuth();

  if (!authState?.authenticated) {
    console.log('authState?.authenticated in auth group', authState?.authenticated);
    return <Redirect href="/login" />;
  }

  return <Slot />;
};
export default Layout;
