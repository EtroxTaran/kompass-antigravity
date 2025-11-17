import { createParamDecorator } from '@nestjs/common';

import type { User } from '@kompass/shared/types/entities/user';
import type { ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 *
 * Extracts the authenticated user from the request object.
 * The user is attached to the request by JwtAuthGuard after token validation.
 *
 * Usage:
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 *
 * @param data - Optional parameter name (not used)
 * @param ctx - Execution context containing the request
 * @returns User object from request.user
 *
 * @throws Error if user is not found in request (should not happen if guard is used)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();
    const user = request.user;

    if (!user) {
      throw new Error(
        'User not found in request. Ensure JwtAuthGuard is applied.'
      );
    }

    return user;
  }
);
