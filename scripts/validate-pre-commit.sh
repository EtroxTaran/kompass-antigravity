#!/bin/bash
# Pre-Commit Hook Validation Script
# Validates that pre-commit and pre-push hooks match CI/CD requirements exactly

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Validating Git Hooks Match CI/CD Requirements"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VALIDATION_FAILED=false

# ============================================================================
# CI/CD Quality Gates (from .github/workflows/ci.yml)
# ============================================================================
CI_CHECKS=(
    "lint:pnpm lint"
    "format-check:pnpm format:check"
    "type-check:pnpm type-check"
    "unit-tests:pnpm --filter @kompass/backend test:cov"
    "unit-tests:pnpm --filter @kompass/frontend test:coverage"
    "security-audit:pnpm audit --audit-level=high"
)

# ============================================================================
# Validate Pre-Commit Hook
# ============================================================================
echo "1️⃣  Validating pre-commit hook (.husky/pre-commit)..."

PRE_COMMIT_FILE=".husky/pre-commit"

if [ ! -f "$PRE_COMMIT_FILE" ]; then
    echo "   ❌ Pre-commit hook file not found: $PRE_COMMIT_FILE"
    VALIDATION_FAILED=true
else
    # Check for required checks
    REQUIRED_PRE_COMMIT=(
        "format:check"
        "type-check"
        "lint-staged"
    )

    for check in "${REQUIRED_PRE_COMMIT[@]}"; do
        if ! grep -q "$check" "$PRE_COMMIT_FILE"; then
            echo "   ❌ Pre-commit hook missing: $check"
            VALIDATION_FAILED=true
        else
            echo "   ✅ Pre-commit hook contains: $check"
        fi
    done
fi

echo ""

# ============================================================================
# Validate Pre-Push Hook
# ============================================================================
echo "2️⃣  Validating pre-push hook (.husky/pre-push)..."

PRE_PUSH_FILE=".husky/pre-push"

if [ ! -f "$PRE_PUSH_FILE" ]; then
    echo "   ❌ Pre-push hook file not found: $PRE_PUSH_FILE"
    VALIDATION_FAILED=true
else
    # Check for required checks (must match CI exactly)
    REQUIRED_PRE_PUSH=(
        "pnpm lint"
        "pnpm format:check"
        "pnpm type-check"
        "test:cov"
        "test:coverage"
        "pnpm audit --audit-level=high"
    )

    for check in "${REQUIRED_PRE_PUSH[@]}"; do
        if ! grep -q "$check" "$PRE_PUSH_FILE"; then
            echo "   ❌ Pre-push hook missing: $check"
            VALIDATION_FAILED=true
        else
            echo "   ✅ Pre-push hook contains: $check"
        fi
    done

    # Verify lint doesn't use --fix (CI doesn't auto-fix)
    if grep -q "pnpm lint.*--fix" "$PRE_PUSH_FILE"; then
        echo "   ❌ Pre-push hook uses 'pnpm lint --fix' (CI doesn't auto-fix)"
        VALIDATION_FAILED=true
    else
        echo "   ✅ Pre-push hook lint command matches CI (no --fix)"
    fi

    # Verify format:check is read-only (not --write)
    if grep -q "format.*--write" "$PRE_PUSH_FILE"; then
        echo "   ❌ Pre-push hook uses 'format --write' (CI uses format:check)"
        VALIDATION_FAILED=true
    else
        echo "   ✅ Pre-push hook format check matches CI (read-only)"
    fi
fi

echo ""

# ============================================================================
# Validate ESLint Scripts
# ============================================================================
echo "3️⃣  Validating ESLint scripts..."

# Backend should have lint (no fix) and lint:fix (with fix)
if grep -q '"lint":.*--fix' "apps/backend/package.json"; then
    echo "   ❌ Backend lint script uses --fix (should be separate lint:fix)"
    VALIDATION_FAILED=true
else
    echo "   ✅ Backend lint script (no --fix) for CI"
fi

if ! grep -q '"lint:fix":.*--fix' "apps/backend/package.json"; then
    echo "   ⚠️  Backend missing lint:fix script (optional but recommended)"
else
    echo "   ✅ Backend has lint:fix script for auto-fixing"
fi

# Frontend should have lint (no fix) and lint:fix (with fix)
if grep -q '"lint":.*--fix' "apps/frontend/package.json"; then
    echo "   ❌ Frontend lint script uses --fix (should be separate lint:fix)"
    VALIDATION_FAILED=true
else
    echo "   ✅ Frontend lint script (no --fix) for CI"
fi

if ! grep -q '"lint:fix":.*--fix' "apps/frontend/package.json"; then
    echo "   ⚠️  Frontend missing lint:fix script (optional but recommended)"
else
    echo "   ✅ Frontend has lint:fix script for auto-fixing"
fi

echo ""

# ============================================================================
# Validate Coverage Thresholds
# ============================================================================
echo "4️⃣  Validating coverage thresholds..."

# Check backend jest.config.js
if grep -q "coverageThreshold" "jest.config.js"; then
    if grep -q '"branches": 80' "jest.config.js" && \
       grep -q '"functions": 80' "jest.config.js" && \
       grep -q '"lines": 80' "jest.config.js" && \
       grep -q '"statements": 80' "jest.config.js"; then
        echo "   ✅ Backend coverage thresholds configured (80% global)"
    else
        echo "   ❌ Backend coverage thresholds don't match requirements (80% global)"
        VALIDATION_FAILED=true
    fi
else
    echo "   ❌ Backend coverage thresholds not configured"
    VALIDATION_FAILED=true
fi

# Check frontend vite.config.ts
if grep -q "coverageThreshold\|thresholds" "apps/frontend/vite.config.ts"; then
    if grep -q '"branches": 80' "apps/frontend/vite.config.ts" && \
       grep -q '"functions": 80' "apps/frontend/vite.config.ts" && \
       grep -q '"lines": 80' "apps/frontend/vite.config.ts" && \
       grep -q '"statements": 80' "apps/frontend/vite.config.ts"; then
        echo "   ✅ Frontend coverage thresholds configured (80% global)"
    else
        echo "   ❌ Frontend coverage thresholds don't match requirements (80% global)"
        VALIDATION_FAILED=true
    fi
else
    echo "   ❌ Frontend coverage thresholds not configured"
    VALIDATION_FAILED=true
fi

echo ""

# ============================================================================
# Summary
# ============================================================================
if [ "$VALIDATION_FAILED" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ VALIDATION FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Some hooks or configurations don't match CI/CD requirements."
    echo "Please fix the issues above to ensure local checks match CI."
    echo ""
    exit 1
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ VALIDATION PASSED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "All hooks and configurations match CI/CD requirements."
    echo "Local checks will catch the same issues as CI."
    echo ""
fi

