# Contributing to KOMPASS

Thank you for contributing to KOMPASS! This document provides guidelines for contributing code, reporting issues, and collaborating on the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Message Format](#commit-message-format)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Architecture Decisions](#architecture-decisions)

## Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Collaborate openly
- Prioritize code quality and maintainability

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git
- Docker (optional, for services)

### Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd kompass
pnpm install

# Setup development environment
./scripts/setup-dev.sh

# Verify installation
pnpm test:unit
pnpm lint
pnpm type-check
```

## Development Workflow

### 1. Create Feature Branch

```bash
# Create branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/customer-duplicate-detection

# Branch naming conventions:
# - feature/* - New features
# - bugfix/* - Bug fixes
# - hotfix/* - Urgent production fixes
# - refactor/* - Code refactoring
# - docs/* - Documentation changes
```

### 2. Make Changes

- Follow coding standards (see `docs/guides/CODING_STANDARDS.md`)
- Write tests for new code (80% coverage minimum)
- Update documentation as needed
- Run linter and type checker frequently

### 3. Commit Changes

```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat(customer): add duplicate detection logic"

# Pre-commit hooks will run:
# - ESLint
# - Prettier
# - Type check
# - Unit tests
```

### 4. Push and Create PR

```bash
# Push to remote
git push origin feature/customer-duplicate-detection

# Create pull request on GitHub
# - Use PR template
# - Add description
# - Link related issues
# - Request reviewers
```

## Coding Standards

### TypeScript

**✅ DO:**

```typescript
// Explicit return types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Interface for objects
interface Customer {
  id: string;
  name: string;
}

// Use unknown instead of any
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data);
  }
}
```

**❌ DON'T:**

```typescript
// No implicit any
function calculateTotal(items) {
  // ❌ Missing types
  return items.reduce((sum, item) => sum + item.price, 0);
}

// No any type
function processData(data: any) {
  // ❌ Use unknown instead
  console.log(data);
}

// No type alias for objects
type Customer = {
  // ❌ Use interface
  id: string;
  name: string;
};
```

### React Components

**✅ DO:**

```tsx
// Use shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent(): JSX.Element {
  return (
    <Card>
      <Button>Save</Button>
    </Card>
  );
}
```

**❌ DON'T:**

```tsx
// Never create custom UI components
const CustomButton = styled.button`
  // ❌ Use shadcn/ui Button
  background: blue;
`;
```

### Backend Services

**✅ DO:**

```typescript
// Follow layered architecture
@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository, // ✅ Inject repository
    private readonly rbacService: RbacService
  ) {}

  async findById(id: string, user: User): Promise<Customer> {
    // ✅ Check permissions
    if (!this.rbacService.hasPermission(user.role, 'Customer', 'READ')) {
      throw new ForbiddenException();
    }

    // ✅ Use repository
    return await this.repository.findById(id);
  }
}
```

**❌ DON'T:**

```typescript
// Don't access database directly from service
@Injectable()
export class CustomerService {
  async findById(id: string): Promise<Customer> {
    return await nano.get(id); // ❌ Use repository pattern
  }
}
```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build process, dependencies, etc.

### Examples

```bash
# Feature
git commit -m "feat(customer): add duplicate detection with fuzzy matching"

# Bug fix
git commit -m "fix(invoice): correct total calculation rounding error"

# Documentation
git commit -m "docs(api): update OpenAPI spec with new endpoints"

# Refactoring
git commit -m "refactor(auth): extract RBAC logic to separate service"

# Tests
git commit -m "test(opportunity): add status transition validation tests"

# Breaking change
git commit -m "feat(api)!: change customer API response format

BREAKING CHANGE: Customer API now returns nested address object instead of flat fields"
```

## Pull Request Process

### PR Checklist

Before creating a PR, ensure:

- [ ] Code follows coding standards (ESLint passes)
- [ ] All tests pass (unit + integration)
- [ ] Test coverage ≥75% for new code
- [ ] Type check passes
- [ ] No console.log statements (use proper logging)
- [ ] Documentation updated (README, JSDoc, OpenAPI)
- [ ] No secrets or sensitive data in code
- [ ] No file duplication (use git for versioning)
- [ ] RBAC guards on new endpoints
- [ ] Audit trail for data modifications

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Fixes #123

## Testing

- [ ] All unit tests passing
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Code follows coding standards
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] RBAC permissions configured
```

### Review Process

1. **Automated Checks** (must pass)
   - ESLint
   - TypeScript type check
   - Unit tests
   - Integration tests
   - Coverage threshold (75%+)
   - Security scan

2. **Code Review** (2 approvals required)
   - Architecture alignment
   - Code quality
   - Test adequacy
   - Documentation completeness

3. **QA Review** (for features)
   - Manual testing
   - Accessibility check
   - Cross-browser testing

4. **Merge**
   - Squash and merge (keep history clean)
   - Delete branch after merge

## Testing Requirements

### Unit Tests (70% of tests)

- **Coverage:** 90%+ for business logic
- **Location:** Colocated with source (`*.spec.ts`)
- **Scope:** Pure functions, services, utilities

```typescript
// Example
describe('CustomerService', () => {
  describe('findById', () => {
    it('should return customer when found', async () => {
      // Arrange
      const mockCustomer = { id: '1', name: 'Test' };
      repository.findById.mockResolvedValue(mockCustomer);

      // Act
      const result = await service.findById('1', mockUser);

      // Assert
      expect(result).toEqual(mockCustomer);
    });
  });
});
```

### Integration Tests (20% of tests)

- **Location:** `tests/integration/`
- **Scope:** API endpoints with real database

```typescript
describe('Customer API', () => {
  it('should create customer with valid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Customer' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### E2E Tests (10% of tests)

- **Location:** `tests/e2e/`
- **Framework:** Playwright
- **Scope:** Critical user journeys

```typescript
test('User can create customer', async ({ page }) => {
  await page.goto('/customers');
  await page.click('button:has-text("New Customer")');
  await page.fill('[name="name"]', 'Test Customer');
  await page.click('button:has-text("Save")');

  await expect(page.locator('.toast-success')).toBeVisible();
});
```

## Architecture Decisions

### When to Create ADR

Create an Architecture Decision Record (ADR) when:

- Choosing between significant technical alternatives
- Making decisions that impact multiple modules
- Establishing new patterns or practices
- Changing existing architectural decisions

### ADR Template

See `docs/adr/template.md`

## Common Tasks

### Add a New Entity

```bash
# Generate scaffolding
./scripts/generate-entity.sh product

# Customize:
# 1. Edit entity fields in packages/shared/src/types/entities/product.ts
# 2. Add validation rules in apps/backend/src/modules/product/dto/
# 3. Implement business logic in apps/backend/src/modules/product/product.service.ts
# 4. Design UI in apps/frontend/src/features/product/components/
# 5. Add tests
# 6. Add module to AppModule
# 7. Create routes
```

### Add shadcn/ui Component

```bash
# Never create custom UI components
# Always install from shadcn/ui

cd apps/frontend
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add form
pnpm dlx shadcn-ui@latest add table

# See https://ui.shadcn.com/docs/components for available components
```

### Debug Issues

```bash
# Backend debugging
cd apps/backend
pnpm start:debug

# Connect debugger on port 9229

# Frontend debugging
cd apps/frontend
pnpm dev

# Use browser DevTools
```

## Getting Help

- **Architecture questions:** See `docs/architectur/`
- **Domain model questions:** See `docs/reviews/DATA_MODEL_SPECIFICATION.md`
- **API questions:** See `docs/reviews/API_SPECIFICATION.md`
- **Testing questions:** See `docs/reviews/TEST_STRATEGY_DOCUMENT.md`
- **Cursor AI rules:** See `.cursorrules`

## Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tagged in git
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Deployed to production

---

**Questions?** Contact the Tech Lead or refer to comprehensive documentation in `docs/`.
