# Documentation Root Cleanup Script

**Date**: 2025-01-27  
**Purpose**: Clean up docs root directory to minimal structure

---

## Current State

**Root files (9 files - TOO MANY):**
- `README.md` ✅ (stays)
- `CHANGELOG.md` ✅ (stays)
- `API_UPDATES.md` ❌
- `DOCUMENTATION_ORGANIZATION.md` ❌
- `DOCUMENTATION_STANDARDS_SUMMARY.md` ❌
- `FILE_ORGANIZATION_RULES.md` ❌
- `IMPLEMENTATION_SUMMARY.md` ❌
- `MIGRATION_GUIDE.md` ❌
- `ROOT_DIRECTORY_CLEANUP.md` ❌

---

## Target State

**Root files (2 files only):**
- `README.md` ✅
- `CHANGELOG.md` ✅

**All other files in subfolders**

---

## Cleanup Commands

### Step 1: Create Required Folders

```bash
cd docs

# Create all required subfolders
mkdir -p api/updates
mkdir -p implementation/reports
mkdir -p implementation/migrations
mkdir -p rules
mkdir -p processes
mkdir -p guides
mkdir -p architecture/{decisions,evolution,ai-extensions,diagrams/images}
mkdir -p specifications
mkdir -p assets/{images,diagrams,templates}
```

### Step 2: Move Files to Correct Locations

```bash
# API documentation
mv API_UPDATES.md api/updates/

# Implementation reports
mv IMPLEMENTATION_SUMMARY.md implementation/reports/

# Migration guides
mv MIGRATION_GUIDE.md implementation/migrations/

# Rules and standards
mv FILE_ORGANIZATION_RULES.md rules/
mv ROOT_DIRECTORY_CLEANUP.md rules/
mv DOCUMENTATION_ORGANIZATION.md rules/
mv DOCUMENTATION_STANDARDS_SUMMARY.md rules/

# Rename folders (fix typos)
mv architectur architecture
mv reviews specifications
```

### Step 3: Move Architecture Files to Subfolders

```bash
cd architecture

# Move AI extensions guide
mv "AI_Automation_Extensions_Implementation_Guide.md" ai-extensions/

# Move evolution guide
mv ARCHITECTURE_EVOLUTION_GUIDE.md evolution/

# Main architecture doc stays in architecture/ root
```

### Step 4: Update README.md

Update `docs/README.md` to reflect new structure and fix all links.

### Step 5: Create Category README Files

Create `README.md` in each category folder with navigation.

---

## Verification

After cleanup, verify:

```bash
# Check root only has 2 files
ls docs/*.md
# Should only show: README.md CHANGELOG.md

# Check all files moved
find docs -name "*.md" -type f | wc -l
# Should show all files are in subfolders
```

---

## Rollback Plan

If something goes wrong:

```bash
# Restore from git
git checkout HEAD -- docs/
```

---

**Status**: Ready to execute  
**Time**: ~30 minutes  
**Risk**: Low (can rollback via git)

