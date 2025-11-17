# DDL-003: Rules Migration to .cursor/rules

**Status**: Accepted  
**Date**: 2025-01-28  
**Deciders**: Tech Leads & Documentation Team

## Context

Documentation rules exist in two locations:

- `docs/rules/` - Markdown documentation files
- `.cursor/rules/` - Cursor rule format (.mdc files)

This duplication creates confusion and maintenance burden. Rules should be in `.cursor/rules/` format for automatic application by Cursor AI, with historical/contextual content archived in DDLs if needed.

## Decision

**Migrate all applicable content from `docs/rules/` to `.cursor/rules/` format, then remove `docs/rules/` directory.**

For each file in `docs/rules/`:

1. If content can be rule format → Create/update `.cursor/rules/*.mdc`
2. If historical/contextual → Archive in DDL or delete
3. If no longer needed → Delete

## File-by-File Migration Plan

### `FILE_ORGANIZATION_RULES.md`

- **Action**: Content already exists in `.cursor/rules/file-organization.mdc`
- **Decision**: Delete (duplicate content)

### `DOCUMENTATION_ORGANIZATION.md`

- **Action**: Content already exists in `.cursor/rules/documentation-organization.mdc`
- **Decision**: Delete (duplicate content)

### `DOCUMENTATION_STANDARDS_SUMMARY.md`

- **Action**: Historical summary of implementation
- **Decision**: Archive in DDL-001 (governance ruleset) or delete

### `DOCUMENTATION_SOLUTIONS.md`

- **Action**: Historical analysis (wiki vs markdown decision)
- **Decision**: Archive in DDL or delete (decision already made, no ongoing value)

### `README_STRUCTURE.md`

- **Action**: Minimal content about root structure
- **Decision**: Content already in `.cursor/rules/documentation-organization.mdc`, delete

### `README.md` (rules index)

- **Action**: Index file
- **Decision**: Delete (no longer needed after migration)

## Rationale

1. **Single Source of Truth**: Rules in `.cursor/rules/` are automatically applied by Cursor AI
2. **Eliminates Duplication**: No need for both markdown and .mdc formats
3. **Reduces Maintenance**: One location to update rules
4. **Better Integration**: Cursor rules are integrated into AI workflow

## Consequences

### Positive

- Single location for all rules
- Automatic application by Cursor AI
- Reduced duplication
- Cleaner documentation structure

### Negative

- Historical context may be lost (mitigated by archiving in DDLs if needed)
- Requires updating any references to `docs/rules/`

## Implementation

✅ **Completed 2025-01-28:**

1. ✅ Verified `.cursor/rules/` files contain all necessary content
2. ✅ Updated references to `docs/rules/` files (DDLs reference for historical context only)
3. ✅ Deleted `docs/rules/` directory and all files:
   - `FILE_ORGANIZATION_RULES.md` - Content in `.cursor/rules/file-organization.mdc`
   - `DOCUMENTATION_ORGANIZATION.md` - Content in `.cursor/rules/documentation-organization.mdc`
   - `DOCUMENTATION_STANDARDS_SUMMARY.md` - Historical summary, archived in DDL-001
   - `DOCUMENTATION_SOLUTIONS.md` - Historical analysis, no ongoing value
   - `README_STRUCTURE.md` - Content in `.cursor/rules/documentation-organization.mdc`
   - `README.md` - Index file, no longer needed
4. ✅ Updated `docs/README.md` to remove references (see update-references phase)

## Related

- [DDL-001: Documentation Governance Ruleset](./ddl-001-documentation-governance-ruleset.md)
- `.cursor/rules/documentation-organization.mdc`
- `.cursor/rules/file-organization.mdc`

---

**Last Updated**: 2025-01-28
