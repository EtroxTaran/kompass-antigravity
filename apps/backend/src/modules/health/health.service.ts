import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Nano from 'nano';

import { DATABASE_CONNECTION } from '../database/database.constants';

/**
 * Health check status
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  database: 'connected' | 'disconnected';
  keycloak: 'reachable' | 'unreachable';
  timestamp: string;
}

/**
 * Health Service
 *
 * Checks the health of critical services:
 * - CouchDB database connectivity
 * - Keycloak authentication service reachability
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly nano: Nano.ServerScope,
    private readonly configService: ConfigService
  ) {}

  /**
   * Check overall health status
   */
  async checkHealth(): Promise<HealthStatus> {
    const [databaseStatus, keycloakStatus] = await Promise.all([
      this.checkDatabase(),
      this.checkKeycloak(),
    ]);

    // Determine overall status
    let overallStatus: 'ok' | 'degraded' | 'down' = 'ok';
    if (databaseStatus === 'disconnected' || keycloakStatus === 'unreachable') {
      overallStatus = 'degraded';
    }
    if (databaseStatus === 'disconnected' && keycloakStatus === 'unreachable') {
      overallStatus = 'down';
    }

    return {
      status: overallStatus,
      database: databaseStatus,
      keycloak: keycloakStatus,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check CouchDB database connectivity
   */
  private async checkDatabase(): Promise<'connected' | 'disconnected'> {
    try {
      await this.nano.db.list();
      return 'connected';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(`Database health check failed: ${errorMessage}`);
      return 'disconnected';
    }
  }

  /**
   * Check Keycloak service reachability
   */
  private async checkKeycloak(): Promise<'reachable' | 'unreachable'> {
    try {
      const keycloakUrl =
        this.configService.get<string>('KEYCLOAK_URL') ||
        'http://keycloak:8080';
      const keycloakRealm =
        this.configService.get<string>('KEYCLOAK_REALM') || 'kompass';

      // Check Keycloak health endpoint or well-known endpoint
      const healthUrl = `${keycloakUrl}/realms/${keycloakRealm}/.well-known/openid-configuration`;

      // Use fetch or axios to check reachability
      // For simplicity, we'll use a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return 'reachable';
        } else {
          this.logger.warn(
            `Keycloak health check returned status ${response.status}`
          );
          return 'unreachable';
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(`Keycloak health check failed: ${errorMessage}`);
      return 'unreachable';
    }
  }
}
