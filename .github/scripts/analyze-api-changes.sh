#!/bin/bash
# API Change Analysis Helper Script
# Extracts and analyzes API changes from git diff for better reporting
# Used by check-docs-update.sh for detailed change classification

set -e

BASE_REF="${1:-origin/main}"
if [ -z "$GITHUB_BASE_REF" ] && [ -z "$GITHUB_REF_NAME" ]; then
  BASE_REF="HEAD~1"
fi

GIT_DIFF=$(git diff "$BASE_REF"...HEAD 2>/dev/null || git diff HEAD~1)

# Output JSON structure for change analysis
output_json() {
  local change_type="$1"
  local has_changes="$2"
  local details="$3"
  
  cat <<EOF
{
  "changeType": "$change_type",
  "hasChanges": "$has_changes",
  "details": "$details"
}
EOF
}

# Detect new endpoints
detect_new_endpoints() {
  echo "$GIT_DIFF" | grep -E "^\+.*@(Get|Post|Put|Patch|Delete)\(['\"]" | \
    sed 's/^+//' | sed 's/^[[:space:]]*//' | head -10
}

# Detect removed endpoints
detect_removed_endpoints() {
  echo "$GIT_DIFF" | grep -E "^\-.*@(Get|Post|Put|Patch|Delete)\(['\"]" | \
    sed 's/^-//' | sed 's/^[[:space:]]*//' | head -10
}

# Detect route path changes
detect_route_changes() {
  local controller_changes=$(echo "$GIT_DIFF" | grep -E "^[\+\-].*@Controller\(['\"]" | head -5)
  local method_changes=$(echo "$GIT_DIFF" | grep -E "^[\+\-].*@(Get|Post|Put|Patch|Delete)\(['\"][^'\"]+['\"]\)" | head -5)
  
  if [ -n "$controller_changes" ] || [ -n "$method_changes" ]; then
    echo "Route changes detected"
    [ -n "$controller_changes" ] && echo "$controller_changes"
    [ -n "$method_changes" ] && echo "$method_changes"
  fi
}

# Detect DTO property changes
detect_dto_changes() {
  local dto_diff=$(echo "$GIT_DIFF" | grep -E "\.dto\.ts$" || true)
  
  if [ -z "$dto_diff" ]; then
    return
  fi

  local added_props=$(echo "$dto_diff" | grep -E "^\+.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:" | \
    sed 's/^+//' | sed 's/^[[:space:]]*//' | head -10)
  local removed_props=$(echo "$dto_diff" | grep -E "^\-.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:" | \
    sed 's/^-//' | sed 's/^[[:space:]]*//' | head -10)

  if [ -n "$added_props" ]; then
    echo "Added properties:"
    echo "$added_props"
  fi

  if [ -n "$removed_props" ]; then
    echo "Removed properties (BREAKING):"
    echo "$removed_props"
  fi
}

# Detect authentication/authorization changes
detect_auth_changes() {
  local guard_changes=$(echo "$GIT_DIFF" | grep -E "^[\+\-].*@UseGuards\(" | head -5)
  local permission_changes=$(echo "$GIT_DIFF" | grep -E "^[\+\-].*@RequirePermission\(" | head -5)
  
  if [ -n "$guard_changes" ] || [ -n "$permission_changes" ]; then
    echo "Auth changes detected"
    [ -n "$guard_changes" ] && echo "$guard_changes"
    [ -n "$permission_changes" ] && echo "$permission_changes"
  fi
}

# Main analysis
main() {
  local has_breaking=false
  local has_new=false
  local has_internal=false
  local details=""

  # Check for breaking changes
  if [ -n "$(detect_removed_endpoints)" ]; then
    has_breaking=true
    details="${details}Removed endpoints (BREAKING):\n$(detect_removed_endpoints)\n\n"
  fi

  if echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -qE "^\-.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:"; then
    has_breaking=true
    details="${details}Removed DTO properties (BREAKING):\n$(detect_dto_changes | grep -A 100 "Removed properties")\n\n"
  fi

  # Check for new features
  if [ -n "$(detect_new_endpoints)" ]; then
    has_new=true
    details="${details}New endpoints:\n$(detect_new_endpoints)\n\n"
  fi

  if echo "$GIT_DIFF" | grep -E "\.dto\.ts$" | grep -qE "^\+.*[a-zA-Z_][a-zA-Z0-9_]*\??\s*:"; then
    has_new=true
    details="${details}New DTO properties:\n$(detect_dto_changes | grep -A 100 "Added properties")\n\n"
  fi

  # Check for route changes
  local route_changes=$(detect_route_changes)
  if [ -n "$route_changes" ]; then
    has_new=true
    details="${details}Route changes:\n${route_changes}\n\n"
  fi

  # Check for auth changes
  local auth_changes=$(detect_auth_changes)
  if [ -n "$auth_changes" ]; then
    has_new=true
    details="${details}${auth_changes}\n\n"
  fi

  # Determine change type
  local change_type="INTERNAL"
  if [ "$has_breaking" = true ]; then
    change_type="BREAKING"
  elif [ "$has_new" = true ]; then
    change_type="NEW"
  fi

  # Output results
  if [ "$change_type" != "INTERNAL" ]; then
    output_json "$change_type" "true" "$details"
  else
    output_json "$change_type" "false" "No API contract changes detected"
  fi
}

# Run analysis
main

