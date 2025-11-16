import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import {
  CalendarEventType,
  CalendarEntityType,
  CalendarPriority,
} from './dto/calendar-event.dto';

import type { CalendarEventDto } from './dto/calendar-event.dto';
import type { CalendarQueryDto } from './dto/calendar-query.dto';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private readonly MAX_DATE_RANGE_DAYS = 90;
  private readonly MAX_EVENTS = 1000;

  constructor() {} // @Inject('IOpportunityRepository') private readonly opportunityRepo: IOpportunityRepository, // @Inject('IProjectRepository') private readonly projectRepo: IProjectRepository, // @Inject('IProjectTaskRepository') private readonly projectTaskRepo: IProjectTaskRepository, // @Inject('IUserTaskRepository') private readonly userTaskRepo: IUserTaskRepository, // TODO: Inject task, project, opportunity repositories when available

  /**
   * Get calendar events aggregated from multiple sources
   * @param query Calendar query filters
   * @param userId Current user ID for RBAC filtering
   * @param userRole Current user role for RBAC filtering
   * @returns Array of calendar events
   */
  async getCalendarEvents(
    query: CalendarQueryDto,
    userId: string,
    userRole: string
  ): Promise<CalendarEventDto[]> {
    this.validateDateRange(query.startDate, query.endDate);

    const events: CalendarEventDto[] = [];

    // Determine which event types to fetch
    const typesToFetch =
      query.types || (Object.values(CalendarEventType) as CalendarEventType[]);

    // Aggregate events from different sources
    if (this.shouldFetchType(typesToFetch, CalendarEventType.USER_TASK)) {
      const userTaskEvents = await this.getUserTaskEvents(
        query,
        userId,
        userRole
      );
      events.push(...userTaskEvents);
    }

    if (this.shouldFetchType(typesToFetch, CalendarEventType.PROJECT_TASK)) {
      const projectTaskEvents = await this.getProjectTaskEvents(
        query,
        userId,
        userRole
      );
      events.push(...projectTaskEvents);
    }

    if (
      this.shouldFetchType(typesToFetch, CalendarEventType.PROJECT_DEADLINE) ||
      this.shouldFetchType(typesToFetch, CalendarEventType.PROJECT_START)
    ) {
      const projectEvents = await this.getProjectEvents(
        query,
        userId,
        userRole
      );
      events.push(...projectEvents);
    }

    if (
      this.shouldFetchType(typesToFetch, CalendarEventType.OPPORTUNITY_CLOSE)
    ) {
      const opportunityEvents = await this.getOpportunityEvents(
        query,
        userId,
        userRole
      );
      events.push(...opportunityEvents);
    }

    // Apply additional filters
    let filteredEvents = this.applyFilters(events, query);

    // Sort by start date
    filteredEvents.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Limit results
    if (filteredEvents.length > this.MAX_EVENTS) {
      this.logger.warn(
        `Event count (${filteredEvents.length}) exceeds maximum (${this.MAX_EVENTS}). Truncating.`
      );
      filteredEvents = filteredEvents.slice(0, this.MAX_EVENTS);
    }

    return filteredEvents;
  }

  /**
   * Get calendar events for current user only
   */
  async getMyCalendarEvents(
    query: CalendarQueryDto,
    userId: string,
    userRole: string
  ): Promise<CalendarEventDto[]> {
    // Override assignedTo filter to current user
    const myQuery = { ...query, assignedTo: userId };
    return this.getCalendarEvents(myQuery, userId, userRole);
  }

  /**
   * Get team calendar events (GF/PLAN only)
   */
  async getTeamCalendarEvents(
    query: CalendarQueryDto,
    userId: string,
    userRole: string
  ): Promise<{
    events: CalendarEventDto[];
    teamMembers: unknown[];
    meta: {
      startDate: string;
      endDate: string;
      totalEvents: number;
      totalTeamMembers: number;
    };
  }> {
    if (userRole !== 'GF' && userRole !== 'PLAN') {
      throw new BadRequestException(
        'Team calendar is only available for GF and PLAN roles'
      );
    }

    const events = await this.getCalendarEvents(query, userId, userRole);

    // TODO: Aggregate team member statistics
    const teamMembers: unknown[] = [];

    const meta = {
      startDate: query.startDate,
      endDate: query.endDate,
      totalEvents: events.length,
      totalTeamMembers: teamMembers.length,
    };

    return { events, teamMembers, meta };
  }

  /**
   * Validate date range does not exceed maximum allowed
   */
  private validateDateRange(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (end < start) {
      throw new BadRequestException(
        'End date must be greater than or equal to start date'
      );
    }

    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > this.MAX_DATE_RANGE_DAYS) {
      throw new BadRequestException(
        `Date range exceeds maximum allowed (${this.MAX_DATE_RANGE_DAYS} days). Current range: ${diffDays} days.`
      );
    }
  }

  /**
   * Check if event type should be fetched based on query
   */
  private shouldFetchType(
    typesToFetch: CalendarEventType[],
    type: CalendarEventType
  ): boolean {
    return typesToFetch.includes(type);
  }

  /**
   * Apply additional filters to events
   */
  private applyFilters(
    events: CalendarEventDto[],
    query: CalendarQueryDto
  ): CalendarEventDto[] {
    let filtered = events;

    // Filter by assigned user
    if (query.assignedTo) {
      filtered = filtered.filter(
        (event) =>
          event.assignedTo && event.assignedTo.includes(query.assignedTo!)
      );
    }

    // Filter by status
    if (query.status && query.status.length > 0) {
      filtered = filtered.filter((event) =>
        query.status!.includes(event.status)
      );
    }

    // Filter by priority
    if (query.priority && query.priority.length > 0) {
      filtered = filtered.filter(
        (event) => event.priority && query.priority!.includes(event.priority)
      );
    }

    return filtered;
  }

  /**
   * Get UserTask events
   * TODO: Implement when UserTask repository is available
   */
  private getUserTaskEvents(
    _query: CalendarQueryDto,
    _userId: string,
    _userRole: string
  ): Promise<CalendarEventDto[]> {
    this.logger.debug('Fetching UserTask events');
    // TODO: Query UserTask repository
    // const tasks = await this.userTaskRepo.findByDateRange(query.startDate, query.endDate);
    // return tasks.map(task => this.userTaskToCalendarEvent(task));
    return Promise.resolve([]);
  }

  /**
   * Get ProjectTask events
   * TODO: Implement when ProjectTask repository is available
   */
  private getProjectTaskEvents(
    _query: CalendarQueryDto,
    _userId: string,
    _userRole: string
  ): Promise<CalendarEventDto[]> {
    this.logger.debug('Fetching ProjectTask events');
    // TODO: Query ProjectTask repository
    return Promise.resolve([]);
  }

  /**
   * Get Project events (start dates, deadlines, milestones)
   * TODO: Implement when Project repository is available
   */
  private getProjectEvents(
    _query: CalendarQueryDto,
    _userId: string,
    _userRole: string
  ): Promise<CalendarEventDto[]> {
    this.logger.debug('Fetching Project events');
    // TODO: Query Project repository
    return Promise.resolve([]);
  }

  /**
   * Get Opportunity events (expected close dates)
   * TODO: Implement when Opportunity repository is available
   */
  private getOpportunityEvents(
    _query: CalendarQueryDto,
    _userId: string,
    _userRole: string
  ): Promise<CalendarEventDto[]> {
    this.logger.debug('Fetching Opportunity events');
    // TODO: Query Opportunity repository
    return Promise.resolve([]);
  }

  /**
   * Convert UserTask to CalendarEvent
   * TODO: Implement when UserTask entity is available
   */
  private _userTaskToCalendarEvent(_task: unknown): CalendarEventDto {
    // Type guard for task object
    if (
      !_task ||
      typeof _task !== 'object' ||
      !('_id' in _task) ||
      !('title' in _task) ||
      !('dueDate' in _task)
    ) {
      throw new BadRequestException('Invalid task object');
    }

    const task = _task as {
      _id: string;
      title: string;
      description?: string;
      priority?: string;
      dueDate: string;
      status?: string;
      assignedTo?: string;
    };

    return {
      id: task._id,
      type: CalendarEventType.USER_TASK,
      title: task.title,
      description: task.description || '',
      color: task.priority
        ? this.getPriorityColor(task.priority) || '#3B82F6'
        : '#3B82F6',
      icon: 'CheckSquare',
      startDate: task.dueDate,
      endDate: task.dueDate,
      allDay: true,
      entityId: task._id,
      entityType: CalendarEntityType.USER_TASK,
      status: task.status || 'pending',
      priority: task.priority
        ? this.mapPriority(task.priority)
        : CalendarPriority.MEDIUM,
      assignedTo: task.assignedTo ? [task.assignedTo] : [],
      url: `/tasks/${task._id}`,
    };
  }

  /**
   * Get color based on priority
   */
  private getPriorityColor(priority: string): string | null {
    const colors: Record<string, string> = {
      critical: '#DC2626',
      urgent: '#EF4444',
      high: '#F97316',
    };
    return colors[priority] || null;
  }

  /**
   * Map task priority to calendar priority enum
   */
  private mapPriority(priority: string): CalendarPriority {
    const mapping: Record<string, CalendarPriority> = {
      low: CalendarPriority.LOW,
      medium: CalendarPriority.MEDIUM,
      high: CalendarPriority.HIGH,
      urgent: CalendarPriority.URGENT,
      critical: CalendarPriority.CRITICAL,
    };
    return mapping[priority] || CalendarPriority.MEDIUM;
  }
}
