import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import type { ExecutionContext } from '@nestjs/common';
import type { Observable } from 'rxjs';


/**
 * JWT Authentication Guard
 *
 * Protects routes by validating JWT tokens from Keycloak.
 * Uses the JWT strategy to verify tokens and extract user information.
 *
 * Usage:
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * async getProtectedData() {
 *   // User is authenticated and available in request.user
 * }
 * ```
 *
 * The guard will:
 * - Extract JWT token from Authorization header (Bearer token)
 * - Validate token signature using Keycloak's public keys
 * - Extract user information and attach to request.user
 * - Throw UnauthorizedException (401) if token is invalid or missing
 *
 * @see JwtStrategy - Strategy that validates tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Handle authentication errors
   *
   * Override to provide custom error handling.
   * Returns 401 Unauthorized with clear error message.
   */
  override handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | false,
    info: Error | string | undefined,
    _context: ExecutionContext
  ): TUser {
    // If there's an error or no user, throw UnauthorizedException
    if (err || !user) {
      const errorMessage =
        info instanceof Error ? info.message : info || 'Authentication failed';
      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }

  /**
   * Check if route is public (no authentication required)
   *
   * Can be used with @Public() decorator to bypass authentication.
   */
  override canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Otherwise, use default Passport authentication
    return super.canActivate(context);
  }
}
