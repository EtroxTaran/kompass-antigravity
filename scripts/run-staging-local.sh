#!/bin/bash
# Run Staging Environment Locally
# This script helps debug staging deployment issues by running staging configuration locally
#
# Usage:
#   bash scripts/run-staging-local.sh [build|pull] [up|down|logs|ps]
#
# Examples:
#   bash scripts/run-staging-local.sh build up    # Build images locally and start
#   bash scripts/run-staging-local.sh pull up     # Pull images from GHCR and start
#   bash scripts/run-staging-local.sh logs        # View logs
#   bash scripts/run-staging-local.sh down        # Stop and remove containers

set -euo pipefail

ACTION=${1:-build}
COMMAND=${2:-up}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Running Staging Environment Locally"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.staging.local.yml"
REGISTRY="ghcr.io"
IMAGE_NAME="etroxtaran/kompass"

# Check if docker-compose files exist
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERROR: docker-compose.yml not found"
    exit 1
fi

if [ ! -f "docker-compose.staging.yml" ]; then
    echo "❌ ERROR: docker-compose.staging.yml not found"
    exit 1
fi

if [ ! -f "docker-compose.staging.local.yml" ]; then
    echo "❌ ERROR: docker-compose.staging.local.yml not found"
    exit 1
fi

# Load environment variables from .env.staging.local if it exists
if [ -f ".env.staging.local" ]; then
    echo "📝 Loading environment variables from .env.staging.local..."
    set -a
    source .env.staging.local
    set +a
else
    echo "⚠️  Warning: .env.staging.local not found. Using defaults."
    echo "   Create .env.staging.local with staging environment variables if needed."
fi

# Set required environment variables for docker-compose
export GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-etroxtaran/kompass}
export STAGING_MEILISEARCH_URL=${STAGING_MEILISEARCH_URL:-http://meilisearch:7700}
export IMAGE_TAG=${IMAGE_TAG:-staging}

# Validate docker-compose configuration
echo "🔍 Validating docker-compose configuration..."
if ! docker-compose $COMPOSE_FILES config > /dev/null 2>&1; then
    echo "❌ ERROR: Docker Compose configuration is invalid"
    echo "Running config check to see errors:"
    docker-compose $COMPOSE_FILES config 2>&1 | head -30
    exit 1
fi
echo "✅ Configuration is valid"
echo ""

# Handle different commands
case "$COMMAND" in
    up)
        echo "🚀 Starting staging environment locally..."
        echo ""
        
        if [ "$ACTION" = "pull" ]; then
            echo "⬇️  Pulling images from GHCR..."
            
            # Check if logged in to GHCR
            if ! docker info | grep -q "ghcr.io"; then
                echo "⚠️  Not logged in to GHCR. Attempting to login..."
                if [ -n "${GHCR_TOKEN:-}" ]; then
                    echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USERNAME:-EtroxTaran}" --password-stdin || {
                        echo "❌ Failed to login to GHCR"
                        echo "   Set GHCR_TOKEN and GHCR_USERNAME environment variables"
                        exit 1
                    }
                else
                    echo "⚠️  GHCR_TOKEN not set. You may need to login manually:"
                    echo "   docker login ghcr.io"
                    echo "   Or set GHCR_TOKEN and GHCR_USERNAME environment variables"
                fi
            fi
            
            # Pull images
            docker pull "${REGISTRY}/${IMAGE_NAME}/backend:staging" || echo "⚠️  Could not pull backend:staging"
            docker pull "${REGISTRY}/${IMAGE_NAME}/frontend:staging" || echo "⚠️  Could not pull frontend:staging"
            
            # Update compose file to use pulled images
            export USE_PULLED_IMAGES=true
        elif [ "$ACTION" = "build" ]; then
            echo "🔨 Building images locally..."
            echo ""
            
            # Build shared package first
            echo "📦 Building shared package..."
            pnpm --filter @kompass/shared build || {
                echo "❌ Failed to build shared package"
                exit 1
            }
            
            echo "✅ Shared package built"
            echo ""
        else
            echo "❌ Invalid action: $ACTION"
            echo "   Use 'build' or 'pull'"
            exit 1
        fi
        
        # Start services
        echo "🚀 Starting services..."
        docker-compose $COMPOSE_FILES up -d --remove-orphans
        
        echo ""
        echo "⏳ Waiting for services to start..."
        sleep 10
        
        # Show status
        echo ""
        echo "📊 Service Status:"
        docker-compose $COMPOSE_FILES ps
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Staging environment started locally"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🔗 Services:"
        echo "   Frontend:  http://localhost:3000"
        echo "   Backend:   http://localhost:3001"
        echo "   CouchDB:   http://localhost:5984"
        echo "   MeiliSearch: http://localhost:7700"
        echo "   Keycloak:  http://localhost:8080"
        echo "   Neo4j:     http://localhost:7474"
        echo "   n8n:       http://localhost:5678"
        echo ""
        echo "📝 Useful commands:"
        echo "   View logs:    bash scripts/run-staging-local.sh logs"
        echo "   View status:  bash scripts/run-staging-local.sh ps"
        echo "   Stop:         bash scripts/run-staging-local.sh down"
        echo "   Health check: bash scripts/health-check.sh staging"
        echo ""
        ;;
        
    down)
        echo "🛑 Stopping staging environment..."
        docker-compose $COMPOSE_FILES down -v
        echo "✅ Staging environment stopped"
        ;;
        
    logs)
        echo "📋 Showing logs (Ctrl+C to exit)..."
        docker-compose $COMPOSE_FILES logs -f
        ;;
        
    ps)
        echo "📊 Service Status:"
        docker-compose $COMPOSE_FILES ps
        ;;
        
    restart)
        echo "🔄 Restarting services..."
        docker-compose $COMPOSE_FILES restart
        echo "✅ Services restarted"
        ;;
        
    health)
        echo "🏥 Running health checks..."
        bash scripts/health-check.sh staging
        ;;
        
    shell-backend)
        echo "🐚 Opening shell in backend container..."
        CONTAINER=$(docker-compose $COMPOSE_FILES ps -q backend)
        if [ -z "$CONTAINER" ]; then
            echo "❌ Backend container is not running"
            exit 1
        fi
        docker exec -it "$CONTAINER" /bin/sh
        ;;
        
    shell-frontend)
        echo "🐚 Opening shell in frontend container..."
        CONTAINER=$(docker-compose $COMPOSE_FILES ps -q frontend)
        if [ -z "$CONTAINER" ]; then
            echo "❌ Frontend container is not running"
            exit 1
        fi
        docker exec -it "$CONTAINER" /bin/sh
        ;;
        
    *)
        echo "❌ Unknown command: $COMMAND"
        echo ""
        echo "Usage: bash scripts/run-staging-local.sh [build|pull] [up|down|logs|ps|restart|health|shell-backend|shell-frontend]"
        echo ""
        echo "Commands:"
        echo "  up            - Start services (requires build or pull)"
        echo "  down          - Stop and remove containers"
        echo "  logs          - View logs (follow mode)"
        echo "  ps            - Show service status"
        echo "  restart       - Restart all services"
        echo "  health        - Run health checks"
        echo "  shell-backend - Open shell in backend container"
        echo "  shell-frontend - Open shell in frontend container"
        exit 1
        ;;
esac

