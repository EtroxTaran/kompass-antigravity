import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { CalendarService } from './calendar.service';
import { IcsGeneratorService } from './services/ics-generator.service';
import { CalendarQueryDto } from './dto';
import type { CalendarEventsResponseDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';

@Controller('api/v1/calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly icsGeneratorService: IcsGeneratorService,
  ) {}

  /**
   * Get calendar events with filters.
   * All users can access, but results are RBAC-filtered.
   */
  @Get('events')
  async getEvents(
    @Query() query: CalendarQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    return this.calendarService.getEvents(query, user);
  }

  /**
   * Get personal calendar events (assigned to current user).
   */
  @Get('my-events')
  async getMyEvents(
    @Query() query: CalendarQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    return this.calendarService.getMyEvents(query, user);
  }

  /**
   * Get team calendar events.
   * Only GF and PLAN roles can access.
   */
  @Get('team-events')
  async getTeamEvents(
    @Query() query: CalendarQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    return this.calendarService.getTeamEvents(query, user);
  }

  /**
   * Export calendar events to ICS file.
   */
  @Get('export/ics')
  async exportIcs(
    @Query() query: CalendarQueryDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.calendarService.getMyEvents(query, user);

    const icsContent = this.icsGeneratorService.generateIcs(
      result.events,
      'KOMPASS Calendar',
    );

    const filename = `kompass-calendar-${new Date().toISOString().split('T')[0]}.ics`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HttpStatus.OK).send(icsContent);
  }
}
