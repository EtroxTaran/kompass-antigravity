# File Organization Enforcement

**Last Updated**: 2025-01-27

This document describes the automated enforcement mechanisms for file organization rules.

---

## Overview

KOMPASS enforces strict file organization rules to maintain a clean, professional project structure. These rules are **automatically enforced** at multiple checkpoints.

---

## Enforcement Checkpoints

### 1. Pre-Commit Hook (Local)

**When**: Before each commit  
**Location**: `.husky/pre-commit`

**Checks**:
1. ✅ Root directory organization (no forbidden .md files)
2. ✅ Forbidden file patterns (no backup files, temp files, etc.)
3. ✅ Lint-staged (code quality)

**What it blocks**:
```bash
# ❌ BLOCKED - Documentation in root
git add IMPLEMENTATION_SUMMARY.md
git commit -m "test"
# Error: Forbidden documentation files in root directory

# ❌ BLOCKED - Backup files
git add old_version_backup.ts
git commit -m "test"
# Error: Forbidden file patterns detected

# ✅ ALLOWED - Proper location
git add docs/deployment/IMPLEMENTATION_SUMMARY.md
git commit -m "test"
# Success!
```

### 2. GitHub Actions (CI/CD)

**When**: On every pull request  
**Location**: `.github/workflows/pr-checks.yml`

**Job**: `root-directory-check`
**Script**: `.github/scripts/check-root-directory.sh`

**What it checks**:
- All files in root directory
- Validates against allowed list
- Checks for forbidden patterns
- Suggests correct locations

**Result**: PR cannot be merged if check fails

---

## Forbidden File Patterns

### Documentation Files (Must be in docs/)

```bash
# ❌ FORBIDDEN in root directory
IMPLEMENTATION*.md          → docs/implementation/ or docs/deployment/
MIGRATION*.md               → docs/guides/ or docs/implementation/migrations/
DEVELOPMENT.md              → docs/guides/
DEPLOYMENT*.md              → docs/deployment/
USAGE*.md                   → docs/guides/
CODING*.md                  → docs/guides/
SETUP*.md                   → docs/implementation/ or docs/deployment/
API*.md                     → docs/api/
*_GUIDE.md                  → docs/guides/
*_SPECIFICATION.md          → docs/specifications/
*_UPDATES.md                → docs/api/
*_COMPLETE.md               → docs/implementation/ or docs/deployment/
*_SUMMARY.md                → docs/implementation/ or docs/deployment/
```

### Version Control Anti-Patterns (Use Git!)

```bash
# ❌ NEVER commit these patterns
*_backup*, *.backup, *.bak  → Use: git commit
*_old, *.old                → Use: git branch
*_v2, *_v3, *.v2            → Use: git tag
*_fixed, *.fixed            → Use: git commit with fix
*_copy, *.copy              → Use: git branch
*_temp, *.temp, *.tmp       → Delete or add to .gitignore
*~, *.swp                   → Editor temp files (already gitignored)
```

---

## Allowed Root Files

**Only these files belong in project root**:

### Documentation (4 files)
- ✅ `README.md` - Project overview and quick start
- ✅ `CHANGELOG.md` - Version history and releases
- ✅ `LICENSE` - License information
- ✅ `CONTRIBUTING.md` - Contribution guidelines (optional)

### Configuration (Standard files)
- ✅ `package.json` - Node.js dependencies
- ✅ `pnpm-workspace.yaml` - Monorepo configuration
- ✅ `turbo.json` - Turborepo configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `jest.config.js` - Test configuration
- ✅ `playwright.config.ts` - E2E test configuration
- ✅ `commitlint.config.js` - Commit linting
- ✅ `docker-compose*.yml` - Container orchestration

**Everything else goes in subdirectories!**

---

## Correct Documentation Organization

```
kompass/
├── README.md                    ✅ Root: Project overview
├── CHANGELOG.md                 ✅ Root: Version history
├── CONTRIBUTING.md              ✅ Root: How to contribute
├── LICENSE                      ✅ Root: License
│
└── docs/                        ✅ All other documentation
    ├── api/                     ✅ API documentation
    │   ├── reference/
    │   └── updates/
    │
    ├── architecture/            ✅ Architecture docs
    │   └── decisions/           ✅ ADRs (Architecture Decision Records)
    │
    ├── deployment/              ✅ Deployment & CI/CD
    │   ├── QUICK_START.md
    │   ├── DEPLOYMENT_GUIDE.md
    │   ├── IMPLEMENTATION_SUMMARY.md  ✅ Moved from root!
    │   └── ...
    │
    ├── guides/                  ✅ User & developer guides
    │   ├── DEVELOPMENT.md
    │   └── ...
    │
    ├── implementation/          ✅ Implementation details
    │   └── migrations/
    │
    ├── processes/               ✅ Process documentation
    │   ├── DEVELOPMENT_WORKFLOW.md
    │   └── ...
    │
    └── specifications/          ✅ Technical specifications
        ├── API_SPECIFICATION.md
        └── ...
```

---

## How to Fix Violations

### If Pre-Commit Hook Fails

```bash
# 1. Check what was blocked
git status

# 2. Move file to correct location
mv IMPLEMENTATION_SUMMARY.md docs/deployment/

# 3. Stage corrected file
git add docs/deployment/IMPLEMENTATION_SUMMARY.md

# 4. Commit
git commit -m "docs(KOM-XXX): move implementation summary to correct location"
```

### If GitHub Actions Check Fails

1. **Review the error** in GitHub Actions logs
2. **Identify the forbidden file(s)**
3. **Move to correct location**:
   ```bash
   git mv <file> docs/<subdirectory>/
   git commit -m "docs(KOM-XXX): organize documentation properly"
   git push
   ```

### If You Have Backup/Temp Files

```bash
# ❌ DON'T commit these
git rm component_backup.tsx
git rm old_version.ts
git rm temp_fix.js

# ✅ INSTEAD use Git for versioning
git commit -m "refactor(KOM-XXX): improve component"
git tag v1.0.0  # For version markers
```

---

## Testing the Enforcement

### Test Pre-Commit Hook

```bash
# Create a forbidden file
echo "# Test" > IMPLEMENTATION_SUMMARY.md

# Try to commit
git add IMPLEMENTATION_SUMMARY.md
git commit -m "test"

# Should fail with clear error message

# Fix it
git rm --cached IMPLEMENTATION_SUMMARY.md
mv IMPLEMENTATION_SUMMARY.md docs/deployment/
git add docs/deployment/IMPLEMENTATION_SUMMARY.md
git commit -m "test"

# Should succeed
```

### Test GitHub Actions

```bash
# Create PR with forbidden file
# Watch GitHub Actions run
# Should see "Root Directory Organization Check" fail

# Fix and push again
# Should see check pass
```

---

## Bypassing Checks (NOT RECOMMENDED)

### Skip Pre-Commit Hook

```bash
git commit --no-verify
```

**⚠️ WARNING**: 
- You'll still fail GitHub Actions
- Your PR will be blocked
- Not recommended except for emergencies

### Override GitHub Actions

Not possible - checks are required for merge.

---

## Maintenance

### Adding New Forbidden Patterns

1. **Update**: `.github/scripts/check-root-directory.sh`
2. **Update**: `.husky/pre-commit` (if pattern needs pre-commit check)
3. **Update**: `.gitignore` (add pattern to help prevent accidents)
4. **Test**: Create test file and verify it's blocked

### Adding New Allowed Root Files

1. **Update**: `.github/scripts/check-root-directory.sh` → `ALLOWED_FILES` array
2. **Document**: Update this file
3. **Test**: Verify file is allowed

---

## Related Documentation

- **Rules**: `.cursor/rules/file-organization.mdc`
- **Rules**: `.cursor/rules/documentation-organization.mdc`
- **Git Workflow**: `.cursor/rules/git-workflow.mdc`
- **Pre-Commit Hook**: `.husky/pre-commit`
- **GitHub Actions**: `.github/workflows/pr-checks.yml`
- **Check Script**: `.github/scripts/check-root-directory.sh`

---

## FAQ

### Q: Why are these rules so strict?

**A**: To maintain a professional, organized codebase that:
- Is easy to navigate
- Looks professional to clients/stakeholders
- Makes documentation discoverable
- Prevents clutter and confusion

### Q: Can I disable these checks?

**A**: No. They are required for merge to main/develop.

### Q: What if I need a special case?

**A**: Discuss with tech lead. Rules may be updated if there's a valid reason.

### Q: I have a file that doesn't fit any category

**A**: Put it in `docs/` with an appropriate subdirectory. Create new subdirectories if needed.

---

**Enforced By**: Pre-commit hooks + GitHub Actions  
**Required For**: All commits and PRs  
**Bypass**: Not allowed (checks are required)

**Questions?** See `.cursor/rules/file-organization.mdc` or ask tech lead

