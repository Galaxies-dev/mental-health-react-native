/**
 * HapticTab.tsx
 *
 * This component enhances the standard bottom tab bar button with haptic feedback.
 * When a user presses a tab on iOS devices, it provides a light haptic feedback
 * to improve the tactile experience of the app.
 */
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

/**
 * HapticTab component that wraps the standard tab bar button with haptic feedback
 *
 * This component extends the standard tab bar button functionality by adding
 * a light haptic feedback when pressed on iOS devices. It passes through all
 * other props to the underlying PlatformPressable component.
 *
 * @param props - The standard BottomTabBarButtonProps from React Navigation
 * @returns A tab bar button with haptic feedback on press
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Call the original onPressIn handler if it exists
        props.onPressIn?.(ev);
      }}
    />
  );
}
