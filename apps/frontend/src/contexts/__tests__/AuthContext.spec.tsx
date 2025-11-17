import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { UserRole } from '@kompass/shared';

import * as authLib from '../../lib/auth';
import { AuthProvider, useAuth } from '../AuthContext';

import type { User } from '@kompass/shared';

// Mock the auth library
vi.mock('../../lib/auth', () => ({
  initKeycloak: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  getUserInfo: vi.fn(),
  getAccessToken: vi.fn(),
  refreshToken: vi.fn(),
  setupTokenRefresh: vi.fn(),
}));

/**
 * Test component that uses auth context
 */
function TestComponent(): React.ReactElement {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <button onClick={() => login()}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AuthProvider', () => {
    it('should initialize Keycloak on mount', async () => {
      const mockKeycloak = {
        authenticated: false,
        token: null,
        tokenParsed: null,
        updateToken: vi.fn(),
      };

      vi.mocked(authLib.initKeycloak).mockResolvedValue(mockKeycloak as any);
      vi.mocked(authLib.isAuthenticated).mockReturnValue(false);
      vi.mocked(authLib.getUserInfo).mockResolvedValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authLib.initKeycloak).toHaveBeenCalled();
      });
    });

    it('should load user info if authenticated', async () => {
      const mockUser: User = {
        _id: 'user-123',
        _rev: '',
        type: 'user',
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [UserRole.ADM],
        primaryRole: UserRole.ADM,
        active: true,
        createdBy: 'system',
        createdAt: new Date(),
        modifiedBy: 'system',
        modifiedAt: new Date(),
        version: 1,
      };

      const mockKeycloak = {
        authenticated: true,
        token: 'mock-token',
        tokenParsed: {},
        updateToken: vi.fn(),
      };

      vi.mocked(authLib.initKeycloak).mockResolvedValue(mockKeycloak as any);
      vi.mocked(authLib.isAuthenticated).mockReturnValue(true);
      vi.mocked(authLib.getUserInfo).mockResolvedValue(mockUser);
      vi.mocked(authLib.setupTokenRefresh).mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authLib.getUserInfo).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('test@example.com');
        expect(screen.getByTestId('authenticated').textContent).toBe(
          'Authenticated'
        );
      });
    });

    it('should show loading state during initialization', async () => {
      const mockKeycloak = {
        authenticated: false,
        token: null,
        tokenParsed: null,
        updateToken: vi.fn(),
      };

      vi.mocked(authLib.initKeycloak).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockKeycloak as any), 100)
          )
      );
      vi.mocked(authLib.isAuthenticated).mockReturnValue(false);
      vi.mocked(authLib.getUserInfo).mockResolvedValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('loading').textContent).toBe('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      });
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Failed to initialize Keycloak');
      vi.mocked(authLib.initKeycloak).mockRejectedValue(error);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Failed to initialize authentication'
        );
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error if used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide login function', async () => {
      const mockKeycloak = {
        authenticated: false,
        token: null,
        tokenParsed: null,
        updateToken: vi.fn(),
      };

      vi.mocked(authLib.initKeycloak).mockResolvedValue(mockKeycloak as any);
      vi.mocked(authLib.isAuthenticated).mockReturnValue(false);
      vi.mocked(authLib.getUserInfo).mockResolvedValue(null);
      vi.mocked(authLib.login).mockResolvedValue(undefined);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      });

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(authLib.login).toHaveBeenCalled();
      });
    });

    it('should provide logout function', async () => {
      const mockKeycloak = {
        authenticated: true,
        token: 'mock-token',
        tokenParsed: {},
        updateToken: vi.fn(),
      };

      const mockUser: User = {
        _id: 'user-123',
        _rev: '',
        type: 'user',
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [UserRole.ADM],
        primaryRole: UserRole.ADM,
        active: true,
        createdBy: 'system',
        createdAt: new Date(),
        modifiedBy: 'system',
        modifiedAt: new Date(),
        version: 1,
      };

      vi.mocked(authLib.initKeycloak).mockResolvedValue(mockKeycloak as any);
      vi.mocked(authLib.isAuthenticated).mockReturnValue(true);
      vi.mocked(authLib.getUserInfo).mockResolvedValue(mockUser);
      vi.mocked(authLib.setupTokenRefresh).mockImplementation(() => {});
      vi.mocked(authLib.logout).mockResolvedValue(undefined);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe(
          'Authenticated'
        );
      });

      const logoutButton = screen.getByText('Logout');
      logoutButton.click();

      await waitFor(() => {
        expect(authLib.logout).toHaveBeenCalled();
      });
    });
  });
});
