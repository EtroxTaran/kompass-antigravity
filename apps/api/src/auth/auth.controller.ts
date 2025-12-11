import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RbacGuard } from './guards/rbac.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Permissions } from './decorators/permissions.decorator';
import { KeycloakService } from './keycloak.service';
import type { AuthenticatedUser } from './strategies/jwt.strategy';
import { User, UserRole } from '@kompass/shared/src/types/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly keycloakService: KeycloakService) { }

  /**
   * GET /auth/me
   * Returns the current authenticated user's information
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthenticatedUser): Promise<User | Partial<User>> {
    // Try to get synced user from CouchDB for more details
    const keycloakId = user.id.replace('user-', '');
    const syncedUser =
      await this.keycloakService.findUserByKeycloakId(keycloakId);

    if (syncedUser) {
      return syncedUser;
    }

    // Fallback to JWT token info (Minimal info, might not fully match User interface strictly)
    // We construct a partial user or best effort
    const now = new Date().toISOString();
    return {
      _id: `user-${user.id}`,
      type: 'user',
      email: user.email,
      displayName: user.username, // Fallback to username if display name missing
      // We assume roles are strings in JWT, need casting or mapping
      roles: (user.roles as unknown) as UserRole[], // Risk of invalid roles if JWT has others
      primaryRole: (user.primaryRole as UserRole) || 'ADM',
      active: true,
      createdAt: now,
      modifiedAt: now,
      createdBy: 'system',
      modifiedBy: 'system',
      version: 1,
    } as User;
  }

  /**
   * POST /auth/sync-users
   * Sync all users from Keycloak (admin only)
   */
  @Post('sync-users')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions({ entity: 'User', action: 'CREATE' })
  async syncUsers() {
    const result = await this.keycloakService.syncAllUsers();
    return {
      message: 'User synchronization complete',
      ...result,
    };
  }

  /**
   * GET /auth/users
   * Get all synced users (admin only)
   */
  @Get('users')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions({ entity: 'User', action: 'READ' })
  async getUsers(): Promise<{ data: unknown[]; total: number }> {
    const users = await this.keycloakService.getActiveUsers();
    return {
      data: users,
      total: users.length,
    };
  }

  /**
   * GET /auth/health
   * Public endpoint for health checks
   */
  @Get('health')
  @Public()
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
