# Documentation Update Guide

**Last Updated:** 2025-01-28  
**Owner:** Backend Team & Technical Writers  
**Purpose:** Guide for when and how to update documentation when making code changes

This guide helps developers understand when documentation updates are required and how to update them correctly.

---

## When Documentation is Required

### API Changes Requiring Documentation

**BREAKING Changes (Always Required):**
- ✅ Removed endpoints
- ✅ Removed request/response fields
- ✅ Changed endpoint URLs/paths
- ✅ Changed authentication/authorization requirements
- ✅ Changed HTTP status codes for existing endpoints

**NEW Features (Always Required):**
- ✅ New endpoints
- ✅ New request/response fields
- ✅ New query parameters
- ✅ New authentication/authorization options

**INTERNAL Changes (Not Required):**
- ❌ Bug fixes in existing logic
- ❌ Refactoring (code reorganization)
- ❌ Validation improvements (same API contract)
- ❌ Type improvements (TypeScript types only)
- ❌ Error message improvements
- ❌ Logging changes
- ❌ Performance optimizations (same behavior)

**MINOR Changes (Optional):**
- ⚠️ Error message improvements (may want to document new error codes)
- ⚠️ Response time improvements (may want to update performance docs)

---

## How to Update API Documentation

### Step 1: Identify What Changed

The CI check will automatically detect:
- New endpoints (new `@Get()`, `@Post()`, etc. decorators)
- Changed routes (modified `@Controller()` or method decorators)
- DTO changes (added/removed properties)
- Authentication changes (new/removed guards)

### Step 2: Update Relevant Documentation Files

#### For Endpoint Changes

**File:** `docs/api/updates/API_UPDATES.md`

Add entry in format:

```markdown
## New Endpoints (YYYY-MM-DD)

### Feature Name

#### Endpoint Name

```http
METHOD /api/v1/resource/{id}/subresource
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "field": "value"
}

Response 201:
{
  "id": "resource-id",
  "field": "value"
}
```

**Permissions**: `Resource.ACTION` (roles that can use this)
```

#### For Specification Changes

**File:** `docs/specifications/api-specification.md` (if exists)

Update the relevant sections:
- Endpoint definitions
- Request/response schemas
- Authentication requirements
- Error responses

#### For Reference Documentation

**File:** `docs/api/reference/` (if detailed reference docs exist)

Update endpoint reference pages with:
- Complete request/response examples
- All possible status codes
- Error scenarios
- Usage examples

---

## How to Skip Documentation Check

### When Skipping is Appropriate

You can skip the documentation check if:
1. **Internal-only changes**: Bug fixes, refactoring, validation improvements
2. **Documentation already exists**: Changes are already documented
3. **Temporary/experimental**: Changes are in a feature branch and will be documented before merge

### How to Skip

#### Option 1: Commit Message Marker

Add `[skip-docs]` or `[no-docs]` to your commit message:

```bash
git commit -m "fix(KOM-123): fix validation bug [skip-docs]

This is an internal bug fix that doesn't change the API contract."
```

**Important:** You must explain why in your PR description.

#### Option 2: Environment Variable

Set `SKIP_DOCS_CHECK=true` in your PR (via GitHub Actions secrets/variables).

**Important:** Only use this for exceptional cases. Always explain in PR.

#### Option 3: Update Documentation

The best option is to update the documentation, even for minor changes. This keeps docs current and helps future developers.

---

## Examples

### Example 1: New Endpoint (Requires Docs)

**Change:**
```typescript
@Post('locations')
async createLocation(@Body() dto: CreateLocationDto) {
  // ...
}
```

**Required Documentation:**
- Add to `docs/api/updates/API_UPDATES.md`
- Include request/response examples
- Document permissions

### Example 2: Bug Fix (No Docs Needed)

**Change:**
```typescript
// Before: Bug in validation
if (value < 0) { throw error; }

// After: Fixed validation
if (value <= 0) { throw error; }
```

**Action:**
- Add `[skip-docs]` to commit message
- Or just update docs anyway (recommended)

### Example 3: DTO Property Added (Requires Docs)

**Change:**
```typescript
// Before
export class CreateCustomerDto {
  companyName: string;
}

// After
export class CreateCustomerDto {
  companyName: string;
  vatNumber?: string; // NEW
}
```

**Required Documentation:**
- Update `docs/api/updates/API_UPDATES.md`
- Document new optional field
- Update request examples

### Example 4: Refactoring (No Docs Needed)

**Change:**
```typescript
// Before: Inline logic
async create(dto: CreateDto) {
  const validated = validate(dto);
  return repository.create(validated);
}

// After: Extracted method
async create(dto: CreateDto) {
  return this.createWithValidation(dto);
}
```

**Action:**
- No documentation needed (internal refactoring)
- Add `[skip-docs]` if CI complains

---

## Documentation File Locations

### API Documentation

- **Changelog**: `docs/api/updates/API_UPDATES.md`
- **Reference**: `docs/api/reference/` (if exists)
- **Specification**: `docs/specifications/api-specification.md` (if exists)

### Architecture Documentation

- **Main Architecture**: `docs/architecture/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
- **ADRs**: `docs/architecture/decisions/adr-###-*.md`

### User Guides

- **Guides**: `docs/guides/`
- **README**: `README.md` (for major features)

---

## CI Check Details

### What the Check Detects

The CI check uses semantic analysis to detect:

1. **New HTTP method decorators** (`@Get()`, `@Post()`, etc.)
2. **Changed route paths** (in `@Controller()` or method decorators)
3. **DTO property changes** (added/removed fields)
4. **Removed endpoints** (removed decorators)
5. **Authentication changes** (new/removed guards)

### What the Check Ignores

The check ignores:
- Method body changes (logic only)
- Comments and documentation strings
- Type-only changes (TypeScript types)
- Test file changes
- Import statement changes

### Change Classification

- **BREAKING**: Removed endpoints, removed fields → Always requires docs
- **NEW**: New endpoints, new fields → Requires docs
- **INTERNAL**: Refactoring, bug fixes → No docs needed
- **MINOR**: Error messages, logging → Optional docs

---

## Troubleshooting

### CI Check Failing But No API Changes

If the CI check fails but you believe no documentation is needed:

1. **Verify the change type:**
   - Check if it's truly internal (bug fix, refactoring)
   - Review the CI output for detected changes

2. **Use skip mechanism:**
   - Add `[skip-docs]` to commit message
   - Explain in PR why docs aren't needed

3. **Update docs anyway:**
   - Sometimes it's easier to add a brief note
   - Helps future developers understand the change

### CI Check Not Detecting Changes

If you made API changes but CI didn't detect them:

1. **Check your commit:**
   - Ensure changes are in the PR
   - Verify file paths are correct

2. **Manual documentation:**
   - Update docs manually
   - CI will pass once docs are updated

---

## Best Practices

### 1. Document Early

Update documentation as you code, not after:
- Easier to remember what changed
- Prevents forgetting to document
- Keeps PRs complete

### 2. Be Specific

When documenting:
- Include complete request/response examples
- Document all possible status codes
- Explain error scenarios
- Include permission requirements

### 3. Keep Examples Current

- Update examples when APIs change
- Test examples to ensure they work
- Use realistic data in examples

### 4. Link Related Docs

- Link to architecture docs for design decisions
- Link to guides for usage examples
- Cross-reference related endpoints

---

## Related Documentation

- **[API Specification](../specifications/api-specification.md)** - Complete API specification
- **[Development Workflow](./DEVELOPMENT_WORKFLOW.md)** - Git workflow and PR process
- **[Architecture Documentation](../architecture/README.md)** - System architecture

---

## Quick Reference

| Change Type | Docs Required? | Skip Allowed? |
|------------|----------------|---------------|
| New endpoint | ✅ Yes | ❌ No |
| Removed endpoint | ✅ Yes (BREAKING) | ❌ No |
| New DTO field | ✅ Yes | ❌ No |
| Removed DTO field | ✅ Yes (BREAKING) | ❌ No |
| Bug fix | ❌ No | ✅ Yes |
| Refactoring | ❌ No | ✅ Yes |
| Validation improvement | ❌ No | ✅ Yes |
| Type improvement | ❌ No | ✅ Yes |

---

**Last Updated:** 2025-01-28  
**Next Review:** 2025-02-28

