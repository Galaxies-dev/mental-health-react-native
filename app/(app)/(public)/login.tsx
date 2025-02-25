import {
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password is too long'),
});

type FormData = z.infer<typeof schema>;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'client@galaxies.dev',
      password: '123456',
    },
    mode: 'onChange',
  });

  // Sign in with email and password
  const onSignInPress = async (data: FormData) => {
    setLoading(true);

    try {
      const result = await signIn(data.email, data.password);
    } catch (e) {
      Alert.alert('Error', 'Could not log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white p-6 dark:bg-gray-900 ">
      <View className="flex-1 justify-center w-full max-w-md mx-auto">
        <Text className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">Welcome Back</Text>
        <Text className="text-lg text-gray-600 mb-8 dark:text-white">
          Sign in to your mental health space
        </Text>

        <View className="gap-2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email address"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSignInPress)}
          disabled={loading}
          className={`bg-blue-600 rounded-xl p-4 items-center mt-6 ${loading ? 'opacity-50' : ''}`}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 dark:text-white">Don't have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;
