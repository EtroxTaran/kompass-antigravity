#!/bin/bash
# Staging Deployment Script
# Deploys the latest staging images to the staging server using Git SHA tags
# 
# Usage:
#   GIT_SHA=<sha> bash scripts/deploy-staging.sh
#   Or set GIT_SHA environment variable before running
#
# This script is called by GitHub Actions workflow deploy-staging.yml
# It uses Git SHA-based tags for traceability: staging-<sha>

set -e

echo "🚀 Starting staging deployment..."

# Configuration
DEPLOY_DIR="/opt/kompass/staging"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Get Git SHA (required for staging deployments)
if [ -z "$GIT_SHA" ]; then
    # Try to get from git if available
    if command -v git &> /dev/null && [ -d "$DEPLOY_DIR/.git" ]; then
        GIT_SHA=$(cd "$DEPLOY_DIR" && git rev-parse --short HEAD)
        echo "📝 Detected Git SHA: $GIT_SHA"
    else
        echo "❌ ERROR: GIT_SHA environment variable is required"
        echo "   Usage: GIT_SHA=<sha> bash scripts/deploy-staging.sh"
        exit 1
    fi
fi

# Validate Git SHA format (should be 7+ characters)
if [ ${#GIT_SHA} -lt 7 ]; then
    echo "❌ ERROR: Invalid Git SHA format: $GIT_SHA"
    exit 1
fi

# Image tags using Git SHA
BACKEND_TAG="staging-${GIT_SHA}"
FRONTEND_TAG="staging-${GIT_SHA}"

# Registry configuration
REGISTRY=${REGISTRY:-ghcr.io}
IMAGE_NAME=${IMAGE_NAME:-${GITHUB_REPOSITORY}}

echo "📝 Deployment Info:"
echo "   Git SHA: $GIT_SHA"
echo "   Backend Tag: $BACKEND_TAG"
echo "   Frontend Tag: $FRONTEND_TAG"
echo "   Registry: $REGISTRY/$IMAGE_NAME"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up current deployment state..."
docker-compose $COMPOSE_FILES ps > "$BACKUP_DIR/deployment-state-$TIMESTAMP.txt" 2>/dev/null || true

echo "⬇️  Pulling latest images..."
docker pull "${REGISTRY}/${IMAGE_NAME}/backend:${BACKEND_TAG}"
docker pull "${REGISTRY}/${IMAGE_NAME}/frontend:${FRONTEND_TAG}"

# Also pull the generic 'staging' tag for fallback
docker pull "${REGISTRY}/${IMAGE_NAME}/backend:staging" || echo "⚠️  Warning: Could not pull staging tag (using SHA tag only)"
docker pull "${REGISTRY}/${IMAGE_NAME}/frontend:staging" || echo "⚠️  Warning: Could not pull staging tag (using SHA tag only)"

echo "🔄 Stopping current containers..."
docker-compose $COMPOSE_FILES stop || true

echo "🏷️  Tagging current images for rollback..."
# Get current image tags before updating
CURRENT_BACKEND=$(docker-compose $COMPOSE_FILES config | grep -A 5 "backend:" | grep "image:" | awk '{print $2}' | cut -d: -f2 || echo "staging")
CURRENT_FRONTEND=$(docker-compose $COMPOSE_FILES config | grep -A 5 "frontend:" | grep "image:" | awk '{print $2}' | cut -d: -f2 || echo "staging")

# Tag current images for rollback
docker tag "${REGISTRY}/${IMAGE_NAME}/backend:${CURRENT_BACKEND}" "${REGISTRY}/${IMAGE_NAME}/backend:staging-rollback-${TIMESTAMP}" 2>/dev/null || true
docker tag "${REGISTRY}/${IMAGE_NAME}/frontend:${CURRENT_FRONTEND}" "${REGISTRY}/${IMAGE_NAME}/frontend:staging-rollback-${TIMESTAMP}" 2>/dev/null || true

echo "🚀 Starting new containers with Git SHA tags..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
export IMAGE_TAG=${BACKEND_TAG}
# Use SHA-tagged images (staging-<sha>) that were just pulled
docker-compose $COMPOSE_FILES up -d --remove-orphans

echo "⏳ Waiting for services to be healthy..."
sleep 30

echo "🏥 Running health checks..."
if bash scripts/health-check.sh staging; then
    echo "✅ Health checks passed"
else
    echo "❌ Health checks failed - initiating rollback..."
    bash scripts/rollback.sh staging $TIMESTAMP
    exit 1
fi

echo "🧪 Running smoke tests..."
# Backend health
curl -f http://localhost:3001/health || {
    echo "❌ Backend health check failed"
    bash scripts/rollback.sh staging $TIMESTAMP
    exit 1
}

# Frontend health
curl -f http://localhost:3000/health || {
    echo "❌ Frontend health check failed"
    bash scripts/rollback.sh staging $TIMESTAMP
    exit 1
}

# Validate feature flags are set (if required)
echo "🔍 Validating feature flags..."
if [ -z "$STAGING_AI_N8N_ENABLED" ] && [ -z "$STAGING_AI_RAG_ENABLED" ] && [ -z "$STAGING_AI_ML_ENABLED" ]; then
    echo "⚠️  Warning: No feature flags detected. Using defaults from docker-compose.staging.yml"
else
    echo "✅ Feature flags detected:"
    [ -n "$STAGING_AI_N8N_ENABLED" ] && echo "   AI_N8N_ENABLED=$STAGING_AI_N8N_ENABLED"
    [ -n "$STAGING_AI_RAG_ENABLED" ] && echo "   AI_RAG_ENABLED=$STAGING_AI_RAG_ENABLED"
    [ -n "$STAGING_AI_ML_ENABLED" ] && echo "   AI_ML_ENABLED=$STAGING_AI_ML_ENABLED"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ STAGING DEPLOYMENT SUCCESSFUL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Staging URL: ${STAGING_URL:-http://localhost:3000}"
echo "📝 Git SHA: $GIT_SHA"
echo "📝 Backup created: $BACKUP_DIR/deployment-state-$TIMESTAMP.txt"
echo "🏷️  Rollback tag: staging-rollback-$TIMESTAMP"
echo "🏷️  Current tags: backend:$BACKEND_TAG, frontend:$FRONTEND_TAG"
echo ""
echo "To rollback: bash scripts/rollback.sh staging $TIMESTAMP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

