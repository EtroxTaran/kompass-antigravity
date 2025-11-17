import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RbacGuard } from './guards/rbac.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Authentication Module
 *
 * Provides JWT authentication using Keycloak OIDC.
 * Registers JWT strategy, guards, and authentication endpoints.
 *
 * This module is marked as @Global() so guards and decorators can be used
 * throughout the application without importing AuthModule in every feature module.
 *
 * @see JwtStrategy - Validates Keycloak JWT tokens
 * @see JwtAuthGuard - Protects routes with JWT authentication
 * @see RbacGuard - Enforces role-based access control
 */
@Global()
@Module({
  imports: [
    // Passport module for authentication strategies
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT module configuration
    // Note: We use JWKS (JSON Web Key Set) for Keycloak, so we don't need
    // to configure a secret here. The JwtStrategy uses passportJwtSecret
    // to fetch keys from Keycloak's well-known endpoint.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // JWT module is required by Passport, but we use JWKS for validation
        // This is a placeholder configuration
        return {
          // The actual secret/key is fetched via JWKS in JwtStrategy
          secret: configService.get<string>('JWT_SECRET', 'placeholder-secret'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy, // JWT validation strategy
    JwtAuthGuard, // JWT authentication guard
    RbacGuard, // Role-based access control guard
  ],
  exports: [
    JwtAuthGuard, // Export so other modules can use it
    RbacGuard, // Export so other modules can use it
    PassportModule, // Export PassportModule for decorators
  ],
})
export class AuthModule {}
