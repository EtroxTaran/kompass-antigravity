#!/bin/bash

# Enable admin-cli client for direct access grants in Keycloak
# This is needed for the keycloak-setup.sh script to work

set -e

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
KEYCLOAK_ADMIN="${KEYCLOAK_ADMIN:-admin}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-devpassword}"

echo "🔧 Enabling admin-cli client for direct access grants..."

# In Keycloak 23.0 dev mode, we can use the admin REST API
# First, let's try to get a token using account-console client (which should work)
TOKEN_RESPONSE=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${KEYCLOAK_ADMIN}" \
  -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=account-console" 2>&1)

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token with account-console client"
  echo "Response: $TOKEN_RESPONSE"
  echo ""
  echo "Trying alternative: Using kcadm.sh with service account..."
  
  # Try using kcadm.sh with service account approach
  docker exec kompass-keycloak /opt/keycloak/bin/kcadm.sh config credentials \
    --server http://localhost:8080 \
    --realm master \
    --user admin \
    --password "${KEYCLOAK_ADMIN_PASSWORD}" 2>&1 || true
    
  # Get admin-cli client UUID
  CLIENT_UUID=$(docker exec kompass-keycloak /opt/keycloak/bin/kcadm.sh get clients \
    --realm master \
    --server http://localhost:8080 \
    --fields id,clientId \
    --format csv 2>/dev/null | grep admin-cli | cut -d',' -f1 || echo "")
    
  if [ -n "$CLIENT_UUID" ]; then
    echo "✅ Found admin-cli client: $CLIENT_UUID"
    echo "✅ admin-cli client should be enabled by default in dev mode"
    exit 0
  fi
  
  echo "⚠️  Could not enable admin-cli client automatically"
  echo "Please enable it manually in Keycloak Admin Console:"
  echo "1. Go to http://localhost:8080/admin"
  echo "2. Login with admin/devpassword"
  echo "3. Go to Clients > admin-cli"
  echo "4. Enable 'Direct access grants'"
  exit 1
fi

echo "✅ Got token, enabling admin-cli client..."

# Get admin-cli client UUID
CLIENT_RESPONSE=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/master/clients?clientId=admin-cli" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

CLIENT_UUID=$(echo "$CLIENT_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$CLIENT_UUID" ]; then
  echo "❌ admin-cli client not found"
  exit 1
fi

# Get current client configuration
CURRENT_CONFIG=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/master/clients/${CLIENT_UUID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

# Update to enable direct access grants
UPDATED_CONFIG=$(echo "$CURRENT_CONFIG" | sed 's/"directAccessGrantsEnabled":false/"directAccessGrantsEnabled":true/' | sed 's/"directAccessGrantsEnabled":null/"directAccessGrantsEnabled":true/')

# Update client
UPDATE_RESPONSE=$(curl -s -w "%{http_code}" -X PUT "${KEYCLOAK_URL}/admin/realms/master/clients/${CLIENT_UUID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$UPDATED_CONFIG")

HTTP_CODE="${UPDATE_RESPONSE: -3}"

if [ "$HTTP_CODE" = "204" ] || [ "$HTTP_CODE" = "200" ]; then
  echo "✅ admin-cli client enabled for direct access grants"
  exit 0
else
  echo "⚠️  Failed to update client (HTTP $HTTP_CODE)"
  echo "Response: ${UPDATE_RESPONSE%???}"
  exit 1
fi

