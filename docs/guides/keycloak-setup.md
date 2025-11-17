# Keycloak Setup Guide

This guide explains how to set up and configure Keycloak for the KOMPASS application.

## Overview

KOMPASS uses Keycloak for authentication and authorization. Keycloak provides:

- User authentication (login/logout)
- Role-based access control (RBAC)
- Token management (JWT access and refresh tokens)
- User management via Admin API

## Prerequisites

- Docker and Docker Compose installed
- Keycloak service configured in `docker-compose.yml`
- PostgreSQL database for Keycloak (configured in docker-compose.yml)

## Initial Setup

### 1. Start Keycloak

Start the Keycloak service using Docker Compose:

```bash
docker-compose up -d keycloak
```

Wait for Keycloak to be ready (usually takes 30-60 seconds).

### 2. Run Setup Script

Run the Keycloak setup script to configure the realm, clients, roles, and create the default admin user:

```bash
./scripts/keycloak-setup.sh
```

The script will:

- Create the `kompass` realm
- Create `kompass-api` client (confidential, for backend)
- Create `kompass-frontend` client (public, with direct access grants enabled)
- Create all required roles (ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN)
- Create default admin user: `admin@kompass.de` / `Admin123!@#`
- Assign ADMIN role to the admin user

### 3. Verify Setup

Access the Keycloak Admin Console:

- URL: http://localhost:8080
- Username: `admin` (Keycloak admin, not application admin)
- Password: Set via `KEYCLOAK_ADMIN_PASSWORD` environment variable (default: `devpassword`)

Verify:

- Realm `kompass` exists
- Both clients are created
- All roles are present
- Admin user `admin@kompass.de` exists with ADMIN role

## Configuration

### Environment Variables

Keycloak configuration is controlled via environment variables:

**Backend:**

- `KEYCLOAK_URL`: Keycloak server URL (default: `http://keycloak:8080`)
- `KEYCLOAK_REALM`: Realm name (default: `kompass`)
- `KEYCLOAK_CLIENT_ID`: Backend client ID (default: `kompass-api`)
- `KEYCLOAK_ADMIN`: Keycloak admin username (default: `admin`)
- `KEYCLOAK_ADMIN_PASSWORD`: Keycloak admin password (required)

**Frontend:**

- `VITE_KEYCLOAK_URL`: Keycloak server URL (default: `http://localhost:8080`)
- `VITE_KEYCLOAK_REALM`: Realm name (default: `kompass`)
- `VITE_KEYCLOAK_CLIENT_ID`: Frontend client ID (default: `kompass-frontend`)

### Client Configuration

**Frontend Client (`kompass-frontend`):**

- Type: Public client
- Direct Access Grants: Enabled (for embedded login forms)
- Standard Flow: Enabled
- Redirect URIs: `http://localhost:5173/*`, `http://localhost:3000/*`, `http://frontend:8080/*`

**Backend Client (`kompass-api`):**

- Type: Confidential client
- Service Accounts: Enabled
- Standard Flow: Enabled

## Default Admin User

The setup script creates a default admin user:

- **Email:** `admin@kompass.de`
- **Password:** `Admin123!@#` (configurable via `ADMIN_USER_PASSWORD`)
- **Role:** ADMIN

**⚠️ Important:** Change the password on first login in production!

## Roles

The following roles are created automatically:

- **ADM** (Außendienst): Field sales representatives
- **INNEN** (Innendienst): Inside sales and quoting
- **PLAN** (Planungsabteilung): Project planning and execution
- **KALK** (Kalkulation): Cost calculation and time tracking
- **BUCH** (Buchhaltung): Accounting and invoicing
- **GF** (Geschäftsführer): Executive management
- **ADMIN** (System Administrator): Full system access

## Embedded Login

KOMPASS uses **embedded login forms** instead of redirecting to Keycloak's login page. This provides:

- Better user experience (users stay in the application)
- Consistent UI/UX with the application design
- More control over the login flow

The frontend client has **Direct Access Grants** enabled to support this approach.

## User Management

Users can be managed via:

1. **Application UI** (recommended): `/admin` page (GF and ADMIN roles only)
2. **Keycloak Admin Console**: http://localhost:8080/admin
3. **Keycloak Admin REST API**: Used by the backend `KeycloakAdminService`

### Creating Users via Application

1. Log in as admin user (`admin@kompass.de`)
2. Navigate to `/admin`
3. Click "Neuer Benutzer"
4. Fill in user details and assign roles
5. User is created in both Keycloak and CouchDB

### Creating Users via Keycloak Admin Console

1. Access http://localhost:8080/admin
2. Select `kompass` realm
3. Go to Users → Add user
4. Fill in user details
5. Go to Credentials tab to set password
6. Go to Role mapping to assign roles

**Note:** Users created directly in Keycloak will not be automatically synced to CouchDB. Use the application UI for proper synchronization.

## Troubleshooting

### Keycloak Not Starting

- Check Docker logs: `docker-compose logs keycloak`
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check environment variables are set correctly

### Cannot Login

- Verify Keycloak is accessible: `curl http://localhost:8080/health`
- Check client configuration (Direct Access Grants enabled for frontend)
- Verify user exists and is enabled in Keycloak
- Check user roles are assigned correctly

### Token Issues

- Verify JWT token is valid: Check expiration time
- Check token refresh is working: Tokens auto-refresh when expiring
- Verify Keycloak URL is correct in frontend environment variables

### User Not Found in Application

- User must exist in both Keycloak and CouchDB
- Use application UI to create users for proper synchronization
- Check KeycloakAdminService logs for sync errors

## Security Considerations

### Development

- Keycloak is accessible on `localhost:8080`
- Default passwords are used (not secure)
- Direct Access Grants enabled (acceptable for development)

### Production

- Keycloak should only be accessible via internal Docker network
- Use strong passwords and change default admin password
- Enable HTTPS/TLS for Keycloak
- Consider disabling Direct Access Grants if security requirements demand it
- Use Keycloak's password policies
- Enable brute force protection (already configured in setup script)

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html)
- [OIDC/OAuth2 Best Practices](https://www.keycloak.org/docs/latest/securing_apps/)
