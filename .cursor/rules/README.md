# Cursor Rules Directory

This directory contains structured coding rules for the KOMPASS project in `.mdc` format. These rules enforce architectural decisions, coding standards, domain models, and development processes.

**Last Audit:** 2025-01-27 - All rules verified and production-ready ✅

## Rule File Format

All rule files use the `.mdc` (Markdown Cursor) format with YAML frontmatter:

```yaml
---
description: Clear, concise description of what the rule covers
globs: ['**/*.ts', '**/*.tsx'] # Array format - files this rule applies to
alwaysApply: true # Whether rule should always be active
---
```

### YAML Frontmatter Fields

- **`description`**: 50-200 character description with keywords (e.g., "NestJS", "React", "TypeScript")
- **`globs`**: Array of file patterns (always use array format, not space-separated)
- **`alwaysApply`**: Boolean - `true` for foundational rules, `false` for context-specific rules

## Rule Files Overview

### Core Architecture & Structure

- **project-structure.mdc** - Monorepo structure, domain-driven organization, file naming
- **architecture.mdc** - Layered architecture (Controller → Service → Repository), dependency injection
- **typescript-standards.mdc** - Strict TypeScript, type safety, immutability, code quality

### Domain & Data

- **domain-model.mdc** - Entity structure, validation rules, GoBD compliance, RBAC checks
- **offline-first.mdc** - CouchDB/PouchDB patterns, sync queues, conflict resolution, storage quotas

### UI & Frontend

- **ui-components.mdc** - shadcn/ui and RadixUI ONLY, accessibility (WCAG 2.1 AA), mobile-first
- **ui-ux-documentation-sync.mdc** - CRITICAL: GitHub UI reference repository checks and documentation updates for UI/UX changes
- **reusable-components.mdc** - Code extraction patterns, shared utilities, anti-patterns

### Testing & Quality

- **testing-strategy.mdc** - 70/20/10 test pyramid, coverage requirements (80% overall, 90% services)
- **code-review.mdc** - Review checklist, security focus areas, review best practices

### Security & Compliance

- **security-compliance.mdc** - RBAC guards, DSGVO compliance, GoBD immutability, audit trails
- **security-best-practices.mdc** - Rate limiting, CSRF protection, XSS prevention, input sanitization, CouchDB security

### API & Integration

- **api-design.mdc** - RESTful conventions, OpenAPI documentation, error responses (RFC 7807)
- **linear-integration.mdc** - Linear issue tracking, commit messages, branch naming, PR requirements

### Development Workflow

- **git-workflow.mdc** - Conventional commits, branch naming, PR standards, pre-commit hooks
- **error-handling.mdc** - Structured error responses, secure logging, correlation IDs
- **dependency-management.mdc** - Vulnerability scanning, dependency updates, license checks
- **graphiti-memory.mdc** - Graphiti MCP memory usage - when and how to store architectural decisions, infrastructure changes, routing updates, refactors, and bug fixes
- **mcp-tool-usage.mdc** - MCP tool usage overview - prioritization hierarchy, decision tree, best practices, and references to detailed tool-specific rules
- **mcp-tool-usage-documentation.mdc** - Ref, Context7, and Perplexity for API documentation lookup, version-specific docs, and web search
- **mcp-tool-usage-code-analysis.mdc** - Semgrep for security scanning, bug detection, and code quality analysis
- **mcp-tool-usage-automation.mdc** - Playwright, Firecrawl, and n8n for browser testing, web scraping, and workflow automation
- **mcp-tool-usage-ui-integration.mdc** - ShadCN, GitHub UI Reference, GitHub, Linear, and Graphiti for component generation, UI pattern reference, and project management

### Performance

- **performance.mdc** - Lazy loading, memoization, virtual scrolling, bundle optimization

### Security Rules (CodeGuard)

- **23 codeguard-\*.mdc files** - Security rules from CodeGuard (DO NOT MODIFY)
  - Cryptographic algorithms and certificates
  - Input validation and injection defense
  - Authentication, authorization, and session management
  - Client-side web security, data storage, and privacy
  - Framework-specific security guides
  - See [RULE_AUDIT.md](./RULE_AUDIT.md) for complete list

## How Rules Are Applied

**IMPORTANT**: Cursor AI automatically detects and applies all `.mdc` files in this directory. Rules are applied based on:

1. **YAML Frontmatter**: Cursor reads the `description`, `globs`, and `alwaysApply` fields
2. **File Matching**: Rules with `globs` patterns are applied when matching files are open
3. **Always Active**: Rules with `alwaysApply: true` are always in context
4. **Backwards Compatibility**: Rules are also included in `.cursorrules` for legacy support

### Automatic Application

Cursor AI automatically:

- ✅ Applies rules based on file patterns (`globs`)
- ✅ Keeps foundational rules active (`alwaysApply: true`)
- ✅ Suggests corrections based on rule patterns
- ✅ Prevents violations during code generation

### Manual Regeneration of .cursorrules

**Note**: The `.cursorrules` file is deprecated but maintained for backwards compatibility. All rules are now in `.mdc` format for automatic detection.

To regenerate `.cursorrules` from `.mdc` files:

### Updating Rules

1. **Edit the relevant `.mdc` file** in `.cursor/rules/`
2. **Regenerate `.cursorrules`** by running:
   ```bash
   ./scripts/update-cursorrules.sh
   ```
3. **Commit both files** to git

### Manual Regeneration

If you need to manually regenerate `.cursorrules`:

```bash
# From project root
./scripts/update-cursorrules.sh
```

This script:

- Reads all `.mdc` files from `.cursor/rules/`
- Concatenates them into `.cursorrules`
- Adds section headers for organization
- Updates the "Last Updated" date

## Rule Categories

### Security (Critical)

- Input validation and sanitization
- Rate limiting and CSRF protection
- XSS and NoSQL injection prevention
- Secure error handling (no stack traces in production)
- Environment variable validation
- HTTPS enforcement
- CouchDB security configuration

### Compliance

- DSGVO: Consent management, data retention, anonymization
- GoBD: Immutability after finalization, change logs, tamper detection
- RBAC: Permission checks on all endpoints, field-level filtering

### Code Quality

- TypeScript strict mode (no 'any')
- Function length ≤ 50 lines
- Cyclomatic complexity ≤ 10
- No code duplication
- Comprehensive testing

### Architecture

- Layered architecture enforcement
- Dependency injection with interfaces
- Repository pattern for data access
- Shared code in `packages/shared/`

## Usage

These rules are automatically loaded by Cursor AI. When coding, Cursor will:

1. Enforce these rules automatically
2. Suggest corrections based on these patterns
3. Prevent common mistakes and security issues
4. Guide code structure and organization

## Rule Statistics

- **Total Rule Files**: 47 (24 project rules + 23 codeguard security rules)
- **Code Examples**: 229+ ✅ CORRECT / ❌ WRONG examples
- **Coverage**: All major areas covered (architecture, security, testing, API design, UI/UX sync, memory management, etc.)
- **Status**: ✅ Production-ready, fully audited

## Audit Information

See [RULE_AUDIT.md](./RULE_AUDIT.md) for:

- Complete audit report
- Verification checklist
- Best practices verification
- Recommendations

**Last Audit**: 2025-01-27  
**Status**: ✅ All rules verified and production-ready

## Codeguard Rules

⚠️ **IMPORTANT**: The 23 `codeguard-*.mdc` files are security rules from CodeGuard and **MUST NOT be modified**. These rules:

- Have `version` field in YAML frontmatter
- Are automatically applied by Cursor AI
- Cover critical security patterns (crypto, injection, auth, etc.)
- Are maintained by CodeGuard, not the project team

## Related Documentation

- Architecture: `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
- Data Model: `docs/reviews/DATA_MODEL_SPECIFICATION.md`
- NFRs: `docs/reviews/NFR_SPECIFICATION.md`
- Test Strategy: `docs/reviews/TEST_STRATEGY_DOCUMENT.md`
- RBAC Matrix: `docs/reviews/RBAC_PERMISSION_MATRIX.md`
- API Spec: `docs/reviews/API_SPECIFICATION.md`
