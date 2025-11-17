#!/bin/bash

# List UI Reference Repository Structure
# Lists directory structure of EtroxTaran/Kompassuimusterbibliothek
#
# Usage:
#   ./scripts/list-ui-reference.sh [path]
#
# Examples:
#   ./scripts/list-ui-reference.sh                    # List root directory
#   ./scripts/list-ui-reference.sh src               # List src directory
#   ./scripts/list-ui-reference.sh src/components     # List components directory

set -euo pipefail

REPO_OWNER="EtroxTaran"
REPO_NAME="Kompassuimusterbibliothek"
TARGET_PATH="${1:-}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 GitHub UI Reference Repository Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "Path: ${TARGET_PATH:-/ (root)}"
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI (gh)..."
    echo ""
    
    if [ -z "$TARGET_PATH" ]; then
        gh api "repos/${REPO_OWNER}/${REPO_NAME}/contents" --jq '.[] | "\(.type == "dir" | if . then "📁" else "📄" end) \(.name)"'
    else
        gh api "repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH}" --jq '.[] | "\(.type == "dir" | if . then "📁" else "📄" end) \(.name)"'
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
    echo "  4. Path: ${TARGET_PATH:-/}"
    echo ""
    echo "Or visit: https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/main/${TARGET_PATH}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Tip: Use './scripts/fetch-ui-reference.sh <file-path>' to fetch specific files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

