#!/bin/bash
# Staging Deployment Script
# Deploys the latest staging images to the staging server

set -e

echo "🚀 Starting staging deployment..."

# Configuration
DEPLOY_DIR="/opt/kompass/staging"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up current deployment state..."
docker-compose $COMPOSE_FILES ps > "$BACKUP_DIR/deployment-state-$TIMESTAMP.txt"

echo "⬇️  Pulling latest images..."
docker pull ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:staging
docker pull ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:staging

echo "🔄 Stopping current containers..."
docker-compose $COMPOSE_FILES stop

echo "🏷️  Tagging current images for rollback..."
docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:staging ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:staging-rollback-$TIMESTAMP || true
docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:staging ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:staging-rollback-$TIMESTAMP || true

echo "🚀 Starting new containers..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
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

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ STAGING DEPLOYMENT SUCCESSFUL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Staging URL: ${STAGING_URL:-http://localhost:3000}"
echo "📝 Backup created: $BACKUP_DIR/deployment-state-$TIMESTAMP.txt"
echo "🏷️  Rollback tag: staging-rollback-$TIMESTAMP"
echo ""
echo "To rollback: bash scripts/rollback.sh staging $TIMESTAMP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

