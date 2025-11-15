# KOMPASS Coding Standards

This document describes the coding standards enforced by `.cursorrules` and expected in all code reviews.

## Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [Backend Standards (NestJS)](#backend-standards-nestjs)
3. [Frontend Standards (React)](#frontend-standards-react)
4. [Testing Standards](#testing-standards)
5. [Security Standards](#security-standards)
6. [Documentation Standards](#documentation-standards)
7. [Git Standards](#git-standards)

## TypeScript Standards

### Strict Mode (Required)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Type Safety Rules

**✅ DO:**

```typescript
// Explicit return types
function getUserById(id: string): Promise<User> {
  return repository.findById(id);
}

// Use unknown instead of any
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data);
  }
}

// Interface for objects
interface Customer {
  readonly id: string;
  name: string;
}

// Branded types for IDs
type CustomerId = string & { __brand: 'CustomerId' };

// Discriminated unions for state
type LoadingState =
  | { status: 'loading' }
  | { status: 'success'; data: Customer }
  | { status: 'error'; error: Error };
```

**❌ DON'T:**

```typescript
// No implicit any
function processData(data) {} // ❌

// No any type
function processData(data: any) {} // ❌

// No type assertion without guards
const customer = data as Customer; // ❌

// No missing return types
function getUserById(id: string) {
  // ❌
  return repository.findById(id);
}
```

### Immutability

```typescript
// ✅ Use readonly
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// ✅ Const assertions
const STATUS = ['NEW', 'ACTIVE', 'COMPLETED'] as const;
type Status = (typeof STATUS)[number];

// ✅ Spread for updates
const updated = { ...original, name: 'New Name' };

// ❌ Don't mutate
original.name = 'New Name'; // ❌
array.push(item); // ❌ Use [...array, item]
```

## Backend Standards (NestJS)

### Module Structure (Required)

Every domain module must have:

```
customer/
├── customer.module.ts       # ✅ Required
├── customer.controller.ts   # ✅ Required
├── customer.service.ts      # ✅ Required
├── customer.repository.ts   # ✅ Required
├── dto/
│   ├── create-customer.dto.ts   # ✅ Required
│   ├── update-customer.dto.ts   # ✅ Required
│   └── customer-response.dto.ts # ✅ Required
├── entities/
│   └── customer.entity.ts   # ✅ Required
└── __tests__/
    └── customer.service.spec.ts # ✅ Required
```

### Layered Architecture (Strict)

```
Controller → Service → Repository → Database
   ↓           ↓          ↓
  DTOs      Business   CouchDB
            Logic
```

**✅ DO:**

```typescript
// Controller: Only HTTP concerns
@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbacGuard) // ✅ Guards required
  async findOne(@Param('id') id: string) {
    return this.service.findById(id); // ✅ Delegate to service
  }
}

// Service: Business logic
@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async findById(id: string): Promise<Customer> {
    return this.repository.findById(id); // ✅ Use repository
  }
}

// Repository: Data access
@Injectable()
export class CustomerRepository {
  async findById(id: string): Promise<Customer> {
    return this.db.get(id); // ✅ Only layer accessing DB
  }
}
```

**❌ DON'T:**

```typescript
// No business logic in controller
@Controller('customers')
export class CustomerController {
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.db.get(id); // ❌ No DB access
    customer.status = 'active'; // ❌ No business logic
    return customer;
  }
}

// No DB access in service
@Injectable()
export class CustomerService {
  async findById(id: string): Promise<Customer> {
    return this.db.get(id); // ❌ Use repository
  }
}
```

### Guards (Required on All Endpoints)

```typescript
// ✅ Every endpoint must have guards
@Controller('customers')
@UseGuards(JwtAuthGuard, RbacGuard) // ✅ Required
export class CustomerController {
  @Get(':id')
  @RequirePermission('Customer', 'READ') // ✅ Required
  async findOne(@Param('id') id: string) {
    // ...
  }
}

// ❌ No guards
@Controller('customers')
export class CustomerController {
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // ❌ Missing guards!
    // ...
  }
}
```

### Entity Fields (Required)

Every entity MUST have:

```typescript
interface BaseEntity {
  _id: string; // ✅ Required
  _rev: string; // ✅ Required
  type: string; // ✅ Required
  createdBy: string; // ✅ Required
  createdAt: Date; // ✅ Required
  modifiedBy: string; // ✅ Required
  modifiedAt: Date; // ✅ Required
  version: number; // ✅ Required
  _conflicts?: string[]; // ✅ For offline sync
  lastSyncedAt?: Date; // ✅ For offline sync
}
```

## Frontend Standards (React)

### Component Rules

**✅ DO: Use shadcn/ui ONLY**

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <Button>Save</Button> {/* ✅ shadcn component */}
    </Card>
  );
}
```

**❌ DON'T: Create custom UI components**

```tsx
// ❌ Never do this
const CustomButton = styled.button`
  background: blue;
`;

// ❌ Never do this
function MyButton({ children }) {
  return <button className="custom-btn">{children}</button>;
}
```

### Hooks Rules

```typescript
// ✅ Extract complex logic to hooks
function useCustomerData(id: string) {
  const { data, isLoading } = useQuery(['customer', id], () =>
    customerApi.getById(id)
  );

  const { mutate: update } = useMutation((data) =>
    customerApi.update(id, data)
  );

  return { customer: data, isLoading, update };
}

// ❌ Don't put complex logic in components
function CustomerDetail({ id }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ Too much logic in component
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then(setCustomer)
      .finally(() => setLoading(false));
  }, [id]);

  // ...
}
```

### State Management

```typescript
// ✅ Redux Toolkit for global state
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
  },
});

// ✅ Zustand for local feature state
const useCustomerFilters = create((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

// ✅ React Query for server state
function useCustomer(id) {
  return useQuery(['customer', id], () => api.getById(id));
}

// ❌ Don't use useState for server data
function MyComponent() {
  const [customer, setCustomer] = useState(null); // ❌ Use React Query

  useEffect(() => {
    fetchCustomer().then(setCustomer);
  }, []);
}
```

### Prop Drilling Limit

```typescript
// ✅ Maximum 2 levels of prop passing
<Page>
  <List items={items} onSelect={onSelect}>  {/* Level 1 */}
    <Item item={item} onSelect={onSelect} />  {/* Level 2 - OK */}
  </List>
</Page>

// ❌ More than 2 levels - use Context or state management
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user}>
        <Avatar user={user} />  {/* Level 4 - ❌ Use Context */}
      </UserMenu>
    </Sidebar>
  </Layout>
</App>
```

### Accessibility (WCAG 2.1 AA Required)

```tsx
// ✅ Semantic HTML
<main>
  <h1>Customer List</h1>
  <nav aria-label="Customer navigation">
    <Button>New Customer</Button>
  </nav>
</main>

// ✅ ARIA labels for icons
<Button aria-label="Delete customer">
  <TrashIcon />
</Button>

// ✅ Keyboard navigation
<Button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Save
</Button>

// ❌ Divs for everything
<div onClick={handleClick}>Save</div>  // ❌ Not accessible
```

## Testing Standards

### Coverage Requirements

| Component Type            | Coverage Required |
| ------------------------- | ----------------- |
| Business Logic (Services) | 90%               |
| React Components          | 80%               |
| Utilities                 | 85%               |
| Controllers               | 70%               |
| Overall                   | 80%               |

### Test Structure

```typescript
describe('Feature', () => {
  describe('method', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = doSomething(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mocking Guidelines

```typescript
// ✅ Mock external dependencies
const mockRepository = {
  findById: jest.fn(),
  create: jest.fn(),
};

// ✅ Mock dates for consistency
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01'));

// ❌ Don't mock the code under test
const mockService = jest.fn(); // ❌ Test real service
```

## Security Standards

### No Secrets in Code

```typescript
// ✅ Use environment variables
const apiKey = process.env.API_KEY;
const jwtSecret = process.env.JWT_SECRET;

// ❌ Hardcoded secrets
const apiKey = 'sk-1234567890'; // ❌ NEVER!
const jwtSecret = 'my-secret'; // ❌ NEVER!
```

### Input Validation (Always)

```typescript
// ✅ Validate all input
@Post()
async create(@Body() dto: CreateCustomerDto) {  // ✅ DTO validates
  return this.service.create(dto);
}

// DTOs with validation
export class CreateCustomerDto {
  @IsString()
  @Length(2, 200)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

// ❌ No validation
@Post()
async create(@Body() data: any) {  // ❌ No validation!
  return this.service.create(data);
}
```

### RBAC (Always Check)

```typescript
// ✅ Check permissions
if (!rbacService.hasPermission(user.role, 'Customer', 'READ')) {
  throw new ForbiddenException();
}

// ✅ Check record ownership
if (user.role === 'ADM' && customer.owner !== user.id) {
  throw new ForbiddenException('Can only view own customers');
}

// ❌ No permission check
async getCustomer(id: string) {  // ❌ No RBAC!
  return repository.findById(id);
}
```

## Documentation Standards

### JSDoc Comments (Required for Public APIs)

````typescript
/**
 * Finds a customer by ID with RBAC filtering
 *
 * @param id - Customer ID (UUID format)
 * @param user - Current authenticated user
 * @returns Promise resolving to customer with filtered fields
 * @throws {NotFoundException} If customer not found
 * @throws {ForbiddenException} If user lacks permission
 *
 * @example
 * ```typescript
 * const customer = await service.findById('customer-123', currentUser);
 * ```
 */
async findById(id: string, user: User): Promise<Customer> {
  // Implementation
}
````

### README Files (Required for Modules)

Every module directory should have a README.md:

```markdown
# Customer Module

## Overview

Handles customer management with CRUD, validation, and RBAC.

## API Endpoints

- GET /api/v1/customers
- GET /api/v1/customers/:id
- POST /api/v1/customers
- PUT /api/v1/customers/:id
- DELETE /api/v1/customers/:id

## Usage

[Import and usage examples]

## Testing

[How to run tests]
```

## Git Standards

### No File Duplication (Strict Rule)

```bash
# ✅ Use git for versions
git commit -m "feat: add customer validation"

# If you need to revert:
git revert HEAD

# ❌ NEVER create duplicate files
customer.service.ts
customer.service.old.ts      # ❌ NEVER
customer.service.backup.ts   # ❌ NEVER
customer.service.v2.ts       # ❌ NEVER
```

### Commit Messages (Conventional Commits)

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(customer): add duplicate detection
fix(invoice): correct total calculation
docs(api): update OpenAPI spec
refactor(auth): extract RBAC to guard
test(opportunity): add transition tests
chore(deps): update nestjs to v10
```

### Branch Naming

```bash
# Format
<type>/<description>

# Examples
feature/customer-duplicate-detection
bugfix/invoice-calculation-error
hotfix/security-jwt-expiration
refactor/rbac-service-extraction
```

## Performance Standards

### Frontend Performance

```typescript
// ✅ Lazy load routes
const CustomerPage = lazy(() => import('./features/customer/CustomerPage'));

// ✅ Memoize expensive computations
const statistics = useMemo(() => {
  return calculateStatistics(customers);
}, [customers]);

// ✅ Use callback for stable references
const handleClick = useCallback(() => {
  doSomething();
}, []);

// ✅ Virtual scrolling for large lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Backend Performance

```typescript
// ✅ Use indexes
await db.find({
  selector: { owner: userId },  // ✅ Indexed field
  use_index: '_design/customers',
});

// ✅ Pagination
async findAll(page = 1, limit = 25) {
  return db.find({
    limit,
    skip: (page - 1) * limit,
  });
}

// ✅ Caching
@UseInterceptors(CacheInterceptor)
@CacheTTL(300) // 5 minutes
async findAll() {
  // ...
}
```

## Offline-First Standards

### Always Use Repository Pattern

```typescript
// ✅ Repository handles offline/online
class CustomerRepository {
  async findById(id: string): Promise<Customer> {
    // Try local first
    const local = await localDB.get(id);
    if (local) return local;

    // Fallback to API
    const remote = await api.get(id);
    await localDB.put(remote);
    return remote;
  }
}

// ❌ Direct API calls
async getCustomer(id) {
  return fetch(`/api/customers/${id}`);  // ❌ No offline support
}
```

### Conflict Detection

```typescript
// ✅ Check for conflicts
if (local._rev !== remote._rev) {
  const conflicts = await detectConflicts(local, remote);
  if (conflicts.length > 0) {
    showConflictResolutionUI(conflicts);
  }
}

// ✅ Queue offline changes
if (!navigator.onLine) {
  entity._queuedForSync = true;
  await localDB.put(entity);
}
```

## GoBD Compliance Standards

### Immutable Entities

```typescript
// ✅ Invoice is immutable after finalization
if (invoice.finalized) {
  const immutableFields = ['invoiceNumber', 'invoiceDate', 'totalAmount'];

  if (changesInclude(immutableFields)) {
    if (user.role !== 'GF') {
      throw new ForbiddenException('Requires GF approval');
    }

    // Log correction
    invoice.changeLog.push({
      field,
      oldValue,
      newValue,
      changedBy: user.id,
      changedAt: new Date(),
      reason: correctionReason, // ✅ Required
      approvedBy: user.id,
    });
  }
}
```

### Audit Trail (Required)

```typescript
// ✅ Log all modifications
await auditService.log({
  action: 'UPDATE',
  entityType: 'Customer',
  entityId: id,
  userId: user.id,
  timestamp: new Date(),
  changes: detectChanges(old, new),
});
```

## Code Review Checklist

Before approving a PR, verify:

- [ ] Follows TypeScript strict mode (no `any`)
- [ ] Uses shadcn/ui components (no custom UI)
- [ ] Repository pattern for data access
- [ ] RBAC guards on all endpoints
- [ ] Audit trail for modifications
- [ ] Tests written (80%+ coverage)
- [ ] No secrets in code
- [ ] No file duplication
- [ ] Conventional commit messages
- [ ] Documentation updated
- [ ] Type check passes
- [ ] ESLint passes
- [ ] All tests pass

## Enforcement

These standards are enforced by:

1. **`.cursorrules`** - Cursor AI coding assistant
2. **ESLint** - Linting rules
3. **TypeScript** - Type checking
4. **Husky hooks** - Pre-commit validation
5. **GitHub Actions** - CI/CD checks
6. **Code review** - Manual verification

## Questions?

- Check `.cursorrules` for complete rules
- See `DEVELOPMENT.md` for practical examples
- Refer to `docs/reviews/` for specifications
- Ask Tech Lead for clarifications

---

**Remember:** These standards exist to maintain code quality, prevent bugs, and ensure long-term maintainability. Follow them consistently!
