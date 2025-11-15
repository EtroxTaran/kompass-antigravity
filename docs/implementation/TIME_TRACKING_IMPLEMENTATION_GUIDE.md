# Time Tracking Implementation Guide

**Status**: Phase 1 Complete ✅  
**Date**: 2025-11-12  
**Author**: AI Implementation Team

---

## Overview

This document describes the implementation of time tracking and project cost management for the KOMPASS system. Phase 1 (core functionality) has been completed. This guide outlines what has been implemented and what remains for future phases.

---

## Phase 1: Core Functionality ✅ COMPLETED

### Backend Implementation ✅

#### Entities Created

1. **TimeEntry Entity** (`packages/shared/src/types/entities/time-entry.ts`)
   - Track individual time entries for projects
   - Fields: projectId, userId, taskId, startTime, endTime, durationMinutes, description, isBillable, status
   - Status workflow: in_progress → completed → approved/rejected

2. **ProjectCost Entity** (`packages/shared/src/types/entities/project-cost.ts`)
   - Track material costs, contractors, external services
   - Fields: projectId, costType, description, supplierName, quantity, unitPrice, taxRate, invoiceNumber, status
   - Cost types: material, contractor, external_service, equipment, other

3. **Extended Project Entity** (`packages/shared/src/types/entities/project.ts`)
   - Added cost tracking fields: budgetedHours, budgetedCost, actualHours, actualCost, profitability

#### Backend Modules ✅

1. **Time Tracking Module** (`apps/backend/src/modules/time-tracking/`)
   - TimeEntryController: REST API endpoints
   - TimeEntryService: Business logic
   - TimeEntryRepository: Data access layer
   - Endpoints: CRUD operations for time entries

2. **Project Cost Module** (`apps/backend/src/modules/project-cost/`)
   - ProjectCostController: REST API endpoints
   - ProjectCostService: Business logic
   - ProjectCostRepository: Data access layer
   - Endpoints: CRUD operations for project costs

3. **Cost Calculator Service** (`apps/backend/src/modules/project/services/project-cost-calculator.service.ts`)
   - Calculate labor costs from time entries
   - Calculate material costs from project costs
   - Calculate project profitability
   - Automatic recalculation on changes

4. **Budget Alert Service** (`apps/backend/src/modules/project/services/budget-alert.service.ts`)
   - Budget threshold monitoring (80%, 100%, 110%)
   - Automatic alerts when thresholds exceeded
   - Alert notification system (currently logs, extensible to email/push)

#### RBAC Updates ✅

Updated RBAC permission matrix (`packages/shared/src/constants/rbac.constants.ts`):

- Added `TimeEntry` and `ProjectCost` entity types
- Added `KALK` (Cost Calculation) role
- Defined granular permissions for all roles:
  - **ADM**: Own time entries and project costs view
  - **INNEN**: Own time entries
  - **PLAN**: Team time entries approval, project costs management
  - **KALK**: Time entry creation, project cost viewing
  - **BUCH**: Full project cost management and approval
  - **GF**: Full access to all time and cost data

### Frontend Implementation ✅

#### Timer Widget ✅

**Location**: `apps/frontend/src/features/time-tracking/components/TimerWidget.tsx`

Features:

- Start/pause/resume/stop timer
- Real-time duration display
- Integrated with useTimer hook
- TODO: Add offline support

#### Time Entry Management ✅

**Components Created**:

1. `TimeEntryList.tsx` - List view with filtering and bulk actions
2. `TimeTrackingPage.tsx` - Main time tracking page
3. `MyTimesheetsPage.tsx` - Personal timesheets
4. `TeamTimesheetsPage.tsx` - Team approvals (PLAN/GF)
5. `TimesheetWeekView.tsx` - Weekly calendar view

**Hooks Created**:

- `useTimer.ts` - Timer logic and state management
- `useTimeTracking.ts` - Fetch time entries with filters
- `useMyTimesheets.ts` - Personal timesheets
- `useTeamTimesheets.ts` - Team timesheets for managers

#### Project Cost Management ✅

**Components Created**:

1. `ProjectCostList.tsx` - List view with actions
2. `ProjectCostForm.tsx` - Cost entry form
3. `ProjectCostsPage.tsx` - Main costs page

**Hooks Created**:

- `useProjectCosts.ts` - Fetch costs and summary

**API Client**:

- `project-cost-api.ts` - HTTP client for project costs

#### Profitability Dashboard ✅

**Components Created**:

1. `ProfitabilityDashboard.tsx` - Comprehensive profitability analysis
2. `ProjectProfitabilityPage.tsx` - Dashboard page

**Hooks Created**:

- `useProfitability.ts` - Fetch profitability report

**Features**:

- Budget vs actual comparison
- Cost breakdown (labor vs materials)
- Profit margin analysis
- Visual progress bars
- Budget alerts and warnings

---

## Phase 2: Reporting & Exports 🔄 FUTURE

### Requirements

1. **CSV Export** (ID: reporting-exports)
   - Export time entries to CSV
   - Export project costs to CSV
   - Configurable date range and filters
   - German locale formatting

2. **PDF Reports** (ID: reporting-exports)
   - Generate PDF time tracking reports
   - Generate PDF cost reports
   - Include summary statistics and charts
   - Professional layout with company branding

### Implementation Plan

**Backend**:

1. Install PDF generation library (e.g., `@pdf-lib/pdf-lib` or `pdfkit`)
2. Create `ReportingService` with methods:
   - `generateTimeTrackingCSV(filters): Promise<Buffer>`
   - `generateTimeTrackingPDF(filters): Promise<Buffer>`
   - `generateCostReportCSV(filters): Promise<Buffer>`
   - `generateCostReportPDF(filters): Promise<Buffer>`
3. Add endpoints:
   - `GET /api/v1/reports/time-tracking/csv`
   - `GET /api/v1/reports/time-tracking/pdf`
   - `GET /api/v1/reports/project-costs/csv`
   - `GET /api/v1/reports/project-costs/pdf`

**Frontend**:

1. Update export buttons in pages to call report endpoints
2. Add download functionality
3. Add preview modal for PDF reports

### Estimated Effort

- Backend: 8 hours
- Frontend: 4 hours
- **Total: 12 hours**

---

## Phase 3: CSV Import Tool 🔄 FUTURE

### Requirements

1. **CSV Import** (ID: csv-import-tool)
   - Import historical time entries from CSV
   - Validate data before import
   - Handle errors gracefully
   - Preview import before applying
   - Dry-run mode

### Implementation Plan

**CSV Format**:

```csv
Date,ProjectID,UserID,TaskDescription,DurationMinutes,IsBillable,Status
2024-01-15,project-1,user-1,Development work,480,true,completed
```

**Backend**:

1. Install CSV parsing library (`csv-parse`)
2. Create `ImportService`:
   - `validateCSV(file): Promise<ValidationResult>`
   - `previewImport(file): Promise<ImportPreview>`
   - `executeImport(file, dryRun): Promise<ImportResult>`
3. Add endpoints:
   - `POST /api/v1/import/time-entries/validate`
   - `POST /api/v1/import/time-entries/preview`
   - `POST /api/v1/import/time-entries/execute`

**Frontend**:

1. Create `ImportTimeEntriesPage.tsx`:
   - File upload
   - CSV validation
   - Preview table
   - Execute import button
2. Add progress indicator
3. Display import results (success/errors)

### Estimated Effort

- Backend: 6 hours
- Frontend: 6 hours
- **Total: 12 hours**

---

## Phase 4: PWA Offline Support 🔄 FUTURE

### Requirements

1. **Offline Timer** (ID: offline-timer-support)
   - Timer works offline
   - Queue time entries for sync
   - Background sync when online
   - Conflict resolution

### Implementation Plan

**Service Worker**:

1. Create Service Worker (`apps/frontend/public/sw.js`)
2. Implement background sync:
   - Register sync event
   - Queue offline time entries
   - Sync when connection restored
3. Cache timer state in IndexedDB

**Frontend**:

1. Update `useTimer.ts`:
   - Detect offline status
   - Store entries in IndexedDB when offline
   - Sync when online
2. Add offline indicator UI
3. Show sync status

**Backend**:

1. Add conflict detection:
   - Check for overlapping time entries
   - Resolve conflicts automatically where possible
2. Add bulk sync endpoint:
   - `POST /api/v1/time-entries/sync`
   - Accept array of time entries
   - Return sync results

### Estimated Effort

- Service Worker: 8 hours
- Frontend: 8 hours
- Backend: 4 hours
- **Total: 20 hours**

---

## Phase 5: Testing 🔄 FUTURE

### Requirements

1. **Unit Tests** (ID: testing-time-tracking)
   - Backend services
   - Frontend hooks
   - Utilities

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Cost calculations

3. **E2E Tests**
   - Timer workflows
   - Time entry approval
   - Project cost management
   - Profitability dashboard

### Implementation Plan

**Unit Tests** (70% of tests):

```bash
# Backend
apps/backend/src/modules/time-tracking/**/*.spec.ts
apps/backend/src/modules/project-cost/**/*.spec.ts
apps/backend/src/modules/project/services/*.spec.ts

# Frontend
apps/frontend/src/features/time-tracking/**/*.spec.tsx
apps/frontend/src/features/project-costs/**/*.spec.tsx
```

**Integration Tests** (20% of tests):

```bash
tests/integration/time-tracking/
tests/integration/project-cost/
tests/integration/profitability/
```

**E2E Tests** (10% of tests):

```bash
tests/e2e/time-tracking/
tests/e2e/project-cost/
tests/e2e/profitability/
```

### Estimated Effort

- Unit Tests: 16 hours
- Integration Tests: 8 hours
- E2E Tests: 8 hours
- **Total: 32 hours**

---

## Phase 6: TimeCard Integration 🔄 FUTURE

### Requirements

1. **TimeCard API Evaluation** (ID: research-timecard-api, timecard-integration)
   - Contact REINER SCT for API access
   - Evaluate API capabilities
   - Decide on integration approach

2. **Integration Implementation** (if API is suitable)
   - Sync service
   - Bi-directional sync
   - Conflict resolution
   - Data mapping

### Implementation Plan

**Step 1: Contact REINER SCT**

- Email: support@reiner-sct.com
- Request: TimeCard API documentation and credentials
- Mention: ERP/CRM integration for project time tracking

**Step 2: API Evaluation**
After receiving API access:

1. Review API documentation
2. Test API endpoints
3. Evaluate capabilities:
   - Can we read time entries?
   - Can we write time entries?
   - Real-time vs batch sync?
   - Authentication method?
4. Decide if integration is feasible

**Step 3: Implementation** (if feasible)

1. Create `TimeCardSyncService`:
   - `syncFromTimeCard(): Promise<SyncResult>`
   - `syncToTimeCard(entries): Promise<SyncResult>`
   - `resolveConflicts(conflicts): Promise<void>`
2. Add scheduled sync (e.g., every 15 minutes)
3. Add manual sync button
4. Show sync status in UI

### Estimated Effort

- API Evaluation: 4 hours
- Sync Service: 12 hours
- UI Integration: 4 hours
- **Total: 20 hours**

---

## Summary

### Phase 1 (Completed) ✅

- ✅ Backend entities and modules
- ✅ RBAC permissions
- ✅ Cost calculator and budget alerts
- ✅ Frontend timer widget
- ✅ Time entry management pages
- ✅ Project cost management pages
- ✅ Profitability dashboard

### Future Phases 🔄

- 🔄 Phase 2: Reporting & Exports (12 hours)
- 🔄 Phase 3: CSV Import Tool (12 hours)
- 🔄 Phase 4: PWA Offline Support (20 hours)
- 🔄 Phase 5: Testing (32 hours)
- 🔄 Phase 6: TimeCard Integration (20 hours)

**Total Future Effort**: ~96 hours

---

## Next Steps

1. **Immediate**: Test Phase 1 implementation in development environment
2. **Short-term**: Implement Phase 2 (Reporting & Exports)
3. **Medium-term**: Implement Phase 3 (CSV Import)
4. **Long-term**: Contact REINER SCT for TimeCard API access

---

## References

- Time Tracking Plan: `docs/implementation/TIME_TRACKING_PLAN.md`
- Data Model: `docs/reviews/DATA_MODEL_SPECIFICATION.md`
- RBAC Matrix: `docs/reviews/RBAC_PERMISSION_MATRIX.md`
- API Specification: `docs/reviews/API_SPECIFICATION.md`
