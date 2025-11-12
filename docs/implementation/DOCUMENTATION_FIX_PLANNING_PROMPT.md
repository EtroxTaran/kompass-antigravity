# Documentation Fix Planning Prompt

**Date**: 2025-01-28  
**Purpose**: Planning prompt for fixing documentation gaps identified in audit  
**Priority**: 🔴 **CRITICAL** - Immediate action required

---

## Executive Summary

**7 Critical Documentation Gaps** identified requiring **25-35 hours** of documentation work. Code implementation has advanced beyond documentation, creating risk for development velocity, security, and quality.

---

## Critical Issues Summary

### 🔴 Priority 1: Critical (This Week - 15-18 hours)

#### Issue 1: TimeEntry Entity - Missing Full Documentation
- **Status**: Fully implemented in code, only placeholder in docs
- **Files Affected**: 
  - `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` (add full entity spec)
  - `docs/specifications/reviews/API_SPECIFICATION.md` (add endpoints)
  - `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` (verify permissions)
  - `docs/specifications/reviews/TEST_STRATEGY_DOCUMENT.md` (add test scenarios)
- **Effort**: 4-6 hours
- **Reference**: `packages/shared/src/types/entities/time-entry.ts`, `apps/backend/src/modules/time-tracking/`

#### Issue 2: ProjectCost Entity - Missing Full Documentation
- **Status**: Fully implemented in code, not documented at all
- **Files Affected**: Same as Issue 1
- **Effort**: 4-6 hours
- **Reference**: `packages/shared/src/types/entities/project-cost.ts`, `apps/backend/src/modules/project-cost/`

#### Issue 3: Customer Tour Planning Fields - Missing Documentation
- **Status**: Fields added to code, not documented
- **Fields**: `lastVisitDate`, `visitFrequencyDays`, `preferredVisitTime`
- **Files Affected**:
  - `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` (add fields)
  - `ui-ux/03-entity-forms/customer-form.md` (update form)
- **Effort**: 2-3 hours
- **Reference**: `packages/shared/src/types/entities/customer.ts` (lines 116-123)

#### Issue 4: Location GPS & Hotel Fields - Missing Documentation
- **Status**: Fields added to code, not documented
- **Fields**: `gpsCoordinates`, `isHotel`, `hotelRating`
- **Files Affected**: Same as Issue 3
- **Effort**: 2-3 hours
- **Reference**: `packages/shared/src/types/entities/location.ts` (lines 52-65)

### 🟡 Priority 2: Important (Next Week - 10-12 hours)

#### Issue 5: INNEN vs PLAN Role Boundaries - Unclear
- **Status**: Both roles exist, boundaries confusing in docs
- **Clarification Needed**:
  - **INNEN**: Pre-sales, customer/opportunity/offer management, read-only projects
  - **PLAN**: Post-sales, project execution, read-only customers (project context), full CRUD projects
- **Files Affected**: All UI/UX documentation files, RBAC matrix
- **Effort**: 3-4 hours

#### Issue 6: Offer & Contract Entities - Incomplete
- **Status**: Briefly mentioned, need full documentation
- **Files Affected**: `DATA_MODEL_SPECIFICATION.md`, `API_SPECIFICATION.md`
- **Effort**: 4-5 hours

#### Issue 7: API Endpoints Missing - TimeEntry & ProjectCost
- **Status**: Controllers exist, API spec incomplete
- **Files Affected**: `API_SPECIFICATION.md`
- **Effort**: 2-3 hours

---

## Implementation Plan

### Phase 1: Critical Documentation (Week 1)

**Day 1-2: Entity Documentation**
1. Document TimeEntry entity completely
   - Copy structure from `time-entry.ts`
   - Add validation rules from code
   - Document business rules (approval workflow)
   - Add to `DATA_MODEL_SPECIFICATION.md` section

2. Document ProjectCost entity completely
   - Copy structure from `project-cost.ts`
   - Add validation rules
   - Document cost types and statuses
   - Add to `DATA_MODEL_SPECIFICATION.md` section

**Day 3: Field Documentation**
3. Document Customer tour planning fields
   - Add fields to Customer entity section
   - Document validation rules
   - Update customer form UI/UX doc

4. Document Location GPS/hotel fields
   - Add fields to Location entity section
   - Document GPS validation
   - Document hotel integration

**Day 4-5: API Documentation**
5. Add TimeEntry API endpoints
   - Review `TimeEntryController`
   - Document all endpoints
   - Add DTOs
   - Add OpenAPI examples

6. Add ProjectCost API endpoints
   - Review `ProjectCostController`
   - Document all endpoints
   - Add DTOs
   - Add OpenAPI examples

### Phase 2: Verification & Clarification (Week 2)

**Day 1-2: RBAC Verification**
7. Verify TimeEntry permissions
   - Check `rbac.constants.ts`
   - Update `RBAC_PERMISSION_MATRIX.md`
   - Add authorization examples

8. Verify ProjectCost permissions
   - Same as above

**Day 3-4: Role Clarification**
9. Create role boundary document
   - Define INNEN vs PLAN clearly
   - Update all UI/UX docs consistently
   - Verify RBAC matrix matches

**Day 5: Offer/Contract Completion**
10. Complete Offer entity documentation
11. Complete Contract entity documentation
12. Document conversion workflow

---

## Documentation Templates

### Entity Documentation Template

```markdown
## X. [EntityName] Entity

**Status**: [Implemented/Planned]  
**Last Updated**: YYYY-MM-DD

### [EntityName] Interface

\`\`\`typescript
interface [EntityName] extends BaseEntity {
  // Copy from entity file
}
\`\`\`

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| field1 | Required, 2-200 chars | "Field must be 2-200 characters" |

### Business Rules

- **BR-001**: Rule description
- **BR-002**: Rule description

### RBAC Permissions

| Permission | Roles | Notes |
|------------|-------|-------|
| READ | All | Filtered by ownership |
| CREATE | ADM, GF | ... |

### API Endpoints

See: [API_SPECIFICATION.md Section X](#link)
```

### API Endpoint Documentation Template

```markdown
#### POST /api/v1/[entity]

**Summary**: Create new [entity]

**Permissions**: Requires `[Entity].CREATE` permission

**Request Body**:
\`\`\`json
{
  "field1": "value",
  "field2": 123
}
\`\`\`

**Response**: 201 Created
\`\`\`json
{
  "_id": "entity-123",
  "field1": "value",
  ...
}
\`\`\`

**Error Responses**:
- 400: Validation error
- 403: Permission denied
```

---

## Quality Checklist

For each documentation update:

- [ ] Entity interface matches code exactly
- [ ] Validation rules match code validation functions
- [ ] Business rules documented with rule IDs (BR-XXX)
- [ ] RBAC permissions verified against code
- [ ] API endpoints match controller methods
- [ ] DTOs documented with examples
- [ ] Error responses documented (RFC 7807)
- [ ] Cross-references updated
- [ ] UI/UX documentation updated if needed
- [ ] Test scenarios added

---

## Success Criteria

Documentation is complete when:

1. ✅ All entities in code have full documentation
2. ✅ All API endpoints in controllers have API spec entries
3. ✅ All RBAC permissions verified and documented
4. ✅ All validation rules match code
5. ✅ All business rules documented
6. ✅ Cross-references are correct
7. ✅ UI/UX documentation updated
8. ✅ Test scenarios added

---

## Risk Mitigation

**Risk**: Documentation gaps cause development delays and bugs

**Mitigation**:
1. Assign dedicated documentation sprint
2. Review documentation in PR process
3. Set up automated checks (if possible)
4. Regular documentation audits

---

## Next Steps

1. **Review this prompt** with team
2. **Assign tasks** to developers
3. **Create Linear issues** for each priority item
4. **Schedule documentation sprint** (Week 1)
5. **Set up review process** for documentation PRs
6. **Track progress** in this document

---

**Estimated Total Effort**: 25-35 hours  
**Timeline**: 2 weeks (1 week critical, 1 week verification)  
**Team Size**: 1-2 developers + 1 technical writer (if available)

---

**Ready to Execute**: ✅ Yes  
**Blockers**: None  
**Dependencies**: Access to codebase, documentation tools

