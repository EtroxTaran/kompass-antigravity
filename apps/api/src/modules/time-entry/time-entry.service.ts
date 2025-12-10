import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeEntryRepository, TimeEntry } from './time-entry.repository';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entry.dto';

import { ProjectService } from '../project/project.service';

@Injectable()
export class TimeEntryService {
  private readonly DEFAULT_HOURLY_RATE = 60; // TODO: Fetch from User/Role configuration

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly projectService: ProjectService,
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      projectId?: string;
      userId?: string;
    } = {},
  ) {
    if (options.projectId) {
      return this.timeEntryRepository.findByProject(options.projectId, options);
    }
    if (options.userId) {
      return this.timeEntryRepository.findByUser(options.userId, options);
    }
    return this.timeEntryRepository.findAll(options);
  }

  async findById(id: string): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findById(id);
    if (!timeEntry) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `TimeEntry with ID '${id}' not found`,
        resourceType: 'TimeEntry',
        resourceId: id,
      });
    }
    return timeEntry;
  }

  async findByProject(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.timeEntryRepository.findByProject(projectId, options);
  }

  async findByUser(
    userId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.timeEntryRepository.findByUser(userId, options);
  }

  async getDailyTotal(userId: string, date: string): Promise<number> {
    // Determine start and end of the day in UTC
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const result = await this.timeEntryRepository.findByUser(userId, {
      limit: 100, // Should be enough for one day
    });

    // Filter by date range and sum up duration
    // Note: ideally repository should support date range query
    const dailyEntries = result.data.filter((e) => {
      const entryDate = new Date(e.startTime);
      return entryDate >= start && entryDate <= end;
    });

    const totalMinutes = dailyEntries.reduce(
      (sum, e) => sum + e.durationMinutes,
      0,
    );
    return totalMinutes / 60;
  }

  async findMyEntries(
    userId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.timeEntryRepository.findByUser(userId, options);
  }

  async create(
    dto: CreateTimeEntryDto,
    user: { id: string; email?: string },
  ): Promise<TimeEntry> {
    const entry = await this.timeEntryRepository.create(
      dto as Partial<TimeEntry>,
      user.id,
      user.email,
    );

    // Update Project Cost
    const cost = (entry.durationMinutes / 60) * this.DEFAULT_HOURLY_RATE;
    await this.projectService.updateActualCost(
      entry.projectId,
      'labor',
      cost,
      user.id,
    );

    return entry;
  }

  async update(
    id: string,
    dto: UpdateTimeEntryDto,
    user: { id: string; email?: string },
  ): Promise<TimeEntry> {
    const oldEntry = await this.findById(id);
    const updated = await this.timeEntryRepository.update(
      id,
      dto as Partial<TimeEntry>,
      user.id,
      user.email,
    );

    // Update Cost Difference if duration changed
    if (
      dto.durationMinutes &&
      dto.durationMinutes !== oldEntry.durationMinutes
    ) {
      const oldCost =
        (oldEntry.durationMinutes / 60) * this.DEFAULT_HOURLY_RATE;
      const newCost = (dto.durationMinutes / 60) * this.DEFAULT_HOURLY_RATE;
      const diff = newCost - oldCost;

      await this.projectService.updateActualCost(
        oldEntry.projectId, // Assuming project ID doesn't change, or we handle move? Simplification: update valid for same project.
        'labor',
        diff,
        user.id,
      );
    }
    return updated;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    const entry = await this.findById(id);
    await this.timeEntryRepository.delete(id, user.id, user.email);

    // Revert Cost
    const cost = (entry.durationMinutes / 60) * this.DEFAULT_HOURLY_RATE;
    await this.projectService.updateActualCost(
      entry.projectId,
      'labor',
      -cost,
      user.id,
    );
  }
}
