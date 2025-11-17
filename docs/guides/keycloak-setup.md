# Keycloak Setup Guide

## Overview

KOMPASS uses Keycloak for authentication and authorization. This guide explains how to set up Keycloak for development.

## Prerequisites

- Keycloak running in Docker (via `docker-compose up`)
- Keycloak accessible at `http://localhost:8080`

## Manual Setup (Recommended for Development)

### Step 1: Access Keycloak Admin Console

1. Navigate to http://localhost:8080/admin
2. Login with:
   - Username: `admin`
   - Password: `devpassword` (or your `KEYCLOAK_ADMIN_PASSWORD`)

### Step 2: Enable admin-cli Client (Required for Setup Script)

1. In the Admin Console, go to **Clients**
2. Find and click on **admin-cli**
3. Enable **Direct access grants**
4. Click **Save**

### Step 3: Run Setup Script

After enabling admin-cli, run the setup script:

```bash
./scripts/keycloak-setup.sh
```

This will create:

- `kompass` realm
- `kompass-api` client (confidential, for backend)
- `kompass-frontend` client (public, with direct access grants enabled)
- Roles: ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN
- Default admin user: `admin@kompass.de` / `Admin123!@#`

### Step 4: Verify Setup

1. Check that the `kompass` realm exists
2. Verify `kompass-frontend` client has **Direct access grants** enabled
3. Test login with default admin credentials

## Automatic Setup (Alternative)

If the setup script fails due to admin-cli authentication issues, you can set up Keycloak manually:

### Create Realm

1. Go to **Realms** > **Create realm**
2. Name: `kompass`
3. Click **Create**

### Create Frontend Client

1. Go to **Clients** > **Create client**
2. Client ID: `kompass-frontend`
3. Client authentication: **Off** (public client)
4. Click **Next**
5. Enable:
   - **Standard flow**
   - **Direct access grants** (required for embedded login)
6. Valid redirect URIs: `http://localhost:5173/*`, `http://localhost:3000/*`
7. Web origins: `*`
8. Click **Save**

### Create API Client

1. Go to **Clients** > **Create client**
2. Client ID: `kompass-api`
3. Client authentication: **On** (confidential client)
4. Click **Next**
5. Enable:
   - **Standard flow**
   - **Service accounts roles**
6. Click **Save**
7. Go to **Credentials** tab and note the **Secret** (needed for backend)

### Create Roles

1. Go to **Realm roles**
2. Create the following roles:
   - `ADM` - Account Manager
   - `INNEN` - Inside Sales
   - `PLAN` - Planning
   - `KALK` - Calculation
   - `BUCH` - Accounting
   - `GF` - Geschäftsführer (CEO)
   - `ADMIN` - System Administrator

### Create Admin User

1. Go to **Users** > **Create new user**
2. Username: `admin@kompass.de`
3. Email: `admin@kompass.de`
4. First name: `Admin`
5. Last name: `User`
6. Email verified: **On**
7. Click **Create**
8. Go to **Credentials** tab
9. Set password: `Admin123!@#`
10. Temporary: **Off**
11. Click **Set password**
12. Go to **Role mapping** tab
13. Assign role: `ADMIN`

## Environment Variables

### Frontend (.env)

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=kompass
VITE_KEYCLOAK_CLIENT_ID=kompass-frontend
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```env
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=kompass
KEYCLOAK_CLIENT_ID=kompass-api
KEYCLOAK_CLIENT_SECRET=<secret-from-api-client>
```

## Testing

### Test Login

1. Navigate to http://localhost:5173/login
2. Login with:
   - Email: `admin@kompass.de`
   - Password: `Admin123!@#`

### Test Registration

1. Navigate to http://localhost:5173/register
2. Fill in registration form
3. Submit and verify user is created

## Troubleshooting

### admin-cli Authentication Fails

If the setup script fails with "unauthorized_client":

1. Enable admin-cli client for direct access grants (see Step 2 above)
2. Run the setup script again

### Realm Not Found

If you get "realm not found" errors:

1. Verify the `kompass` realm exists in Keycloak
2. Check that `KEYCLOAK_REALM=kompass` is set in environment variables

### Direct Access Grants Not Working

If login fails with "invalid_grant":

1. Verify `kompass-frontend` client has **Direct access grants** enabled
2. Check that the client ID matches `VITE_KEYCLOAK_CLIENT_ID`

### Token Validation Fails

If backend token validation fails:

1. Verify `KEYCLOAK_URL`, `KEYCLOAK_REALM`, and `KEYCLOAK_CLIENT_ID` are correct
2. Check that the API client secret is set in backend environment variables
3. Verify JWKS endpoint is accessible: `http://localhost:8080/realms/kompass/protocol/openid-connect/certs`

## References

- Keycloak Documentation: https://www.keycloak.org/docs/
- Keycloak Admin REST API: https://www.keycloak.org/docs-api/latest/rest-api/
- KOMPASS Architecture: `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
