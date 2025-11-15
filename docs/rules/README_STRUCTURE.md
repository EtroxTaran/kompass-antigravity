# Documentation Root Structure - Minimal Approach

**Principle**: Keep `docs/` root minimal - only 2 files maximum.

---

## ✅ Allowed in `docs/` Root

**ONLY these files:**

1. **`README.md`** - Main documentation index
   - Provides navigation to all documentation
   - Links to all categories
   - Quick start guide
   - **This is the ONLY entry point**

2. **`CHANGELOG.md`** - Version history (optional)
   - Project changelog
   - Version history
   - Can be omitted if using GitHub releases

---

## ❌ Forbidden in `docs/` Root

**ALL other files must be in subfolders:**

- ❌ `API_UPDATES.md` → `api/updates/API_UPDATES.md`
- ❌ `IMPLEMENTATION_SUMMARY.md` → `implementation/reports/IMPLEMENTATION_SUMMARY.md`
- ❌ `MIGRATION_GUIDE.md` → `implementation/migrations/MIGRATION_GUIDE.md`
- ❌ `FILE_ORGANIZATION_RULES.md` → `rules/FILE_ORGANIZATION_RULES.md`
- ❌ Any other `.md` files

---

## Benefits of Minimal Root

1. **Clean Navigation** - Easy to find main index
2. **Clear Structure** - All docs organized by category
3. **Scalability** - Can add many docs without clutter
4. **Professional** - Industry best practice
5. **Discoverability** - Clear where to find things

---

## README.md Structure

The `docs/README.md` should:

1. **Provide clear navigation** to all categories
2. **Link to important documents** directly
3. **Include quick start** for new team members
4. **List all categories** with descriptions
5. **Provide search hints** (if using site generator)

---

## Future Enhancement: Documentation Site

For better navigation, consider:

- **Docusaurus** - React-based, excellent for monorepos
- **MkDocs** - Python-based, simple and fast
- **VitePress** - Vue-based, very fast

See `docs/DOCUMENTATION_SOLUTIONS.md` for details.

---

**Rule**: If creating a new `.md` file in `docs/` root, ask: "Should this be in a subfolder?" The answer is almost always YES.
