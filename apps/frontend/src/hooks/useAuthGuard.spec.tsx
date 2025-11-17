import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

import { EntityType, Permission, UserRole } from '@kompass/shared';

import { AuthProvider } from '../contexts/AuthContext';

import { useAuthGuard } from './useAuthGuard';

import type { User } from '@kompass/shared';

// Mock the auth library
vi.mock('../lib/auth', () => ({
  initKeycloak: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  getUserInfo: vi.fn(),
  getAccessToken: vi.fn(),
  refreshToken: vi.fn(),
  setupTokenRefresh: vi.fn(),
}));

import * as authLib from '../lib/auth';

/**
 * Wrapper component for testing hooks
 */
function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state when auth is loading', async () => {
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

    const { result } = renderHook(
      () => useAuthGuard(EntityType.Customer, Permission.READ),
      {
        wrapper: TestWrapper,
      }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasPermission).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return false when user is not authenticated', async () => {
    const mockKeycloak = {
      authenticated: false,
      token: null,
      tokenParsed: null,
      updateToken: vi.fn(),
    };

    vi.mocked(authLib.initKeycloak).mockResolvedValue(mockKeycloak as any);
    vi.mocked(authLib.isAuthenticated).mockReturnValue(false);
    vi.mocked(authLib.getUserInfo).mockResolvedValue(null);

    const { result } = renderHook(
      () => useAuthGuard(EntityType.Customer, Permission.READ),
      {
        wrapper: TestWrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasPermission).toBe(false);
      expect(result.current.error).toBe('User not authenticated');
    });
  });

  it('should return false when user has no roles', async () => {
    const mockUser: User = {
      _id: 'user-123',
      _rev: '',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [],
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

    const { result } = renderHook(
      () => useAuthGuard(EntityType.Customer, Permission.READ),
      {
        wrapper: TestWrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasPermission).toBe(false);
      expect(result.current.error).toBe('User has no assigned roles');
    });
  });

  it('should return true when user has permission', async () => {
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

    const { result } = renderHook(
      () => useAuthGuard(EntityType.Customer, Permission.READ),
      {
        wrapper: TestWrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasPermission).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.roles).toEqual([UserRole.ADM]);
    });
  });

  it('should return false when user lacks permission', async () => {
    const mockUser: User = {
      _id: 'user-123',
      _rev: '',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [UserRole.ADM], // ADM cannot access Project entity
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

    const { result } = renderHook(
      () => useAuthGuard(EntityType.Project, Permission.READ),
      {
        wrapper: TestWrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasPermission).toBe(false);
      expect(result.current.error).toBe('Insufficient permissions');
    });
  });
});
