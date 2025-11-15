#!/bin/bash
# Rollback Script
# Rolls back to a previous deployment using versioned tags (production) or SHA tags (staging)
#
# Usage:
#   Production: bash scripts/rollback.sh production [v1.2.3|rollback-v1.2.3|rollback-timestamp]
#   Staging:    bash scripts/rollback.sh staging [staging-<sha>|staging-rollback-timestamp]
#
# If no rollback tag is provided, the script will attempt to find the previous version

set -e

ENVIRONMENT=${1:-staging}
ROLLBACK_TAG_INPUT=${2}

# Registry configuration
REGISTRY=${REGISTRY:-ghcr.io}
IMAGE_NAME=${IMAGE_NAME:-${GITHUB_REPOSITORY}}

echo "🔄 Starting rollback for $ENVIRONMENT environment..."

# Configuration based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    DEPLOY_DIR="/opt/kompass/production"
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
    
    # Determine rollback tag for production
    if [ -z "$ROLLBACK_TAG_INPUT" ]; then
        # Try to find previous version tag
        echo "🔍 Searching for previous version tag..."
        PREV_VERSION=$(docker images --format "{{.Tag}}" "${REGISTRY}/${IMAGE_NAME}/backend" | grep -E "^v[0-9]+\.[0-9]+\.[0-9]+$" | sort -V | tail -n 2 | head -n 1 || echo "")
        if [ -n "$PREV_VERSION" ]; then
            ROLLBACK_TAG="$PREV_VERSION"
            echo "📝 Found previous version: $ROLLBACK_TAG"
        else
            # Try to find rollback tag
            ROLLBACK_TAG=$(docker images --format "{{.Tag}}" "${REGISTRY}/${IMAGE_NAME}/backend" | grep "^rollback-" | sort -r | head -n 1 || echo "")
            if [ -z "$ROLLBACK_TAG" ]; then
                echo "❌ ERROR: No rollback tag provided and no previous version found"
                echo "   Usage: bash scripts/rollback.sh production <v1.2.3|rollback-tag>"
                echo "   Available backend images:"
                docker images "${REGISTRY}/${IMAGE_NAME}/backend" | head -n 10
                exit 1
            fi
            echo "📝 Found rollback tag: $ROLLBACK_TAG"
        fi
    elif [[ "$ROLLBACK_TAG_INPUT" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        # Valid version tag provided
        ROLLBACK_TAG="$ROLLBACK_TAG_INPUT"
    elif [[ "$ROLLBACK_TAG_INPUT" =~ ^rollback- ]]; then
        # Rollback tag provided
        ROLLBACK_TAG="$ROLLBACK_TAG_INPUT"
    else
        echo "❌ ERROR: Invalid rollback tag format: $ROLLBACK_TAG_INPUT"
        echo "   Production rollback tags must be: v*.*.* or rollback-*"
        exit 1
    fi
    
    # Target tag for production (use the version tag directly)
    if [[ "$ROLLBACK_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        TARGET_TAG="$ROLLBACK_TAG"
    else
        # Extract version from rollback tag or use rollback tag as-is
        TARGET_TAG=$(echo "$ROLLBACK_TAG" | sed 's/^rollback-//' || echo "$ROLLBACK_TAG")
    fi
else
    # Staging environment
    DEPLOY_DIR="/opt/kompass/staging"
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
    
    # Determine rollback tag for staging
    if [ -z "$ROLLBACK_TAG_INPUT" ]; then
        # Try to find previous staging SHA tag
        echo "🔍 Searching for previous staging tag..."
        PREV_STAGING=$(docker images --format "{{.Tag}}" "${REGISTRY}/${IMAGE_NAME}/backend" | grep "^staging-" | grep -v "rollback" | sort -r | head -n 1 || echo "")
        if [ -n "$PREV_STAGING" ]; then
            ROLLBACK_TAG="$PREV_STAGING"
            echo "📝 Found previous staging tag: $ROLLBACK_TAG"
        else
            # Try to find rollback tag
            ROLLBACK_TAG=$(docker images --format "{{.Tag}}" "${REGISTRY}/${IMAGE_NAME}/backend" | grep "^staging-rollback-" | sort -r | head -n 1 || echo "")
            if [ -z "$ROLLBACK_TAG" ]; then
                echo "❌ ERROR: No rollback tag provided and no previous staging tag found"
                echo "   Usage: bash scripts/rollback.sh staging [staging-<sha>|staging-rollback-timestamp]"
                echo "   Available backend images:"
                docker images "${REGISTRY}/${IMAGE_NAME}/backend" | head -n 10
                exit 1
            fi
            echo "📝 Found rollback tag: $ROLLBACK_TAG"
        fi
    elif [[ "$ROLLBACK_TAG_INPUT" =~ ^staging- ]]; then
        # Valid staging tag provided
        ROLLBACK_TAG="$ROLLBACK_TAG_INPUT"
    else
        echo "❌ ERROR: Invalid rollback tag format: $ROLLBACK_TAG_INPUT"
        echo "   Staging rollback tags must start with: staging-"
        exit 1
    fi
    
    # Target tag for staging
    TARGET_TAG="staging"
fi

cd "$DEPLOY_DIR"

echo "⚠️  WARNING: This will rollback to the previous deployment"
echo "Environment: $ENVIRONMENT"
echo "Rollback tag: $ROLLBACK_TAG"
echo "Target tag: $TARGET_TAG"
echo ""

# Stop current containers
echo "🛑 Stopping current containers..."
docker-compose $COMPOSE_FILES stop || true

# Check if rollback images exist
echo "🔍 Checking for rollback images..."
if ! docker image inspect "${REGISTRY}/${IMAGE_NAME}/backend:${ROLLBACK_TAG}" > /dev/null 2>&1; then
    echo "❌ Rollback image not found: backend:${ROLLBACK_TAG}"
    echo "Available backend images:"
    docker images "${REGISTRY}/${IMAGE_NAME}/backend" | head -n 20
    exit 1
fi

if ! docker image inspect "${REGISTRY}/${IMAGE_NAME}/frontend:${ROLLBACK_TAG}" > /dev/null 2>&1; then
    echo "❌ Rollback image not found: frontend:${ROLLBACK_TAG}"
    echo "Available frontend images:"
    docker images "${REGISTRY}/${IMAGE_NAME}/frontend" | head -n 20
    exit 1
fi

echo "✅ Rollback images found"

# Tag rollback images as current
echo "🏷️  Restoring previous images..."
docker tag "${REGISTRY}/${IMAGE_NAME}/backend:${ROLLBACK_TAG}" "${REGISTRY}/${IMAGE_NAME}/backend:${TARGET_TAG}"
docker tag "${REGISTRY}/${IMAGE_NAME}/frontend:${ROLLBACK_TAG}" "${REGISTRY}/${IMAGE_NAME}/frontend:${TARGET_TAG}"

# Restart containers with previous version
echo "🚀 Starting containers with previous version..."
export GITHUB_REPOSITORY=${IMAGE_NAME}
export IMAGE_TAG=${TARGET_TAG}
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
echo "Current tag: $TARGET_TAG"
echo ""
echo "Check logs: docker-compose $COMPOSE_FILES logs -f"
echo "Check status: docker-compose $COMPOSE_FILES ps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

