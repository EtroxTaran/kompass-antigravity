#!/bin/bash
# Clean Development Environment
# This script cleans up the development environment, removing containers and volumes
#
# Usage:
#   bash scripts/dev-clean.sh

set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 Clean Development Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERROR: docker-compose.yml not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

echo "⚠️  This will:"
echo "   - Stop all development containers"
echo "   - Remove all containers"
echo "   - Remove all volumes (including node_modules and database data)"
echo ""
echo "   This will DELETE:"
echo "   - All database data (CouchDB, PostgreSQL, Neo4j)"
echo "   - All node_modules volumes"
echo "   - All application data volumes"
echo ""
read -p "   Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 0
fi

echo ""
echo "🛑 Stopping containers..."
docker-compose down

echo ""
echo "🗑️  Removing volumes..."
docker-compose down -v

echo ""
echo "🧹 Cleaning up orphaned containers..."
docker-compose down --remove-orphans 2>/dev/null || true

echo ""
echo "✅ Development environment cleaned up!"
echo ""
echo "   To start fresh: bash scripts/dev.sh up"
echo ""

