#!/bin/bash
# Rollback Script
# Rolls back to the previous deployment

set -e

ENVIRONMENT=${1:-staging}
BACKUP_TIMESTAMP=${2:-rollback}

echo "🔄 Starting rollback for $ENVIRONMENT environment..."

# Configuration based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    DEPLOY_DIR="/opt/kompass/production"
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
    ROLLBACK_TAG="rollback"
else
    DEPLOY_DIR="/opt/kompass/staging"
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
    if [ "$BACKUP_TIMESTAMP" != "rollback" ]; then
        ROLLBACK_TAG="staging-rollback-$BACKUP_TIMESTAMP"
    else
        ROLLBACK_TAG="staging-rollback"
    fi
fi

cd "$DEPLOY_DIR"

echo "⚠️  WARNING: This will rollback to the previous deployment"
echo "Environment: $ENVIRONMENT"
echo "Rollback tag: $ROLLBACK_TAG"
echo ""

# Stop current containers
echo "🛑 Stopping current containers..."
docker-compose $COMPOSE_FILES stop

# Check if rollback images exist
echo "🔍 Checking for rollback images..."
if ! docker image inspect ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:$ROLLBACK_TAG > /dev/null 2>&1; then
    echo "❌ Rollback image not found: backend:$ROLLBACK_TAG"
    echo "Available backend images:"
    docker images ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend
    exit 1
fi

if ! docker image inspect ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:$ROLLBACK_TAG > /dev/null 2>&1; then
    echo "❌ Rollback image not found: frontend:$ROLLBACK_TAG"
    echo "Available frontend images:"
    docker images ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend
    exit 1
fi

echo "✅ Rollback images found"

# Tag rollback images as current
echo "🏷️  Restoring previous images..."
if [ "$ENVIRONMENT" = "production" ]; then
    docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:$ROLLBACK_TAG ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:latest
    docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:$ROLLBACK_TAG ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:latest
else
    docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:$ROLLBACK_TAG ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:staging
    docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:$ROLLBACK_TAG ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:staging
fi

# Restart containers with previous version
echo "🚀 Starting containers with previous version..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
if [ "$ENVIRONMENT" = "production" ]; then
    export IMAGE_TAG=latest
fi
docker-compose $COMPOSE_FILES up -d --force-recreate

echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
if bash scripts/health-check.sh $ENVIRONMENT; then
    echo "✅ Rollback successful - services are healthy"
else
    echo "❌ Rollback failed - services are not healthy"
    echo "Manual intervention required!"
    docker-compose $COMPOSE_FILES logs --tail=100
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ROLLBACK SUCCESSFUL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Environment: $ENVIRONMENT"
echo "Rolled back to: $ROLLBACK_TAG"
echo ""
echo "Check logs: docker-compose $COMPOSE_FILES logs -f"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

