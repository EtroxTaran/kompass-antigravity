import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GFMetricsDto } from './dashboard.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /dashboard/gf/metrics
   * Returns aggregated metrics for GF (Geschäftsführer) dashboard
   */
  @Get('gf/metrics')
  async getGFMetrics(): Promise<GFMetricsDto> {
    return this.dashboardService.getGFMetrics();
  }
}
