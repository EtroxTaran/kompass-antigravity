import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../database/database.module';
import * as Nano from 'nano';
import { User, UserRole, USER_ROLES } from '@kompass/shared/src/types/user';

interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  attributes?: Record<string, string[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
}

@Injectable()
export class KeycloakService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakService.name);
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private readonly configService: ConfigService,
    @Inject(OPERATIONAL_DB) private readonly db: Nano.DocumentScope<any>,
  ) {
    this.keycloakUrl = this.configService.get<string>(
      'KEYCLOAK_URL',
      'http://localhost:8080',
    );
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'kompass');
    this.clientId = this.configService.get<string>(
      'KEYCLOAK_ADMIN_CLIENT_ID',
      'admin-cli',
    );
    this.clientSecret = this.configService.get<string>(
      'KEYCLOAK_ADMIN_CLIENT_SECRET',
      '',
    );
  }

  async onModuleInit() {
    // Only sync on startup if configured
    const syncOnStartup =
      this.configService.get<string>('KEYCLOAK_SYNC_ON_STARTUP', 'false') ===
      'true';
    if (syncOnStartup) {
      try {
        await this.syncAllUsers();
      } catch (error) {
        this.logger.warn(
          'Failed to sync users from Keycloak on startup',
          error,
        );
      }
    }
  }

  /**
   * Get admin access token for Keycloak Admin REST API
   */
  private async getAdminToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`;

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get admin token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set expiry with 30 second buffer
      this.tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;

      return this.accessToken!;
    } catch (error) {
      this.logger.error('Failed to get Keycloak admin token', error);
      throw error;
    }
  }

  /**
   * Fetch all users from Keycloak realm
   */
  async fetchKeycloakUsers(): Promise<KeycloakUser[]> {
    const token = await this.getAdminToken();
    const usersUrl = `${this.keycloakUrl}/admin/realms/${this.realm}/users?max=1000`;

    try {
      const response = await fetch(usersUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Failed to fetch users from Keycloak', error);
      throw error;
    }
  }

  /**
   * Fetch roles for a specific user
   */
  async fetchUserRoles(userId: string): Promise<UserRole[]> {
    const token = await this.getAdminToken();
    const rolesUrl = `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`;

    try {
      const response = await fetch(rolesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const roles = await response.json();
      const roleNames = roles.map((r: { name: string }) => r.name);

      // Filter strictly by USER_ROLES and cast
      return roleNames.filter((role: string) =>
        (USER_ROLES as readonly string[]).includes(role)
      ) as UserRole[];

    } catch (error) {
      this.logger.warn(`Failed to fetch roles for user ${userId}`, error);
      return [];
    }
  }

  /**
   * Sync a single user from Keycloak to CouchDB
   */
  async syncUser(keycloakUser: KeycloakUser): Promise<User> {
    const roles = await this.fetchUserRoles(keycloakUser.id);
    const docId = `user-${keycloakUser.id}`;

    // Check if user already exists
    let existingUser: User | null = null;
    try {
      existingUser = (await this.db.get(docId)) as User;
    } catch (error: any) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }

    const now = new Date().toISOString();
    const displayName =
      [keycloakUser.firstName, keycloakUser.lastName]
        .filter(Boolean)
        .join(' ') || keycloakUser.username;

    const userData: User = {
      _id: docId,
      ...(existingUser?._rev && { _rev: existingUser._rev }),
      type: 'user',
      username: keycloakUser.username,
      keycloakId: keycloakUser.id,
      email: keycloakUser.email || '',
      firstName: keycloakUser.firstName,
      lastName: keycloakUser.lastName,
      displayName,
      roles: roles.length > 0 ? roles : ['ADM'],
      primaryRole: roles.length > 0 ? roles[0] : 'ADM',
      active: keycloakUser.enabled,
      createdAt: existingUser?.createdAt || now,
      modifiedAt: now,
      createdBy: existingUser?.createdBy || 'system',
      modifiedBy: 'system',
      version: existingUser ? (existingUser.version || 0) + 1 : 1,
    };

    await this.db.insert(userData);
    this.logger.log(
      `Synced user: ${keycloakUser.username} (${roles.join(', ')})`,
    );

    return userData;
  }

  /**
   * Sync all users from Keycloak to CouchDB
   */
  async syncAllUsers(): Promise<{ synced: number; errors: number }> {
    this.logger.log('Starting user sync from Keycloak...');

    const users = await this.fetchKeycloakUsers();
    let synced = 0;
    let errors = 0;

    for (const user of users) {
      try {
        await this.syncUser(user);
        synced++;
      } catch (error) {
        this.logger.error(`Failed to sync user ${user.username}`, error);
        errors++;
      }
    }

    this.logger.log(`User sync complete: ${synced} synced, ${errors} errors`);
    return { synced, errors };
  }

  /**
   * Find synced user by Keycloak ID
   */
  async findUserByKeycloakId(keycloakId: string): Promise<User | null> {
    try {
      return (await this.db.get(`user-${keycloakId}`)) as User;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find synced user by username
   */
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.db.find({
        selector: {
          type: 'user',
          username,
        },
        limit: 1,
      });
      return (result.docs[0] as User) || null;
    } catch (error) {
      this.logger.error(`Failed to find user by username: ${username}`, error);
      return null;
    }
  }

  /**
   * Get all active users
   */
  async getActiveUsers(): Promise<User[]> {
    try {
      const result = await this.db.find({
        selector: {
          type: 'user',
          active: true,
        },
      });
      return result.docs as User[];
    } catch (error) {
      this.logger.error('Failed to get active users', error);
      return [];
    }
  }
}
