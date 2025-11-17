#!/bin/bash
# Keycloak Admin Account Initialization Script
# This script waits for Keycloak and CouchDB to be ready, then creates the admin account
# Designed to be run as a Docker init container or startup script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADMIN_SCRIPT="${SCRIPT_DIR}/keycloak-create-admin.sh"

# Wait for Keycloak to be ready
wait_for_keycloak() {
  local max_attempts=60
  local attempt=0

  echo "⏳ Waiting for Keycloak to be ready..."
  while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "${KEYCLOAK_URL:-http://localhost:8080}/health" > /dev/null 2>&1; then
      echo "✅ Keycloak is ready"
      return 0
    fi
    attempt=$((attempt + 1))
    echo "  Attempt $attempt/$max_attempts..."
    sleep 2
  done

  echo "❌ Keycloak did not become ready in time"
  return 1
}

# Wait for CouchDB to be ready
wait_for_couchdb() {
  local max_attempts=30
  local attempt=0

  echo "⏳ Waiting for CouchDB to be ready..."
  while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "${COUCHDB_URL:-http://localhost:5984}/_up" > /dev/null 2>&1; then
      echo "✅ CouchDB is ready"
      return 0
    fi
    attempt=$((attempt + 1))
    echo "  Attempt $attempt/$max_attempts..."
    sleep 2
  done

  echo "❌ CouchDB did not become ready in time"
  return 1
}

# Main execution
main() {
  echo "🚀 Starting Keycloak admin account initialization..."

  # Wait for services
  wait_for_keycloak || exit 1
  wait_for_couchdb || exit 1

  # Wait a bit more for Keycloak to fully initialize
  echo "⏳ Waiting for Keycloak realm setup..."
  sleep 5

  # Run admin creation script
  echo "👤 Creating admin account..."
  bash "${ADMIN_SCRIPT}" || {
    echo "⚠️  Admin account creation failed, but continuing..."
    # Don't exit with error - allow container to continue
    exit 0
  }

  echo "✅ Admin account initialization completed"
}

main

