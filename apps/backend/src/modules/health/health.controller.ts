import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthService, type HealthStatus } from './health.service';

/**
 * Health Check Controller
 *
 * Provides health check endpoint for monitoring service status.
 * Used by Docker health checks, load balancers, and monitoring systems.
 */
@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Health check endpoint
   *
   * Returns the health status of critical services:
   * - Database connectivity (CouchDB)
   * - Authentication service (Keycloak)
   *
   * @returns Health status with service availability
   */
  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Returns the health status of critical services (database, Keycloak)',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['ok', 'degraded', 'down'],
          example: 'ok',
        },
        database: {
          type: 'string',
          enum: ['connected', 'disconnected'],
          example: 'connected',
        },
        keycloak: {
          type: 'string',
          enum: ['reachable', 'unreachable'],
          example: 'reachable',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-01-28T12:00:00.000Z',
        },
      },
    },
  })
  async health(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }
}
