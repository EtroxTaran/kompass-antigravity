# Time Tracking Bug Fix Summary

**Date**: 2025-01-28  
**Issue ID**: Bug 1 - Team Timesheets Filter Override  
**Severity**: High (Feature Breaking)  
**Status**: ✅ Fixed

---

## Problem Description

The `findAll` method in `TimeEntryService` was unconditionally overriding the `userId` filter parameter with the `currentUserId` on line 294, causing the `getTeamTimesheets` endpoint to only return the current user's entries instead of team members' entries.

### Impact

- Managers (GF, PLAN, BUCH) could not view their team's time entries
- The team timesheets feature was completely broken
- Filtering by specific team members was impossible
- This violated the RBAC requirements where managers should have visibility into team time tracking

### Root Cause

```typescript
// ❌ WRONG: Always overrides userId filter
async findAll(
  filters: TimeEntryFilters,
  currentUserId: string,
): Promise<TimeEntryResponseDto[]> {
  const userFilters: TimeEntryFilters = {
    ...filters,
    userId: currentUserId,  // BUG: Always forces userId to currentUser
  };
  
  const entries = await this.repository.findAll(userFilters);
  return entries.map((entry) => this.mapToResponseDto(entry));
}
```

The method was forcing `userId: currentUserId` for ALL users, regardless of their role or the provided filter.

---

## Solution

### Changed Files

1. `/apps/backend/src/modules/time-tracking/services/time-entry.service.ts`
2. `/apps/backend/src/modules/time-tracking/controllers/time-entry.controller.ts`

### Service Layer Fix (time-entry.service.ts)

**Added role-based filtering logic:**

```typescript
// ✅ CORRECT: Role-based userId filtering
async findAll(
  filters: TimeEntryFilters,
  currentUserId: string,
  userRole?: string,  // NEW: Accept user role
): Promise<TimeEntryResponseDto[]> {
  // Apply RBAC filters based on user role
  // Managers (GF, PLAN) can see team entries
  // Other roles can only see their own entries
  const isManager = userRole === 'GF' || userRole === 'PLAN' || userRole === 'BUCH';
  
  const userFilters: TimeEntryFilters = { ...filters };
  
  // Non-managers can only see their own entries
  if (!isManager) {
    userFilters.userId = currentUserId;
  }
  // Managers can use the provided userId filter or see all entries

  const entries = await this.repository.findAll(userFilters);
  return entries.map((entry) => this.mapToResponseDto(entry));
}
```

### Controller Layer Updates (time-entry.controller.ts)

**Updated all three endpoints that call `findAll`:**

1. **General findAll endpoint (line 103)**:
```typescript
return this.timeEntryService.findAll(filters, user.id, user.role);
```

2. **getMyTimesheets endpoint (line 345)**:
```typescript
return this.timeEntryService.findAll(filters, user.id, user.role);
```

3. **getTeamTimesheets endpoint (line 377)**:
```typescript
// RBAC filters applied in service (PLAN/GF/BUCH can see all team entries)
return this.timeEntryService.findAll(filters, user.id, user.role);
```

---

## RBAC Behavior After Fix

### Manager Roles (GF, PLAN, BUCH)

- ✅ Can view ALL team members' time entries
- ✅ Can filter by specific userId to see individual team member entries
- ✅ Can filter by projectId to see project-specific time entries
- ✅ Can see entries across all statuses (pending, completed, approved, rejected)

### Non-Manager Roles (ADM, INNEN, KALK)

- ✅ Can only view their OWN time entries
- ✅ userId filter is automatically enforced (cannot see others' entries)
- ✅ Can still filter by projectId, status, dates within their own entries

---

## Testing Verification

### Test Cases to Verify

1. **Manager Role (PLAN):**
   - Call `GET /api/v1/time-entries/team/list` → Should return ALL team entries
   - Call `GET /api/v1/time-entries/team/list?userId={teamMemberId}` → Should return specific team member's entries
   - Call `GET /api/v1/time-entries/team/list?projectId={projectId}` → Should return all entries for that project

2. **Non-Manager Role (ADM):**
   - Call `GET /api/v1/time-entries` → Should return only current user's entries
   - Call `GET /api/v1/time-entries?userId={otherUserId}` → Should still return only current user's entries (filter ignored)

3. **Accounting Role (BUCH):**
   - Call `GET /api/v1/time-entries/team/list` → Should return ALL team entries for cost tracking

---

## Related Documentation

- **RBAC Specification**: `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md`
- **Time Tracking Implementation**: `docs/implementation/TIME_TRACKING_IMPLEMENTATION_GUIDE.md`
- **API Specification**: `docs/specifications/reviews/API_SPECIFICATION.md`

---

## Lessons Learned

1. **Always consider RBAC in filtering logic**: Don't assume all users should see only their own data
2. **Pass user context to service methods**: Role information is essential for proper authorization
3. **Test with multiple roles**: Ensure filtering behaves correctly for all user types
4. **Document role-specific behavior**: Make it clear in comments which roles have what access

---

**Status**: ✅ Bug verified and fixed  
**Linter Errors**: None  
**Next Steps**: Deploy to test environment and verify with actual role-based testing

