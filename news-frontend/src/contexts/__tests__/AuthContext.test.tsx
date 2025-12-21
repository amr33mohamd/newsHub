import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext';
import api from '@/lib/api';
import { ReactNode } from 'react';

vi.mock('@/lib/api');

// Mock cookie functions
vi.mock('@/lib/cookies', () => ({
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
}));

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock successful user check (no token initially)
    vi.mocked(api.get).mockRejectedValue(new Error('No token'));
  });

  describe('initialization', () => {
    it('starts with no user when no token exists', async () => {
      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
    });

    it('loads user when valid token exists', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      localStorage.setItem('auth_token', 'valid-token');
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { data: mockUser },
      });

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toEqual(mockUser);
      expect(api.get).toHaveBeenCalledWith('/user');
    });

    it('clears invalid token on initialization', async () => {
      localStorage.setItem('auth_token', 'invalid-token');
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'));

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('login', () => {
    it('logs in user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'test-token-123';

      // Mock initial check (no user)
      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));

      // Mock login response
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Perform login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('throws error on failed login', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));
      vi.mocked(api.post).mockRejectedValueOnce(error);

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(
        result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
    });
  });

  describe('register', () => {
    it('registers user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'New User',
        email: 'new@example.com',
      };
      const mockToken = 'new-token-456';

      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.register({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
          password_confirmation: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(api.post).toHaveBeenCalledWith('/register', {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
    });

    it('throws error on failed registration', async () => {
      const error = new Error('Email already exists');
      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));
      vi.mocked(api.post).mockRejectedValueOnce(error);

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(
        result.current.register({
          name: 'Test',
          email: 'existing@example.com',
          password: 'password123',
          password_confirmation: 'password123',
        })
      ).rejects.toThrow('Email already exists');

      expect(result.current.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('logs out user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'test-token';

      // Clear and setup
      vi.clearAllMocks();
      localStorage.clear();

      // Mock no user initially
      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Login first to get authenticated state
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { user: mockUser, token: mockToken },
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);

      // Now test logout
      vi.mocked(api.post).mockResolvedValueOnce({ data: {} });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(api.post).toHaveBeenLastCalledWith('/logout');
    });

    it('clears user data even if logout API fails', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'test-token';

      // Clear and setup
      vi.clearAllMocks();
      localStorage.clear();

      // Mock no user initially
      vi.mocked(api.get).mockRejectedValueOnce(new Error('No token'));

      const { result } = renderHook(() => {
        const context = require('react').useContext(AuthContext);
        return context;
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Login first to get authenticated state
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { user: mockUser, token: mockToken },
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);

      // Mock logout API failure
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.logout();
      });

      // User should still be logged out locally
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('context error handling', () => {
    it('throws error when useAuth is used outside AuthProvider', () => {
      const useAuth = () => {
        const context = require('react').useContext(AuthContext);
        if (context === undefined) {
          throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
      };

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
