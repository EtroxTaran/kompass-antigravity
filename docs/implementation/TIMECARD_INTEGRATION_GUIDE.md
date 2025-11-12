# TimeCard Integration Guide

**Product**: TimeCard Zeiterfassung by REINER SCT  
**Status**: API Access Pending 🔄  
**Date**: 2025-11-12

---

## Overview

This document outlines the research findings for integrating KOMPASS with the existing "TimeCard Zeiterfassung by REINER SCT" time tracking system, and provides a roadmap for implementation once API access is obtained.

---

## Research Findings

### Product Information

**Vendor**: REINER SCT  
**Product**: TimeCard Zeiterfassung  
**Website**: https://www.reiner-sct.com  
**Support**: support@reiner-sct.com

### API Availability

Based on research:
- ✅ TimeCard has an API for ERP/CRM integration
- ❌ API is **not publicly documented**
- ⚠️ API access requires direct contact with REINER SCT support
- ℹ️ API credentials and documentation available on request

### Current Status

- **Native KOMPASS time tracking** has been implemented as primary solution
- **TimeCard integration** remains a future option pending API access
- KOMPASS can be used independently or integrated with TimeCard later

---

## Integration Approaches

### Option 1: One-Way Sync (TimeCard → KOMPASS)

**Use Case**: Import time data from TimeCard for project cost calculation

**Pros**:
- Simple to implement
- No risk of data conflicts
- TimeCard remains source of truth
- KOMPASS uses TimeCard data for cost calculations

**Cons**:
- Users must enter time in TimeCard
- Cannot use KOMPASS timer widget
- Duplicate UI for time entry

### Option 2: Two-Way Sync (KOMPASS ↔ TimeCard)

**Use Case**: Use KOMPASS or TimeCard interchangeably

**Pros**:
- Flexibility for users
- Can use KOMPASS timer widget
- Data stays synchronized

**Cons**:
- Complex conflict resolution
- Risk of data inconsistencies
- Requires careful implementation

### Option 3: KOMPASS as Primary (KOMPASS → TimeCard)

**Use Case**: KOMPASS as main time tracking, sync to TimeCard for payroll

**Pros**:
- Best user experience
- Use KOMPASS features (offline timer, etc.)
- TimeCard receives data for payroll

**Cons**:
- TimeCard becomes secondary
- May require TimeCard configuration

---

## Recommended Approach

### Short-Term (Now)

**Use native KOMPASS time tracking**:
- ✅ Fully implemented and ready
- ✅ Integrated with project cost management
- ✅ Profitability calculations built-in
- ✅ No dependency on external system

### Medium-Term (Once API Available)

**Implement One-Way Sync (TimeCard → KOMPASS)**:
- Import time entries from TimeCard
- Calculate project costs in KOMPASS
- Keep TimeCard for HR/payroll
- Evaluate API capabilities

### Long-Term (After Evaluation)

**Upgrade to Two-Way Sync** (if API supports it and business needs it):
- Enable KOMPASS timer widget
- Sync to TimeCard for payroll
- Conflict resolution strategy
- User can choose entry method

---

## API Access Request

### Contact Information

**Company**: REINER SCT  
**Email**: support@reiner-sct.com  
**Phone**: +49 (0)7123 / 888-0  
**Address**: Schwabstraße 1-3, 78532 Tuttlingen, Germany

### Request Template

```
Subject: TimeCard API Access Request - ERP Integration

Dear REINER SCT Support Team,

We are implementing an ERP/CRM system (KOMPASS) for our organization and would like to integrate
it with our existing TimeCard Zeiterfassung system.

We would like to request:
1. TimeCard API documentation
2. API access credentials (API key or OAuth)
3. Information about available API endpoints
4. Rate limits and usage restrictions
5. Example integration code (if available)

Our use case:
- Import time entries from TimeCard for project cost calculation
- Potentially export project tasks to TimeCard
- Real-time or batch synchronization

Company: [Your Company Name]
TimeCard License: [Your License Number]
Contact Person: [Name]
Email: [Email]
Phone: [Phone]

Thank you for your support!

Best regards,
[Your Name]
```

---

## Implementation Plan (Once API Available)

### Phase 1: API Evaluation (4 hours)

**Tasks**:
1. Review API documentation
2. Test authentication
3. Test basic API calls
4. Evaluate capabilities:
   - ✅ Read time entries?
   - ✅ Write time entries?
   - ✅ Real-time or batch?
   - ✅ Webhook support?
   - ✅ Rate limits?
5. Document API structure
6. Decide on integration approach

**Deliverables**:
- API evaluation report
- Integration approach decision
- Technical specification

### Phase 2: Sync Service Implementation (12 hours)

**Backend Components**:

1. **TimeCardApiClient** (`apps/backend/src/modules/timecard/timecard-api.client.ts`):
   ```typescript
   export class TimeCardApiClient {
     constructor(private readonly apiKey: string, private readonly baseUrl: string) {}
     
     async getTimeEntries(startDate: Date, endDate: Date): Promise<TimeCardEntry[]>
     async createTimeEntry(entry: TimeCardEntry): Promise<TimeCardEntry>
     async updateTimeEntry(id: string, entry: Partial<TimeCardEntry>): Promise<TimeCardEntry>
     async deleteTimeEntry(id: string): Promise<void>
   }
   ```

2. **TimeCardSyncService** (`apps/backend/src/modules/timecard/timecard-sync.service.ts`):
   ```typescript
   export class TimeCardSyncService {
     async syncFromTimeCard(options: SyncOptions): Promise<SyncResult>
     async syncToTimeCard(entries: TimeEntry[]): Promise<SyncResult>
     async resolveConflicts(conflicts: Conflict[]): Promise<void>
   }
   ```

3. **TimeCardMappingService** (`apps/backend/src/modules/timecard/timecard-mapping.service.ts`):
   ```typescript
   export class TimeCardMappingService {
     mapFromTimeCard(timeCardEntry: TimeCardEntry): TimeEntry
     mapToTimeCard(timeEntry: TimeEntry): TimeCardEntry
   }
   ```

**Database**:

Add tracking fields to TimeEntry entity:
```typescript
interface TimeEntry {
  // ... existing fields
  timeCardId?: string;        // TimeCard entry ID
  timeCardSyncedAt?: Date;    // Last sync timestamp
  timeCardSyncStatus?: 'pending' | 'synced' | 'conflict';
}
```

### Phase 3: UI Integration (4 hours)

**Frontend Components**:

1. **Sync Status Indicator**:
   - Show sync status in header
   - Display last sync time
   - Show pending changes count

2. **Manual Sync Button**:
   - Trigger manual sync
   - Show progress
   - Display results

3. **Conflict Resolution Dialog**:
   - Show conflicting entries
   - Let user choose version
   - Apply resolution

**Pages to Update**:
- TimeTrackingPage: Add sync status
- MyTimesheetsPage: Add sync button
- Settings: Add TimeCard configuration

### Phase 4: Scheduled Sync (4 hours)

**Cron Job**:
```typescript
// Sync every 15 minutes
@Cron('*/15 * * * *')
async handleScheduledSync() {
  await this.timeCardSyncService.syncFromTimeCard({
    startDate: subDays(new Date(), 7), // Last 7 days
    endDate: new Date(),
  });
}
```

**Configuration**:
```env
TIMECARD_API_URL=https://api.timecard.example.com
TIMECARD_API_KEY=your-api-key
TIMECARD_SYNC_ENABLED=true
TIMECARD_SYNC_INTERVAL=15 # minutes
```

---

## Data Mapping

### TimeCard Entry → KOMPASS TimeEntry

```typescript
function mapFromTimeCard(timeCardEntry: TimeCardEntry): TimeEntry {
  return {
    _id: generateTimeEntryId(),
    projectId: mapProjectId(timeCardEntry.projectCode),
    userId: mapUserId(timeCardEntry.employeeId),
    taskDescription: timeCardEntry.description,
    startTime: timeCardEntry.startTime,
    endTime: timeCardEntry.endTime,
    durationMinutes: timeCardEntry.durationMinutes,
    isBillable: timeCardEntry.isBillable,
    status: 'completed',
    timeCardId: timeCardEntry.id,
    timeCardSyncedAt: new Date(),
    timeCardSyncStatus: 'synced',
  };
}
```

### KOMPASS TimeEntry → TimeCard Entry

```typescript
function mapToTimeCard(timeEntry: TimeEntry): TimeCardEntry {
  return {
    id: timeEntry.timeCardId,
    employeeId: mapEmployeeId(timeEntry.userId),
    projectCode: mapProjectCode(timeEntry.projectId),
    description: timeEntry.taskDescription,
    startTime: timeEntry.startTime,
    endTime: timeEntry.endTime,
    durationMinutes: timeEntry.durationMinutes,
    isBillable: timeEntry.isBillable,
  };
}
```

---

## Conflict Resolution Strategy

### Types of Conflicts

1. **Same Entry Modified in Both Systems**
   - TimeCard updated
   - KOMPASS updated
   - Different values

2. **Entry Deleted in One System**
   - Exists in TimeCard
   - Deleted in KOMPASS
   - Or vice versa

3. **Overlapping Time Entries**
   - Time entry A: 09:00-12:00
   - Time entry B: 11:00-14:00
   - Overlap: 11:00-12:00

### Resolution Rules

**Rule 1: Last Write Wins**
- Compare `modifiedAt` timestamps
- Use most recent version
- Log conflict for audit

**Rule 2: User Decides**
- Show conflict dialog
- User chooses version
- Apply choice to both systems

**Rule 3: Merge Non-Conflicting Fields**
- If only description changed in A
- And only duration changed in B
- Merge both changes

**Rule 4: Prevent Overlaps**
- Detect overlapping time entries
- Warn user before creating
- Require manual resolution

---

## Testing Strategy

### Unit Tests

```typescript
describe('TimeCardSyncService', () => {
  it('should sync time entries from TimeCard', async () => {
    // Test sync logic
  });
  
  it('should handle API errors gracefully', async () => {
    // Test error handling
  });
  
  it('should resolve conflicts correctly', async () => {
    // Test conflict resolution
  });
});
```

### Integration Tests

```typescript
describe('TimeCard Integration', () => {
  it('should import time entries from TimeCard', async () => {
    // Test full sync flow
  });
  
  it('should export time entries to TimeCard', async () => {
    // Test export flow
  });
});
```

### E2E Tests

```typescript
describe('TimeCard Sync UI', () => {
  it('should display sync status', async () => {
    // Test UI elements
  });
  
  it('should allow manual sync', async () => {
    // Test sync button
  });
  
  it('should handle conflicts via UI', async () => {
    // Test conflict resolution
  });
});
```

---

## Monitoring & Logging

### Metrics to Track

1. **Sync Success Rate**
   - Successful syncs / Total syncs
   - Target: >99%

2. **Sync Duration**
   - Time taken per sync
   - Target: <30 seconds

3. **Conflict Rate**
   - Conflicts / Total synced entries
   - Target: <1%

4. **Error Rate**
   - Sync errors / Total syncs
   - Target: <0.1%

### Logs to Capture

```typescript
logger.log('TimeCard sync started', {
  syncType: 'scheduled',
  startDate: '2024-01-01',
  endDate: '2024-01-07',
});

logger.log('TimeCard sync completed', {
  imported: 150,
  conflicts: 2,
  errors: 0,
  duration: 12500, // ms
});

logger.error('TimeCard sync failed', {
  error: error.message,
  retryCount: 3,
});
```

---

## Security Considerations

1. **API Key Storage**
   - Store in environment variables
   - Never commit to git
   - Rotate regularly

2. **Data Privacy**
   - Only sync necessary data
   - Respect DSGVO requirements
   - Log all sync operations

3. **Error Handling**
   - Don't expose API errors to users
   - Log errors securely
   - Implement retry logic

4. **Rate Limiting**
   - Respect TimeCard rate limits
   - Implement exponential backoff
   - Queue requests if needed

---

## Summary

### Current State

- ✅ Native KOMPASS time tracking fully implemented
- ✅ Ready for immediate use
- 🔄 TimeCard integration pending API access

### Next Steps

1. **Contact REINER SCT** for API access
2. **Evaluate API** capabilities once received
3. **Implement sync service** based on evaluation
4. **Test thoroughly** before production deployment

### Timeline Estimate

- API Access Request: 1-2 weeks (vendor response time)
- API Evaluation: 4 hours
- Sync Service Implementation: 12 hours
- UI Integration: 4 hours
- Testing: 4 hours
- **Total Implementation: ~24 hours** (once API available)

---

## References

- REINER SCT Website: https://www.reiner-sct.com
- KOMPASS Time Tracking: `docs/implementation/TIME_TRACKING_IMPLEMENTATION_GUIDE.md`
- Data Model: `docs/reviews/DATA_MODEL_SPECIFICATION.md`

