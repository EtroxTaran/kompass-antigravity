#!/bin/bash
# Documentation Update Check Script
# Validates that documentation is updated when code changes require it

set -e

echo "🔍 Checking if documentation needs to be updated..."

# Get changed files in this PR/commit
CHANGED_FILES=$(git diff --name-only origin/$GITHUB_BASE_REF...HEAD 2>/dev/null || git diff --name-only HEAD~1)

# Flags to track if docs are needed
NEEDS_API_DOCS=false
NEEDS_ARCHITECTURE_DOCS=false
NEEDS_GUIDE_DOCS=false
DOCS_UPDATED=false

# Check for API changes (controllers, DTOs, routes)
if echo "$CHANGED_FILES" | grep -qE "apps/backend/src/.*\.(controller|dto|guard|module)\.ts$"; then
    echo "⚠️  API changes detected (controllers, DTOs, or modules changed)"
    NEEDS_API_DOCS=true
fi

# Check for architecture changes (new modules, structural changes)
if echo "$CHANGED_FILES" | grep -qE "apps/backend/src/modules/[^/]+/[^/]+\.module\.ts$" || \
   echo "$CHANGED_FILES" | grep -qE "apps/backend/src/config/|apps/backend/src/common/"; then
    echo "⚠️  Architecture changes detected (modules or core structure changed)"
    NEEDS_ARCHITECTURE_DOCS=true
fi

# Check for new features (new feature directories)
if echo "$CHANGED_FILES" | grep -qE "apps/frontend/src/features/[^/]+/" && \
   git diff --name-status origin/$GITHUB_BASE_REF...HEAD 2>/dev/null | grep -q "^A.*apps/frontend/src/features/"; then
    echo "⚠️  New feature detected"
    NEEDS_GUIDE_DOCS=true
fi

# Check if any documentation was updated
if echo "$CHANGED_FILES" | grep -qE "^docs/"; then
    echo "✅ Documentation files were updated"
    DOCS_UPDATED=true
fi

# Check if README was updated (for major features)
if echo "$CHANGED_FILES" | grep -q "^README\.md$"; then
    echo "✅ README.md was updated"
    DOCS_UPDATED=true
fi

# Validation logic
DOCS_CHECK_FAILED=false

if [ "$NEEDS_API_DOCS" = true ]; then
    if echo "$CHANGED_FILES" | grep -qE "^docs/(api/|specifications/API_SPECIFICATION\.md)"; then
        echo "✅ API documentation was updated"
    else
        echo "❌ API changes detected but docs/api/ or API_SPECIFICATION.md was not updated"
        echo "   Please update:"
        echo "   - docs/api/reference/ for endpoint changes"
        echo "   - docs/api/updates/API_UPDATES.md for API changelog"
        echo "   - docs/specifications/API_SPECIFICATION.md if specification changed"
        DOCS_CHECK_FAILED=true
    fi
fi

if [ "$NEEDS_ARCHITECTURE_DOCS" = true ]; then
    if echo "$CHANGED_FILES" | grep -qE "^docs/architecture/"; then
        echo "✅ Architecture documentation was updated"
    else
        echo "❌ Architecture changes detected but docs/architecture/ was not updated"
        echo "   Please update:"
        echo "   - docs/architecture/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md"
        echo "   - Create ADR in docs/architecture/decisions/ if this is a significant decision"
        DOCS_CHECK_FAILED=true
    fi
fi

if [ "$NEEDS_GUIDE_DOCS" = true ]; then
    if echo "$CHANGED_FILES" | grep -qE "^(docs/guides/|README\.md)"; then
        echo "✅ User guides or README were updated"
    else
        echo "⚠️  New feature detected but guides/README not updated"
        echo "   Consider updating:"
        echo "   - README.md for major features"
        echo "   - docs/guides/ for user-facing features"
        # This is a warning, not an error
    fi
fi

# Special case: If only tests/docs changed, no docs update needed
if echo "$CHANGED_FILES" | grep -qvE "\.(spec|test)\.(ts|tsx)$" && \
   echo "$CHANGED_FILES" | grep -qvE "^(docs/|README\.md|\.github/|scripts/)"; then
    # Code changes detected (not just tests/docs/scripts)
    if [ "$DOCS_CHECK_FAILED" = true ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ DOCUMENTATION CHECK FAILED"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Code changes detected that require documentation updates."
        echo "Please update the relevant documentation files and commit them."
        echo ""
        echo "If you believe this check is incorrect, please:"
        echo "1. Review the changed files listed above"
        echo "2. Ensure all user-facing changes are documented"
        echo "3. Add a comment in your PR explaining why docs are not needed"
        echo ""
        exit 1
    fi
else
    echo "ℹ️  Only tests, docs, or scripts changed - no additional documentation required"
fi

echo ""
echo "✅ Documentation check passed"
exit 0

