# KOMPASS Development Workflow

**Last Updated**: 2025-01-27  
**Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Workflow Diagram](#workflow-diagram)
3. [Step-by-Step Process](#step-by-step-process)
4. [Git Conventions](#git-conventions)
5. [Quality Gates](#quality-gates)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Requirements](#documentation-requirements)

---

## Overview

KOMPASS uses a Linear-integrated, Git Flow-inspired development workflow with automated quality gates and continuous deployment.

### Key Principles

1. **Linear Integration**: Every commit references a Linear issue
2. **Quality First**: All code must pass quality gates before merge
3. **Documentation**: Code and documentation are updated together
4. **Automated Testing**: Comprehensive test coverage is required
5. **Continuous Deployment**: Automated deployment to staging and production

---

## Workflow Diagram

```
Linear Issue (KOM-123)
        ↓
   Create Branch
feature/KOM-123-description
        ↓
    Develop
        ↓
  Commit (with hooks)
    ✓ Linting
    ✓ Formatting
    ✓ Type checking
    ✓ Commit message format
        ↓
  Push (with hooks)
    ✓ Unit tests
        ↓
 Create Pull Request
        ↓
GitHub Actions Run
    ✓ All quality gates
    ✓ Build check
    ✓ Security scan
    ✓ Documentation check
        ↓
   Code Review
    ✓ 1+ approvals
    ✓ Conversations resolved
        ↓
  Merge to develop
        ↓
  Auto-Deploy to Staging
        ↓
 Manual QA on Staging
        ↓
 Create PR develop → main
        ↓
  Merge to main
        ↓
Auto-Deploy to Production
        ↓
   GitHub Release
```

---

## Step-by-Step Process

### 1. Pick a Linear Task

- Go to Linear board
- Pick an issue from "Todo" or "Backlog"
- Move issue to "In Progress"
- Note the issue ID (e.g., KOM-123)

### 2. Create Feature Branch

```bash
# Update local branches
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/KOM-123-customer-validation

# Branch naming format:
# <type>/KOM-###-<description>
# Types: feature, bugfix, hotfix, refactor, docs, test, chore
```

### 3. Develop the Feature

```bash
# Make changes
# Write code
# Write tests
# Update documentation (if needed)

# Check status frequently
git status
```

### 4. Commit Changes

```bash
# Stage changes
git add <files>

# Commit with proper message format
git commit -m "feat(KOM-123): add customer validation

Implement fuzzy matching for company names and exact matching for VAT numbers.
Show warning dialog when potential duplicate is found.

- Add validation service
- Add duplicate detection algorithm
- Add warning dialog component
- Add unit tests with 85% coverage
- Update API documentation"
```

**Pre-commit hooks automatically run**:
- ✅ ESLint (auto-fix)
- ✅ Prettier (auto-format)
- ✅ TypeScript type checking
- ✅ Commit message format validation

**Commit Message Format**:
```
<type>(KOM-###): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build process, dependencies
- `ci`: CI/CD changes
- `revert`: Revert previous commit

### 5. Push Branch

```bash
git push origin feature/KOM-123-customer-validation
```

**Pre-push hooks automatically run**:
- ✅ Unit tests
- ✅ Documentation validation (if docs/ changed)
- ✅ Linear issue ID check
- ✅ Branch naming convention check

### 6. Create Pull Request

Go to GitHub and create a pull request:

**Title**: `feat(KOM-123): Add customer validation`

**Description Template**:
```markdown
## Linear Issue
Closes KOM-123

## Changes
- Implemented fuzzy matching for company names
- Added exact matching for VAT numbers
- Created warning dialog for potential duplicates
- Added comprehensive unit tests

## Testing
- [ ] Unit tests pass (85% coverage)
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested on Chrome, Firefox, Safari

## Documentation
- [ ] API documentation updated
- [ ] User guide updated (if applicable)
- [ ] README updated (if applicable)

## Screenshots
(Add screenshots for UI changes)

## Breaking Changes
None

## Additional Notes
Consider adding fuzzy matching threshold configuration in settings.
```

**GitHub Actions automatically run**:
- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Prettier format check
- ✅ Unit tests
- ✅ Integration tests
- ✅ E2E tests
- ✅ Build check
- ✅ Security audit (Snyk, Semgrep, pnpm audit)
- ✅ Documentation check
- ✅ Commit message validation
- ✅ Branch name validation

### 7. Code Review

- Request review from team members
- Address review comments
- Make necessary changes
- Push updates (will re-run CI/CD)

**Requirements**:
- ✅ At least 1 approval
- ✅ All conversations resolved
- ✅ All CI checks passing

### 8. Merge to develop

- Merge PR (use "Squash and merge" recommended)
- Delete feature branch
- Move Linear issue to "Done"

**Automatic Actions**:
- ✅ Docker images built
- ✅ Images pushed to ghcr.io
- ✅ Deployed to staging
- ✅ Smoke tests run
- ✅ CHANGELOG.md updated
- ✅ Linear issue updated

### 9. QA on Staging

- Test feature on staging environment
- Verify functionality
- Check for regressions
- Get product owner sign-off

**Staging URL**: https://staging.kompass.de

### 10. Release to Production

```bash
# Create release PR
git checkout main
git pull origin main
git checkout -b release/v1.2.0
git merge develop

# Update version in package.json
npm version minor  # or major, patch

# Push and create PR
git push origin release/v1.2.0
```

Create PR from `develop` to `main`:

**Title**: `Release v1.2.0`

**Description**: (Changelog summary)

After approval and merge:

**Automatic Actions**:
- ✅ Full test suite runs
- ✅ Docker images built with version tags
- ✅ Deployed to production
- ✅ Smoke tests run
- ✅ GitHub release created
- ✅ Changelog generated
- ✅ Git tag created

---

## Git Conventions

### Branch Names

Format: `<type>/KOM-###-<description>`

**Examples**:
- `feature/KOM-123-customer-validation`
- `bugfix/KOM-456-invoice-calculation`
- `hotfix/KOM-789-security-jwt`
- `refactor/KOM-234-rbac-logic`
- `docs/KOM-567-api-spec-update`

### Commit Messages

Format: `<type>(KOM-###): <subject>`

**Examples**:
```
feat(KOM-123): add customer duplicate detection
fix(KOM-456): correct invoice total calculation
docs(KOM-789): update API specification
refactor(KOM-234): extract RBAC logic to guard
test(KOM-567): add E2E tests for offline sync
chore(KOM-890): update NestJS to v10
```

### Pull Request Titles

Same format as commit messages: `<type>(KOM-###): <subject>`

---

## Quality Gates

All PRs must pass these quality gates:

### Code Quality
- [ ] ESLint passes (no errors)
- [ ] TypeScript type checking passes
- [ ] Prettier formatting check passes
- [ ] Build succeeds (backend + frontend)

### Testing
- [ ] Unit tests pass (70% of test pyramid)
- [ ] Integration tests pass (20% of test pyramid)
- [ ] E2E tests pass (10% of test pyramid)
- [ ] Test coverage ≥75% overall

### Security
- [ ] pnpm audit passes (no high/critical vulnerabilities)
- [ ] Snyk security scan passes
- [ ] Semgrep SAST scan passes

### Documentation
- [ ] Documentation updated (if code changes require it)
- [ ] API documentation current
- [ ] Changelog entry added (for feat/fix/refactor)

### Git Hygiene
- [ ] All commits follow conventional commits format
- [ ] Linear issue referenced in all commits
- [ ] Branch name follows naming convention

### Code Review
- [ ] At least 1 approval
- [ ] All conversations resolved

---

## Pull Request Process

### Creating a PR

1. Ensure all quality gates pass locally
2. Push branch to GitHub
3. Create PR with descriptive title and description
4. Link Linear issue
5. Add labels (feature, bug, documentation, etc.)
6. Request reviewers
7. Move Linear issue to "In Review"

### Reviewing a PR

As a reviewer:

1. **Understand the context**
   - Read Linear issue
   - Review PR description
   - Check what problem is being solved

2. **Code review checklist**
   - [ ] Code follows project conventions
   - [ ] Logic is sound and efficient
   - [ ] Edge cases are handled
   - [ ] Error handling is appropriate
   - [ ] No security vulnerabilities
   - [ ] No performance issues
   - [ ] Tests are comprehensive
   - [ ] Documentation is updated

3. **Provide constructive feedback**
   - Be specific and actionable
   - Explain the "why" behind suggestions
   - Use "Request changes" only for critical issues
   - Approve when ready

4. **Types of comments**
   - **Blocking**: Must be addressed before merge
   - **Non-blocking**: Suggestions for improvement
   - **Question**: Seeking clarification

### Addressing Review Comments

1. Read all comments carefully
2. Respond to questions
3. Make necessary changes
4. Push updates
5. Reply to comments when addressed
6. Request re-review

---

## Testing Requirements

### Unit Tests (70%)

- Test individual functions and components
- Mock external dependencies
- Fast execution (<5ms per test)
- High coverage (>80% for critical modules)

```typescript
describe('CustomerValidationService', () => {
  it('should detect duplicate company names', () => {
    // Test implementation
  });
});
```

### Integration Tests (20%)

- Test multiple modules together
- Use real database (CouchDB test instance)
- Test API endpoints
- Moderate execution time

```typescript
describe('Customer API Integration', () => {
  it('should create customer and trigger duplicate check', async () => {
    // Test implementation
  });
});
```

### E2E Tests (10%)

- Test complete user flows
- Use Playwright
- Test critical paths only
- Slower execution acceptable

```typescript
test('Customer creation flow with duplicate warning', async ({ page }) => {
  // Test implementation
});
```

---

## Documentation Requirements

### When to Update Documentation

**Always update docs when you**:
- Add/modify API endpoints
- Change data models
- Add new features
- Change configuration
- Update dependencies (major versions)

**Consider updating docs when you**:
- Fix complex bugs (add to troubleshooting)
- Improve performance (update metrics)
- Add tests (update test strategy)

### What to Update

| Change Type | Documentation to Update |
|------------|------------------------|
| API changes | `docs/api/reference/endpoints.md`, API_SPECIFICATION.md |
| Architecture changes | `docs/architecture/` |
| New features | `docs/guides/`, README.md |
| Configuration changes | `.env.example`, deployment docs |
| Process changes | `docs/processes/` |

---

## Common Issues & Solutions

### Pre-commit Hook Fails

**Issue**: Linting or formatting errors

**Solution**:
```bash
# Auto-fix linting
pnpm lint --fix

# Auto-format
pnpm format

# Try commit again
git commit
```

### Pre-push Hook Fails

**Issue**: Unit tests fail

**Solution**:
```bash
# Run tests locally
pnpm test:unit

# Fix failing tests
# Try push again
```

### CI Checks Fail

**Issue**: Integration or E2E tests fail in GitHub Actions

**Solution**:
1. Check GitHub Actions logs
2. Run tests locally:
   ```bash
   pnpm test:integration
   pnpm test:e2e
   ```
3. Fix issues and push again

### Merge Conflicts

**Solution**:
```bash
# Update local develop
git checkout develop
git pull origin develop

# Rebase feature branch
git checkout feature/KOM-123-description
git rebase develop

# Resolve conflicts
# Test after rebase
pnpm test

# Force push (rebased history)
git push origin feature/KOM-123-description --force-with-lease
```

---

## Best Practices

1. **Commit frequently**: Small, focused commits
2. **Test as you go**: Don't wait until the end
3. **Update docs immediately**: Fresh in your mind
4. **Request review early**: Get feedback sooner
5. **Be responsive**: Address review comments promptly
6. **Keep PRs small**: Easier to review, faster to merge
7. **Rebase regularly**: Stay up to date with develop
8. **Clean up**: Delete merged branches

---

## Related Documentation

- [API Specification](../specifications/API_SPECIFICATION.md)
- [Test Strategy](../specifications/TEST_STRATEGY_DOCUMENT.md)
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- [RBAC Permission Matrix](../specifications/RBAC_PERMISSION_MATRIX.md)

---

**Maintained By**: Development Team  
**Last Review**: 2025-01-27  
**Next Review**: Q2 2025

