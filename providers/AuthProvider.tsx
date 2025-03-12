/**
 * AuthProvider.tsx
 *
 * This provider manages authentication state and operations throughout the app.
 * It handles user authentication, registration, and session management using JWT tokens.
 * The provider uses SecureStore for native platforms and localStorage for web to persist auth data.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Interface defining the authentication context properties and methods
 */
interface AuthProps {
  authState: {
    token: string | null;
    jwt: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  };
  onRegister: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  initialized: boolean;
  isTherapist: boolean;
}

// Key used for storing the JWT token in secure storage
const TOKEN_KEY = 'user-jwt';
export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

// Create the authentication context with default empty values
const AuthContext = createContext<Partial<AuthProps>>({});

/**
 * Storage helper functions that provide a unified API for both web and native platforms
 * This abstraction allows the same code to work across different platforms
 */
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  },
};

// Default empty authentication state
const EMPTY_AUTH_STATE = {
  token: null,
  jwt: null,
  authenticated: null,
  user_id: null,
  role: null,
  email: null,
};

/**
 * AuthProvider component that manages authentication state and provides auth methods
 * to all child components through React Context
 */
export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    jwt: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  }>(EMPTY_AUTH_STATE);
  const [initialized, setInitialized] = useState(false);

  // On component mount, try to load the saved token from storage
  useEffect(() => {
    const loadToken = async () => {
      const data = await storage.getItem(TOKEN_KEY);

      if (data) {
        const object = JSON.parse(data);
        updateAuthStateFromToken(object);
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  /**
   * Updates the authentication state with data from a token response
   */
  const updateAuthStateFromToken = (object: any) => {
    setAuthState({
      token: object.token,
      jwt: object.jwt,
      authenticated: true,
      user_id: object.user.id,
      role: object.user.role,
      email: object.user.email,
    });
  };

  /**
   * Authenticates a user with email and password
   * Stores the JWT token in secure storage upon successful authentication
   */
  const signIn = async (email: string, password: string) => {
    const result = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json.msg);
    }

    updateAuthStateFromToken(json);
    await storage.setItem(TOKEN_KEY, JSON.stringify(json));
    return result;
  };

  /**
   * Registers a new user with email and password
   * Automatically signs in the user upon successful registration
   */
  const register = async (email: string, password: string) => {
    const result = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json.msg);
    }

    updateAuthStateFromToken(json);

    await storage.setItem(TOKEN_KEY, JSON.stringify(json));

    return json;
  };

  /**
   * Signs out the current user by removing the token from storage
   * and resetting the auth state
   */
  const signOut = async () => {
    await storage.removeItem(TOKEN_KEY);

    setAuthState(EMPTY_AUTH_STATE);
  };

  // Helper property to check if the current user is a therapist
  const isTherapist = authState.role === 'therapist';

  // Context value to be provided to consumers
  const value = {
    onRegister: register,
    signIn,
    signOut,
    authState,
    initialized,
    isTherapist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to easily access the auth context throughout the app
 * Throws an error if used outside of AuthProvider
 */
export const useAuth = () => {
  return useContext(AuthContext) as AuthProps;
};
