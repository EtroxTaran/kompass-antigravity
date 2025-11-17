/**
 * Keycloak Admin Service
 *
 * Handles synchronization of users and roles with Keycloak.
 * Uses Keycloak Admin REST API to create, update, and manage users.
 *
 * @see https://www.keycloak.org/docs-api/latest/rest-api/index.html
 */

import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { type AxiosError, type AxiosInstance } from 'axios';

import type { UserRole } from '@kompass/shared/constants/rbac.constants';

/**
 * Keycloak Admin API Response Types
 */
interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  attributes?: Record<string, string[]>;
}

interface KeycloakRole {
  id: string;
  name: string;
  description?: string;
  composite: boolean;
  clientRole: boolean;
}

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

/**
 * Keycloak Admin Service
 */
@Injectable()
export class KeycloakAdminService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakAdminService.name);
  private readonly keycloakUrl: string;
  private readonly keycloakRealm: string;
  private readonly keycloakAdminUser: string;
  private readonly keycloakAdminPassword: string;
  private readonly clientId: string;
  private adminToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.keycloakUrl =
      this.configService.get<string>('KEYCLOAK_URL') || 'http://keycloak:8080';
    this.keycloakRealm =
      this.configService.get<string>('KEYCLOAK_REALM') || 'kompass';
    this.keycloakAdminUser =
      this.configService.get<string>('KEYCLOAK_ADMIN') || 'admin';
    this.keycloakAdminPassword =
      this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD') ||
      'devpassword';
    this.clientId =
      this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'kompass-api';

    // Create axios instance for Keycloak Admin API
    this.axiosInstance = axios.create({
      baseURL: `${this.keycloakUrl}/admin/realms/${this.keycloakRealm}`,
      timeout: 10000,
    });
  }

  /**
   * Initialize service - get admin token on module init
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.getAdminToken();
      this.logger.log('Keycloak Admin Service initialized');
    } catch (error) {
      this.logger.warn(
        'Failed to initialize Keycloak Admin Service. User management features may not work.',
        error
      );
    }
  }

  /**
   * Get admin access token from Keycloak
   * Token is cached and refreshed automatically
   */
  private async getAdminToken(): Promise<string> {
    // Check if token is still valid (with 30 second buffer)
    const now = Date.now();
    if (this.adminToken && this.tokenExpiresAt > now + 30000) {
      return this.adminToken;
    }

    try {
      const tokenUrl = `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`;

      const response = await axios.post<KeycloakTokenResponse>(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: this.keycloakAdminUser,
          password: this.keycloakAdminPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.adminToken = response.data.access_token;
      this.tokenExpiresAt = now + response.data.expires_in * 1000;

      this.logger.debug('Admin token obtained from Keycloak');

      if (!this.adminToken) {
        throw new Error('Failed to obtain admin token from Keycloak');
      }

      return this.adminToken;
    } catch (error: unknown) {
      this.logger.error('Failed to get admin token from Keycloak:', error);
      throw new Error(
        'Failed to authenticate with Keycloak Admin API. Check KEYCLOAK_ADMIN and KEYCLOAK_ADMIN_PASSWORD configuration.'
      );
    }
  }

  /**
   * Get axios instance with admin token in headers
   */
  private async getAuthenticatedAxios(): Promise<AxiosInstance> {
    const token = await this.getAdminToken();

    return axios.create({
      baseURL: `${this.keycloakUrl}/admin/realms/${this.keycloakRealm}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Map KOMPASS UserRole to Keycloak role name
   */
  private mapKompassRoleToKeycloak(role: UserRole): string {
    // Keycloak roles match KOMPASS roles exactly
    return role;
  }

  /**
   * Create user in Keycloak
   *
   * @param email User email (used as username)
   * @param password User password
   * @param displayName User display name
   * @param roles Initial roles to assign
   * @returns Keycloak user ID
   */
  async createUser(
    email: string,
    password: string,
    displayName: string,
    roles: UserRole[]
  ): Promise<string> {
    const client = await this.getAuthenticatedAxios();

    // Parse display name into first and last name
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user in Keycloak
    const userData = {
      username: email,
      email: email,
      firstName: firstName,
      lastName: lastName,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false, // User must change password on first login
        },
      ],
    };

    try {
      const response = await client.post('/users', userData);
      const locationHeader = response.headers.location;
      const keycloakUserId =
        typeof locationHeader === 'string'
          ? (locationHeader.split('/').pop() ?? undefined)
          : undefined;

      if (!keycloakUserId) {
        throw new Error('Failed to extract user ID from Keycloak response');
      }

      this.logger.log('User created in Keycloak', {
        email,
        keycloakUserId,
      });

      // Assign roles to user
      if (roles.length > 0) {
        await this.assignRoles(keycloakUserId, roles);
      }

      return keycloakUserId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
          // User already exists - try to find and return existing user ID
          const existingUser = await this.findUserByEmail(email);
          if (existingUser) {
            this.logger.warn('User already exists in Keycloak', {
              email,
              keycloakUserId: existingUser.id,
            });
            return existingUser.id;
          }
        }
        this.logger.error('Failed to create user in Keycloak:', {
          email,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  }

  /**
   * Find user by email in Keycloak
   */
  private async findUserByEmail(email: string): Promise<KeycloakUser | null> {
    const client = await this.getAuthenticatedAxios();

    try {
      const response = await client.get<KeycloakUser[]>('/users', {
        params: { email: email, exact: true },
      });

      if (response.data.length > 0) {
        return response.data[0] ?? null;
      }

      return null;
    } catch (error: unknown) {
      this.logger.error('Failed to find user in Keycloak:', error);
      return null;
    }
  }

  /**
   * Update user in Keycloak
   *
   * @param keycloakUserId Keycloak user ID
   * @param email Updated email (optional)
   * @param displayName Updated display name (optional)
   */
  async updateUser(
    keycloakUserId: string,
    email?: string,
    displayName?: string
  ): Promise<void> {
    const client = await this.getAuthenticatedAxios();

    const updateData: Partial<KeycloakUser> = {};

    if (email) {
      updateData.email = email;
      updateData.username = email;
    }

    if (displayName) {
      const nameParts = displayName.split(' ');
      updateData.firstName = nameParts[0] ?? '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    try {
      await client.put(`/users/${keycloakUserId}`, updateData);

      this.logger.log('User updated in Keycloak', {
        keycloakUserId,
        email,
        displayName,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        this.logger.error('Failed to update user in Keycloak:', {
          keycloakUserId,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  }

  /**
   * Assign roles to user in Keycloak
   *
   * @param keycloakUserId Keycloak user ID
   * @param roles Roles to assign
   */
  async assignRoles(keycloakUserId: string, roles: UserRole[]): Promise<void> {
    const client = await this.getAuthenticatedAxios();

    try {
      // Get realm roles (these are the KOMPASS roles)
      const realmRolesResponse = await client.get<KeycloakRole[]>('/roles');
      const realmRoles = realmRolesResponse.data;

      // Filter roles that exist in Keycloak
      const rolesToAssign = roles
        .map((role) => {
          const keycloakRoleName = this.mapKompassRoleToKeycloak(role);
          return realmRoles.find(
            (r: KeycloakRole) => r.name === keycloakRoleName
          );
        })
        .filter((role): role is KeycloakRole => role !== undefined);

      if (rolesToAssign.length === 0) {
        this.logger.warn('No valid roles found in Keycloak', { roles });
        return;
      }

      // Assign realm roles to user
      await client.post(
        `/users/${keycloakUserId}/role-mappings/realm`,
        rolesToAssign
      );

      this.logger.log('Roles assigned in Keycloak', {
        keycloakUserId,
        roles: rolesToAssign.map((r) => r.name),
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        this.logger.error('Failed to assign roles in Keycloak:', {
          keycloakUserId,
          roles,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  }

  /**
   * Set password for user in Keycloak
   *
   * @param keycloakUserId Keycloak user ID
   * @param password New password
   * @param temporary Whether password is temporary (user must change on next login)
   */
  async setPassword(
    keycloakUserId: string,
    password: string,
    temporary: boolean = false
  ): Promise<void> {
    const client = await this.getAuthenticatedAxios();

    try {
      await client.put(`/users/${keycloakUserId}/reset-password`, {
        type: 'password',
        value: password,
        temporary: temporary,
      });

      this.logger.log('Password set in Keycloak', {
        keycloakUserId,
        temporary,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        this.logger.error('Failed to set password in Keycloak:', {
          keycloakUserId,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  }

  /**
   * Delete user from Keycloak
   *
   * @param keycloakUserId Keycloak user ID
   */
  async deleteUser(keycloakUserId: string): Promise<void> {
    const client = await this.getAuthenticatedAxios();

    try {
      await client.delete(`/users/${keycloakUserId}`);

      this.logger.log('User deleted from Keycloak', {
        keycloakUserId,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // 404 is OK - user might already be deleted
        if (axiosError.response?.status === 404) {
          this.logger.warn(
            'User not found in Keycloak (may already be deleted)',
            {
              keycloakUserId,
            }
          );
          return;
        }
        this.logger.error('Failed to delete user from Keycloak:', {
          keycloakUserId,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  }
}
