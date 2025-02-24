import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null; user_id: string | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
  initialized: boolean;
}

const TOKEN_KEY = 'user-jwt';
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthContext = createContext<Partial<AuthProps>>({});

// Storage helper functions for web/native compatibility
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

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user_id: string | null;
  }>({
    token: null,
    authenticated: null,
    user_id: null,
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const data = await storage.getItem(TOKEN_KEY);

      if (data) {
        const object = JSON.parse(data);
        setAuthState({
          token: object.token,
          authenticated: true,
          user_id: object.user.id,
        });
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('login', email, password);

    const result = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('result', result);

    const json = await result.json();
    console.log('🚀 ~ login ~ json:', json);

    if (!result.ok) {
      console.log('result not ok', result);
      throw new Error(json.msg);
    }

    setAuthState({
      token: json.token,
      authenticated: true,
      user_id: json.user.id,
    });

    await storage.setItem(TOKEN_KEY, JSON.stringify(json));
    console.log('after update state');

    return result;
  };

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
      console.log('result not ok', result);
      throw new Error(json.msg);
    }

    setAuthState({
      token: json.token,
      authenticated: true,
      user_id: json.user.id,
    });

    await storage.setItem(TOKEN_KEY, JSON.stringify(json));

    return json;
  };

  const logout = async () => {
    await storage.removeItem(TOKEN_KEY);

    setAuthState({
      token: null,
      authenticated: false,
      user_id: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Easy access to our Provider
export const useAuth = () => {
  return useContext(AuthContext) as AuthProps;
};
