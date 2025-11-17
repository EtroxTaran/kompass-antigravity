/**
 * Meeting Controller
 *
 * Handles HTTP requests for Meeting management
 * Includes GPS check-in endpoints
 *
 * All endpoints require:
 * - JwtAuthGuard: User must be authenticated
 * - RbacGuard: User must have required permissions
 *
 * Permissions:
 * - Meeting.READ: All roles
 * - Meeting.CREATE: GF, PLAN, ADM
 * - Meeting.UPDATE: GF, PLAN, ADM (own)
 * - Meeting.DELETE: GF, PLAN, ADM (own, scheduled only)
 * - Meeting.CHECK_IN: ADM (own only)
 * - Meeting.UPDATE_OUTCOME: GF, PLAN, ADM (own)
 * - Meeting.LINK_TOUR: GF, PLAN, ADM (own)
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { User } from '@kompass/shared/types/entities/user';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import {
  CreateMeetingDto,
  MeetingType,
  MeetingStatus,
} from './dto/create-meeting.dto';
import { MeetingResponseDto } from './dto/meeting-response.dto';
import { UpdateMeetingDto, CheckInDto } from './dto/update-meeting.dto';
import { MeetingService } from './meeting.service';



/**
 * Meeting Controller
 */
@Controller('api/v1/meetings')
@ApiTags('Meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  /**
   * List meetings
   */
  @Get()
  @RequirePermission('Meeting', 'READ')
  @ApiOperation({
    summary: 'List meetings',
    description:
      'Returns meetings. ADM sees own meetings, PLAN/GF see all meetings.',
  })
  @ApiQuery({
    name: 'status',
    enum: MeetingStatus,
    required: false,
  })
  @ApiQuery({
    name: 'meetingType',
    enum: MeetingType,
    required: false,
  })
  @ApiQuery({
    name: 'customerId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'tourId',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of meetings',
    type: [MeetingResponseDto],
  })
  async findAll(
    @Query('status') status?: MeetingStatus,
    @Query('meetingType') meetingType?: MeetingType,
    @Query('customerId') customerId?: string,
    @Query('tourId') tourId?: string,
    @CurrentUser() user?: User
  ): Promise<MeetingResponseDto[]> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const filters: {
      status?: MeetingStatus;
      meetingType?: MeetingType;
      customerId?: string;
      tourId?: string;
    } = {};
    if (status) filters.status = status;
    if (meetingType) filters.meetingType = meetingType;
    if (customerId) filters.customerId = customerId;
    if (tourId) filters.tourId = tourId;

    return this.meetingService.findAll(user, filters);
  }

  /**
   * Create new meeting
   */
  @Post()
  @RequirePermission('Meeting', 'CREATE')
  @ApiOperation({
    summary: 'Create new meeting',
    description:
      'Creates a new meeting. System will suggest tours if no tourId provided.',
  })
  @ApiBody({ type: CreateMeetingDto })
  @ApiResponse({
    status: 201,
    description: 'Meeting created',
    type: MeetingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async create(
    @Body() dto: CreateMeetingDto,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.create(dto, user);
  }

  /**
   * Get tour suggestions for meeting
   * NOTE: Must be defined BEFORE :meetingId route to ensure correct matching
   */
  @Get(':meetingId/tour-suggestions')
  @RequirePermission('Meeting', 'READ')
  @ApiOperation({
    summary: 'Get tour suggestions for meeting',
    description:
      'Returns tours that match meeting date and location (same day ±1, region <50km).',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Tour suggestions',
    type: [Object],
  })
  async getTourSuggestions(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: User
  ): Promise<unknown[]> {
    const meeting = await this.meetingService.findById(meetingId, user);
    return this.meetingService.getTourSuggestions(
      meeting.scheduledAt,
      meeting.locationId,
      user
    );
  }

  /**
   * Get meeting by ID
   */
  @Get(':meetingId')
  @RequirePermission('Meeting', 'READ')
  @ApiOperation({
    summary: 'Get meeting details',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting found',
    type: MeetingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Meeting not found',
  })
  async findOne(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.findById(meetingId, user);
  }

  /**
   * GPS check-in for meeting
   * NOTE: Must be defined BEFORE generic :meetingId routes to ensure correct matching
   */
  @Post(':meetingId/check-in')
  @RequirePermission('Meeting', 'CHECK_IN')
  @ApiOperation({
    summary: 'GPS check-in for meeting',
    description:
      'Performs GPS check-in. Must be within 100m of meeting location.',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiBody({ type: CheckInDto })
  @ApiResponse({
    status: 200,
    description: 'Check-in successful',
    type: MeetingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Too far from location',
  })
  async checkIn(
    @Param('meetingId') meetingId: string,
    @Body() checkInDto: CheckInDto,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.checkIn(meetingId, checkInDto, user);
  }

  /**
   * Update meeting outcome
   * NOTE: Must be defined BEFORE generic :meetingId PUT route to ensure correct matching
   */
  @Put(':meetingId/outcome')
  @RequirePermission('Meeting', 'UPDATE_OUTCOME')
  @ApiOperation({
    summary: 'Update meeting outcome',
    description:
      'Updates meeting outcome and notes. Required if meeting was attended.',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        outcome: {
          type: 'string',
          description: 'Meeting outcome summary',
          example: 'Kunde zeigt großes Interesse an neuem Ladenbau-Konzept.',
        },
        notes: {
          type: 'string',
          description: 'Detailed notes',
          example: 'Kunde wünscht nachhaltige Materialien.',
        },
      },
      required: ['outcome'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Outcome updated',
    type: MeetingResponseDto,
  })
  async updateOutcome(
    @Param('meetingId') meetingId: string,
    @Body('outcome') outcome: string,
    @Body('notes') notes: string | undefined,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.updateOutcome(meetingId, outcome, notes, user);
  }

  /**
   * Link meeting to tour
   * NOTE: Must be defined BEFORE generic :meetingId PUT route to ensure correct matching
   */
  @Put(':meetingId/link-tour')
  @RequirePermission('Meeting', 'LINK_TOUR')
  @ApiOperation({
    summary: 'Link meeting to tour',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tourId: {
          type: 'string',
          example: 'tour-789',
        },
      },
      required: ['tourId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting linked to tour',
    type: MeetingResponseDto,
  })
  async linkToTour(
    @Param('meetingId') meetingId: string,
    @Body('tourId') tourId: string,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.linkToTour(meetingId, tourId, user);
  }

  /**
   * Update meeting
   * NOTE: Generic route must be defined AFTER all specific :meetingId/* routes
   */
  @Put(':meetingId')
  @RequirePermission('Meeting', 'UPDATE')
  @ApiOperation({
    summary: 'Update meeting',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiBody({ type: UpdateMeetingDto })
  @ApiResponse({
    status: 200,
    description: 'Meeting updated',
    type: MeetingResponseDto,
  })
  async update(
    @Param('meetingId') meetingId: string,
    @Body() dto: UpdateMeetingDto,
    @CurrentUser() user: User
  ): Promise<MeetingResponseDto> {
    return this.meetingService.update(meetingId, dto, user);
  }

  /**
   * Delete meeting
   */
  @Delete(':meetingId')
  @RequirePermission('Meeting', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete meeting',
    description: 'Can only delete scheduled meetings.',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'Meeting ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Meeting deleted',
  })
  async delete(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.meetingService.delete(meetingId, user);
  }
}
