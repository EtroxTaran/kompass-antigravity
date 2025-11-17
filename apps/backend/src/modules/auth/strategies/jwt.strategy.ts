import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * JWT Payload from Keycloak token
 */
interface KeycloakJwtPayload {
  sub: string; // User ID
  email?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles?: string[];
    };
  };
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
}

/**
 * JWT Strategy for Keycloak OIDC
 *
 * Validates JWT tokens issued by Keycloak and extracts user information.
 * Uses JWKS (JSON Web Key Set) to fetch Keycloak's public keys for token verification.
 *
 * @see https://www.keycloak.org/docs/latest/securing_apps/#_token_validation
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const keycloakUrl = configService.get<string>(
      'KEYCLOAK_URL',
      'http://keycloak:8080'
    );
    const keycloakRealm = configService.get<string>(
      'KEYCLOAK_REALM',
      'kompass'
    );
    const keycloakClientId = configService.get<string>(
      'KEYCLOAK_CLIENT_ID',
      'kompass-api'
    );
    const issuer = `${keycloakUrl}/realms/${keycloakRealm}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: keycloakClientId,
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }),
    });
  }

  /**
   * Validate JWT payload and return user object
   *
   * This method is called by Passport after token verification.
   * It extracts user information from the Keycloak token and maps it to KOMPASS User entity.
   *
   * @param payload - Decoded JWT payload from Keycloak
   * @returns User object with roles array
   * @throws UnauthorizedException if token is invalid or user has no roles
   */
  async validate(payload: KeycloakJwtPayload): Promise<User> {
    // Extract user ID from subject claim
    const userId = payload.sub;
    if (!userId) {
      throw new UnauthorizedException('Token missing subject claim');
    }

    // Extract email from token
    const email = payload.email || payload.preferred_username;
    if (!email) {
      throw new UnauthorizedException(
        'Token missing email or preferred_username'
      );
    }

    // Extract roles from Keycloak token
    // Priority: resource_access.{client-id}.roles > realm_access.roles
    const keycloakClientId = this.configService.get<string>(
      'KEYCLOAK_CLIENT_ID',
      'kompass-api'
    );
    let roles: string[] = [];

    // Check resource_access first (client-specific roles)
    if (payload.resource_access?.[keycloakClientId]?.roles) {
      roles = payload.resource_access[keycloakClientId].roles;
    }
    // Fallback to realm roles
    else if (payload.realm_access?.roles) {
      roles = payload.realm_access.roles;
    }

    // Map Keycloak role names to KOMPASS UserRole enum
    const kompassRoles = this.mapKeycloakRolesToKompassRoles(roles);

    if (kompassRoles.length === 0) {
      throw new UnauthorizedException('User has no assigned roles');
    }

    // Ensure we have at least one role for primaryRole
    const primaryRole = kompassRoles[0];
    if (!primaryRole) {
      throw new UnauthorizedException('User has no valid roles');
    }

    // Return user object that will be attached to request.user
    // Note: This is a partial User object - full user data should be fetched from CouchDB if needed
    return {
      _id: `user-${userId}`, // Format: user-{keycloak-user-id}
      _rev: '', // Will be set when fetched from CouchDB
      type: 'user',
      email,
      displayName: payload.preferred_username || email,
      roles: kompassRoles,
      primaryRole, // Use first role as primary (can be overridden)
      active: true,
      createdBy: 'system',
      createdAt: new Date(payload.iat * 1000), // Convert iat (seconds) to Date
      modifiedBy: 'system',
      modifiedAt: new Date(payload.iat * 1000),
      version: 1,
    };
  }

  /**
   * Map Keycloak role names to KOMPASS UserRole enum
   *
   * Keycloak roles should match KOMPASS role names exactly (ADM, INNEN, PLAN, BUCH, GF).
   * Case-insensitive matching is used for flexibility.
   *
   * @param keycloakRoles - Array of role names from Keycloak token
   * @returns Array of KOMPASS UserRole enum values (filtered to remove undefined)
   */
  private mapKeycloakRolesToKompassRoles(keycloakRoles: string[]): UserRole[] {
    const roleMap: Record<string, UserRole> = {
      ADM: UserRole.ADM,
      INNEN: UserRole.INNEN,
      PLAN: UserRole.PLAN,
      KALK: UserRole.KALK,
      BUCH: UserRole.BUCH,
      GF: UserRole.GF,
      ADMIN: UserRole.ADMIN,
    };

    return keycloakRoles
      .map((role) => role.toUpperCase())
      .map((role) => roleMap[role])
      .filter((role): role is UserRole => role !== undefined);
  }
}
