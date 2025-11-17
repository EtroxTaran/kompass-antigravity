import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * App Controller
 *
 * Handles root-level endpoints including health checks.
 */
@Controller()
@ApiTags('App')
export class AppController {
  /**
   * Health check endpoint
   *
   * Used by Docker health checks and load balancers to verify service availability.
   * Returns 200 OK if the service is running.
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-27T10:00:00.000Z' },
      },
    },
  })
  health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
