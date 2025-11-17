#!/bin/bash

# Keycloak Setup Script for KOMPASS
# This script configures Keycloak with the KOMPASS realm, clients, and roles.
#
# Prerequisites:
# - Keycloak must be running and accessible
# - Keycloak admin credentials must be set in environment variables
#
# Usage:
#   ./scripts/keycloak-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
KEYCLOAK_ADMIN="${KEYCLOAK_ADMIN:-admin}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-devpassword}"
REALM_NAME="${KEYCLOAK_REALM:-kompass}"
API_CLIENT_ID="${KEYCLOAK_CLIENT_ID:-kompass-api}"
FRONTEND_CLIENT_ID="${KEYCLOAK_FRONTEND_CLIENT_ID:-kompass-frontend}"

# Default admin user configuration
ADMIN_USER_EMAIL="${ADMIN_USER_EMAIL:-admin@kompass.de}"
ADMIN_USER_PASSWORD="${ADMIN_USER_PASSWORD:-Admin123!@#}"
ADMIN_USER_FIRST_NAME="${ADMIN_USER_FIRST_NAME:-Admin}"
ADMIN_USER_LAST_NAME="${ADMIN_USER_LAST_NAME:-User}"

# Roles to create
ROLES=("ADM" "INNEN" "PLAN" "KALK" "BUCH" "GF" "ADMIN")

echo -e "${GREEN}🚀 Starting Keycloak setup for KOMPASS...${NC}"

# Function to wait for Keycloak to be ready
wait_for_keycloak() {
  echo -e "${YELLOW}⏳ Waiting for Keycloak to be ready...${NC}"
  local max_attempts=60
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "${KEYCLOAK_URL}/health" > /dev/null 2>&1; then
      echo -e "${GREEN}✅ Keycloak is ready!${NC}"
      return 0
    fi
    attempt=$((attempt + 1))
    echo -e "${YELLOW}   Attempt $attempt/$max_attempts...${NC}"
    sleep 2
  done

  echo -e "${RED}❌ Keycloak did not become ready in time${NC}"
  return 1
}

# Function to get admin access token
get_admin_token() {
  echo -e "${YELLOW}🔑 Getting admin access token...${NC}"
  
  # Try admin-cli client first
  local response=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=${KEYCLOAK_ADMIN}" \
    -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

  local token=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

  # If admin-cli fails, try using kcadm.sh to get token
  if [ -z "$token" ]; then
    echo -e "${YELLOW}⚠️  admin-cli client authentication failed, trying kcadm.sh...${NC}"
    
    # Use kcadm.sh to get token (works in dev mode)
    local kcadm_token=$(docker exec kompass-keycloak /opt/keycloak/bin/kcadm.sh config credentials \
      --server http://localhost:8080 \
      --realm master \
      --user admin \
      --password "${KEYCLOAK_ADMIN_PASSWORD}" \
      --client admin-cli 2>&1 | grep -i "token" || echo "")
    
    if [ -n "$kcadm_token" ]; then
      # kcadm.sh stores token in ~/.keycloak/kcadm.config, but we need it in script
      # So let's try a different approach - use the admin REST API with service account
      echo -e "${YELLOW}⚠️  kcadm.sh requires manual setup. Trying alternative method...${NC}"
      
      # Alternative: Use the backend's KeycloakAdminService or manual setup
      echo -e "${RED}❌ Automatic Keycloak setup requires admin-cli client to be enabled${NC}"
      echo -e "${YELLOW}💡 Please enable admin-cli client manually:${NC}"
      echo "   1. Go to http://localhost:8080/admin"
      echo "   2. Login with admin/${KEYCLOAK_ADMIN_PASSWORD}"
      echo "   3. Go to Clients > admin-cli"
      echo "   4. Enable 'Direct access grants'"
      echo "   5. Save"
      echo ""
      echo -e "${YELLOW}   Or run this script again after enabling admin-cli${NC}"
      return 1
    fi
  fi

  if [ -z "$token" ]; then
    echo -e "${RED}❌ Failed to get admin token${NC}"
    echo "Response: $response"
    return 1
  fi

  echo "$token"
}

# Function to check if realm exists
realm_exists() {
  local token=$1
  local response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -w "%{http_code}")

  local http_code="${response: -3}"
  [ "$http_code" = "200" ]
}

# Function to create realm
create_realm() {
  local token=$1
  echo -e "${YELLOW}📦 Creating realm: ${REALM_NAME}...${NC}"

  # Check if realm already exists
  local realm_check=$(curl -s -w "%{http_code}" -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")
  
  local check_code="${realm_check: -3}"
  if [ "$check_code" = "200" ]; then
    echo -e "${YELLOW}⚠️  Realm already exists, skipping creation${NC}"
    return 0
  fi

  local realm_config=$(cat <<EOF
{
  "realm": "${REALM_NAME}",
  "enabled": true,
  "displayName": "KOMPASS",
  "displayNameHtml": "<div class=\"kc-logo-text\"><span>KOMPASS</span></div>",
  "loginTheme": "keycloak",
  "accountTheme": "keycloak",
  "adminTheme": "keycloak",
  "emailTheme": "keycloak",
  "accessTokenLifespan": 300,
  "accessTokenLifespanForImplicitFlow": 900,
  "ssoSessionIdleTimeout": 1800,
  "ssoSessionMaxLifespan": 36000,
  "offlineSessionIdleTimeout": 2592000,
  "accessCodeLifespan": 60,
  "accessCodeLifespanUserAction": 300,
  "accessCodeLifespanLogin": 1800,
  "actionTokenGeneratedByAdminLifespan": 43200,
  "actionTokenGeneratedByUserLifespan": 300,
  "enabled": true,
  "sslRequired": "external",
  "registrationAllowed": false,
  "registrationEmailAsUsername": false,
  "rememberMe": true,
  "verifyEmail": false,
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": true,
  "editUsernameAllowed": false,
  "bruteForceProtected": true,
  "permanentLockout": false,
  "maxFailureWaitSeconds": 900,
  "minimumQuickLoginWaitSeconds": 60,
  "waitIncrementSeconds": 60,
  "quickLoginCheckMilliSeconds": 1000,
  "maxDeltaTimeSeconds": 43200,
  "failureFactor": 30
}
EOF
)

  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$realm_config")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Realm created successfully${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  Realm already exists, skipping creation${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to create realm (HTTP $http_code)${NC}"
    echo "Response: ${response%???}"
    return 1
  fi
}

# Function to create client
create_client() {
  local token=$1
  local client_id=$2
  local client_type=$3  # "confidential" or "public"
  local redirect_uris=$4
  local enable_direct_grants=${5:-false}  # Enable direct access grants for embedded login

  echo -e "${YELLOW}📦 Creating client: ${client_id}...${NC}"

  local client_config=$(cat <<EOF
{
  "clientId": "${client_id}",
  "enabled": true,
  "clientAuthenticatorType": "${client_type}",
  "redirectUris": ${redirect_uris},
  "webOrigins": ["*"],
  "protocol": "openid-connect",
  "publicClient": ${([ "$client_type" = "public" ] && echo "true" || echo "false")},
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": ${([ "$enable_direct_grants" = "true" ] && echo "true" || echo "false")},
  "serviceAccountsEnabled": ${([ "$client_type" = "confidential" ] && echo "true" || echo "false")},
  "authorizationServicesEnabled": false,
  "fullScopeAllowed": true
}
EOF
)

  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$client_config")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Client created successfully${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  Client already exists, updating configuration...${NC}"
    # Update existing client to enable direct grants
    update_client_direct_grants "$token" "$client_id" "$enable_direct_grants"
    return 0
  else
    echo -e "${RED}❌ Failed to create client (HTTP $http_code)${NC}"
    echo "Response: ${response%???}"
    return 1
  fi
}

# Function to update client to enable direct access grants
update_client_direct_grants() {
  local token=$1
  local client_id=$2
  local enable=$3

  local client_uuid=$(get_client_uuid "$token" "$client_id")
  if [ -z "$client_uuid" ]; then
    echo -e "${RED}❌ Client ${client_id} not found${NC}"
    return 1
  fi

  # Get current client configuration
  local current_config=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${client_uuid}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  # Update directAccessGrantsEnabled
  local updated_config=$(echo "$current_config" | sed "s/\"directAccessGrantsEnabled\":[^,}]*/\"directAccessGrantsEnabled\":${enable}/")

  local response=$(curl -s -w "%{http_code}" -X PUT "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${client_uuid}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$updated_config")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "204" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Client updated successfully${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️  Failed to update client (HTTP $http_code), continuing...${NC}"
    return 0
  fi
}

# Function to create role
create_role() {
  local token=$1
  local role_name=$2

  echo -e "${YELLOW}📦 Creating role: ${role_name}...${NC}"

  local role_config=$(cat <<EOF
{
  "name": "${role_name}",
  "description": "KOMPASS role: ${role_name}",
  "composite": false,
  "clientRole": false
}
EOF
)

  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$role_config")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Role created successfully${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  Role already exists, skipping creation${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to create role (HTTP $http_code)${NC}"
    echo "Response: ${response%???}"
    return 1
  fi
}

# Function to get client UUID
get_client_uuid() {
  local token=$1
  local client_id=$2

  local response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients?clientId=${client_id}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4
}

# Function to assign realm roles to client
assign_realm_roles_to_client() {
  local token=$1
  local client_uuid=$2

  echo -e "${YELLOW}🔗 Assigning realm roles to client...${NC}"

  # Get all realm roles
  local roles_response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  # For each role, create a client role mapping
  for role in "${ROLES[@]}"; do
    local role_id=$(echo "$roles_response" | grep -o "\"id\":\"[^\"]*\",\"name\":\"${role}\"" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$role_id" ]; then
      # Create client role with same name
      local client_role_config=$(cat <<EOF
{
  "name": "${role}",
  "description": "KOMPASS role: ${role}",
  "composite": false,
  "clientRole": true
}
EOF
)
      curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${client_uuid}/roles" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$client_role_config" > /dev/null 2>&1 || true
    fi
  done

  echo -e "${GREEN}✅ Client roles assigned${NC}"
}

# Function to check if user exists
user_exists() {
  local token=$1
  local email=$2

  local response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?email=${email}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  local user_count=$(echo "$response" | grep -o '"id"' | wc -l)
  [ "$user_count" -gt 0 ]
}

# Function to create user
create_user() {
  local token=$1
  local email=$2
  local password=$3
  local first_name=$4
  local last_name=$5
  local enabled=${6:-true}

  echo -e "${YELLOW}👤 Creating user: ${email}...${NC}"

  local user_config=$(cat <<EOF
{
  "username": "${email}",
  "email": "${email}",
  "firstName": "${first_name}",
  "lastName": "${last_name}",
  "enabled": ${enabled},
  "emailVerified": true,
  "credentials": [
    {
      "type": "password",
      "value": "${password}",
      "temporary": false
    }
  ]
}
EOF
)

  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$user_config")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ User created successfully${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  User already exists, skipping creation${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to create user (HTTP $http_code)${NC}"
    echo "Response: ${response%???}"
    return 1
  fi
}

# Function to get user ID by email
get_user_id() {
  local token=$1
  local email=$2

  local response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?email=${email}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4
}

# Function to assign role to user
assign_role_to_user() {
  local token=$1
  local user_id=$2
  local role_name=$3

  echo -e "${YELLOW}🔗 Assigning role ${role_name} to user...${NC}"

  # Get role representation
  local role_response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles/${role_name}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  if [ -z "$role_response" ] || echo "$role_response" | grep -q '"error"'; then
    echo -e "${RED}❌ Role ${role_name} not found${NC}"
    return 1
  fi

  # Assign role to user
  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${user_id}/role-mappings/realm" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "[${role_response}]")

  local http_code="${response: -3}"
  
  if [ "$http_code" = "204" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Role ${role_name} assigned successfully${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️  Failed to assign role (HTTP $http_code), may already be assigned${NC}"
    return 0
  fi
}

# Main execution
main() {
  # Wait for Keycloak
  wait_for_keycloak || exit 1

  # Get admin token
  ADMIN_TOKEN=$(get_admin_token) || exit 1

  # Create realm
  create_realm "$ADMIN_TOKEN" || exit 1

  # Create API client (confidential, for backend)
  API_REDIRECT_URIS='["*"]'
  create_client "$ADMIN_TOKEN" "$API_CLIENT_ID" "confidential" "$API_REDIRECT_URIS" || exit 1

  # Create Frontend client (public, for React app) with direct access grants enabled
  FRONTEND_REDIRECT_URIS='["http://localhost:5173/*", "http://localhost:3000/*", "http://frontend:8080/*"]'
  create_client "$ADMIN_TOKEN" "$FRONTEND_CLIENT_ID" "public" "$FRONTEND_REDIRECT_URIS" "true" || exit 1

  # Create roles
  for role in "${ROLES[@]}"; do
    create_role "$ADMIN_TOKEN" "$role" || exit 1
  done

  # Assign realm roles to API client (for service account)
  API_CLIENT_UUID=$(get_client_uuid "$ADMIN_TOKEN" "$API_CLIENT_ID")
  if [ -n "$API_CLIENT_UUID" ]; then
    assign_realm_roles_to_client "$ADMIN_TOKEN" "$API_CLIENT_UUID" || exit 1
  fi

  # Create default admin user
  if ! user_exists "$ADMIN_TOKEN" "$ADMIN_USER_EMAIL"; then
    create_user "$ADMIN_TOKEN" "$ADMIN_USER_EMAIL" "$ADMIN_USER_PASSWORD" "$ADMIN_USER_FIRST_NAME" "$ADMIN_USER_LAST_NAME" "true" || exit 1
    
    # Get admin user ID and assign ADMIN role
    ADMIN_USER_ID=$(get_user_id "$ADMIN_TOKEN" "$ADMIN_USER_EMAIL")
    if [ -n "$ADMIN_USER_ID" ]; then
      assign_role_to_user "$ADMIN_TOKEN" "$ADMIN_USER_ID" "ADMIN" || exit 1
      echo -e "${GREEN}✅ Admin user created and ADMIN role assigned${NC}"
    else
      echo -e "${YELLOW}⚠️  Could not find admin user ID, role assignment skipped${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  Admin user already exists, skipping creation${NC}"
    # Ensure ADMIN role is assigned
    ADMIN_USER_ID=$(get_user_id "$ADMIN_TOKEN" "$ADMIN_USER_EMAIL")
    if [ -n "$ADMIN_USER_ID" ]; then
      assign_role_to_user "$ADMIN_TOKEN" "$ADMIN_USER_ID" "ADMIN" || true
    fi
  fi

  echo -e "${GREEN}✅ Keycloak setup completed successfully!${NC}"
  echo ""
  echo -e "${GREEN}📋 Summary:${NC}"
  echo "  - Realm: ${REALM_NAME}"
  echo "  - API Client: ${API_CLIENT_ID}"
  echo "  - Frontend Client: ${FRONTEND_CLIENT_ID} (Direct Access Grants: Enabled)"
  echo "  - Roles: ${ROLES[*]}"
  echo "  - Admin User: ${ADMIN_USER_EMAIL}"
  echo ""
  echo -e "${YELLOW}💡 Default Admin Credentials:${NC}"
  echo "  Email: ${ADMIN_USER_EMAIL}"
  echo "  Password: ${ADMIN_USER_PASSWORD}"
  echo "  ⚠️  Please change the password on first login!"
  echo ""
  echo -e "${YELLOW}💡 Next steps:${NC}"
  echo "  1. Test login with admin credentials"
  echo "  2. Create additional users via the application"
  echo "  3. Test authentication flow"
}

# Run main function
main

