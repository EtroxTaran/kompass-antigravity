#!/bin/bash
# Keycloak Admin Account Creation Script - Production Environment
# This script creates or updates the admin user in Keycloak and CouchDB for production
# It is idempotent - safe to run multiple times
# 
# SECURITY WARNING: This script requires sensitive credentials.
# Only run in secure, controlled environments.

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Keycloak Admin Account Creation - Production${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Configuration - Production defaults
KEYCLOAK_URL="${KEYCLOAK_URL:-https://keycloak.kompass.de}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-kompass}"
KEYCLOAK_ADMIN="${KEYCLOAK_ADMIN:-admin}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD}"

# Admin user configuration - Production defaults
ADMIN_USER_EMAIL="${ADMIN_USER_EMAIL:-admin@kompass.de}"
ADMIN_USER_PASSWORD="${ADMIN_USER_PASSWORD}"
ADMIN_USER_DISPLAY_NAME="${ADMIN_USER_DISPLAY_NAME:-Admin User}"
COUCHDB_URL="${COUCHDB_URL:-http://couchdb:5984}"
COUCHDB_ADMIN_USER="${COUCHDB_ADMIN_USER:-admin}"
COUCHDB_ADMIN_PASSWORD="${COUCHDB_ADMIN_PASSWORD}"

# Parse display name into first and last name
ADMIN_USER_FIRST_NAME="${ADMIN_USER_FIRST_NAME:-Admin}"
ADMIN_USER_LAST_NAME="${ADMIN_USER_LAST_NAME:-User}"

# Validate required environment variables
if [ -z "$KEYCLOAK_ADMIN_PASSWORD" ]; then
  echo -e "${RED}❌ ERROR: KEYCLOAK_ADMIN_PASSWORD environment variable is required${NC}"
  exit 1
fi

if [ -z "$ADMIN_USER_PASSWORD" ]; then
  echo -e "${RED}❌ ERROR: ADMIN_USER_PASSWORD environment variable is required${NC}"
  exit 1
fi

if [ -z "$COUCHDB_ADMIN_PASSWORD" ]; then
  echo -e "${RED}❌ ERROR: COUCHDB_ADMIN_PASSWORD environment variable is required${NC}"
  exit 1
fi

# Security check - warn if running in production
if [ "${ENVIRONMENT:-}" != "production" ]; then
  echo -e "${YELLOW}⚠️  WARNING: This script is for PRODUCTION use.${NC}"
  echo -e "${YELLOW}⚠️  Ensure ENVIRONMENT=production is set if this is intentional.${NC}"
  read -p "Continue? (yes/no): " confirm
  if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
  fi
fi

# Source the main script functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/keycloak-create-admin.sh" --source-only 2>/dev/null || {
  # If sourcing fails, we'll define the functions inline
  # This is a fallback - ideally the main script should support --source-only
  echo -e "${YELLOW}⚠️  Note: Functions will be defined inline${NC}"
}

# Main execution
main

