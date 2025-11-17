# KOMPASS Development Guide

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Development Workflow](#development-workflow)
4. [Testing Guide](#testing-guide)
5. [Debugging](#debugging)
6. [Common Issues](#common-issues)
7. [Tips & Best Practices](#tips--best-practices)

## Local Development Setup

### One-Command Setup

```bash
./scripts/setup-dev.sh
```

This script will:

- Check prerequisites (Node.js 20+, pnpm 8+)
- Install all dependencies
- Setup git hooks (Husky)
- Create environment files
- Build shared packages
- Run initial checks

### Manual Setup

If you prefer step-by-step:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup git hooks
pnpm prepare

# 3. Create environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Build shared package
cd packages/shared && pnpm build

# 5. Start services (Docker)
docker-compose up -d

# 6. Start development servers
pnpm dev
```

### Environment Variables

**Backend (.env):**

```env
NODE_ENV=development
PORT=3000
COUCHDB_URL=http://localhost:5984
COUCHDB_USER=admin
COUCHDB_PASSWORD=changeme
MEILISEARCH_URL=http://localhost:7700
JWT_SECRET=your-secret-key
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true
```

## Architecture Overview

### Monorepo Structure

```
kompass/
├── apps/
│   ├── backend/          # NestJS API (Port 3000)
│   │   └── src/
│   │       ├── modules/  # Domain modules
│   │       │   ├── customer/
│   │       │   ├── opportunity/
│   │       │   └── ...
│   │       ├── common/   # Shared utilities
│   │       └── database/ # DB configuration
│   │
│   └── frontend/         # React PWA (Port 5173)
│       └── src/
│           ├── features/ # Feature modules
│           │   ├── customer/
│           │   ├── opportunity/
│           │   └── ...
│           ├── components/ui/ # shadcn/ui
│           └── lib/      # Utilities
│
├── packages/
│   └── shared/           # Shared types & utilities
│       └── src/
│           ├── types/    # TypeScript types
│           ├── validation/ # Validation rules
│           ├── constants/ # Constants
│           └── utils/    # Pure functions
│
└── tests/
    ├── e2e/              # Playwright tests
    ├── integration/      # API tests
    └── performance/      # Load tests
```

### Technology Decisions

| Purpose            | Technology            | Why                        |
| ------------------ | --------------------- | -------------------------- |
| Backend Framework  | NestJS                | TypeScript, DI, modular    |
| Frontend Framework | React 18              | Component-based, ecosystem |
| Database           | CouchDB               | Offline-first, sync        |
| Search             | MeiliSearch           | Fast, typo-tolerant        |
| Auth               | Keycloak              | RBAC, SSO-ready            |
| State (Global)     | Redux Toolkit         | Predictable, DevTools      |
| State (Local)      | Zustand               | Simple, fast               |
| Server State       | React Query           | Caching, sync              |
| UI Components      | shadcn/ui             | Accessible, customizable   |
| Forms              | react-hook-form       | Performance, validation    |
| Validation         | Zod + class-validator | Type-safe                  |
| Testing            | Jest + Playwright     | Coverage, E2E              |

## Development Workflow

### Day-to-Day Development

```bash
# Start everything
pnpm dev

# Or start individually:
cd apps/backend && pnpm dev    # Backend only
cd apps/frontend && pnpm dev   # Frontend only

# Watch tests
pnpm test:watch

# Type check (all workspaces, builds shared first via Turbo)
pnpm type-check

# Lint with ESLint (allow warnings locally)
pnpm lint

# Lint with ESLint in CI mode (no warnings allowed)
pnpm lint:ci
```

### Quality Gates

KOMPASS uses a **three-layer defense strategy** to ensure code quality:

1. **Pre-Commit Hook** (fast feedback on every commit)
   - File organization checks
   - lint-staged (auto-fixes staged files)
   - Format check (read-only)
   - Type-check
   - Branch naming

2. **Pre-Push Hook** (full codebase, CI parity)
   - Full lint (no --fix, matches CI)
   - Format check (read-only, matches CI)
   - Type-check (matches CI)
   - Unit tests with coverage thresholds
   - Security audit

3. **CI/CD Pipeline** (final gate)
   - All pre-push checks
   - Integration/E2E tests
   - Build verification
   - Documentation guard

**Coverage Thresholds:**

- Global: 80% branches, functions, lines, statements
- Backend services: 90% branches, functions, lines, statements
- Frontend components: 80% branches, functions, lines, statements

**If quality checks fail:**

- ESLint: Run `pnpm --filter @kompass/backend lint:fix` or fix manually
- Format: Run `pnpm format` to auto-fix
- Type-check: Fix TypeScript errors
- Coverage: Add tests to meet thresholds
- Security: Run `pnpm audit --fix` or update vulnerable packages

**Run all quality checks locally:**

```bash
# Run all checks in CI order
./scripts/quality-check.sh

# Validate hooks match CI
./scripts/validate-pre-commit.sh
```

See `.cursor/rules/quality-gates.mdc` for complete documentation.

### Generate New Entity

```bash
# Complete CRUD scaffolding (backend + frontend)
./scripts/generate-entity.sh product

# Backend module only
./scripts/generate-module.sh product

# Frontend feature only
./scripts/generate-feature.sh product
```

This generates:

- ✅ Entity interface with all audit fields
- ✅ Repository (CouchDB operations)
- ✅ Service (business logic)
- ✅ Controller (API endpoints with RBAC)
- ✅ DTOs (create, update, response)
- ✅ Unit tests
- ✅ Frontend components (shadcn/ui)
- ✅ Hooks (React Query + offline)
- ✅ Store (Redux Toolkit slice)
- ✅ API service (REST + PouchDB)

### Add shadcn/ui Component

```bash
cd apps/frontend

# Search available components
pnpm dlx shadcn-ui@latest add

# Install specific component
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add toast

# Components are added to src/components/ui/
```

**Never create custom UI components!** Always use shadcn/ui.

### Offline Development

```bash
# Test offline mode in browser:
# 1. Open DevTools (F12)
# 2. Go to Network tab
# 3. Select "Offline" from throttling dropdown
# 4. Test app functionality

# Or use Playwright:
test('works offline', async ({ page, context }) => {
  await context.setOffline(true);
  // ... test offline functionality
});
```

## Testing Guide

### Running Tests

```bash
# All tests
pnpm test

# Unit tests only (fast)
pnpm test:unit

# Watch mode
pnpm test:watch

# Integration tests (requires services)
docker-compose up -d
pnpm test:integration

# E2E tests
pnpm test:e2e

# Specific test file
pnpm test customer.spec.ts

# With coverage
pnpm test:unit --coverage

# Coverage report
open coverage/lcov-report/index.html
```

### Writing Tests

**Unit Test Example:**

```typescript
// apps/backend/src/modules/customer/__tests__/customer.service.spec.ts
import { Test } from '@nestjs/testing';
import { CustomerService } from '../customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CustomerService /* mocks */],
    }).compile();

    service = module.get(CustomerService);
  });

  it('should create customer', async () => {
    const result = await service.create(dto, mockUser);
    expect(result).toBeDefined();
  });
});
```

**E2E Test Example:**

```typescript
// tests/e2e/customer/create-customer.spec.ts
import { test, expect } from '@playwright/test';

test('User can create customer', async ({ page }) => {
  await page.goto('/customers');
  await page.click('button:has-text("New")');
  await page.fill('[name="name"]', 'Test Customer');
  await page.click('button:has-text("Save")');

  await expect(page.locator('.toast-success')).toBeVisible();
});
```

### Test Data

Use factories for consistent test data:

```typescript
// tests/e2e/helpers/test-data-factory.ts
export function createTestCustomer(overrides = {}) {
  return {
    _id: `customer-${faker.string.uuid()}`,
    type: 'customer',
    name: faker.company.name(),
    vatNumber: `DE${faker.string.numeric(9)}`,
    ...overrides,
  };
}
```

## Debugging

### Backend Debugging (NestJS)

```bash
# Start in debug mode
cd apps/backend
pnpm start:debug

# VS Code launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to NestJS",
  "port": 9229,
  "restart": true,
  "sourceMaps": true
}
```

### Frontend Debugging (React)

```bash
# Development server with source maps
cd apps/frontend
pnpm dev

# Use React DevTools extension
# Use Redux DevTools extension
```

### Database Debugging

```bash
# CouchDB Fauxton UI
open http://localhost:5984/_utils

# Query from CLI
curl http://admin:password@localhost:5984/kompass/_all_docs

# PouchDB in browser console
const db = new PouchDB('customers');
await db.allDocs({ include_docs: true });
```

### Logging

```typescript
// Backend - use NestJS Logger
import { Logger } from '@nestjs/common';

const logger = new Logger('CustomerService');
logger.log('Customer created', { customerId });
logger.error('Failed to create customer', { error });

// Frontend - use console (removed in production)
console.log('Debug info:', data);
console.error('Error:', error);
```

## Common Issues

### Issue: "Module not found"

```bash
# Solution: Rebuild shared package
cd packages/shared
pnpm build

# Or rebuild everything
pnpm turbo run build --force
```

### Issue: "Port already in use"

```bash
# Find process on port 3000
lsof -ti:3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Issue: "CouchDB connection failed"

```bash
# Check if CouchDB is running
docker-compose ps

# Start CouchDB
docker-compose up -d couchdb

# Check logs
docker-compose logs couchdb
```

### Issue: "TypeScript errors after pull"

```bash
# Clean and reinstall
pnpm clean
rm -rf node_modules
pnpm install

# Rebuild packages
pnpm build
```

### Issue: "Tests failing in CI but passing locally"

**This should never happen!** If it does:

1. **Run quality check script:**

   ```bash
   ./scripts/quality-check.sh
   ```

   This runs the EXACT same checks as CI.

2. **Validate hooks match CI:**

   ```bash
   ./scripts/validate-pre-commit.sh
   ```

3. **Common causes:**
   - Node.js version mismatch (use 20+)
   - Environment variables missing
   - Test data isolation issues
   - Race conditions
   - Hardcoded paths
   - Coverage thresholds not met locally (check coverage report)

4. **If hooks are bypassed:**
   - Never use `--no-verify` unless absolutely necessary
   - CI will still catch issues, but it's better to fix locally first

## Tips & Best Practices

### Performance

```typescript
// ✅ DO: Memoize expensive calculations
const statistics = useMemo(() => {
  return calculateStatistics(customers);
}, [customers]);

// ✅ DO: Lazy load routes
const CustomerPage = lazy(
  () => import('./features/customer/pages/CustomerPage')
);

// ✅ DO: Virtual scrolling for large lists (>100 items)
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Offline-First

```typescript
// ✅ DO: Always check online status
const { isOnline } = useOfflineStore();

if (!isOnline) {
  // Save to local PouchDB
  await localDB.put(data);
} else {
  // Save to API
  await api.post('/customers', data);
}

// ✅ DO: Queue changes for sync
if (!isOnline) {
  await queueForSync(change);
}
```

### RBAC

```typescript
// ✅ DO: Always check permissions
@UseGuards(JwtAuthGuard, RbacGuard)
@RequirePermission('Customer', 'READ')
async findOne(@Param('id') id: string) {
  // Handler code
}

// ✅ DO: Filter fields by role
private filterFieldsByRole(entity: Customer, role: string) {
  if (role === 'ADM') {
    delete entity.profitMargin; // ADM can't see profit margin
  }
  return entity;
}
```

### Git Workflow

```bash
# ✅ DO: Small, focused commits
git commit -m "feat(customer): add email validation"

# ✅ DO: Pull before pushing
git pull origin main
git push origin feature/my-feature

# ❌ DON'T: Commit directly to main
git checkout main
git commit  # ❌ Use feature branches

# ❌ DON'T: Force push
git push --force  # ❌ Never force push

# ❌ DON'T: Skip hooks
git commit --no-verify  # ❌ Let hooks run
```

### File Organization

```bash
# ✅ DO: Colocate tests
customer/
├── customer.service.ts
├── customer.service.spec.ts  ✅ Same directory
└── ...

# ✅ DO: Group by feature
features/
├── customer/
│   ├── components/
│   ├── hooks/
│   └── store/
└── opportunity/
    ├── components/
    ├── hooks/
    └── store/

# ❌ DON'T: Duplicate files
customer.service.ts
customer.service.old.ts  ❌ Use git for versions
customer.service.backup.ts  ❌ Never do this
```

## IDE Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- TypeScript
- Jest
- Playwright Test for VS Code
- Tailwind CSS IntelliSense
- GitLens

### VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.eol": "\n"
}
```

## Useful Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm build                  # Build all apps
pnpm clean                  # Clean all build artifacts

# Testing
pnpm test                   # Run all tests
pnpm test:unit             # Unit tests only
pnpm test:e2e              # E2E tests
pnpm test:watch            # Watch mode

# Code Quality
pnpm lint                  # Run ESLint (no --fix, matches CI)
pnpm format                # Format with Prettier
pnpm format:check          # Check formatting (read-only, matches CI)
pnpm type-check            # TypeScript check

# Run all quality checks (matches CI exactly)
./scripts/quality-check.sh

# Validate hooks match CI requirements
./scripts/validate-pre-commit.sh

# Database
docker-compose up -d       # Start services
docker-compose down        # Stop services
docker-compose logs -f     # View logs

# Scaffolding
./scripts/generate-entity.sh product    # Generate entity
./scripts/generate-module.sh invoice    # Backend module
./scripts/generate-feature.sh project   # Frontend feature
```

## Quick Reference

### Cursor AI Rules

The `.cursorrules` file enforces:

- ✅ No `any` types (use `unknown`)
- ✅ Explicit return types
- ✅ shadcn/ui components only
- ✅ Repository pattern for data access
- ✅ RBAC guards on all endpoints
- ✅ Audit trail on all modifications
- ✅ No file duplication (use git)
- ✅ Conventional commit messages
- ✅ 80% test coverage minimum

### RBAC Roles

| Role      | Description                  | Permissions                                     |
| --------- | ---------------------------- | ----------------------------------------------- |
| **ADM**   | Außendienst (Field Sales)    | Own customers, opportunities, protocols         |
| **INNEN** | Innendienst (Inside Sales)   | All customers, create offers, view projects     |
| **PLAN**  | Planungsabteilung (Planning) | Assigned projects, all tasks, capacity planning |
| **BUCH**  | Buchhaltung (Accounting)     | All invoices, payments, financial reports       |
| **GF**    | Geschäftsführer (Executive)  | Full access, approve high-value items           |
| **ADMIN** | System Administrator         | Full system access, user management             |

See `docs/reviews/RBAC_PERMISSION_MATRIX.md` for complete matrix.

### Domain Entities

**Core entities with GoBD compliance:**

- **Customer** - Business customers
- **Contact** - Customer contacts
- **Location** - Customer locations
- **Opportunity** - Sales pipeline
- **Offer** - Versioned quotes
- **Project** - Active projects (immutable after start)
- **Task** - Project tasks
- **Invoice** - Invoices (immutable after finalization)
- **Payment** - Payment records (always immutable)
- **Protocol** - Activity logs (immutable after 24h)

### Validation Rules

From `docs/specifications/data-model.md`:

```typescript
// Customer validation
companyName: 2-200 chars, /^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/
vatNumber: /^DE\d{9}$/ (optional)
email: Valid email format (optional)
phone: /^[\+]?[0-9\s\-()]+$/, 7-20 chars (optional)
creditLimit: 0 - 1,000,000 EUR (optional)

// Opportunity validation
estimatedValue: 0 - 10,000,000 EUR (required)
probability: 0-100, step 5 (required)
status: Enum with valid transitions

// Project validation
plannedStartDate: -30 to +365 days from today
plannedEndDate: > plannedStartDate
budget: Should be ≤ contractValue (warning if higher)

// Invoice validation (GoBD)
invoiceDate: -7 days to today (immutable after finalization)
totalAmount: Must equal subtotal + tax - discount
```

### API Conventions

```typescript
// RESTful endpoints
GET    /api/v1/customers      # List
GET    /api/v1/customers/:id  # Get one
POST   /api/v1/customers      # Create
PUT    /api/v1/customers/:id  # Update
DELETE /api/v1/customers/:id  # Delete

// Error responses (RFC 7807)
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Company name must be 2-200 characters",
  "errors": [/* field errors */]
}
```

## Resources

- **Architecture:** `docs/architecture/README.md` (see v1 comprehensive & v2 pragmatic)
- **Data Model:** `docs/specifications/data-model.md`
- **API Spec:** `docs/specifications/api-specification.md`
- **Test Strategy:** `docs/specifications/test-strategy.md`
- **NFRs:** `docs/specifications/nfr-specification.md`
- **RBAC Matrix:** `docs/specifications/rbac-permissions.md`

---

**Happy coding! 🚀**
