# File Organization Rules - Complete Guide

**Date**: 2025-01-27  
**Status**: ✅ Rules Implemented and Enforced

---

## Overview

This document summarizes the comprehensive file organization rules implemented to maintain a clean, professional project structure and prevent clutter.

---

## Rules Implemented

### 1. No File Duplication Rule (`.cursor/rules/git-workflow.mdc`)

**Enforcement**: STRICTLY ENFORCED

**Forbidden Patterns:**

- Backup patterns: `*_backup*`, `*.backup*`, `*.bak`, `*~`, `*.swp`, `*.tmp`
- Version patterns: `*_v[0-9]*`, `*.v[0-9]*`, `*_version*`, `*.version*`
- Status patterns: `*_fixed*`, `*.fixed*`, `*_final*`, `*.final*`, `*_working*`, `*.working*`
- Old/temporary: `*_old*`, `*.old*`, `*_temp*`, `*.temp*`, `*_tmp*`, `*.tmp*`
- Copy patterns: `*_copy*`, `*.copy*`, `*_copy[0-9]*`
- Date patterns: `*_[0-9]{4}-[0-9]{2}-[0-9]{2}*`
- Test patterns: `*_test.ts`, `*.test.ts` (use `__tests__/` instead)

**Solution**: Use Git for all versioning needs:

- `git log` - See file history
- `git diff` - Compare versions
- `git revert` - Restore previous versions
- Feature branches - For experimental code

### 2. Root Directory Standards (`.cursor/rules/project-structure.mdc`)

**Allowed in Root:**

- `README.md` - Project overview
- `CHANGELOG.md` - Version history (optional)
- `LICENSE` - License file
- `CONTRIBUTING.md` - Contribution guidelines (optional)
- Configuration files (`.json`, `.js`, `.yaml`, etc.)
- CI/CD configs (`.github/`, `.husky/`, etc.)

**Forbidden in Root:**

- Implementation reports (`IMPLEMENTATION_*.md`)
- Development guides (`DEVELOPMENT.md`, `USAGE_GUIDE.md`)
- Coding standards (`CODING_STANDARDS.md`)
- Migration guides (`MIGRATION_GUIDE.md`)
- API documentation (`API_UPDATES.md`)
- Any project-specific documentation beyond README

**Solution**: All documentation goes in `docs/` directory.

### 3. File Organization Standards (`.cursor/rules/file-organization.mdc`)

**Key Principles:**

1. One file, one purpose
2. Colocate related files
3. Use directories for grouping
4. No empty directories (or have README)
5. No orphaned files

**Directory Structure:**

```
kompass/
├── apps/                    # Applications
├── packages/               # Shared packages
├── docs/                   # ALL documentation
├── tests/                  # E2E and integration tests
├── scripts/                # Development scripts
├── templates/              # Code generation templates
└── [config files]          # Configuration only
```

---

## Enforcement Mechanisms

### Pre-Commit Hooks

Pre-commit hooks detect and reject:

1. Forbidden file patterns (backup, old, copy, etc.)
2. Files in wrong directories
3. Empty directories without README
4. Documentation files in root

**Example Hook:**

```bash
# Check for forbidden patterns
if git diff --cached --name-only | grep -E '(_backup|\.backup|\.bak|_old|\.old|_v[0-9]|\.v[0-9]|_fixed|\.fixed|_copy|\.copy|_temp|\.temp|~$|\.swp$|\.tmp$)'; then
  echo "❌ ERROR: Forbidden file pattern detected!"
  echo "Use Git for versioning instead of creating duplicate files."
  exit 1
fi
```

### CI/CD Checks

CI/CD pipelines scan for:

1. Forbidden patterns
2. Directory structure violations
3. Root directory violations
4. File naming convention violations

### Code Review Checklist

Reviewers check:

1. No duplicate files created
2. Files in correct directories
3. Proper naming conventions
4. No temporary/backup files

---

## Best Practices from Industry Research

Based on industry standards from monorepo projects, enterprise codebases, and open source projects:

### 1. Version Control Over File Copies

**Industry Standard**: Use Git/VCS for all versioning needs, never manual file copies.

**Our Implementation**: ✅ Complete Git-based versioning with comprehensive pattern detection.

### 2. Structured Directory Layout

**Industry Standard**: Separate source files from generated artifacts, documentation, tests, and backups.

**Our Implementation**: ✅ Clear separation with `apps/`, `packages/`, `docs/`, `tests/` directories.

### 3. Clean Project Roots

**Industry Standard**: Store only essential files (README, LICENSE, manifest files) at root.

**Our Implementation**: ✅ Explicit list of allowed root files, all else in `docs/`.

### 4. Automated Enforcement

**Industry Standard**: Pre-commit hooks, CI checks, and lint scripts block violations.

**Our Implementation**: ✅ Pre-commit hooks, CI/CD checks, and code review checklist.

### 5. Consistent Naming Conventions

**Industry Standard**: Project-wide rules for file naming, avoid ad hoc suffixes.

**Our Implementation**: ✅ Comprehensive naming conventions for all file types.

---

## File Naming Conventions

### Code Files

**Backend (NestJS):**

- `kebab-case.ts`: `customer.service.ts`, `create-customer.dto.ts`
- Classes: `PascalCase`: `CustomerService`, `CreateCustomerDto`

**Frontend (React):**

- Components: `PascalCase.tsx`: `CustomerList.tsx`
- Hooks: `camelCase.ts`: `useCustomer.ts`
- Utilities: `kebab-case.ts`: `api-client.ts`

**Shared Package:**

- All files: `kebab-case.ts`: `id-generator.ts`

### Test Files

- Unit tests: `*.spec.ts` (colocated with source)
- E2E tests: `*.e2e.spec.ts` (in `tests/e2e/`)
- Integration tests: `*.integration.spec.ts` (in `tests/integration/`)

### Documentation Files

- Major docs: `UPPER_SNAKE_CASE.md`: `API_SPECIFICATION.md`
- Guides: `kebab-case.md`: `migration-guide.md`
- Reports: `PascalCase.md`: `ImplementationSummary.md`

---

## Clean Project Checklist

Before committing, verify:

- [ ] No files in root except allowed files
- [ ] No duplicate/backup file patterns (`*_backup*`, `*.old`, etc.)
- [ ] All documentation in `docs/` directory
- [ ] All source code in `apps/` or `packages/`
- [ ] All tests colocated or in `tests/`
- [ ] No empty directories (or have README)
- [ ] No orphaned files
- [ ] File names follow conventions
- [ ] No temporary files committed

---

## Examples

### ✅ CORRECT: Clean Structure

```
kompass/
├── README.md                    # ✅ Root - project overview
├── package.json                 # ✅ Root - config
├── docs/
│   ├── DEVELOPMENT.md           # ✅ Docs in docs/
│   └── implementation/
│       └── IMPLEMENTATION_COMPLETE.md  # ✅ Implementation reports
├── apps/
│   └── backend/
│       └── src/
│           └── modules/
│               └── customer/
│                   ├── customer.service.ts      # ✅ Proper location
│                   └── customer.service.spec.ts # ✅ Colocated test
```

### ❌ WRONG: Cluttered Structure

```
kompass/
├── README.md
├── IMPLEMENTATION_COMPLETE.md   # ❌ Should be in docs/
├── DEVELOPMENT.md               # ❌ Should be in docs/
├── customer.service.ts          # ❌ Should be in apps/backend/
├── customer.service.backup.ts   # ❌ Forbidden pattern
├── customer.service.old.ts      # ❌ Forbidden pattern
└── src/                         # ❌ Should be in apps/
    └── customer.ts
```

---

## Migration Guide

### For Existing Files

If you have files violating these rules:

1. **Duplicate/Backup Files:**

   ```bash
   # Remove duplicate files
   rm file_backup.ts file.old.ts file_v2.ts

   # Use Git to see history instead
   git log --follow file.ts
   ```

2. **Documentation in Root:**

   ```bash
   # Move to docs/
   mv IMPLEMENTATION_COMPLETE.md docs/implementation/
   mv DEVELOPMENT.md docs/
   mv CODING_STANDARDS.md docs/
   ```

3. **Update References:**
   - Update `README.md` links
   - Update cross-references in other docs
   - Update import paths if needed

---

## Benefits

1. **Cleaner Project Structure** - Easier navigation, less clutter
2. **Better Organization** - Clear file locations
3. **Consistency** - Enforced rules prevent future issues
4. **Discoverability** - Developers know where to find files
5. **Maintainability** - Easier to maintain organized structure
6. **Professional Standards** - Industry best practices enforced

---

## References

- Git Workflow: `.cursor/rules/git-workflow.mdc` - No file duplication rules
- File Organization: `.cursor/rules/file-organization.mdc` - Complete file organization standards
- Project Structure: `.cursor/rules/project-structure.mdc` - Directory organization
- Root Directory Cleanup: `docs/ROOT_DIRECTORY_CLEANUP.md` - Cleanup guide

---

**Status**: ✅ Rules implemented and enforced  
**Enforcement**: Pre-commit hooks, CI/CD checks, code review  
**Next Step**: Run cleanup script (optional) to move existing files
