#!/bin/bash
# Documentation Update Check Script
# Validates that documentation is updated when code changes require it
# Enhanced with semantic API change detection to reduce false positives

set -e

echo "🔍 Checking if documentation needs to be updated..."

# Get base ref for comparison
if [ -n "$GITHUB_BASE_REF" ]; then
  BASE_REF="origin/$GITHUB_BASE_REF"
elif [ -n "$GITHUB_REF_NAME" ]; then
  BASE_REF="origin/$GITHUB_REF_NAME"
else
  BASE_REF="HEAD~1"
fi

# Check for skip mechanism
check_skip_mechanism() {
  # Check environment variable
  if [ "$SKIP_DOCS_CHECK" = "true" ]; then
    echo "⚠️  Documentation check skipped (SKIP_DOCS_CHECK=true)"
    echo "   Please ensure you've documented why docs are not needed in your PR"
    exit 0
  fi

  # Check commit messages for skip markers
  if git log "$BASE_REF"..HEAD --oneline 2>/dev/null | grep -qiE "\[skip-docs\]|\[no-docs\]"; then
    echo "⚠️  Documentation check skipped (found [skip-docs] or [no-docs] in commit message)"
    echo "   Please ensure you've documented why docs are not needed in your PR"
    exit 0
  fi
}

check_skip_mechanism

# Get changed files in this PR/commit
CHANGED_FILES=$(git diff --name-only "$BASE_REF"...HEAD 2>/dev/null || git diff --name-only HEAD~1)

# Get git diff for semantic analysis
GIT_DIFF=$(git diff "$BASE_REF"...HEAD 2>/dev/null || git diff HEAD~1)

# Flags to track if docs are needed
NEEDS_API_DOCS=false
NEEDS_ARCHITECTURE_DOCS=false
NEEDS_GUIDE_DOCS=false
DOCS_UPDATED=false

# Change classification
CHANGE_TYPE=""  # BREAKING, NEW, INTERNAL, MINOR
API_CHANGES_DETAILS=""

# Function to detect actual API changes (not just file changes)
detect_api_changes() {
  local has_api_changes=false
  local change_details=""

  # Check for new HTTP method decorators (new endpoints)
  if echo "$GIT_DIFF" | grep -qE "^\+.*@(Get|Post|Put|Patch|Delete)\(['\"]"; then
    has_api_changes=true
    local new_endpoints=$(echo "$GIT_DIFF" | grep -E "^\+.*@(Get|Post|Put|Patch|Delete)\(['\"]" | sed 's/^+//' | head -5)
    change_details="${change_details}  • New endpoints detected:\n"
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        change_details="${change_details}    - $line\n"
      fi
    done <<< "$new_endpoints"
  fi

  # Check for changed route paths in @Controller or method decorators
  if echo "$GIT_DIFF" | grep -qE "^\+.*@Controller\(['\"]|^\-.*@Controller\(['\"]"; then
    has_api_changes=true
    change_details="${change_details}  • Controller route paths changed\n"
  fi

  # Check for changed route paths in method decorators
  if echo "$GIT_DIFF" | grep -qE "^\+.*@(Get|Post|Put|Patch|Delete)\(['\"][^'\"]+['\"]\)|^\-.*@(Get|Post|Put|Patch|Delete)\(['\"][^'\"]+['\"]\)"; then
    has_api_changes=true
    change_details="${change_details}  • Endpoint route paths changed\n"
  fi

  # Check for DTO property additions/removals (affecting request/response)
  local dto_files=$(echo "$CHANGED_FILES" | grep -E "\.dto\.ts$" || true)
  if [ -n "$dto_files" ]; then
    # Check for added properties (new fields in request/response)
    if echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -qE "^\+.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:"; then
      has_api_changes=true
      local added_props=$(echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -E "^\+.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:" | sed 's/^+//' | head -5)
      change_details="${change_details}  • DTO properties added (new request/response fields):\n"
      while IFS= read -r line; do
        if [ -n "$line" ]; then
          change_details="${change_details}    - $line\n"
        fi
      done <<< "$added_props"
    fi

    # Check for removed properties (breaking change)
    if echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -qE "^\-.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:"; then
      has_api_changes=true
      CHANGE_TYPE="BREAKING"
      local removed_props=$(echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -E "^\-.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:" | sed 's/^-//' | head -5)
      change_details="${change_details}  • DTO properties removed (BREAKING CHANGE):\n"
      while IFS= read -r line; do
        if [ -n "$line" ]; then
          change_details="${change_details}    - $line\n"
        fi
      done <<< "$removed_props"
    fi
  fi

  # Check for removed HTTP method decorators (removed endpoints - breaking)
  if echo "$GIT_DIFF" | grep -qE "^\-.*@(Get|Post|Put|Patch|Delete)\(['\"]"; then
    has_api_changes=true
    CHANGE_TYPE="BREAKING"
    change_details="${change_details}  • Endpoints removed (BREAKING CHANGE)\n"
  fi

  # Check for changed HTTP status codes (if we can detect them)
  if echo "$GIT_DIFF" | grep -qE "@HttpCode\(|@ApiResponse\(.*status.*:"; then
    has_api_changes=true
    change_details="${change_details}  • HTTP status codes changed\n"
  fi

  # Check for changed authentication/authorization (guards, decorators)
  if echo "$GIT_DIFF" | grep -qE "^\+.*@UseGuards\(|^\-.*@UseGuards\(|^\+.*@RequirePermission\(|^\-.*@RequirePermission\("; then
    has_api_changes=true
    change_details="${change_details}  • Authentication/authorization requirements changed\n"
  fi

  if [ "$has_api_changes" = true ]; then
    API_CHANGES_DETAILS="$change_details"
    if [ -z "$CHANGE_TYPE" ]; then
      CHANGE_TYPE="NEW"
    fi
    return 0
  fi

  return 1
}

# Function to classify change type
classify_change_type() {
  # If we already classified as BREAKING, keep it
  if [ "$CHANGE_TYPE" = "BREAKING" ]; then
    return
  fi

  # Check if only internal changes (method body, comments, types)
  local only_internal=true

  # If we detected API changes, it's not internal
  if detect_api_changes; then
    only_internal=false
  fi

  # Check if only method body changes (no decorator or signature changes)
  if [ "$only_internal" = true ]; then
    # Check if there are any decorator changes
    if echo "$GIT_DIFF" | grep -qE "^\+.*@|^\-.*@"; then
      only_internal=false
    fi

    # Check if there are signature changes (parameter additions/removals)
    if echo "$GIT_DIFF" | grep -qE "^\+.*\(.*:.*\)|^\-.*\(.*:.*\)"; then
      only_internal=false
    fi
  fi

  if [ "$only_internal" = true ]; then
    CHANGE_TYPE="INTERNAL"
    return
  fi

  # If we have API changes but not breaking, classify as NEW
  if [ -z "$CHANGE_TYPE" ]; then
    CHANGE_TYPE="NEW"
  fi
}

# Check for API changes using semantic detection
if echo "$CHANGED_FILES" | grep -qE "apps/backend/src/.*\.(controller|dto)\.ts$"; then
  if detect_api_changes; then
    echo "⚠️  API changes detected (semantic analysis)"
    echo -e "$API_CHANGES_DETAILS"
    NEEDS_API_DOCS=true
  else
    # File changed but no actual API contract change detected
    classify_change_type
    if [ "$CHANGE_TYPE" = "INTERNAL" ]; then
      echo "ℹ️  Controller/DTO file changed but only internal changes detected (refactoring, bug fixes, etc.)"
      echo "   No documentation update required for internal-only changes"
    else
      echo "⚠️  Controller/DTO file changed - please verify if API documentation is needed"
      NEEDS_API_DOCS=true
    fi
  fi
fi

# Check for architecture changes (new modules, structural changes)
if echo "$CHANGED_FILES" | grep -qE "apps/backend/src/modules/[^/]+/[^/]+\.module\.ts$" || \
   echo "$CHANGED_FILES" | grep -qE "apps/backend/src/config/|apps/backend/src/common/"; then
  echo "⚠️  Architecture changes detected (modules or core structure changed)"
  NEEDS_ARCHITECTURE_DOCS=true
fi

# Check for new features (new feature directories)
if echo "$CHANGED_FILES" | grep -qE "apps/frontend/src/features/[^/]+/" && \
   git diff --name-status "$BASE_REF"...HEAD 2>/dev/null | grep -q "^A.*apps/frontend/src/features/"; then
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
WARNING_ONLY=false

if [ "$NEEDS_API_DOCS" = true ]; then
  if echo "$CHANGED_FILES" | grep -qE "^docs/(api/|specifications/)"; then
    echo "✅ API documentation was updated"
  else
    if [ "$CHANGE_TYPE" = "BREAKING" ]; then
      echo "❌ BREAKING API changes detected but documentation was not updated"
      echo "   BREAKING changes require immediate documentation updates"
      DOCS_CHECK_FAILED=true
    elif [ "$CHANGE_TYPE" = "NEW" ]; then
      echo "❌ New API changes detected but documentation was not updated"
      DOCS_CHECK_FAILED=true
    else
      echo "⚠️  API changes detected but documentation was not updated"
      WARNING_ONLY=true
    fi

    if [ "$DOCS_CHECK_FAILED" = true ] || [ "$WARNING_ONLY" = true ]; then
      echo ""
      echo "   Please update:"
      echo "   - docs/api/reference/ for endpoint changes"
      echo "   - docs/api/updates/API_UPDATES.md for API changelog"
      echo "   - docs/specifications/api-specification.md if specification changed"
      echo ""
      echo "   See: docs/processes/documentation-update-guide.md for detailed instructions"
      echo ""
      if [ "$DOCS_CHECK_FAILED" = true ]; then
        DOCS_CHECK_FAILED=true
      fi
    fi
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
    echo "If you believe this check is incorrect, you can:"
    echo "1. Add [skip-docs] to your commit message (with explanation in PR)"
    echo "2. Set SKIP_DOCS_CHECK=true in your PR (with explanation)"
    echo "3. Review the changed files and ensure all user-facing changes are documented"
    echo ""
    echo "See: docs/processes/documentation-update-guide.md for guidance"
    echo ""
    exit 1
  fi
else
  echo "ℹ️  Only tests, docs, or scripts changed - no additional documentation required"
fi

echo ""
echo "✅ Documentation check passed"
exit 0
