import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeEntryRepository, TimeEntry } from './time-entry.repository';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entry.dto';

@Injectable()
export class TimeEntryService {
  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

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
    return this.timeEntryRepository.create(
      dto as Partial<TimeEntry>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateTimeEntryDto,
    user: { id: string; email?: string },
  ): Promise<TimeEntry> {
    await this.findById(id);
    return this.timeEntryRepository.update(
      id,
      dto as Partial<TimeEntry>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    await this.findById(id);
    return this.timeEntryRepository.delete(id, user.id, user.email);
  }
}
