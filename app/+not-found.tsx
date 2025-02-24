import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <View className="flex-1 items-center justify-center p-5">
        <Text>This screen doesn't exist.</Text>
        <Link href="/login" className="mt-4 py-4">
          <Text className="text-primary">Back to Login!</Text>
        </Link>
      </View>
    </>
  );
}
