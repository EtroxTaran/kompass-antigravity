#!/bin/bash
# Production Deployment Script
# Deploys production images using versioned tags (v*.*.*) from Git tags
# Includes comprehensive health checks and automatic rollback on failure
#
# Usage:
#   VERSION_TAG=v1.2.3 bash scripts/deploy-production.sh
#   Or set VERSION_TAG environment variable before running
#
# This script is called by GitHub Actions workflow deploy-prod.yml
# It uses semantic version tags for production: v1.2.3

set -e

echo "🚀 Starting production deployment..."

# Configuration
DEPLOY_DIR="/opt/kompass/production"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Get version tag (required for production deployments)
if [ -z "$VERSION_TAG" ]; then
    echo "❌ ERROR: VERSION_TAG environment variable is required"
    echo "   Usage: VERSION_TAG=v1.2.3 bash scripts/deploy-production.sh"
    echo "   Version tag must match pattern: v*.*.* (e.g., v1.2.3)"
    exit 1
fi

# Validate version tag format (v*.*.*)
if ! [[ "$VERSION_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ ERROR: Invalid version tag format: $VERSION_TAG"
    echo "   Version tag must match pattern: v*.*.* (e.g., v1.2.3)"
    exit 1
fi

# Extract version without 'v' prefix for image tags
VERSION_CLEAN=${VERSION_TAG#v}

# Registry configuration
REGISTRY=${REGISTRY:-ghcr.io}
IMAGE_NAME=${IMAGE_NAME:-${GITHUB_REPOSITORY}}

echo "📝 Deployment Info:"
echo "   Version Tag: $VERSION_TAG"
echo "   Version (clean): $VERSION_CLEAN"
echo "   Backend Tag: $VERSION_TAG"
echo "   Frontend Tag: $VERSION_TAG"
echo "   Registry: $REGISTRY/$IMAGE_NAME"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up current deployment state..."
docker-compose $COMPOSE_FILES ps > "$BACKUP_DIR/deployment-state-$TIMESTAMP.txt" 2>/dev/null || true

# Backup database before deployment
echo "💾 Creating database backup..."
docker exec kompass-couchdb curl -X POST http://admin:${PRODUCTION_COUCHDB_PASSWORD}@localhost:5984/_replicate \
  -H "Content-Type: application/json" \
  -d "{\"source\":\"kompass\",\"target\":\"kompass_backup_$TIMESTAMP\",\"create_target\":true}" || echo "⚠️  Database backup failed (non-fatal)"

echo "⬇️  Pulling versioned images..."
docker pull "${REGISTRY}/${IMAGE_NAME}/backend:${VERSION_TAG}"
docker pull "${REGISTRY}/${IMAGE_NAME}/frontend:${VERSION_TAG}"

# Also pull prod-<sha> tag if available (for additional traceability)
if [ -n "$GIT_SHA" ]; then
    echo "⬇️  Pulling Git SHA tag for traceability..."
    docker pull "${REGISTRY}/${IMAGE_NAME}/backend:prod-${GIT_SHA}" || echo "⚠️  Warning: Could not pull prod-${GIT_SHA} tag"
    docker pull "${REGISTRY}/${IMAGE_NAME}/frontend:prod-${GIT_SHA}" || echo "⚠️  Warning: Could not pull prod-${GIT_SHA} tag"
fi

echo "🔄 Stopping current containers gracefully..."
docker-compose $COMPOSE_FILES stop || true

echo "🏷️  Tagging current images for rollback..."
# Get current image tags before updating
CURRENT_BACKEND=$(docker-compose $COMPOSE_FILES config | grep -A 5 "backend:" | grep "image:" | awk '{print $2}' | cut -d: -f2 || echo "latest")
CURRENT_FRONTEND=$(docker-compose $COMPOSE_FILES config | grep -A 5 "frontend:" | grep "image:" | awk '{print $2}' | cut -d: -f2 || echo "latest")

# Tag current images for rollback (use version tag if it's a version, otherwise use 'rollback')
if [[ "$CURRENT_BACKEND" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    ROLLBACK_TAG="rollback-${CURRENT_BACKEND}"
else
    ROLLBACK_TAG="rollback-${TIMESTAMP}"
fi

docker tag "${REGISTRY}/${IMAGE_NAME}/backend:${CURRENT_BACKEND}" "${REGISTRY}/${IMAGE_NAME}/backend:${ROLLBACK_TAG}" 2>/dev/null || true
docker tag "${REGISTRY}/${IMAGE_NAME}/frontend:${CURRENT_FRONTEND}" "${REGISTRY}/${IMAGE_NAME}/frontend:${ROLLBACK_TAG}" 2>/dev/null || true

echo "🚀 Starting new containers with version tag: $VERSION_TAG..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
export IMAGE_TAG=${VERSION_TAG}
docker-compose $COMPOSE_FILES up -d --remove-orphans

echo "⏳ Waiting for services to be healthy..."
sleep 45

echo "🏥 Running comprehensive health checks..."
if bash scripts/health-check.sh production; then
    echo "✅ Health checks passed"
else
    echo "❌ Health checks failed - initiating automatic rollback..."
    bash scripts/rollback.sh production
    exit 1
fi

echo "🧪 Running smoke tests..."
# Backend health
curl -f http://localhost:3001/health || {
    echo "❌ Backend health check failed"
    bash scripts/rollback.sh production
    exit 1
}

# Frontend health
curl -f http://localhost:3000/health || {
    echo "❌ Frontend health check failed"
    bash scripts/rollback.sh production
    exit 1
}

# Additional production checks
echo "🔍 Running additional production checks..."

# Check database connectivity
curl -f http://localhost:5984/_up || {
    echo "❌ Database connectivity check failed"
    bash scripts/rollback.sh production
    exit 1
}

# Check MeiliSearch
curl -f http://localhost:7700/health || {
    echo "❌ MeiliSearch connectivity check failed"
    bash scripts/rollback.sh production
    exit 1
}

echo "🧹 Cleaning up old images..."
docker image prune -f --filter "until=168h" # Remove images older than 7 days

# Validate feature flags are set (if required)
echo "🔍 Validating feature flags..."
if [ -z "$PRODUCTION_AI_N8N_ENABLED" ] && [ -z "$PRODUCTION_AI_RAG_ENABLED" ] && [ -z "$PRODUCTION_AI_ML_ENABLED" ]; then
    echo "⚠️  Warning: No feature flags detected. Using defaults from docker-compose.production.yml"
else
    echo "✅ Feature flags detected:"
    [ -n "$PRODUCTION_AI_N8N_ENABLED" ] && echo "   AI_N8N_ENABLED=$PRODUCTION_AI_N8N_ENABLED"
    [ -n "$PRODUCTION_AI_RAG_ENABLED" ] && echo "   AI_RAG_ENABLED=$PRODUCTION_AI_RAG_ENABLED"
    [ -n "$PRODUCTION_AI_ML_ENABLED" ] && echo "   AI_ML_ENABLED=$PRODUCTION_AI_ML_ENABLED"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PRODUCTION DEPLOYMENT SUCCESSFUL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Production URL: ${PRODUCTION_URL:-https://kompass.de}"
echo "📝 Version Tag: $VERSION_TAG"
echo "📝 Backup created: $BACKUP_DIR/deployment-state-$TIMESTAMP.txt"
echo "💾 Database backup: kompass_backup_$TIMESTAMP"
echo "🏷️  Rollback images tagged: backend:$ROLLBACK_TAG, frontend:$ROLLBACK_TAG"
echo "🏷️  Current tags: backend:$VERSION_TAG, frontend:$VERSION_TAG"
[ -n "$GIT_SHA" ] && echo "📝 Git SHA: $GIT_SHA"
echo ""
echo "To rollback: bash scripts/rollback.sh production $ROLLBACK_TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

