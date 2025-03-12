/**
 * TabBarBackground.ios.tsx
 *
 * This file contains components for styling and managing the tab bar background
 * specifically for iOS devices. It uses the BlurView from Expo to create a native-looking
 * tab bar with a blur effect that matches iOS system UI.
 */
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * BlurTabBarBackground component that renders a blur effect for the tab bar
 *
 * Uses the system chrome material blur effect which automatically adapts to
 * the system's theme (light/dark mode) and matches native iOS tab bar appearance.
 *
 * @returns A BlurView component that fills its container
 */
export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

/**
 * Custom hook that calculates the overflow height of the tab bar
 *
 * This is useful for adjusting content to account for the tab bar height
 * beyond what the safe area insets provide.
 *
 * @returns The difference between the tab bar height and the bottom safe area inset
 */
export function useBottomTabOverflow() {
  let tabHeight = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    tabHeight = useBottomTabBarHeight();
  } catch {}
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
