#!/bin/bash
# Changelog Generation Script
# Generates CHANGELOG.md from conventional commits
# Uses conventional-changelog-cli

set -e

echo "📝 Generating changelog from conventional commits..."

# Check if conventional-changelog-cli is installed
if ! command -v conventional-changelog &> /dev/null; then
    echo "Installing conventional-changelog-cli..."
    pnpm add -D conventional-changelog-cli
fi

# Determine the tag range
if [ -z "$1" ]; then
    # No argument provided, generate from last tag to HEAD
    echo "Generating changelog from last tag to HEAD..."
    npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0
else
    # Specific version provided
    echo "Generating changelog for version $1..."
    npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0 --release-count 1
fi

echo ""
echo "✅ Changelog generated successfully!"
echo "📄 Updated: CHANGELOG.md"
echo ""
echo "💡 Review the changes and commit:"
echo "   git add CHANGELOG.md"
echo "   git commit -m 'docs(KOM-XXX): update changelog for release'"

