#!/bin/bash
# Script to regenerate .cursorrules from .cursor/rules/*.mdc files
# This ensures all rules are automatically applied by Cursor AI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🔄 Regenerating .cursorrules from .cursor/rules/*.mdc files..."

# Create header
cat > .cursorrules << 'HEADER'
# KOMPASS Project - Cursor AI Coding Rules
# Version: 2.0.0
# Last Updated: $(date +%Y-%m-%d)
# 
# This file enforces all architectural decisions, coding standards, domain models,
# and development processes from the KOMPASS project documentation.
#
# IMPORTANT: All rules from .cursor/rules/*.mdc files are included below
# to ensure Cursor AI automatically applies them.
#
# Documentation References:
# - docs/reviews/DATA_MODEL_SPECIFICATION.md
# - docs/reviews/NFR_SPECIFICATION.md
# - docs/reviews/TEST_STRATEGY_DOCUMENT.md
# - docs/reviews/RBAC_PERMISSION_MATRIX.md
# - docs/reviews/API_SPECIFICATION.md
# - docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md

HEADER

# Append all .mdc files in sorted order
find .cursor/rules -name "*.mdc" -type f | sort | while read -r file; do
  echo "" >> .cursorrules
  echo "# ============================================================================" >> .cursorrules
  echo "# $(basename "$file" .mdc | tr '[:lower:]' '[:upper:]' | tr '-' ' ')" >> .cursorrules
  echo "# ============================================================================" >> .cursorrules
  echo "" >> .cursorrules
  cat "$file" >> .cursorrules
  echo "" >> .cursorrules
done

# Update the date in the header
sed -i "s/Last Updated: \$(date +%Y-%m-%d)/Last Updated: $(date +%Y-%m-%d)/" .cursorrules

echo "✅ .cursorrules regenerated successfully!"
echo "📊 Total lines: $(wc -l < .cursorrules)"
echo ""
echo "All rules from .cursor/rules/*.mdc are now automatically applied by Cursor AI."

