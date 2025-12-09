import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RbacGuard } from './guards/rbac.guard';
import { AuthController } from './auth.controller';
import { KeycloakService } from './keycloak.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, RbacGuard, KeycloakService],
  exports: [JwtAuthGuard, RbacGuard, JwtStrategy, KeycloakService],
})
export class AuthModule {}
