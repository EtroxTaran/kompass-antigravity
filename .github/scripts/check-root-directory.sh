#!/bin/bash
# Root Directory Cleanliness Check
# Enforces file organization rules - prevents documentation clutter in root

set -e

echo "🧹 Checking root directory for forbidden files..."

# Get all files in root directory (excluding hidden files and directories)
ROOT_FILES=$(find . -maxdepth 1 -type f ! -name ".*" -exec basename {} \;)

# Define ALLOWED files in root
ALLOWED_FILES=(
    "README.md"
    "CHANGELOG.md"
    "LICENSE"
    "CONTRIBUTING.md"
    "package.json"
    "pnpm-workspace.yaml"
    "turbo.json"
    "tsconfig.json"
    "jest.config.js"
    "playwright.config.ts"
    "commitlint.config.js"
    "docker-compose.yml"
    "docker-compose.staging.yml"
    "docker-compose.production.yml"
)

# Define FORBIDDEN patterns
FORBIDDEN_PATTERNS=(
    "*_COMPLETE.md"
    "*_SUMMARY.md"
    "IMPLEMENTATION*.md"
    "MIGRATION*.md"
    "DEVELOPMENT.md"
    "DEPLOYMENT*.md"
    "USAGE*.md"
    "CODING*.md"
    "SETUP*.md"
    "API*.md"
    "GUIDE*.md"
    "*_GUIDE.md"
    "*_SPECIFICATION.md"
    "*_UPDATES.md"
)

VIOLATIONS_FOUND=false
VIOLATIONS_LIST=""

# Check each file in root
for file in $ROOT_FILES; do
    # Check if file is in allowed list
    IS_ALLOWED=false
    for allowed in "${ALLOWED_FILES[@]}"; do
        if [ "$file" = "$allowed" ]; then
            IS_ALLOWED=true
            break
        fi
    done
    
    # If not in allowed list, check if it matches forbidden patterns
    if [ "$IS_ALLOWED" = false ]; then
        # Check against forbidden patterns
        for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
            if [[ "$file" == $pattern ]]; then
                VIOLATIONS_FOUND=true
                
                # Suggest correct location
                SUGGESTED_LOCATION=""
                if [[ "$file" == IMPLEMENTATION* ]] || [[ "$file" == *_COMPLETE.md ]] || [[ "$file" == *_SUMMARY.md ]] || [[ "$file" == SETUP* ]]; then
                    SUGGESTED_LOCATION="docs/implementation/ or docs/deployment/"
                elif [[ "$file" == DEVELOPMENT.md ]] || [[ "$file" == CODING* ]] || [[ "$file" == USAGE* ]]; then
                    SUGGESTED_LOCATION="docs/guides/"
                elif [[ "$file" == MIGRATION* ]]; then
                    SUGGESTED_LOCATION="docs/guides/ or docs/implementation/migrations/"
                elif [[ "$file" == DEPLOYMENT* ]]; then
                    SUGGESTED_LOCATION="docs/deployment/"
                elif [[ "$file" == API* ]] || [[ "$file" == *_UPDATES.md ]]; then
                    SUGGESTED_LOCATION="docs/api/"
                elif [[ "$file" == *_SPECIFICATION.md ]]; then
                    SUGGESTED_LOCATION="docs/specifications/"
                elif [[ "$file" == *GUIDE*.md ]]; then
                    SUGGESTED_LOCATION="docs/guides/"
                else
                    SUGGESTED_LOCATION="docs/"
                fi
                
                VIOLATIONS_LIST="$VIOLATIONS_LIST\n  ❌ $file → Should be in: $SUGGESTED_LOCATION"
                break
            fi
        done
        
        # If not in allowed list and doesn't match forbidden patterns, check if it's a markdown file
        if [ "$IS_ALLOWED" = false ] && [[ "$file" == *.md ]]; then
            VIOLATIONS_FOUND=true
            VIOLATIONS_LIST="$VIOLATIONS_LIST\n  ❌ $file → Should be in: docs/"
        fi
    fi
done

# Report violations
if [ "$VIOLATIONS_FOUND" = true ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ ROOT DIRECTORY ORGANIZATION VIOLATION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Found forbidden files in root directory:"
    echo -e "$VIOLATIONS_LIST"
    echo ""
    echo "📋 RULE: Only these files allowed in root:"
    echo "   - README.md (project overview)"
    echo "   - CHANGELOG.md (version history)"
    echo "   - LICENSE (license file)"
    echo "   - CONTRIBUTING.md (contribution guidelines)"
    echo "   - Configuration files (package.json, tsconfig.json, etc.)"
    echo ""
    echo "📁 All other documentation MUST be in docs/ subdirectories:"
    echo "   - Implementation reports → docs/implementation/"
    echo "   - Deployment docs → docs/deployment/"
    echo "   - Developer guides → docs/guides/"
    echo "   - API documentation → docs/api/"
    echo "   - Specifications → docs/specifications/"
    echo ""
    echo "🔧 To fix:"
    echo "   mv <file> docs/<appropriate-subdirectory>/"
    echo ""
    echo "See: .cursor/rules/file-organization.mdc"
    echo "     .cursor/rules/documentation-organization.mdc"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 1
fi

echo "✅ Root directory is clean - no forbidden files found"
exit 0

