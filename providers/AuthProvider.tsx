import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthProps {
  authState: {
    token: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
  initialized: boolean;
  isTherapist: boolean;
}

const TOKEN_KEY = 'user-jwt';
export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

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

const EMPTY_AUTH_STATE = {
  token: null,
  authenticated: null,
  user_id: null,
  role: null,
  email: null,
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  }>(EMPTY_AUTH_STATE);
  const [initialized, setInitialized] = useState(false);

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

  const updateAuthStateFromToken = (object: any) => {
    setAuthState({
      token: object.token,
      authenticated: true,
      user_id: object.user.id,
      role: object.user.role,
      email: object.user.email,
    });
  };

  const login = async (email: string, password: string) => {
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

  const logout = async () => {
    await storage.removeItem(TOKEN_KEY);

    setAuthState(EMPTY_AUTH_STATE);
  };

  const isTherapist = authState.role === 'therapist';

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    initialized,
    isTherapist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Easy access to our Provider
export const useAuth = () => {
  return useContext(AuthContext) as AuthProps;
};
