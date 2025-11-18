#!/bin/bash

# Keycloak User Creation Script (Generic)
# Creates a user with a specific role in Keycloak and CouchDB if it doesn't exist.
# Supports development, staging, and production environments.
#
# Usage:
#   ./scripts/keycloak-create-user.sh <ROLE> [EMAIL] [PASSWORD] [DISPLAY_NAME]
#
# Examples:
#   ./scripts/keycloak-create-user.sh ADM
#   ./scripts/keycloak-create-user.sh PLAN plan@kompass.de Plan123!@# "Plan User"
#
# Environment Variables:
#   KEYCLOAK_URL - Keycloak server URL (default: http://localhost:8080)
#   KEYCLOAK_REALM - Realm name (default: kompass)
#   KEYCLOAK_ADMIN - Keycloak admin username (default: admin)
#   KEYCLOAK_ADMIN_PASSWORD - Keycloak admin password (default: devpassword)
#   COUCHDB_URL - CouchDB URL (default: http://localhost:5984)
#   COUCHDB_ADMIN_USER - CouchDB admin username (default: admin)
#   COUCHDB_ADMIN_PASSWORD - CouchDB admin password (default: changeme)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration with defaults
KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-kompass}"
KEYCLOAK_ADMIN="${KEYCLOAK_ADMIN:-admin}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-devpassword}"
COUCHDB_URL="${COUCHDB_URL:-http://localhost:5984}"
COUCHDB_ADMIN_USER="${COUCHDB_ADMIN_USER:-admin}"
COUCHDB_ADMIN_PASSWORD="${COUCHDB_ADMIN_PASSWORD:-devpassword}"

# Parse arguments
ROLE="${1:-}"
if [ -z "$ROLE" ]; then
  echo -e "${RED}❌ Error: Role is required${NC}"
  echo "Usage: $0 <ROLE> [EMAIL] [PASSWORD] [DISPLAY_NAME]"
  echo "Valid roles: ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN"
  exit 1
fi

# Validate role
VALID_ROLES=("ADM" "INNEN" "PLAN" "KALK" "BUCH" "GF" "ADMIN")
if [[ ! " ${VALID_ROLES[@]} " =~ " ${ROLE} " ]]; then
  echo -e "${RED}❌ Error: Invalid role '${ROLE}'${NC}"
  echo "Valid roles: ${VALID_ROLES[*]}"
  exit 1
fi

# Set defaults based on role
case "$ROLE" in
  ADM)
    DEFAULT_EMAIL="adm@kompass.de"
    DEFAULT_PASSWORD="Adm123!@#"
    DEFAULT_DISPLAY_NAME="Test ADM"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="ADM"
    ;;
  INNEN)
    DEFAULT_EMAIL="innen@kompass.de"
    DEFAULT_PASSWORD="Innen123!@#"
    DEFAULT_DISPLAY_NAME="Test INNEN"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="INNEN"
    ;;
  PLAN)
    DEFAULT_EMAIL="plan@kompass.de"
    DEFAULT_PASSWORD="Plan123!@#"
    DEFAULT_DISPLAY_NAME="Test PLAN"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="PLAN"
    ;;
  KALK)
    DEFAULT_EMAIL="kalk@kompass.de"
    DEFAULT_PASSWORD="Kalk123!@#"
    DEFAULT_DISPLAY_NAME="Test KALK"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="KALK"
    ;;
  BUCH)
    DEFAULT_EMAIL="buch@kompass.de"
    DEFAULT_PASSWORD="Buch123!@#"
    DEFAULT_DISPLAY_NAME="Test BUCH"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="BUCH"
    ;;
  GF)
    DEFAULT_EMAIL="gf@kompass.de"
    DEFAULT_PASSWORD="Gf123!@#"
    DEFAULT_DISPLAY_NAME="Test GF"
    DEFAULT_FIRST_NAME="Test"
    DEFAULT_LAST_NAME="GF"
    ;;
  ADMIN)
    DEFAULT_EMAIL="admin@kompass.de"
    DEFAULT_PASSWORD="Admin123!@#"
    DEFAULT_DISPLAY_NAME="Admin User"
    DEFAULT_FIRST_NAME="Admin"
    DEFAULT_LAST_NAME="User"
    ;;
esac

# Use provided values or defaults
USER_EMAIL="${2:-${DEFAULT_EMAIL}}"
USER_PASSWORD="${3:-${DEFAULT_PASSWORD}}"
USER_DISPLAY_NAME="${4:-${DEFAULT_DISPLAY_NAME}}"

# Parse display name into first and last name
USER_FIRST_NAME="${USER_FIRST_NAME:-${DEFAULT_FIRST_NAME}}"
USER_LAST_NAME="${USER_LAST_NAME:-${DEFAULT_LAST_NAME}}"

# If display name was provided, try to parse it
if [ -n "$4" ]; then
  IFS=' ' read -ra NAME_PARTS <<< "$USER_DISPLAY_NAME"
  if [ ${#NAME_PARTS[@]} -ge 2 ]; then
    USER_FIRST_NAME="${NAME_PARTS[0]}"
    USER_LAST_NAME="${NAME_PARTS[*]:1}"
  else
    USER_FIRST_NAME="$USER_DISPLAY_NAME"
    USER_LAST_NAME="$ROLE"
  fi
fi

echo -e "${BLUE}👤 Keycloak User Creation - ${ROLE} Role${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to get Keycloak admin token
get_admin_token() {
  echo -e "${YELLOW}🔑 Getting Keycloak admin token...${NC}" >&2
  
  local response=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=${KEYCLOAK_ADMIN}" \
    -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
    -d "grant_type=password" \
    -d "client_id=admin-cli" 2>&1)

  local token=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

  if [ -z "$token" ]; then
    echo -e "${RED}❌ Failed to get admin token${NC}" >&2
    echo "Response: $response" >&2
    return 1
  fi

  echo "$token"
}

# Function to get user ID from Keycloak
get_keycloak_user_id() {
  local token=$1
  local email=$2

  local encoded_email=$(echo "$email" | sed 's/@/%40/g')

  local response_body=$(curl -s --max-time 5 -X GET "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?email=${encoded_email}&exact=true" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" 2>&1)

  if ! echo "$response_body" | grep -q "^[\[{]"; then
    if [ "${DEBUG:-0}" = "1" ]; then
      echo "DEBUG: Invalid response - $response_body" >&2
    fi
    echo ""
    return 1
  fi

  if command -v jq > /dev/null 2>&1; then
    local user_id=$(echo "$response_body" | jq -r 'if type == "array" and length > 0 then .[0].id else empty end' 2>/dev/null)
    echo "$user_id"
  else
    echo "$response_body" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4
  fi
}

# Function to create user in Keycloak
create_keycloak_user() {
  local token=$1
  local email=$2
  local password=$3
  local first_name=$4
  local last_name=$5

  echo -e "${YELLOW}👤 Creating user in Keycloak: ${email}...${NC}"

  if command -v jq > /dev/null 2>&1; then
    local user_config=$(jq -n \
      --arg username "$email" \
      --arg email "$email" \
      --arg firstName "$first_name" \
      --arg lastName "$last_name" \
      --arg password "$password" \
      '{
        username: $username,
        email: $email,
        firstName: $firstName,
        lastName: $lastName,
        enabled: true,
        emailVerified: true,
        credentials: [{
          type: "password",
          value: $password,
          temporary: false
        }]
      }')
  else
    local user_config=$(printf '{"username":"%s","email":"%s","firstName":"%s","lastName":"%s","enabled":true,"emailVerified":true,"credentials":[{"type":"password","value":"%s","temporary":false}]}' \
      "$email" "$email" "$first_name" "$last_name" "$password")
  fi

  local temp_body=$(mktemp)
  local temp_headers=$(mktemp)
  
  local http_code=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$user_config" \
    -D "$temp_headers" \
    -o "$temp_body" 2>&1)

  local response_body=$(cat "$temp_body")
  rm -f "$temp_body" "$temp_headers"

  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ User created in Keycloak${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  User already exists in Keycloak${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to create user in Keycloak (HTTP $http_code)${NC}"
    if [ -n "$response_body" ]; then
      echo "Response: $response_body"
    fi
    return 1
  fi
}

# Function to assign role to user in Keycloak
assign_role_to_user() {
  local token=$1
  local user_id=$2
  local role_name=$3

  echo -e "${YELLOW}🔗 Assigning role ${role_name} to user...${NC}"

  local role_response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${role_name}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json")

  if [ -z "$role_response" ] || echo "$role_response" | grep -q '"error"'; then
    echo -e "${RED}❌ Role ${role_name} not found in Keycloak${NC}"
    echo -e "${YELLOW}💡 Creating role ${role_name}...${NC}"
    
    local role_config=$(cat <<EOF
{
  "name": "${role_name}",
  "description": "KOMPASS role: ${role_name}",
  "composite": false,
  "clientRole": false
}
EOF
)
    local create_response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles" \
      -H "Authorization: Bearer ${token}" \
      -H "Content-Type: application/json" \
      -d "$role_config")

    local create_code="${create_response: -3}"
    if [ "$create_code" != "201" ] && [ "$create_code" != "409" ]; then
      echo -e "${RED}❌ Failed to create role ${role_name}${NC}"
      return 1
    fi

    role_response=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${role_name}" \
      -H "Authorization: Bearer ${token}" \
      -H "Content-Type: application/json")
  fi

  local response=$(curl -s -w "%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${user_id}/role-mappings/realm" \
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

# Function to check if user exists in CouchDB
user_exists_in_couchdb() {
  local email=$1

  local find_query=$(printf '{"selector":{"type":"user","email":"%s"},"limit":1}' "$email")
  local response=$(curl -s -w "\n%{http_code}" -X POST "${COUCHDB_URL}/kompass/_find" \
    -u "${COUCHDB_ADMIN_USER}:${COUCHDB_ADMIN_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d "$find_query" 2>&1)

  local http_code=$(echo "$response" | tail -1)
  local response_body=$(echo "$response" | head -n -1)

  if [ "$http_code" = "404" ]; then
    local all_docs=$(curl -s -X GET "${COUCHDB_URL}/kompass/_all_docs?include_docs=true" \
      -u "${COUCHDB_ADMIN_USER}:${COUCHDB_ADMIN_PASSWORD}" 2>&1)
    
    if echo "$all_docs" | grep -q "\"email\":\"${email}\""; then
      return 0
    else
      return 1
    fi
  fi

  if [ "$http_code" = "200" ]; then
    if command -v jq > /dev/null 2>&1; then
      local doc_count=$(echo "$response_body" | jq -r '.docs | length' 2>/dev/null || echo "0")
      [ "$doc_count" -gt 0 ]
    else
      echo "$response_body" | grep -q "\"email\":\"${email}\""
    fi
  else
    return 1
  fi
}

# Function to create user in CouchDB
create_couchdb_user() {
  local email=$1
  local display_name=$2
  local keycloak_user_id=$3
  local role=$4

  echo -e "${YELLOW}💾 Creating user in CouchDB: ${email}...${NC}"

  local user_id="user-$(uuidgen | tr '[:upper:]' '[:lower:]')"

  local user_doc=$(cat <<EOF
{
  "_id": "${user_id}",
  "type": "user",
  "email": "${email}",
  "displayName": "${display_name}",
  "roles": ["${role}"],
  "primaryRole": "${role}",
  "active": true,
  "keycloakUserId": "${keycloak_user_id}",
  "createdBy": "system",
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "modifiedBy": "system",
  "modifiedAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "version": 1
}
EOF
)

  local response=$(curl -s -w "%{http_code}" -X POST "${COUCHDB_URL}/kompass" \
    -u "${COUCHDB_ADMIN_USER}:${COUCHDB_ADMIN_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d "$user_doc" 2>&1)

  local http_code="${response: -3}"

  if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ User created in CouchDB${NC}"
    return 0
  elif [ "$http_code" = "409" ]; then
    echo -e "${YELLOW}⚠️  User already exists in CouchDB${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to create user in CouchDB (HTTP $http_code)${NC}"
    echo "Response: ${response%???}"
    return 1
  fi
}

# Main execution
main() {
  echo -e "${BLUE}Configuration:${NC}"
  echo "  Keycloak URL: ${KEYCLOAK_URL}"
  echo "  Realm: ${KEYCLOAK_REALM}"
  echo "  User Email: ${USER_EMAIL}"
  echo "  Display Name: ${USER_DISPLAY_NAME}"
  echo "  Role: ${ROLE}"
  echo ""

  # Get admin token
  ADMIN_TOKEN=$(get_admin_token) || exit 1
  
  if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Failed to obtain admin token${NC}"
    exit 1
  fi

  # Check if user exists in Keycloak
  echo -e "${YELLOW}🔍 Checking if user exists...${NC}"
  
  encoded_email=$(echo "$USER_EMAIL" | sed 's/@/%40/g')
  
  local api_url="${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?email=${encoded_email}&exact=true"
  local auth_header="Authorization: Bearer ${ADMIN_TOKEN}"
  
  if [ "${DEBUG:-0}" = "1" ]; then
    echo "DEBUG: Token length: ${#ADMIN_TOKEN}" >&2
    echo "DEBUG: Token preview: ${ADMIN_TOKEN:0:50}..." >&2
    echo "DEBUG: Encoded email: $encoded_email" >&2
    echo "DEBUG: API URL: $api_url" >&2
  fi
  
  user_response=$(curl -s --max-time 10 -X GET "$api_url" \
    -H "$auth_header" \
    -H "Content-Type: application/json" 2>&1)
  
  if [ "${DEBUG:-0}" = "1" ]; then
    echo "DEBUG: Response length: ${#user_response}" >&2
    echo "DEBUG: Response preview: ${user_response:0:100}" >&2
  fi
  
  if [ -n "$user_response" ] && echo "$user_response" | head -c 1 | grep -q "\["; then
    if command -v jq > /dev/null 2>&1; then
      KEYCLOAK_USER_ID=$(echo "$user_response" | jq -r 'if type == "array" and length > 0 then .[0].id else empty end' 2>/dev/null || echo "")
    else
      KEYCLOAK_USER_ID=$(echo "$user_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    fi
  else
    KEYCLOAK_USER_ID=""
    if [ "${DEBUG:-0}" = "1" ]; then
      echo "DEBUG: Invalid or empty response. First char: '$(echo "$user_response" | head -c 1)'" >&2
      echo "DEBUG: Response: ${user_response:0:200}" >&2
    fi
  fi
  
  if [ "${DEBUG:-0}" = "1" ]; then
    echo "DEBUG: KEYCLOAK_USER_ID='$KEYCLOAK_USER_ID'"
  fi
  
  if [ -n "$KEYCLOAK_USER_ID" ] && [ "$KEYCLOAK_USER_ID" != "null" ] && [ "$KEYCLOAK_USER_ID" != "" ]; then
    echo -e "${GREEN}✅ User already exists in Keycloak${NC}"
    echo -e "${YELLOW}   User ID: ${KEYCLOAK_USER_ID}${NC}"
    
    # Ensure role is assigned
    echo -e "${YELLOW}🔗 Ensuring ${ROLE} role is assigned...${NC}"
    assign_role_to_user "$ADMIN_TOKEN" "$KEYCLOAK_USER_ID" "$ROLE" || true
  else
    echo -e "${YELLOW}👤 User does not exist, creating...${NC}"
    # Create user in Keycloak
    create_keycloak_user "$ADMIN_TOKEN" "$USER_EMAIL" "$USER_PASSWORD" "$USER_FIRST_NAME" "$USER_LAST_NAME" || exit 1
    
    # Get user ID (wait a moment for Keycloak to process)
    sleep 1
    KEYCLOAK_USER_ID=$(get_keycloak_user_id "$ADMIN_TOKEN" "$USER_EMAIL")
    
    if [ -z "$KEYCLOAK_USER_ID" ] || [ "$KEYCLOAK_USER_ID" = "null" ]; then
      echo -e "${RED}❌ Could not retrieve user ID from Keycloak${NC}"
      exit 1
    fi

    # Assign role
    assign_role_to_user "$ADMIN_TOKEN" "$KEYCLOAK_USER_ID" "$ROLE" || exit 1
  fi

  # Check if user exists in CouchDB
  if user_exists_in_couchdb "$USER_EMAIL"; then
    echo -e "${YELLOW}⚠️  User already exists in CouchDB${NC}"
  else
    # Create user in CouchDB
    create_couchdb_user "$USER_EMAIL" "$USER_DISPLAY_NAME" "$KEYCLOAK_USER_ID" "$ROLE" || exit 1
  fi

  echo ""
  echo -e "${GREEN}✅ User setup completed successfully!${NC}"
  echo ""
  echo -e "${GREEN}📋 Summary:${NC}"
  echo "  Email: ${USER_EMAIL}"
  echo "  Password: ${USER_PASSWORD}"
  echo "  Display Name: ${USER_DISPLAY_NAME}"
  echo "  Role: ${ROLE}"
  echo "  Keycloak User ID: ${KEYCLOAK_USER_ID}"
  echo ""
  echo -e "${YELLOW}💡 You can now login with these credentials${NC}"
}

# Only run main if script is executed directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "${0}" ] || [ "${1:-}" != "--source-only" ]; then
  main
fi

