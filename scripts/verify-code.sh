#!/usr/bin/env bash
# Verification script for KOMPASS codebase
# Runs all code quality checks: format, lint, type-check, and tests
# Exit code: 0 if all pass, non-zero if any fail

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track results
FAILED_CHECKS=0
PASSED_CHECKS=0

# Parse arguments
SKIP_TESTS=false
FAST_MODE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --fast)
      FAST_MODE=true
      SKIP_TESTS=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--skip-tests] [--fast]"
      echo ""
      echo "Options:"
      echo "  --skip-tests    Skip unit tests (faster verification)"
      echo "  --fast          Fast mode (skip tests, minimal output)"
      echo "  --help          Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Print header
if [ "$FAST_MODE" = false ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 Running code verification checks..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi

# Function to run a check
run_check() {
  local check_name="$1"
  local check_command="$2"
  local description="${3:-$check_name}"

  if [ "$FAST_MODE" = false ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 $check_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
  fi

  if eval "$check_command"; then
    if [ "$FAST_MODE" = false ]; then
      echo ""
      echo -e "${GREEN}✅ $check_name passed${NC}"
      echo ""
    else
      echo -e "${GREEN}✅${NC} $check_name"
    fi
    ((PASSED_CHECKS++))
    return 0
  else
    if [ "$FAST_MODE" = false ]; then
      echo ""
      echo -e "${RED}❌ $check_name failed${NC}"
      echo ""
    else
      echo -e "${RED}❌${NC} $check_name"
    fi
    ((FAILED_CHECKS++))
    return 1
  fi
}

# ============================================================================
# 1. Build shared package (required for type-check and tests)
# ============================================================================
if [ "$FAST_MODE" = false ]; then
  echo "1️⃣  Building shared package..."
fi

if pnpm --filter @kompass/shared build > /dev/null 2>&1; then
  if [ "$FAST_MODE" = false ]; then
    echo "   ✅ Shared package built successfully"
    echo ""
  fi
else
  echo -e "${RED}❌ Shared package build failed${NC}"
  echo "   This is required for type-check and tests."
  exit 1
fi

# ============================================================================
# 2. Format Check
# ============================================================================
if ! run_check "Format Check" "pnpm format:check" "Checking code formatting with Prettier"; then
  echo -e "${YELLOW}💡 Tip: Run 'pnpm format' to auto-fix formatting issues${NC}"
  if [ "$FAST_MODE" = false ]; then
    echo ""
  fi
fi

# ============================================================================
# 3. Lint Check
# ============================================================================
if ! run_check "Lint Check" "pnpm lint" "Checking code quality with ESLint"; then
  echo -e "${YELLOW}💡 Tip: Some linting issues can be auto-fixed. Check the output above.${NC}"
  if [ "$FAST_MODE" = false ]; then
    echo ""
  fi
fi

# ============================================================================
# 4. Type Check
# ============================================================================
if ! run_check "Type Check" "pnpm type-check" "Checking TypeScript types"; then
  echo -e "${YELLOW}💡 Tip: Fix type errors shown above before committing${NC}"
  if [ "$FAST_MODE" = false ]; then
    echo ""
  fi
fi

# ============================================================================
# 5. Unit Tests (optional)
# ============================================================================
if [ "$SKIP_TESTS" = false ]; then
  # For long-running tests, use background execution with timeout
  if [ "$FAST_MODE" = false ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 Unit Tests"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Running unit tests (this may take a few minutes)..."
    echo ""
  fi

  # Run tests with timeout (5 minutes max) to prevent hanging
  # Check if timeout command is available
  if command -v timeout >/dev/null 2>&1; then
    # Use timeout command if available
    TEST_CMD="timeout 300 pnpm test:unit"
  else
    # Fallback: run without timeout (may hang on some systems)
    TEST_CMD="pnpm test:unit"
    if [ "$FAST_MODE" = false ]; then
      echo "   ⚠️  Warning: 'timeout' command not available. Tests may hang if they run too long."
      echo ""
    fi
  fi

  # Run tests and capture output
  if eval "$TEST_CMD > /tmp/test-output.log 2>&1"; then
    if [ "$FAST_MODE" = false ]; then
      cat /tmp/test-output.log
      echo ""
      echo -e "${GREEN}✅ Unit Tests passed${NC}"
      echo ""
    else
      echo -e "${GREEN}✅${NC} Unit Tests"
    fi
    ((PASSED_CHECKS++))
  else
    TEST_EXIT_CODE=$?
    if [ "$FAST_MODE" = false ]; then
      cat /tmp/test-output.log
      echo ""
      # Exit code 124 = timeout (if timeout command was used)
      if [ $TEST_EXIT_CODE -eq 124 ] && command -v timeout >/dev/null 2>&1; then
        echo -e "${RED}❌ Unit Tests timed out after 5 minutes${NC}"
        echo -e "${YELLOW}💡 Tip: Tests are taking too long. Check for infinite loops or slow tests.${NC}"
      else
        echo -e "${RED}❌ Unit Tests failed${NC}"
        echo -e "${YELLOW}💡 Tip: Fix failing tests before committing${NC}"
      fi
      echo ""
    else
      # Exit code 124 = timeout (if timeout command was used)
      if [ $TEST_EXIT_CODE -eq 124 ] && command -v timeout >/dev/null 2>&1; then
        echo -e "${RED}❌${NC} Unit Tests (timeout)"
      else
        echo -e "${RED}❌${NC} Unit Tests"
      fi
    fi
    ((FAILED_CHECKS++))
  fi
  # Clean up log file
  rm -f /tmp/test-output.log
else
  if [ "$FAST_MODE" = false ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏭️  Skipping unit tests (--skip-tests flag)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${YELLOW}⚠️  Warning: Tests were skipped. Run 'pnpm test:unit' before committing.${NC}"
    echo ""
  fi
fi

# ============================================================================
# Summary
# ============================================================================
if [ "$FAST_MODE" = false ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 Verification Summary"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo -e "${GREEN}✅ Passed: $PASSED_CHECKS${NC}"
  if [ $FAILED_CHECKS -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED_CHECKS${NC}"
  else
    echo -e "${GREEN}❌ Failed: $FAILED_CHECKS${NC}"
  fi
  echo ""
fi

# Exit with appropriate code
if [ $FAILED_CHECKS -eq 0 ]; then
  if [ "$FAST_MODE" = false ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ ALL VERIFICATION CHECKS PASSED${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
  fi
  exit 0
else
  if [ "$FAST_MODE" = false ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ VERIFICATION CHECKS FAILED${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Fix the issues above before committing."
    echo ""
  fi
  exit 1
fi

