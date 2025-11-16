#!/bin/bash
# Start Local Development Environment
# This script starts the complete development environment with hot reload
#
# Usage:
#   bash scripts/dev.sh [up|down|logs|ps|restart|clean]
#
# Examples:
#   bash scripts/dev.sh up      # Start development environment
#   bash scripts/dev.sh down    # Stop development environment
#   bash scripts/dev.sh logs    # View logs
#   bash scripts/dev.sh ps      # Show running containers
#   bash scripts/dev.sh restart # Restart services
#   bash scripts/dev.sh clean   # Clean up and remove volumes

set -euo pipefail

COMMAND=${1:-up}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 KOMPASS Local Development Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERROR: docker-compose.yml not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERROR: Docker is not running"
    echo "   Please start Docker and try again"
    exit 1
fi

case "$COMMAND" in
    up)
        echo "📦 Building and starting development environment..."
        echo ""
        echo "   This will:"
        echo "   - Build development images (first time only)"
        echo "   - Start all infrastructure services (PostgreSQL, CouchDB, etc.)"
        echo "   - Start backend with hot reload (NestJS watch mode)"
        echo "   - Start frontend with HMR (Vite dev server)"
        echo ""
        echo "   Access URLs:"
        echo "   - Frontend:  http://localhost:5173"
        echo "   - Backend:   http://localhost:3000"
        echo "   - CouchDB:   http://localhost:5984"
        echo "   - MeiliSearch: http://localhost:7700"
        echo "   - Keycloak:  http://localhost:8080"
        echo "   - Neo4j:     http://localhost:7474"
        echo "   - n8n:       http://localhost:5678"
        echo ""
        
        # Build and start services
        docker-compose up -d --build
        
        echo ""
        echo "⏳ Waiting for services to be healthy..."
        sleep 5
        
        # Check service status
        echo ""
        echo "📊 Service Status:"
        docker-compose ps
        
        echo ""
        echo "✅ Development environment started!"
        echo ""
        echo "   To view logs:    bash scripts/dev.sh logs"
        echo "   To stop:         bash scripts/dev.sh down"
        echo "   To restart:      bash scripts/dev.sh restart"
        echo ""
        echo "   Hot reload is enabled - changes to code will be reflected automatically"
        ;;
        
    down)
        echo "🛑 Stopping development environment..."
        docker-compose down
        echo "✅ Development environment stopped"
        ;;
        
    logs)
        SERVICE=${2:-}
        if [ -z "$SERVICE" ]; then
            echo "📋 Showing logs for all services (Ctrl+C to exit)..."
            docker-compose logs -f
        else
            echo "📋 Showing logs for $SERVICE (Ctrl+C to exit)..."
            docker-compose logs -f "$SERVICE"
        fi
        ;;
        
    ps)
        echo "📊 Development Environment Status:"
        docker-compose ps
        echo ""
        echo "💡 Tip: Use 'bash scripts/dev.sh logs <service>' to view logs for a specific service"
        ;;
        
    restart)
        echo "🔄 Restarting development environment..."
        docker-compose restart
        echo "✅ Services restarted"
        echo ""
        echo "📊 Service Status:"
        docker-compose ps
        ;;
        
    clean)
        echo "🧹 Cleaning up development environment..."
        echo ""
        echo "   This will:"
        echo "   - Stop all containers"
        echo "   - Remove containers"
        echo "   - Remove volumes (including node_modules)"
        echo ""
        read -p "   Are you sure? This will delete all data in volumes (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo "✅ Development environment cleaned up"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;
        
    *)
        echo "❌ Unknown command: $COMMAND"
        echo ""
        echo "Usage: bash scripts/dev.sh [up|down|logs|ps|restart|clean]"
        echo ""
        echo "Commands:"
        echo "  up       - Start development environment (default)"
        echo "  down     - Stop development environment"
        echo "  logs     - View logs (optionally specify service: logs backend)"
        echo "  ps       - Show running containers"
        echo "  restart  - Restart all services"
        echo "  clean    - Stop and remove all containers and volumes"
        exit 1
        ;;
esac

