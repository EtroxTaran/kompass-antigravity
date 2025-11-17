# Admin Account Management

## Overview

KOMPASS requires an admin account to be created in both Keycloak (for authentication) and CouchDB (for application data). This guide explains how to create and manage the admin account across different environments.

## Quick Start

### Development

```bash
# Create admin account (idempotent - safe to run multiple times)
./scripts/keycloak-create-admin.sh
```

This creates:
- Admin user in Keycloak: `admin@kompass.de` / `Admin123!@#`
- Admin user in CouchDB with matching `keycloakUserId`
- ADMIN role assigned in Keycloak

### Staging

```bash
# Set required environment variables
export KEYCLOAK_ADMIN_PASSWORD="your-keycloak-admin-password"
export ADMIN_USER_PASSWORD="your-admin-user-password"
export COUCHDB_ADMIN_PASSWORD="your-couchdb-password"

# Run staging script
./scripts/keycloak-create-admin-staging.sh
```

### Production

```bash
# Set required environment variables
export ENVIRONMENT=production
export KEYCLOAK_ADMIN_PASSWORD="your-keycloak-admin-password"
export ADMIN_USER_PASSWORD="your-admin-user-password"
export COUCHDB_ADMIN_PASSWORD="your-couchdb-password"

# Run production script (requires confirmation)
./scripts/keycloak-create-admin-production.sh
```

## Script Details

### `keycloak-create-admin.sh` (Development)

**Purpose**: Creates or updates admin account in development environment.

**Features**:
- Idempotent (safe to run multiple times)
- Checks if user exists before creating
- Creates user in both Keycloak and CouchDB
- Automatically assigns ADMIN role
- Uses development defaults

**Default Configuration**:
- Keycloak URL: `http://localhost:8080`
- Realm: `kompass`
- Admin Email: `admin@kompass.de`
- Admin Password: `Admin123!@#`
- CouchDB URL: `http://localhost:5984`

**Usage**:
```bash
./scripts/keycloak-create-admin.sh
```

**Environment Variables** (optional):
- `KEYCLOAK_URL` - Override Keycloak URL
- `KEYCLOAK_REALM` - Override realm name
- `KEYCLOAK_ADMIN` - Override Keycloak admin username
- `KEYCLOAK_ADMIN_PASSWORD` - Override Keycloak admin password
- `ADMIN_USER_EMAIL` - Override admin user email
- `ADMIN_USER_PASSWORD` - Override admin user password
- `ADMIN_USER_DISPLAY_NAME` - Override admin user display name
- `COUCHDB_URL` - Override CouchDB URL
- `COUCHDB_ADMIN_USER` - Override CouchDB admin username
- `COUCHDB_ADMIN_PASSWORD` - Override CouchDB admin password

### `keycloak-create-admin-staging.sh` (Staging)

**Purpose**: Creates or updates admin account in staging environment.

**Features**:
- Requires environment variables (no defaults for security)
- Validates all required credentials
- Uses staging Keycloak URL by default
- Same idempotent behavior as development script

**Required Environment Variables**:
- `KEYCLOAK_ADMIN_PASSWORD` - Keycloak admin password
- `ADMIN_USER_PASSWORD` - Admin user password
- `COUCHDB_ADMIN_PASSWORD` - CouchDB admin password

**Optional Environment Variables**:
- `KEYCLOAK_URL` - Keycloak URL (default: `https://keycloak.staging.kompass.de`)
- `ADMIN_USER_EMAIL` - Admin user email (default: `admin@kompass.de`)
- `ADMIN_USER_DISPLAY_NAME` - Admin user display name (default: `Admin User`)

**Usage**:
```bash
KEYCLOAK_ADMIN_PASSWORD=... ADMIN_USER_PASSWORD=... COUCHDB_ADMIN_PASSWORD=... \
  ./scripts/keycloak-create-admin-staging.sh
```

### `keycloak-create-admin-production.sh` (Production)

**Purpose**: Creates or updates admin account in production environment.

**Features**:
- Requires environment variables (no defaults for security)
- Requires `ENVIRONMENT=production` confirmation
- Validates all required credentials
- Uses production Keycloak URL by default
- Same idempotent behavior as development script

**Required Environment Variables**:
- `ENVIRONMENT=production` - Must be set to confirm production use
- `KEYCLOAK_ADMIN_PASSWORD` - Keycloak admin password
- `ADMIN_USER_PASSWORD` - Admin user password
- `COUCHDB_ADMIN_PASSWORD` - CouchDB admin password

**Optional Environment Variables**:
- `KEYCLOAK_URL` - Keycloak URL (default: `https://keycloak.kompass.de`)
- `ADMIN_USER_EMAIL` - Admin user email (default: `admin@kompass.de`)
- `ADMIN_USER_DISPLAY_NAME` - Admin user display name (default: `Admin User`)

**Usage**:
```bash
ENVIRONMENT=production \
  KEYCLOAK_ADMIN_PASSWORD=... ADMIN_USER_PASSWORD=... COUCHDB_ADMIN_PASSWORD=... \
  ./scripts/keycloak-create-admin-production.sh
```

## Password Requirements

The admin user password must meet Keycloak's password policy requirements:

- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (`@$!%*?&`)

**Example valid passwords**:
- `Admin123!@#`
- `SecurePassword2024!`
- `MyAdmin@2024`

## What the Scripts Do

1. **Get Keycloak Admin Token**: Authenticate with Keycloak using admin credentials
2. **Check if User Exists**: Query Keycloak for existing admin user by email
3. **Create User (if needed)**: Create admin user in Keycloak with specified credentials
4. **Assign ADMIN Role**: Ensure ADMIN role is assigned to the user
5. **Create CouchDB User**: Create corresponding user document in CouchDB with `keycloakUserId`

## Verification

After running the script, verify the admin account:

### Check Keycloak

```bash
# Login via Keycloak token endpoint
curl -X POST "http://localhost:8080/realms/kompass/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=kompass-frontend&username=admin@kompass.de&password=Admin123!@#"
```

### Check CouchDB

```bash
# Query CouchDB for admin user
curl -u admin:devpassword "http://localhost:5984/kompass/_find" \
  -H "Content-Type: application/json" \
  -d '{"selector":{"type":"user","email":"admin@kompass.de"}}'
```

### Check via Application

1. Navigate to login page
2. Enter admin credentials
3. Verify successful login and redirect to dashboard

## Troubleshooting

### Script Fails with "Failed to get admin token"

**Cause**: Keycloak admin credentials are incorrect or Keycloak is not ready.

**Solution**:
1. Verify Keycloak is running: `curl http://localhost:8080/health`
2. Check `KEYCLOAK_ADMIN_PASSWORD` matches Keycloak configuration
3. Wait for Keycloak to fully start (may take 30-60 seconds)

### Script Fails with "User already exists" but Role Assignment Fails

**Cause**: User exists but role assignment is failing.

**Solution**:
1. Check if ADMIN role exists in Keycloak realm
2. Verify user has correct permissions
3. Run script again (idempotent, will retry role assignment)

### Script Fails with "Failed to create user in CouchDB"

**Cause**: CouchDB credentials are incorrect or CouchDB is not accessible.

**Solution**:
1. Verify CouchDB is running: `curl http://localhost:5984/_up`
2. Check `COUCHDB_ADMIN_PASSWORD` matches CouchDB configuration
3. Verify CouchDB database `kompass` exists

### User Created in Keycloak but Not in CouchDB

**Cause**: CouchDB creation step failed.

**Solution**:
1. Run script again (idempotent, will create CouchDB user if missing)
2. Manually create user in CouchDB using the `keycloakUserId` from Keycloak

## Integration with Deployment

### Docker Compose

For development, you can run the admin setup script manually after services start:

```bash
docker-compose up -d
# Wait for services to be ready
./scripts/keycloak-create-admin.sh
```

### CI/CD Pipeline

For staging/production, add the admin setup script to your deployment pipeline:

```yaml
# Example GitHub Actions step
- name: Create Admin Account
  env:
    KEYCLOAK_ADMIN_PASSWORD: ${{ secrets.KEYCLOAK_ADMIN_PASSWORD }}
    ADMIN_USER_PASSWORD: ${{ secrets.ADMIN_USER_PASSWORD }}
    COUCHDB_ADMIN_PASSWORD: ${{ secrets.COUCHDB_ADMIN_PASSWORD }}
  run: |
    ./scripts/keycloak-create-admin-staging.sh
```

## Security Considerations

1. **Never commit passwords**: Use environment variables or secrets management
2. **Rotate passwords regularly**: Change admin passwords periodically
3. **Limit admin access**: Only grant admin access to trusted users
4. **Monitor admin activity**: Log and monitor admin account usage
5. **Use strong passwords**: Follow password requirements strictly

## Related Documentation

- [Keycloak Setup Guide](./keycloak-setup.md) - Initial Keycloak configuration
- [Authentication Architecture](../architecture/decisions/adr-021-keycloak-authentication.md) - Authentication design decisions

