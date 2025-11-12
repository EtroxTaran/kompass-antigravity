import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { MeetingRepository } from './meeting.repository';

/**
 * Meeting Module
 * 
 * Provides meeting scheduling and management functionality:
 * - CRUD operations for meetings
 * - GPS check-in functionality
 * - Tour linkage and auto-suggestion
 * - Meeting outcome tracking
 * - RBAC enforcement
 * - Offline sync support
 * 
 * Phase 2 (Q3 2025)
 */
@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    MeetingRepository,
    {
      provide: 'IMeetingRepository',
      useClass: MeetingRepository,
    },
  ],
  exports: [MeetingService],
})
export class MeetingModule {}

