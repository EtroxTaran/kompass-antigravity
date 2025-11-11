#!/bin/bash
# Production Deployment Script
# Deploys the latest production images to the production server
# Includes comprehensive health checks and automatic rollback on failure

set -e

echo "🚀 Starting production deployment..."

# Configuration
DEPLOY_DIR="/opt/kompass/production"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up current deployment state..."
docker-compose $COMPOSE_FILES ps > "$BACKUP_DIR/deployment-state-$TIMESTAMP.txt"

# Backup database before deployment
echo "💾 Creating database backup..."
docker exec kompass-couchdb curl -X POST http://admin:${PRODUCTION_COUCHDB_PASSWORD}@localhost:5984/_replicate \
  -H "Content-Type: application/json" \
  -d "{\"source\":\"kompass\",\"target\":\"kompass_backup_$TIMESTAMP\",\"create_target\":true}" || echo "⚠️  Database backup failed (non-fatal)"

echo "⬇️  Pulling latest images..."
docker pull ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:latest
docker pull ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:latest

echo "🔄 Stopping current containers gracefully..."
docker-compose $COMPOSE_FILES stop

echo "🏷️  Tagging current images for rollback..."
docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:latest ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/backend:rollback || true
docker tag ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:latest ${REGISTRY:-ghcr.io}/${IMAGE_NAME}/frontend:rollback || true

echo "🚀 Starting new containers..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
export IMAGE_TAG=latest
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

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PRODUCTION DEPLOYMENT SUCCESSFUL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Production URL: ${PRODUCTION_URL:-https://kompass.de}"
echo "📝 Backup created: $BACKUP_DIR/deployment-state-$TIMESTAMP.txt"
echo "💾 Database backup: kompass_backup_$TIMESTAMP"
echo "🏷️  Rollback images tagged: backend:rollback, frontend:rollback"
echo ""
echo "To rollback: bash scripts/rollback.sh production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

