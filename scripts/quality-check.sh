#!/bin/bash
# Quality Check Script
# Runs all quality checks in the same order as CI/CD pipeline
# This ensures local checks match CI exactly

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Running Quality Checks (CI Parity)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================================
# 1. Build shared package first (required for type-check and tests)
# ============================================================================
echo "1️⃣  Building shared package..."
pnpm --filter @kompass/shared build

if [ $? -ne 0 ]; then
    echo "❌ Shared package build failed"
    exit 1
fi

echo "   ✅ Shared package built successfully"
echo ""

# ============================================================================
# 2. Run ESLint (full codebase, no --fix, matches CI)
# ============================================================================
echo "2️⃣  Running ESLint (full codebase, no auto-fix)..."
pnpm lint

if [ $? -ne 0 ]; then
    echo "❌ ESLint failed"
    echo "   Run 'pnpm lint:fix' in individual packages to auto-fix issues"
    exit 1
fi

echo "   ✅ ESLint passed"
echo ""

# ============================================================================
# 3. Run Prettier format check (read-only, matches CI)
# ============================================================================
echo "3️⃣  Running Prettier format check (read-only)..."
pnpm format:check

if [ $? -ne 0 ]; then
    echo "❌ Format check failed"
    echo "   Run 'pnpm format' to auto-fix formatting issues"
    exit 1
fi

echo "   ✅ Format check passed"
echo ""

# ============================================================================
# 4. Run TypeScript type-check (matches CI)
# ============================================================================
echo "4️⃣  Running TypeScript type-check..."
pnpm type-check

if [ $? -ne 0 ]; then
    echo "❌ Type-check failed"
    exit 1
fi

echo "   ✅ Type-check passed"
echo ""

# ============================================================================
# 5. Run unit tests with coverage thresholds (matches CI)
# ============================================================================
echo "5️⃣  Running unit tests with coverage thresholds..."

echo "   Running backend tests with coverage..."
pnpm --filter @kompass/backend test:cov
BACKEND_STATUS=$?

echo "   Running frontend tests with coverage..."
pnpm --filter @kompass/frontend test:coverage
FRONTEND_STATUS=$?

if [ $BACKEND_STATUS -ne 0 ] || [ $FRONTEND_STATUS -ne 0 ]; then
    echo "❌ Tests failed or coverage thresholds not met"
    echo "   Coverage requirements:"
    echo "   - Global: 80% branches, functions, lines, statements"
    echo "   - Services: 90% branches, functions, lines, statements"
    exit 1
fi

echo "   ✅ Tests passed with coverage thresholds met"
echo ""

# ============================================================================
# 6. Run security audit (matches CI)
# ============================================================================
echo "6️⃣  Running security audit..."
pnpm audit --audit-level=high

if [ $? -ne 0 ]; then
    echo "❌ Security audit found high or critical vulnerabilities"
    echo "   Run 'pnpm audit --fix' to attempt automatic fixes"
    exit 1
fi

echo "   ✅ Security audit passed"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL QUALITY CHECKS PASSED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   ✅ Shared package built"
echo "   ✅ ESLint passed"
echo "   ✅ Format check passed"
echo "   ✅ Type-check passed"
echo "   ✅ Tests passed with coverage thresholds"
echo "   ✅ Security audit passed"
echo ""
echo "   Your code is ready for CI/CD!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

