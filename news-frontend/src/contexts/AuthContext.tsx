'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setCookie, deleteCookie } from '@/lib/cookies';
import { User, LoginCredentials, RegisterData } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
  setCookie('auth_token', token, 7);
};

const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
  deleteCookie('auth_token');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setCookie('auth_token', token, 7);
        const response = await api.get<{ data: User }>('/user');
        setUser(response.data.data);
      }
    } catch {
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.post('/login', credentials);
    storeAuthToken(response.data.token);
    setUser(response.data.user);
    router.push('/');
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    const response = await api.post('/register', data);
    storeAuthToken(response.data.token);
    setUser(response.data.user);
    router.push('/');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthToken();
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
