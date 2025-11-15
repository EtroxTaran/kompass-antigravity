import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Header,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CalendarService } from './calendar.service';
import { CalendarEventDto } from './dto/calendar-event.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';
import { IcsGeneratorService } from './services/ics-generator.service';
// TODO: Import actual guards when available
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RbacGuard } from '../auth/guards/rbac.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@ApiTags('Calendar')
@Controller('api/v1/calendar')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RbacGuard) // TODO: Uncomment when guards are available
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly icsGenerator: IcsGeneratorService
  ) {}

  @Get('events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get calendar events',
    description:
      'Retrieves calendar events aggregated from tasks, projects, and opportunities',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: true,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: true,
    description: 'End date (ISO 8601)',
  })
  @ApiQuery({
    name: 'types',
    type: [String],
    required: false,
    description: 'Event types to include',
  })
  @ApiQuery({
    name: 'assignedTo',
    type: String,
    required: false,
    description: 'Filter by assigned user',
  })
  @ApiQuery({
    name: 'status',
    type: [String],
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'priority',
    type: [String],
    required: false,
    description: 'Filter by priority',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar events retrieved successfully',
    type: [CalendarEventDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range or parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  // @RequirePermission('Calendar', 'VIEW_ALL_EVENTS') // TODO: Uncomment when RBAC is implemented
  async getCalendarEvents(
    @Query() query: CalendarQueryDto
    // @CurrentUser() user: any, // TODO: Uncomment when auth is available
  ): Promise<{ events: CalendarEventDto[]; meta: any }> {
    // TODO: Get user from CurrentUser decorator
    const userId = 'temp-user-id';
    const userRole = 'GF';

    const events = await this.calendarService.getCalendarEvents(
      query,
      userId,
      userRole
    );

    const meta = {
      startDate: query.startDate,
      endDate: query.endDate,
      totalEvents: events.length,
      eventsByType: this.countEventsByType(events),
    };

    return { events, meta };
  }

  @Get('my-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get my calendar events',
    description:
      'Retrieves calendar events for the current authenticated user only',
  })
  @ApiResponse({
    status: 200,
    description: 'User calendar events retrieved successfully',
    type: [CalendarEventDto],
  })
  // @RequirePermission('Calendar', 'VIEW_OWN_EVENTS')
  async getMyCalendarEvents(
    @Query() query: CalendarQueryDto
    // @CurrentUser() user: any,
  ): Promise<{ events: CalendarEventDto[]; meta: any }> {
    const userId = 'temp-user-id';
    const userRole = 'ADM';

    const events = await this.calendarService.getMyCalendarEvents(
      query,
      userId,
      userRole
    );

    const meta = {
      startDate: query.startDate,
      endDate: query.endDate,
      totalEvents: events.length,
      eventsByType: this.countEventsByType(events),
    };

    return { events, meta };
  }

  @Get('team-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team calendar events',
    description: 'Retrieves team-wide calendar events (GF/PLAN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Team calendar events retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - GF/PLAN role required',
  })
  // @RequirePermission('Calendar', 'VIEW_ALL_EVENTS')
  async getTeamCalendarEvents(
    @Query() query: CalendarQueryDto
    // @CurrentUser() user: any,
  ): Promise<any> {
    const userId = 'temp-user-id';
    const userRole = 'GF';

    return this.calendarService.getTeamCalendarEvents(query, userId, userRole);
  }

  @Get('export/ics')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @ApiOperation({
    summary: 'Export calendar to ICS',
    description:
      'Generates and downloads an ICS file for importing into Outlook, Google Calendar, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'ICS file generated successfully',
    content: {
      'text/calendar': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range or parameters',
  })
  // @RequirePermission('Calendar', 'EXPORT')
  async exportCalendarIcs(
    @Query() query: CalendarQueryDto,
    @Res() res: Response
    // @CurrentUser() user: any,
  ): Promise<void> {
    const userId = 'temp-user-id';
    const userRole = 'GF';

    // Get calendar events
    const events = await this.calendarService.getCalendarEvents(
      query,
      userId,
      userRole
    );

    if (events.length === 0) {
      throw new BadRequestException(
        'No events found in the selected date range'
      );
    }

    // Generate ICS file
    const icsContent = this.icsGenerator.generateIcs(events);

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `kompass-calendar-${today}.ics`;

    // Set headers and send file
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.send(icsContent);
  }

  /**
   * Helper method to count events by type
   */
  private countEventsByType(
    events: CalendarEventDto[]
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    events.forEach((event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
    });

    return counts;
  }
}
