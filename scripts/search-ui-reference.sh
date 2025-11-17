#!/bin/bash

# Search UI Reference Repository
# Searches for files/components in EtroxTaran/Kompassuimusterbibliothek
#
# Usage:
#   ./scripts/search-ui-reference.sh <search-term>
#
# Examples:
#   ./scripts/search-ui-reference.sh Customer
#   ./scripts/search-ui-reference.sh "customer list"
#   ./scripts/search-ui-reference.sh form

set -euo pipefail

REPO_OWNER="EtroxTaran"
REPO_NAME="Kompassuimusterbibliothek"

if [ $# -eq 0 ]; then
    echo "❌ Error: Search term required"
    echo ""
    echo "Usage: ./scripts/search-ui-reference.sh <search-term>"
    echo ""
    echo "Examples:"
    echo "  ./scripts/search-ui-reference.sh Customer"
    echo "  ./scripts/search-ui-reference.sh \"customer list\""
    echo "  ./scripts/search-ui-reference.sh form"
    exit 1
fi

SEARCH_TERM="$1"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Searching UI Reference Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "Search term: ${SEARCH_TERM}"
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "Searching for files matching '${SEARCH_TERM}'..."
    echo ""
    
    # Search using GitHub API code search
    gh api "search/code?q=repo:${REPO_OWNER}/${REPO_NAME}+${SEARCH_TERM}" --jq '.items[] | "📄 \(.path) - \(.name)"' 2>/dev/null || {
        echo "⚠️  GitHub API search returned no results or rate limited."
        echo ""
        echo "Alternative: Use GitHub MCP tools in Cursor:"
        echo "  1. Use GitHub MCP: search_code"
        echo "  2. Query: repo:${REPO_OWNER}/${REPO_NAME} ${SEARCH_TERM}"
        echo ""
        echo "Or visit: https://github.com/${REPO_OWNER}/${REPO_NAME}/search?q=${SEARCH_TERM}"
        exit 0
    }
else
    echo "⚠️  GitHub CLI (gh) not found."
    echo ""
    echo "To use this script, install GitHub CLI:"
    echo "  https://cli.github.com/"
    echo ""
    echo "Alternatively, use GitHub MCP tools in Cursor:"
    echo "  1. Use GitHub MCP: search_code"
    echo "  2. Query: repo:${REPO_OWNER}/${REPO_NAME} ${SEARCH_TERM}"
    echo ""
    echo "Or visit: https://github.com/${REPO_ARNER}/${REPO_NAME}/search?q=${SEARCH_TERM}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Tip: Use './scripts/fetch-ui-reference.sh <file-path>' to fetch specific files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

