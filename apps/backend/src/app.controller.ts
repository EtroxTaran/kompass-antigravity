import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

/**
 * App Controller
 *
 * Handles root-level endpoints.
 * Health check has been moved to HealthModule.
 */
@Controller()
@ApiTags('App')
export class AppController {
  // Health check endpoint moved to HealthModule
}
