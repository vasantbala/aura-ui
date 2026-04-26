import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  provider: 'google' | 'apple';
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = 'aura_auth_token';
const AUTH_USER_KEY = 'aura_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await SecureStore.getItemAsync(AUTH_USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Silently clear corrupt state
        await SecureStore.deleteItemAsync(AUTH_USER_KEY);
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (newUser: User, token: string) => {
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(newUser));
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    setUser(newUser);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
