import { Slot } from 'expo-router';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { OverlayProvider } from 'stream-chat-expo';


const InitialLayout = () => {
  const { authState, initialized } = useAuth();

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <StatusBar style="auto" />
            <InitialLayout />
          </AuthProvider>
        </ThemeProvider>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
