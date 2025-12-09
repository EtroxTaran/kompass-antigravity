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

@Controller('auth')
export class AuthController {
  constructor(private readonly keycloakService: KeycloakService) {}

  /**
   * GET /auth/me
   * Returns the current authenticated user's information
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    // Try to get synced user from CouchDB for more details
    const keycloakId = user.id.replace('user-', '');
    const syncedUser =
      await this.keycloakService.findUserByKeycloakId(keycloakId);

    if (syncedUser) {
      return {
        _id: syncedUser._id,
        type: 'user',
        email: syncedUser.email,
        displayName: syncedUser.displayName,
        firstName: syncedUser.firstName,
        lastName: syncedUser.lastName,
        roles: syncedUser.roles,
        primaryRole: syncedUser.primaryRole,
        active: syncedUser.active,
        lastSyncedAt: syncedUser.lastSyncedAt,
      };
    }

    // Fallback to JWT token info
    return {
      _id: user.id,
      type: 'user',
      email: user.email,
      displayName: user.username,
      roles: user.roles,
      primaryRole: user.primaryRole,
      active: true,
    };
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
