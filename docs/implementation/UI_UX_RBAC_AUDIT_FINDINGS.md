# UI/UX RBAC Audit Findings - PLAN Role Corrections

**Date:** 2025-01-27  
**Auditor:** AI Assistant  
**Scope:** All files in `ui-ux/` directory  
**Focus:** Incorrect PLAN role permissions

---

## PLAN Role - Correct Permissions (Reference)

Based on `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` and `rbac.constants.ts`:

### PLAN Role Access (Correct Specification)

**✅ PLAN CAN:**
- Read ALL projects
- Update ASSIGNED projects only
- Read customers (project-related, read-only)
- Create/read/update/delete tasks
- Update Contact.DECISION_ROLE (special permission with GF)
- Read locations (all)
- Create/update locations (via customer access)

**❌ PLAN CANNOT:**
- Delete customers (only GF can)
- **Update customers** (only read access)
- Create customers (only GF, INNEN, ADM can)
- Delete locations (only GF, INNEN can)
- Create projects directly (only from opportunities)
- Access full financial data (restricted to GF/BUCH)
- Approve offers (only GF for >€50k)

---

## Audit Findings - Incorrect References

### Critical Issues (Incorrect Permissions)

#### 1. rbac-permission-indicators.md

**Line 78:**
```markdown
- Detail: "Nur GF und PLAN können Kunden löschen"
```

**Issue:** INCORRECT - Only GF can delete customers, PLAN cannot.

**Correction:**
```markdown
- Detail: "Nur GF kann Kunden löschen"
```

**Line 199:**
```markdown
**Scenario 3: PLAN views any customer**
- All fields: Editable
- Actions: All enabled
- Financial data: Visible but read-only (BUCH permission needed to edit)
```

**Issue:** INCORRECT - PLAN cannot edit customers at all.

**Correction:**
```markdown
**Scenario 3: PLAN views any customer**
- All fields: Read-only (project-related access)
- Actions: "Bearbeiten" (disabled), "Löschen" (disabled)
- Financial data: Hidden (no access)
- Note: "PLAN hat nur Lesezugriff auf Kunden - Kontaktieren Sie INNEN für Änderungen"
```

#### 2. customer-form.md

**Line 5:**
```markdown
- **User Roles**: GF, PLAN, ADM (create own), KALK (read-only), BUCH (read-only)
```

**Issue:** INCORRECT - PLAN should not be listed as editor, only reader.

**Correction:**
```markdown
- **User Roles**: GF, INNEN, ADM (create own), KALK (read-only), BUCH (read-only), PLAN (read-only)
```

#### 3. location-list.md

**Line 5:**
```markdown
- **User Roles**: All (read), GF/PLAN (create/edit/delete), ADM (create/edit own customers only)
```

**Issue:** PARTIALLY INCORRECT - PLAN cannot delete locations.

**Correction:**
```markdown
- **User Roles**: All (read), GF/INNEN (full CRUD), PLAN (create/edit), ADM (create/edit own customers only)
```

#### 4. contact-list.md

**Line 5:**
```markdown
- **User Roles**: All (read), GF/PLAN (full edit), ADM (basic edit on own customers)
```

**Issue:** PARTIALLY CORRECT but ambiguous - PLAN can edit, but ADM has restrictions.

**Correction:**
```markdown
- **User Roles**: All (read), GF/INNEN (full edit), PLAN (edit including decision authority), ADM (basic edit on own customers, no decision authority)
```

#### 5. invoice-form.md

**Line 5:**
```markdown
- **User Roles**: GF (full), BUCH (full), PLAN (limited), ADM (read-only)
```

**Issue:** AMBIGUOUS - What is "PLAN (limited)"? PLAN should not have invoice edit access.

**Correction:**
```markdown
- **User Roles**: GF (full), BUCH (full), INNEN (read for projects), PLAN (read-only), ADM (read-only)
```

#### 6. opportunity-form.md

**Line 5:**
```markdown
- **User Roles**: GF, PLAN, ADM (create own), KALK (read-only)
```

**Issue:** AMBIGUOUS - PLAN should have limited access to opportunities (read for projects).

**Correction:**
```markdown
- **User Roles**: GF, INNEN, ADM (create own), PLAN (read for projects), KALK (read-only)
```

**Line 180:**
```markdown
   - For GF/PLAN: Can assign to any ADM/PLAN user
```

**Issue:** INCORRECT - This is for opportunities, PLAN should not be assigning opportunities.

**Correction:**
```markdown
   - For GF/INNEN: Can assign to any ADM/INNEN user
```

#### 7. project-form.md

**Line 5:**
```markdown
- **User Roles**: GF (full), PLAN (full), ADM (limited read), KALK (cost data only)
```

**Issue:** CORRECT - PLAN has full access to projects (this is their main domain).

**No correction needed.**

#### 8. bulk-import-form.md

**Line 5:**
```markdown
- **User Roles**: GF, PLAN (full access), ADM (own data only)
```

**Issue:** INCORRECT - PLAN should not have customer import access.

**Correction:**
```markdown
- **User Roles**: GF, INNEN (full access), ADM (own data only), PLAN (read-only)
```

**Line 229:**
```markdown
- GF/PLAN: Can assign imported customers to any ADM user
```

**Issue:** INCORRECT - PLAN cannot import or assign customers.

**Correction:**
```markdown
- GF/INNEN: Can assign imported customers to any ADM user
```

### Minor Issues (Ambiguous or Missing Details)

#### 9. plan-dashboard.md

**Line 6:**
```markdown
- **Access**: ALL projects and customers
```

**Issue:** CORRECT but could be clearer that customer access is read-only.

**Suggested clarification:**
```markdown
- **Access**: ALL projects (full), ALL customers (read-only)
```

#### 10. README.md

**Line 299:**
```markdown
- **GF/PLAN**: Full CRUD on all entities
```

**Issue:** INCORRECT - PLAN does not have full CRUD on customers.

**Correction:**
```markdown
- **GF**: Full CRUD on all entities
- **PLAN**: Full CRUD on projects/tasks, read-only customers, limited other entities
```

---

## Summary Statistics

**Total UI/UX files reviewed:** 64  
**Files with PLAN references:** 25  
**Files with incorrect PLAN permissions:** 8  
**Critical corrections needed:** 6  
**Minor clarifications needed:** 4  

---

## Files Requiring Corrections

### High Priority (Incorrect Permissions)

1. ✅ `ui-ux/08-specialized/rbac-permission-indicators.md` - Lines 78, 199
2. ✅ `ui-ux/03-entity-forms/customer-form.md` - Line 5
3. ✅ `ui-ux/04-list-views/location-list.md` - Line 5
4. ✅ `ui-ux/04-list-views/contact-list.md` - Line 5
5. ✅ `ui-ux/03-entity-forms/invoice-form.md` - Line 5
6. ✅ `ui-ux/03-entity-forms/opportunity-form.md` - Lines 5, 180
7. ✅ `ui-ux/03-entity-forms/bulk-import-form.md` - Lines 5, 229
8. ✅ `ui-ux/README.md` - Line 299

### Medium Priority (Clarifications)

9. ✅ `ui-ux/06-dashboards/plan-dashboard.md` - Line 6 (clarify read-only customers)

### Low Priority (Already Correct)

10. ✅ `ui-ux/03-entity-forms/project-form.md` - Correct (PLAN has full project access)
11. ✅ `ui-ux/05-detail-pages/project-detail.md` - Needs review
12. ✅ All other files - Needs systematic review

---

## Next Steps

1. ✅ Complete systematic review of remaining files
2. ✅ Apply all corrections to markdown files
3. ✅ Create comprehensive Figma migration prompt with all changes
4. ✅ Update ui-ux/README.md with new migration prompt reference

---

## Correction Pattern Template

For each incorrect reference, use this pattern:

```markdown
<!-- OLD (INCORRECT): -->
- **User Roles**: GF, PLAN, ADM

<!-- NEW (CORRECT): -->
- **User Roles**: GF, INNEN, ADM (PLAN read-only)
```

---

## Reference Documents

- `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` - Authoritative source
- `packages/shared/src/constants/rbac.constants.ts` - Implementation
- `docs/personas/Strategische Referenzpersona_ Planungsabteilung.md` - PLAN role definition

