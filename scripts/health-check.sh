#!/bin/bash
# Health Check Script
# Validates that all services are healthy after deployment

set -e

ENVIRONMENT=${1:-staging}

echo "🏥 Running health checks for $ENVIRONMENT environment..."

# Configuration based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    BACKEND_PORT=3001
    FRONTEND_PORT=3000
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
else
    BACKEND_PORT=3001
    FRONTEND_PORT=3000
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
fi

# Check if containers are running
echo "1️⃣  Checking if containers are running..."
CONTAINERS=$(docker-compose $COMPOSE_FILES ps --services --filter "status=running")

REQUIRED_SERVICES=("backend" "frontend" "couchdb" "meilisearch")
for service in "${REQUIRED_SERVICES[@]}"; do
    if echo "$CONTAINERS" | grep -q "^$service$"; then
        echo "   ✅ $service is running"
    else
        echo "   ❌ $service is not running"
        exit 1
    fi
done

# Check backend health endpoint
echo ""
echo "2️⃣  Checking backend health endpoint..."
for i in {1..10}; do
    if curl -f -s http://localhost:$BACKEND_PORT/health > /dev/null; then
        echo "   ✅ Backend health check passed"
        break
    else
        if [ $i -eq 10 ]; then
            echo "   ❌ Backend health check failed after 10 attempts"
            exit 1
        fi
        echo "   ⏳ Attempt $i/10 - waiting 5 seconds..."
        sleep 5
    fi
done

# Check frontend health endpoint
echo ""
echo "3️⃣  Checking frontend health endpoint..."
for i in {1..10}; do
    if curl -f -s http://localhost:$FRONTEND_PORT/health > /dev/null; then
        echo "   ✅ Frontend health check passed"
        break
    else
        if [ $i -eq 10 ]; then
            echo "   ❌ Frontend health check failed after 10 attempts"
            exit 1
        fi
        echo "   ⏳ Attempt $i/10 - waiting 5 seconds..."
        sleep 5
    fi
done

# Check CouchDB
echo ""
echo "4️⃣  Checking CouchDB..."
if curl -f -s http://localhost:5984/_up > /dev/null; then
    echo "   ✅ CouchDB is healthy"
else
    echo "   ❌ CouchDB health check failed"
    exit 1
fi

# Check MeiliSearch
echo ""
echo "5️⃣  Checking MeiliSearch..."
if curl -f -s http://localhost:7700/health > /dev/null; then
    echo "   ✅ MeiliSearch is healthy"
else
    echo "   ❌ MeiliSearch health check failed"
    exit 1
fi

# Check container resource usage
echo ""
echo "6️⃣  Checking container resource usage..."
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -n 6

# Check for any container restarts
echo ""
echo "7️⃣  Checking for container restarts..."
RESTARTS=$(docker-compose $COMPOSE_FILES ps --format json | jq -r '.[] | select(.State != "running") | .Name')
if [ -n "$RESTARTS" ]; then
    echo "   ⚠️  Some containers have restarted:"
    echo "$RESTARTS"
else
    echo "   ✅ No unexpected container restarts"
fi

# Check logs for errors (last 50 lines)
echo ""
echo "8️⃣  Checking for errors in logs..."
ERROR_COUNT=$(docker-compose $COMPOSE_FILES logs --tail=50 | grep -i "error\|exception\|fatal" | wc -l)
if [ "$ERROR_COUNT" -gt 5 ]; then
    echo "   ⚠️  Found $ERROR_COUNT error messages in logs (showing last 10):"
    docker-compose $COMPOSE_FILES logs --tail=50 | grep -i "error\|exception\|fatal" | tail -10
else
    echo "   ✅ No critical errors in recent logs"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL HEALTH CHECKS PASSED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Environment: $ENVIRONMENT"
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0

