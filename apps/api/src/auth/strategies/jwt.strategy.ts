import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

export interface JwtPayload {
  sub: string;
  email: string;
  preferred_username: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  roles: string[];
  primaryRole: string;
}

// Helper function to build JWT options based on environment
function buildJwtOptions(configService: ConfigService) {
  const useMockAuth =
    configService.get<string>('USE_MOCK_AUTH', 'true') === 'true';

  if (useMockAuth) {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'mock-secret-for-development',
    };
  }

  const keycloakUrl = configService.get<string>(
    'KEYCLOAK_URL',
    'http://localhost:8080',
  );
  const keycloakRealm = configService.get<string>('KEYCLOAK_REALM', 'kompass');
  const keycloakClientId = configService.get<string>(
    'KEYCLOAK_CLIENT_ID',
    'kompass-api',
  );

  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKeyProvider: passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
    }),
    issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
    audience: keycloakClientId,
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super(buildJwtOptions(configService));
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Extract roles from Keycloak token structure
    let roles: string[] = [];

    // Try resource_access first (client-specific roles)
    const keycloakClientId = this.configService.get<string>(
      'KEYCLOAK_CLIENT_ID',
      'kompass-api',
    );
    if (payload.resource_access?.[keycloakClientId]?.roles) {
      roles = payload.resource_access[keycloakClientId].roles;
    }
    // Fallback to realm_access
    else if (payload.realm_access?.roles) {
      roles = payload.realm_access.roles.filter((role) =>
        ['ADM', 'INNEN', 'PLAN', 'KALK', 'BUCH', 'GF', 'ADMIN'].includes(role),
      );
    }

    // Default role if none found
    if (roles.length === 0) {
      roles = ['ADM'];
    }

    return {
      id: `user-${payload.sub}`,
      email: payload.email || '',
      username: payload.preferred_username || payload.email || 'unknown',
      roles,
      primaryRole: roles[0],
    };
  }
}
