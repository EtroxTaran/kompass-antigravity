# KOMPASS Cursor Environment Usage Guide

## Overview

This guide demonstrates how the `.cursorrules` file enforces KOMPASS architecture, coding standards, and best practices.

## What the Rules Enforce

### 1. No File Duplication ✅

**❌ PREVENTED:**
```
customer.service.ts
customer.service.old.ts      # ❌ Cursor will warn
customer.service.backup.ts   # ❌ Cursor will prevent
customer.service.v2.ts       # ❌ Cursor will suggest git
```

**✅ GUIDED:**
```bash
# Cursor will suggest:
"Use git for versioning instead:
git commit -m 'feat(customer): add validation'
git log customer.service.ts  # View history
git revert HEAD  # Undo if needed"
```

### 2. No `any` Type ✅

**❌ PREVENTED:**
```typescript
// Cursor will show error
function processData(data: any) {  // ❌
  console.log(data);
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
function processData(data: unknown): void {  // ✅
  if (typeof data === 'string') {
    console.log(data);
  }
}
```

### 3. Explicit Return Types ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
async function getCustomer(id: string) {  // ❌ Missing return type
  return await repository.findById(id);
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
async function getCustomer(id: string): Promise<Customer> {  // ✅
  return await repository.findById(id);
}
```

### 4. shadcn/ui Components Only ✅

**❌ PREVENTED:**
```tsx
// Cursor will block
const CustomButton = styled.button`  // ❌
  background: blue;
  padding: 10px;
`;

function MyButton() {  // ❌
  return <button className="my-custom-btn">Click</button>;
}
```

**✅ GUIDED:**
```tsx
// Cursor will suggest:
import { Button } from '@/components/ui/button';  // ✅

function MyComponent() {
  return <Button variant="default">Click</Button>;
}

// If component doesn't exist:
// "Run: pnpm dlx shadcn-ui@latest add button"
```

### 5. Repository Pattern Required ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
@Injectable()
export class CustomerService {
  async findById(id: string) {
    return await nano.get(id);  // ❌ Direct DB access
  }
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository  // ✅
  ) {}
  
  async findById(id: string): Promise<Customer> {
    return await this.repository.findById(id);  // ✅
  }
}
```

### 6. RBAC Guards Required ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
@Controller('customers')
export class CustomerController {
  @Get(':id')  // ❌ No guards!
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
@Controller('customers')
@UseGuards(JwtAuthGuard, RbacGuard)  // ✅
export class CustomerController {
  @Get(':id')
  @RequirePermission('Customer', 'READ')  // ✅
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User  // ✅
  ) {
    return this.service.findById(id, user);
  }
}
```

### 7. Audit Fields Required ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
interface Customer {
  _id: string;
  _rev: string;
  name: string;  // ❌ Missing audit fields
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
interface Customer extends BaseEntity {  // ✅
  _id: string;
  _rev: string;
  type: 'customer';  // ✅
  name: string;
  // Audit fields inherited from BaseEntity:
  createdBy: string;  // ✅
  createdAt: Date;  // ✅
  modifiedBy: string;  // ✅
  modifiedAt: Date;  // ✅
  version: number;  // ✅
}
```

### 8. Test Colocation ✅

**❌ PREVENTED:**
```
src/
├── services/
│   └── customer.service.ts
└── tests/
    └── customer.service.spec.ts  # ❌ Wrong location
```

**✅ GUIDED:**
```
src/
└── services/
    ├── customer.service.ts
    └── customer.service.spec.ts  # ✅ Colocated
```

### 9. Immutability for Finalized Entities ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
async function updateInvoice(invoice: Invoice) {
  if (invoice.finalized) {
    invoice.totalAmount = 5000;  // ❌ Modifying immutable field
    await db.put(invoice);
  }
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
async function updateInvoice(
  invoice: Invoice,
  updates: Partial<Invoice>,
  user: User
) {
  if (invoice.finalized) {
    // Check immutable fields
    const immutableFields = ['invoiceNumber', 'totalAmount'];
    const changedImmutable = immutableFields.filter(
      field => updates[field] !== undefined
    );
    
    if (changedImmutable.length > 0) {
      if (user.role !== 'GF') {  // ✅
        throw new ForbiddenException('Requires GF approval');
      }
      
      // Log correction
      invoice.changeLog.push({  // ✅
        field: changedImmutable[0],
        oldValue: invoice[changedImmutable[0]],
        newValue: updates[changedImmutable[0]],
        changedBy: user.id,
        changedAt: new Date(),
        reason: 'Correction by GF',
        approvedBy: user.id,
      });
    }
  }
}
```

### 10. Offline-First Pattern ✅

**❌ PREVENTED:**
```typescript
// Cursor will warn
async function getCustomer(id: string) {
  return fetch(`/api/customers/${id}`);  // ❌ No offline support
}
```

**✅ GUIDED:**
```typescript
// Cursor will suggest:
async function getCustomer(id: string) {
  // Try local first (offline-first)  // ✅
  const local = await localDB.get(id);
  
  if (local) {
    if (navigator.onLine) {
      // Sync in background
      syncCustomer(id).catch(console.error);
    }
    return local;
  }
  
  // Fetch from API if not in local
  if (!navigator.onLine) {
    throw new Error('Customer not available offline');
  }
  
  const remote = await fetch(`/api/customers/${id}`);
  await localDB.put(remote);  // Save for offline
  
  return remote;
}
```

## Cursor AI Assistant Examples

### Example 1: Creating a New Component

**You ask:** "Create a button component for saving customers"

**Cursor will:**
1. ❌ Refuse to create custom button
2. ✅ Suggest using shadcn/ui Button
3. ✅ Provide installation command
4. ✅ Show usage example

```tsx
// Cursor response:
"I'll use shadcn/ui Button component instead of creating a custom one.
First, install it:

  pnpm dlx shadcn-ui@latest add button

Then use it like this:

import { Button } from '@/components/ui/button';

export function SaveCustomerButton({ onClick, isLoading }) {
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      aria-label='Save customer'
    >
      {isLoading ? 'Saving...' : 'Save Customer'}
    </Button>
  );
}
"
```

### Example 2: Creating a New Service

**You ask:** "Create a service to fetch customers"

**Cursor will:**
1. ✅ Follow repository pattern
2. ✅ Add RBAC checks
3. ✅ Include offline support
4. ✅ Add audit trail
5. ✅ Generate with all required imports

### Example 3: Creating an Entity

**You ask:** "Create a Product entity"

**Cursor will:**
1. ✅ Suggest using scaffold: `./scripts/generate-entity.sh product`
2. ✅ Include all audit fields
3. ✅ Add validation comments
4. ✅ Follow BaseEntity interface
5. ✅ Add type guards

## Scaffolding Examples

### Generate Complete Entity

```bash
# This creates backend + frontend + shared types
./scripts/generate-entity.sh product

# Generated structure:
packages/shared/src/types/entities/product.ts
apps/backend/src/modules/product/...
apps/frontend/src/features/product/...
```

### Generate Backend Module Only

```bash
./scripts/generate-module.sh invoice

# Generated:
apps/backend/src/modules/invoice/
├── invoice.module.ts
├── invoice.controller.ts
├── invoice.service.ts
├── invoice.repository.ts
├── dto/
│   ├── create-invoice.dto.ts
│   ├── update-invoice.dto.ts
│   └── invoice-response.dto.ts
└── __tests__/
    └── invoice.service.spec.ts
```

### Generate Frontend Feature Only

```bash
./scripts/generate-feature.sh opportunity

# Generated:
apps/frontend/src/features/opportunity/
├── components/
│   ├── OpportunityCard.tsx
│   └── OpportunityList.tsx
├── hooks/
│   └── useOpportunity.ts
├── services/
│   └── opportunity.service.ts
├── store/
│   ├── opportunitySlice.ts (Redux)
│   └── opportunityStore.ts (Zustand)
└── types/
    └── opportunity.types.ts
```

## Code Quality Enforcement

### Pre-commit Hooks

When you run `git commit`:

1. **ESLint runs** - Fixes auto-fixable issues
2. **Prettier runs** - Formats code
3. **Type check runs** - Catches type errors
4. **Commit message validated** - Enforces conventional commits

If any step fails, commit is blocked:

```bash
$ git commit -m "fix stuff"

✖ subject may not be empty [subject-empty]
✖ type may not be empty [type-empty]

# Cursor will suggest:
"Use conventional commit format:
git commit -m 'fix(customer): resolve validation bug'"
```

### Pre-push Hooks

When you run `git push`:

1. **Unit tests run** - Fast tests only
2. If tests fail, push is blocked

```bash
$ git push

Running unit tests before push...
FAIL src/customer.service.spec.ts
❌ Unit tests failed. Push aborted.

# Fix tests or skip:
git push --no-verify  # Not recommended!
```

## CI/CD Pipeline

### On Pull Request

1. **Quality Checks** (quality.yml)
   - ESLint
   - TypeScript type check
   - Prettier format check
   - Security scan (Snyk + Semgrep)
   - Dependency audit

2. **Tests** (test.yml)
   - Unit tests (all)
   - Integration tests (with services)
   - E2E tests (Playwright)
   - Coverage check (75%+ required)

3. **Build** (build.yml)
   - Build backend
   - Build frontend
   - Check bundle size

**If any check fails, PR cannot be merged.**

### On Merge to Main

- All tests run again
- Docker images built
- Deployed to staging
- Smoke tests run

## Common Scenarios

### Scenario 1: Adding a New Field

**Task:** Add `website` field to Customer

**Steps:**
1. Update shared type: `packages/shared/src/types/entities/customer.ts`
2. Update DTO: `apps/backend/src/modules/customer/dto/create-customer.dto.ts`
3. Update form: `apps/frontend/src/features/customer/components/CustomerForm.tsx`
4. Update tests
5. Run validation: `pnpm test && pnpm type-check`

**Cursor will:**
- ✅ Validate type safety
- ✅ Suggest validation decorators
- ✅ Warn if tests missing
- ✅ Check RBAC permissions

### Scenario 2: Creating New Module

**Task:** Add Task entity for project management

**Steps:**
```bash
# 1. Generate scaffolding
./scripts/generate-entity.sh task

# 2. Customize generated files
# - Edit packages/shared/src/types/entities/task.ts
# - Add validation in DTOs
# - Implement business logic in service

# 3. Add to modules
# Edit apps/backend/src/app.module.ts:
imports: [
  CustomerModule,
  TaskModule,  // ✅ Add here
]

# 4. Test
pnpm test task
```

**Cursor will:**
- ✅ Validate all imports
- ✅ Check module registration
- ✅ Ensure guards present
- ✅ Verify tests exist

### Scenario 3: Implementing Offline Sync

**Task:** Make opportunities work offline

**Steps:**
1. Use React Query hook from template
2. Implement PouchDB storage
3. Add sync queue logic
4. Handle conflicts

**Cursor will:**
- ✅ Suggest offline-first patterns
- ✅ Guide conflict detection
- ✅ Remind about sync queue
- ✅ Enforce error handling

## Validation Examples

### Example 1: Missing Audit Fields

**You write:**
```typescript
interface Product {
  _id: string;
  name: string;
}
```

**Cursor will warn:**
```
❌ Entity missing required fields:
- _rev (CouchDB revision)
- type (document discriminator)
- createdBy, createdAt
- modifiedBy, modifiedAt
- version (optimistic locking)

Extend BaseEntity instead:
import { BaseEntity } from '@kompass/shared';

interface Product extends BaseEntity {
  type: 'product';
  name: string;
}
```

### Example 2: Missing RBAC Guard

**You write:**
```typescript
@Controller('products')
export class ProductController {
  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
```

**Cursor will warn:**
```
❌ Missing RBAC guards and permission decorator

Add guards to controller:
@Controller('products')
@UseGuards(JwtAuthGuard, RbacGuard)  // ✅
export class ProductController {
  @Get()
  @RequirePermission('Product', 'READ')  // ✅
  async findAll(@CurrentUser() user: User) {  // ✅
    return this.service.findAll(user);
  }
}
```

### Example 3: Custom UI Component

**You write:**
```tsx
function MyCard({ children }) {
  return (
    <div style={{ border: '1px solid gray', padding: '10px' }}>
      {children}
    </div>
  );
}
```

**Cursor will prevent:**
```
❌ Custom UI component detected

Use shadcn/ui Card component instead:

import { Card, CardContent } from '@/components/ui/card';

function MyCard({ children }) {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

Install if not already:
pnpm dlx shadcn-ui@latest add card
```

## Best Practices Enforcement

### 1. Domain-Driven Structure

Cursor enforces this structure:

```
apps/backend/src/modules/
├── customer/          # ✅ Domain module
│   ├── customer.module.ts
│   ├── customer.controller.ts
│   ├── customer.service.ts
│   ├── customer.repository.ts
│   ├── dto/
│   └── __tests__/
├── opportunity/       # ✅ Domain module
└── project/           # ✅ Domain module
```

**❌ Cursor will warn against:**
```
src/
├── controllers/       # ❌ Not domain-driven
│   ├── customer.controller.ts
│   └── opportunity.controller.ts
├── services/          # ❌ Not domain-driven
│   ├── customer.service.ts
│   └── opportunity.service.ts
```

### 2. Test Coverage

Cursor monitors coverage and warns:

```
⚠️ Coverage for CustomerService: 65%
Target: 90% for business logic

Missing tests for:
- CustomerService.validateBusinessRules()
- CustomerService.detectConflicts()

Add tests in: customer.service.spec.ts
```

### 3. Performance Optimization

```typescript
// Cursor will suggest optimization
function CustomerList({ customers }) {
  // ❌ No memoization for expensive calculation
  const statistics = calculateStatistics(customers);
  
  return <div>{statistics.total}</div>;
}

// ✅ Cursor suggests:
function CustomerList({ customers }) {
  const statistics = useMemo(() => {
    return calculateStatistics(customers);
  }, [customers]);  // ✅ Memoized
  
  return <div>{statistics.total}</div>;
}
```

## Troubleshooting

### Cursor Not Enforcing Rules?

1. **Check .cursorrules exists:**
   ```bash
   ls -la .cursorrules
   ```

2. **Reload Cursor:**
   - Cmd/Ctrl + Shift + P
   - "Reload Window"

3. **Check Cursor settings:**
   - Ensure "Rules" are enabled
   - Check rules file path

### Rules Too Strict?

The rules are intentionally strict to enforce:
- Architecture patterns
- Security requirements
- Compliance (GoBD, DSGVO)
- Code quality

If you need to bypass a rule temporarily:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = unknownData;  // Only in exceptional cases!
```

**But generally: Don't bypass. Follow the pattern.**

### False Positives?

If Cursor warns incorrectly:
1. Check if you're following patterns correctly
2. Review `.cursorrules` for the specific rule
3. Update rule if legitimately wrong

## Quick Reference

### Generating Code

```bash
# Complete entity (backend + frontend + shared)
./scripts/generate-entity.sh <name>

# Backend module only
./scripts/generate-module.sh <name>

# Frontend feature only
./scripts/generate-feature.sh <name>
```

### Running Tests

```bash
# All tests
pnpm test

# Specific test
pnpm test customer.spec.ts

# Watch mode
pnpm test:watch

# Coverage
pnpm test:unit --coverage
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

# All checks (like CI)
pnpm lint && pnpm type-check && pnpm test:unit
```

### Viewing Documentation

```bash
# Start documentation server
cd docs
python -m http.server 8000

# Open browser
open http://localhost:8000
```

## Resources

- **Rules File:** `.cursorrules` (2000+ lines of enforcement rules)
- **Templates:** `templates/` (all code templates)
- **Scripts:** `scripts/` (generation scripts)
- **Docs:** `docs/reviews/` (comprehensive specifications)
- **Examples:** This file + `CODING_STANDARDS.md`

## Getting Help

**Question:** How do I...?
**Answer:** Check these resources in order:

1. `.cursorrules` - Search for relevant rule
2. `CODING_STANDARDS.md` - Code examples
3. `DEVELOPMENT.md` - Development workflows
4. `docs/reviews/` - Detailed specifications
5. Templates in `templates/` - Working examples
6. Generated sample in `apps/*/modules/customer/` - Reference implementation

---

**The rules exist to help you write better, safer, more maintainable code. Trust them!** 🚀

