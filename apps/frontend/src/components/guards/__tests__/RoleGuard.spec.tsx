import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { EntityType, Permission, UserRole } from '@kompass/shared';

import { AuthProvider } from '../../../contexts/AuthContext';
import * as authLib from '../../../lib/auth';
import { RoleGuard } from '../RoleGuard';

import type { User } from '@kompass/shared';

// Mock the auth library
vi.mock('../../../lib/auth', () => ({
  initKeycloak: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  getUserInfo: vi.fn(),
  getAccessToken: vi.fn(),
  refreshToken: vi.fn(),
  setupTokenRefresh: vi.fn(),
}));

// Mock audit service
const mockLogUnauthorizedAccess = vi.fn();
vi.mock('../../../services/audit.service', () => ({
  auditService: {
    logUnauthorizedAccess: mockLogUnauthorizedAccess,
  },
}));

/**
 * Test component for protected route
 */
function TestPage(): React.ReactElement {
  return <div>Protected Content</div>;
}

/**
 * Test wrapper with routing
 */
function TestWrapper({
  children,
  initialEntries = ['/test'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}): React.ReactElement {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/test" element={children} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while checking permissions', async () => {
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
      <TestWrapper>
        <RoleGuard
          entityType={EntityType.Customer}
          permission={Permission.READ}
        >
          <TestPage />
        </RoleGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Checking permissions...')).toBeInTheDocument();
  });

  it('should render children when user has permission', async () => {
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
      <TestWrapper>
        <RoleGuard
          entityType={EntityType.Customer}
          permission={Permission.READ}
        >
          <TestPage />
        </RoleGuard>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('should redirect to unauthorized page when user lacks permission', async () => {
    const mockUser: User = {
      _id: 'user-123',
      _rev: '',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [UserRole.ADM], // ADM cannot access Project
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
      <TestWrapper initialEntries={['/test']}>
        <RoleGuard entityType={EntityType.Project} permission={Permission.READ}>
          <TestPage />
        </RoleGuard>
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Unauthorized')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Audit logging happens before redirect, so wait a bit
    await waitFor(
      () => {
        expect(mockLogUnauthorizedAccess).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it('should log unauthorized access attempt', async () => {
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
      <TestWrapper initialEntries={['/test']}>
        <RoleGuard entityType={EntityType.Project} permission={Permission.READ}>
          <TestPage />
        </RoleGuard>
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(mockLogUnauthorizedAccess).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'user-123',
            route: '/test',
            reason: 'Insufficient permissions',
            roles: [UserRole.ADM],
          })
        );
      },
      { timeout: 3000 }
    );
  });
});
