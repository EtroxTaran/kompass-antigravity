# Documentation Organization Guide

**Date**: 2025-01-27  
**Status**: ✅ Standards Defined  
**Owner**: Tech Leads & Product Team

---

## Overview

This guide defines the standard structure for organizing all KOMPASS documentation to prevent duplicates, ensure discoverability, and maintain clarity.

---

## Current Structure Analysis

### ✅ Well-Organized Categories

- **`architectur/`** - Architecture documentation ✅
- **`personas/`** - User personas ✅
- **`product-vision/`** - Product vision documents ✅
- **`reviews/`** - Technical specifications ✅

### ⚠️ Needs Organization

**Root Level Files:**
- `API_UPDATES.md` → Should be in `api/updates/`
- `CHANGELOG.md` → ✅ Can stay (standard location)
- `FILE_ORGANIZATION_RULES.md` → Should be in `rules/`
- `IMPLEMENTATION_SUMMARY.md` → Should be in `implementation/reports/`
- `MIGRATION_GUIDE.md` → Should be in `implementation/migrations/`
- `ROOT_DIRECTORY_CLEANUP.md` → Should be in `rules/`
- `README.md` → ✅ Stays (main index)

---

## Target Structure

### Complete Documentation Hierarchy

```
docs/
├── README.md                    # Main documentation index
├── CHANGELOG.md                 # Version history (maintained)
│
├── guides/                      # User and developer guides
│   ├── README.md               # Guides index
│   ├── getting-started.md      # Quick start guide
│   ├── development.md          # Development guide (from root DEVELOPMENT.md)
│   ├── deployment.md            # Deployment procedures
│   ├── troubleshooting.md       # Common issues
│   └── contributing.md         # Contribution guidelines
│
├── api/                         # API documentation
│   ├── README.md               # API documentation index
│   ├── reference/              # API reference
│   │   ├── endpoints.md        # All endpoints (from API_SPECIFICATION.md)
│   │   ├── authentication.md   # Auth documentation
│   │   └── models.md           # Data models
│   ├── updates/                # API change logs
│   │   └── API_UPDATES.md      # API changes by version
│   └── examples/               # API usage examples
│
├── architecture/                # Architecture documentation
│   ├── README.md               # Architecture overview
│   ├── system-design.md        # Main architecture (from architectur/)
│   ├── decisions/               # Architecture Decision Records (ADRs)
│   │   ├── README.md          # ADR index
│   │   └── adr-001-*.md        # Individual ADRs
│   ├── evolution/              # Architecture evolution guides
│   │   └── ARCHITECTURE_EVOLUTION_GUIDE.md
│   ├── ai-extensions/          # AI extensions architecture
│   │   └── AI_Automation_Extensions_Implementation_Guide.md
│   └── diagrams/               # Architecture diagrams
│       └── images/             # Diagram images
│
├── specifications/              # Technical specifications
│   ├── README.md               # Specifications index
│   ├── data-model.md           # Data model specification
│   ├── rbac.md                 # RBAC permission matrix
│   ├── testing.md              # Test strategy
│   ├── nfr.md                  # Non-functional requirements
│   ├── api.md                  # API specification
│   └── security.md             # Security specifications
│
├── product-vision/              # Product vision and strategy
│   ├── README.md               # Product vision index
│   ├── overview.md             # Main product vision
│   ├── roadmap.md              # Technology roadmap
│   └── features/               # Feature-specific visions
│       ├── crm.md
│       ├── project-management.md
│       ├── finance-compliance.md
│       └── ai-automation.md
│
├── personas/                    # User personas
│   ├── README.md               # Personas index
│   └── *.md                    # Individual persona files
│
├── implementation/              # Implementation reports and logs
│   ├── README.md               # Implementation index
│   ├── reports/                # Implementation reports
│   │   ├── IMPLEMENTATION_COMPLETE.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   ├── migrations/             # Migration guides
│   │   └── MIGRATION_GUIDE.md
│   └── setup/                  # Setup documentation
│       └── SETUP_COMPLETE.md
│
├── processes/                   # Process and workflow documentation
│   ├── README.md               # Processes index
│   ├── git-workflow.md         # Git workflow
│   ├── code-review.md          # Code review process
│   └── release.md              # Release process
│
├── rules/                       # Project rules and standards
│   ├── README.md               # Rules index
│   ├── FILE_ORGANIZATION_RULES.md
│   └── ROOT_DIRECTORY_CLEANUP.md
│
└── assets/                      # Documentation assets
    ├── images/                  # Images referenced in docs
    ├── diagrams/                # Diagrams and charts
    └── templates/              # Documentation templates
```

---

## Migration Plan

### Phase 1: Create New Structure (No File Moves Yet)

1. Create new category folders:
   ```bash
   mkdir -p docs/{guides,api/{reference,updates,examples},architecture/{decisions,evolution,ai-extensions,diagrams/images},specifications,implementation/{reports,migrations,setup},processes,rules,assets/{images,diagrams,templates}}
   ```

2. Create README.md files for each category

### Phase 2: Move Files to New Locations

**Root Level Files:**
```bash
# API documentation
mv docs/API_UPDATES.md docs/api/updates/

# Guides
# (DEVELOPMENT.md should be moved from root to docs/guides/development.md)

# Implementation reports
mv docs/IMPLEMENTATION_SUMMARY.md docs/implementation/reports/

# Migration guides
mv docs/MIGRATION_GUIDE.md docs/implementation/migrations/

# Rules
mv docs/FILE_ORGANIZATION_RULES.md docs/rules/
mv docs/ROOT_DIRECTORY_CLEANUP.md docs/rules/
```

**Architecture Files:**
```bash
# Main architecture stays in architecture/
# But rename folder from architectur/ to architecture/
mv docs/architectur docs/architecture

# Move AI extensions guide
mv docs/architecture/AI_Automation_Extensions_Implementation_Guide.md docs/architecture/ai-extensions/

# Move evolution guide
mv docs/architecture/ARCHITECTURE_EVOLUTION_GUIDE.md docs/architecture/evolution/
```

**Specifications:**
```bash
# Move reviews/ to specifications/
mv docs/reviews/* docs/specifications/
rmdir docs/reviews

# Rename files for consistency
mv docs/specifications/DATA_MODEL_SPECIFICATION.md docs/specifications/data-model.md
mv docs/specifications/RBAC_PERMISSION_MATRIX.md docs/specifications/rbac.md
mv docs/specifications/API_SPECIFICATION.md docs/specifications/api.md
mv docs/specifications/TEST_STRATEGY_DOCUMENT.md docs/specifications/testing.md
```

### Phase 3: Update All Links

1. Update `docs/README.md` with new structure
2. Update all cross-references in documents
3. Update `.cursor/rules/` references
4. Verify all links work

### Phase 4: Create Category README Files

Each category folder needs a README.md with:
- Category overview
- Document list with descriptions
- Quick links
- Last updated dates

---

## Documentation Standards

### File Naming Conventions

**Guides:** `kebab-case.md`
- `getting-started.md`
- `development.md`
- `deployment.md`

**Specifications:** `kebab-case.md` (renamed from UPPER_SNAKE_CASE)
- `data-model.md` (was `DATA_MODEL_SPECIFICATION.md`)
- `rbac.md` (was `RBAC_PERMISSION_MATRIX.md`)
- `api.md` (was `API_SPECIFICATION.md`)

**Implementation Reports:** `UPPER_SNAKE_CASE.md`
- `IMPLEMENTATION_COMPLETE.md`
- `IMPLEMENTATION_SUMMARY.md`
- `MIGRATION_GUIDE.md`

**Architecture:** `kebab-case.md` or `UPPER_SNAKE_CASE.md` (consistent within folder)
- `system-design.md`
- `ARCHITECTURE_EVOLUTION_GUIDE.md`

### Single Source of Truth

**Each topic has ONE authoritative document:**

- ❌ `API_SPECIFICATION.md` + `api/endpoints.md` + `api/reference/API.md`
- ✅ `specifications/api.md` (authoritative) + `api/reference/endpoints.md` (detailed reference)

### Preventing Duplicates

**Before creating new documentation:**

1. Search existing docs for similar content
2. Check if topic exists in different folder
3. Verify if update is needed vs. new document
4. If similar content exists: update existing document
5. If new document needed: place in correct category folder

---

## Maintenance Workflow

### Document Lifecycle

1. **Draft** → Work in progress, marked `[DRAFT]`
2. **Active** → Published, linked from indexes, regularly reviewed
3. **Deprecated** → Marked with deprecation notice, links to replacement
4. **Archived** → Historical only, never updated, read-only reference

### Review Schedule

| Category | Owner | Review Frequency |
|----------|-------|------------------|
| Guides | Development Team | With code changes |
| API | Backend Team | With API changes |
| Architecture | Tech Leads | Quarterly |
| Specifications | Architects | With releases |
| Product Vision | Product Team | Quarterly |
| Personas | UX/Product | When roles change |
| Implementation | Implementation Team | Archive after completion |
| Processes | DevOps/Engineering | With process changes |

### Update Checklist

**Before updating documentation:**

- [ ] Check if document already exists
- [ ] Verify correct category folder
- [ ] Update folder's README.md index
- [ ] Add cross-references
- [ ] Update CHANGELOG.md if significant
- [ ] Notify document owner

---

## Category README Template

Each category folder should have a README.md:

```markdown
# [Category Name]

Brief description of category purpose.

## Quick Links

- [Document 1](./document-1.md) - Description
- [Document 2](./document-2.md) - Description

## Documents

| Document | Description | Last Updated | Owner |
|----------|-------------|--------------|-------|
| [Document 1](./document-1.md) | Description | 2025-01-27 | Team |
| [Document 2](./document-2.md) | Description | 2025-01-27 | Team |

## Related Documentation

- [Related Doc](../other-category/doc.md) - Description
```

---

## Enforcement

### Pre-Commit Checks

- New docs in correct category folder
- No duplicate filenames (case-insensitive)
- README.md updated in category folder
- Links are valid
- No versioned filenames (`*_v*.md`)

### CI/CD Checks

- All README.md files exist in category folders
- No broken internal links
- Documentation structure compliance
- No duplicate content (basic checks)

---

## References

- Documentation Organization Rule: `.cursor/rules/documentation-organization.mdc`
- File Organization: `.cursor/rules/file-organization.mdc`
- Project Structure: `.cursor/rules/project-structure.mdc`

---

**Status**: ✅ Standards defined  
**Next Step**: Execute migration plan (optional but recommended)

