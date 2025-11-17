# Documentation Decision Logs (DDL)

**Purpose**: Track smaller documentation evolution decisions, structure changes, and process improvements that don't warrant a full ADR.

## DDL vs ADR

### Use ADR for:

- Major architectural decisions
- Technology choices (databases, frameworks, libraries)
- Pattern changes (modifying layered architecture, adding new patterns)
- Integration decisions (adding new external services)
- Performance architecture (caching strategies, scaling approaches)
- Security architecture (authentication methods, authorization patterns)

### Use DDL for:

- Documentation structure changes
- Documentation process improvements
- Minor documentation evolution decisions
- Documentation retention policy changes
- Documentation organization decisions
- Documentation tooling decisions

## DDL Format

Each DDL follows this structure:

```markdown
# DDL-###: [Short Description]

**Status**: Proposed | Accepted | Deprecated | Superseded  
**Date**: YYYY-MM-DD  
**Deciders**: [Names/Roles]

## Context

[Describe the documentation situation that requires a decision]

## Decision

[State the documentation decision clearly]

## Rationale

[Explain why this decision was made]

## Consequences

[Positive and negative consequences of this decision]

## Related

- [Related ADRs](./../adr-###-*.md)
- [Related DDLs](./ddl-###-*.md)
```

## DDL Numbering

- Sequential numbering starting from 001
- Format: `ddl-###-short-description.md`
- Examples: `ddl-001-documentation-governance-ruleset.md`, `ddl-002-implementation-report-retention.md`

## DDL Index

| DDL                                                      | Title                                  | Status   | Date       |
| -------------------------------------------------------- | -------------------------------------- | -------- | ---------- |
| [DDL-001](./ddl-001-documentation-governance-ruleset.md) | Documentation Governance Ruleset       | Accepted | 2025-01-28 |
| [DDL-002](./ddl-002-implementation-report-retention.md)  | Implementation Report Retention Policy | Accepted | 2025-01-28 |
| [DDL-003](./ddl-003-rules-migration-to-cursor.md)        | Rules Migration to .cursor/rules       | Accepted | 2025-01-28 |

---

**Last Updated**: 2025-01-28  
**Maintained By**: Tech Leads & Documentation Team
