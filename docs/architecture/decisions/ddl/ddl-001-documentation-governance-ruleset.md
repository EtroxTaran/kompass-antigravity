# DDL-001: Documentation Governance Ruleset

**Status**: Accepted  
**Date**: 2025-01-28  
**Deciders**: Tech Leads & Documentation Team

## Context

The KOMPASS project documentation has grown organically, resulting in:

- Duplicate content across multiple files
- Outdated implementation reports
- Rules scattered between `docs/rules/` and `.cursor/rules/`
- No clear governance on what to document vs. what not to document
- No retention policies for temporary documentation
- Version numbers in filenames (should use Git for versioning)

A comprehensive governance ruleset is needed to ensure documentation remains clean, minimal, and high-value.

## Decision

Establish a comprehensive documentation governance ruleset that defines:

1. What should be documented
2. What should NOT be documented
3. Rules for evolving documentation
4. Folder structure and naming conventions
5. Documentation lifecycle
6. Retention policies

## What Should Be Documented

### Long-Term Value Documentation

**Vision & Strategy:**

- Product vision documents
- Technology roadmaps
- Strategic decisions
- User personas (evolve, don't remove)

**Architecture & Design:**

- System architecture
- Architecture Decision Records (ADRs)
- Design patterns
- Data models
- API specifications

**Domain Knowledge:**

- Business rules
- Domain constraints
- Non-obvious reasoning
- Long-term trade-offs

**Stable Workflows:**

- Development workflows (that don't change frequently)
- Deployment procedures
- Migration guides (until superseded)
- Setup documentation (keep current)

**Decision Tracking:**

- ADRs for major architectural/strategic decisions
- DDLs for documentation evolution decisions
- Evolution reasoning stored in Graphiti Memory

## What Should NOT Be Documented

### Temporary/Transient Content

**Temporary Decisions:**

- Implementation notes written during coding
- Temporary workarounds
- Experimental approaches (unless they become permanent)

**Transient Implementation Details:**

- Code that is self-explanatory
- Obvious code behavior
- Implementation reports >6 months old (unless ongoing relevance)

**Comments That Belong in Code:**

- Function-level documentation → Use JSDoc in code
- API endpoint details → Use OpenAPI/Swagger annotations
- Type definitions → Use TypeScript comments

**Duplication:**

- Duplication of existing ADR/architecture content
- Multiple documents for the same topic
- Versioned filenames (Git handles versioning)

**Outdated Content:**

- Implementation reports documenting completed work >6 months old
- Historical analysis documents (archive instead)
- Superseded migration guides

## Rules for Evolving Documentation

### Versioning

**NEVER rename files for versioning:**

- ❌ `architecture-v2.md`, `spec-v1.md`, `guide-2024.md`
- ✅ `architecture.md` (Git history is the versioning)

**Use Git for all versioning:**

- `git log --follow file.md` - See file history
- `git diff HEAD~1 file.md` - Compare versions
- `git revert` - Restore previous versions

### Decision Tracking

**For Major Changes:**

- Use ADRs for architectural/strategic decisions
- Store in `docs/architecture/decisions/`
- Format: `adr-###-short-description.md`

**For Documentation Evolution:**

- Use DDLs for documentation structure/process changes
- Store in `docs/architecture/decisions/ddl/`
- Format: `ddl-###-short-description.md`

**For Context & Reasoning:**

- Store in Graphiti Memory for cross-session awareness
- Update Linear issues when evolving important documents
- Keep documentation minimal, clean, and high-value

### Evolution of Protected Documents

**Personas:**

- Cannot be removed
- Cannot be replaced
- Can evolve gradually
- Evolution must be documented (DDL or Linear comment)
- Store evolution reasoning in Graphiti Memory

**Product Vision:**

- Cannot be removed
- Can evolve or expand
- No versioning in filename (Git handles this)
- Evolution should follow DDL entries or ADRs if strategic

**Architecture:**

- Must never be removed
- Only expanded or clarified
- No duplication
- Major structural changes → Create new ADR
- Link ADRs to maintain decision history

**Specifications:**

- Core specs are protected (data-model, rbac, api, nfr, test-strategy)
- Can evolve but maintain backward compatibility notes
- Use ADRs for breaking changes

## Folder Structure & Naming

### Standard Structure

```
docs/
├── README.md                    # Main index (REQUIRED)
├── CHANGELOG.md                 # Version history (OPTIONAL)
│
├── guides/                      # User and developer guides
├── api/                         # API documentation
├── architecture/                # Architecture documentation
│   ├── decisions/              # ADRs and DDLs
│   │   ├── adr-###-*.md       # Architecture Decision Records
│   │   └── ddl/               # Documentation Decision Logs
│   ├── evolution/              # Architecture evolution guides
│   └── ai-extensions/          # AI extensions architecture
├── specifications/              # Technical specifications
├── product-vision/              # Product vision (PROTECTED)
├── personas/                    # User personas (PROTECTED)
├── implementation/              # Implementation reports
│   ├── reports/                # Implementation reports (6 month retention)
│   ├── migrations/             # Migration guides (until superseded)
│   └── setup/                  # Setup documentation (keep current)
├── deployment/                  # Deployment procedures
└── processes/                   # Development processes
```

### Naming Conventions

**Guides:** `kebab-case.md`

- `getting-started.md`, `development.md`, `deployment.md`

**Specifications:** `kebab-case.md`

- `data-model.md`, `rbac-permissions.md`, `api-specification.md`

**Implementation Reports:** `UPPER_SNAKE_CASE.md`

- `IMPLEMENTATION_COMPLETE.md`, `MIGRATION_GUIDE.md`

**ADRs:** `adr-###-short-description.md`

- `adr-001-use-nestjs.md`, `adr-021-keycloak-authentication.md`

**DDLs:** `ddl-###-short-description.md`

- `ddl-001-documentation-governance-ruleset.md`

**Architecture:** `kebab-case.md` or consistent within folder

- `system-architecture.md`, `ARCHITECTURE_EVOLUTION_GUIDE.md`

### Single Source of Truth

**Each topic has ONE authoritative document:**

- ❌ `data-model.md` + `DATA_MODEL_SPECIFICATION.md` (duplicate)
- ✅ `specifications/data-model.md` (authoritative)

## Documentation Lifecycle

### Lifecycle Stages

1. **Draft** (`[DRAFT]` in title)
   - Work in progress
   - Not linked from main indexes
   - Can be in feature branch

2. **Active**
   - Published and maintained
   - Linked from indexes
   - Regularly reviewed per schedule

3. **Deprecated**
   - Marked with deprecation notice
   - Links to replacement document
   - Will be removed after migration period

4. **Archived**
   - Historical only
   - Never updated
   - Read-only reference
   - Moved to archive location if needed

5. **Deleted**
   - No longer needed
   - Removed after extraction of key decisions to ADRs/DDLs
   - Key context stored in Graphiti Memory if important

## Retention Policies

### Implementation Reports

**Retention:** 6 months from implementation date

**After 6 months:**

- Extract key decisions to DDLs or ADRs
- Store important context in Graphiti Memory
- Delete the report file

**Exceptions (Keep):**

- Reports documenting ongoing systems
- Reports with unique historical value (archive instead)

### Migration Guides

**Retention:** Until superseded

- Keep active migration guides
- Archive superseded guides
- Mark deprecated guides with notice

### Setup Documentation

**Retention:** Keep current, update with changes

- Always keep latest setup docs
- Update when environment changes
- Archive old versions if major changes

### ADRs/DDLs

**Retention:** Permanent

- Never delete ADRs or DDLs
- Can be superseded (link to new ADR/DDL)
- Maintain decision history

### Personas/Vision/Architecture

**Retention:** Permanent (evolve, don't remove)

- Never delete protected documents
- Evolve gradually
- Document evolution in DDLs or ADRs

## Enforcement Mechanisms

### Pre-Commit Hooks

Check for:

- Versioned filenames (`*_v*.md`, `*-v*.md`)
- Documentation files in root (except README.md, CHANGELOG.md)
- Forbidden file patterns (backup, old, copy, etc.)

### CI/CD Checks

Validate:

- Documentation structure compliance
- No broken internal links
- All README.md files exist in category folders
- No duplicate content (basic checks)

### Code Review Checklist

Reviewers check:

- Document in correct category
- No duplicates created
- README.md updated
- Cross-references added
- No versioned filenames
- Retention policy followed

## Rationale

1. **Minimal Documentation**: Reduces maintenance burden, improves discoverability
2. **Git-Based Versioning**: Single source of truth, clear history, no filename confusion
3. **Decision Tracking**: ADRs for major decisions, DDLs for documentation evolution
4. **Retention Policies**: Prevents documentation bloat, keeps only valuable content
5. **Protected Documents**: Ensures core knowledge (personas, vision, architecture) is never lost
6. **Lifecycle Management**: Clear stages prevent accumulation of outdated content

## Consequences

### Positive

- Clean, minimal documentation structure
- Easy to find relevant documentation
- Reduced maintenance burden
- Clear decision history via ADRs/DDLs
- No versioning confusion (Git handles it)

### Negative

- Requires discipline to follow retention policies
- May lose some historical context (mitigated by Graphiti Memory)
- Initial cleanup effort required

## Related

- [ADR-020: Unified Architecture Document](./../adr-020-unified-architecture-document.md)
- [DDL-002: Implementation Report Retention Policy](./ddl-002-implementation-report-retention.md)
- [DDL-003: Rules Migration to .cursor/rules](./ddl-003-rules-migration-to-cursor.md)

---

**Last Updated**: 2025-01-28  
**Next Review**: Q2 2025
