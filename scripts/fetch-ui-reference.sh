#!/bin/bash

# Fetch UI Reference File
# Fetches specific file from EtroxTaran/Kompassuimusterbibliothek
#
# Usage:
#   ./scripts/fetch-ui-reference.sh <file-path> [--open]
#
# Examples:
#   ./scripts/fetch-ui-reference.sh src/components/CustomerForm.tsx
#   ./scripts/fetch-ui-reference.sh src/pages/CustomerPage.tsx --open

set -euo pipefail

REPO_OWNER="EtroxTaran"
REPO_NAME="Kompassuimusterbibliothek"

if [ $# -eq 0 ]; then
    echo "❌ Error: File path required"
    echo ""
    echo "Usage: ./scripts/fetch-ui-reference.sh <file-path> [--open]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/fetch-ui-reference.sh src/components/CustomerForm.tsx"
    echo "  ./scripts/fetch-ui-reference.sh src/pages/CustomerPage.tsx --open"
    exit 1
fi

FILE_PATH="$1"
OPEN_IN_EDITOR=false

if [ "${2:-}" == "--open" ]; then
    OPEN_IN_EDITOR=true
fi

TEMP_DIR="/tmp/kompass-ui-reference"
mkdir -p "$TEMP_DIR"

OUTPUT_FILE="${TEMP_DIR}/$(basename "$FILE_PATH")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 Fetching UI Reference File"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "File path: ${FILE_PATH}"
echo "Output: ${OUTPUT_FILE}"
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "Fetching file..."
    
    # Fetch file content using GitHub API
    gh api "repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}" --jq '.content' | base64 -d > "$OUTPUT_FILE" 2>/dev/null || {
        echo "❌ Error: Failed to fetch file"
        echo ""
        echo "The file may not exist or you may not have access."
        echo "Verify the path and try again."
        echo ""
        echo "Alternative: Use GitHub MCP tools in Cursor:"
        echo "  1. Use GitHub MCP: get_file_contents"
        echo "  2. Owner: ${REPO_OWNER}"
        echo "  3. Repo: ${REPO_NAME}"
        echo "  4. Path: ${FILE_PATH}"
        exit 1
    }
    
    echo "✅ File fetched successfully"
    echo ""
    echo "Saved to: ${OUTPUT_FILE}"
    echo ""
    
    if [ "$OPEN_IN_EDITOR" = true ]; then
        if [ -n "${EDITOR:-}" ]; then
            echo "Opening in ${EDITOR}..."
            $EDITOR "$OUTPUT_FILE"
        elif command -v code &> /dev/null; then
            echo "Opening in VS Code..."
            code "$OUTPUT_FILE"
        elif command -v nano &> /dev/null; then
            echo "Opening in nano..."
            nano "$OUTPUT_FILE"
        else
            echo "⚠️  No editor found. Set EDITOR environment variable or install VS Code."
            echo "File saved to: ${OUTPUT_FILE}"
        fi
    else
        echo "💡 Tip: Add --open flag to open in editor"
        echo "   ./scripts/fetch-ui-reference.sh ${FILE_PATH} --open"
    fi
else
    echo "⚠️  GitHub CLI (gh) not found."
    echo ""
    echo "To use this script, install GitHub CLI:"
    echo "  https://cli.github.com/"
    echo ""
    echo "Alternatively, use GitHub MCP tools in Cursor:"
    echo "  1. Use GitHub MCP: get_file_contents"
    echo "  2. Owner: ${REPO_OWNER}"
    echo "  3. Repo: ${REPO_NAME}"
    echo "  4. Path: ${FILE_PATH}"
    echo ""
    echo "Or visit: https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${FILE_PATH}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

