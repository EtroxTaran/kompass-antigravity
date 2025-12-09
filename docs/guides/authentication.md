# Keycloak Authentication Guide

**Last Updated:** 2025-01-28  
**Status:** Active  
**Related:** [API Specification](../specifications/api-specification.md#2-authentication)

---

## Overview

KOMPASS uses **Keycloak** for authentication and single sign-on (SSO). This guide explains how to set up, configure, and use Keycloak authentication in the KOMPASS application.

## Table of Contents

1. [Keycloak Setup](#1-keycloak-setup)
2. [Backend Authentication Flow](#2-backend-authentication-flow)
3. [Frontend Authentication Flow](#3-frontend-authentication-flow)
4. [Token Refresh Mechanism](#4-token-refresh-mechanism)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Keycloak Setup

### Prerequisites

- Docker and Docker Compose installed
- Keycloak service running (configured in `docker-compose.yml`)

### Initial Setup

1. **Start Keycloak service:**

```bash
docker-compose up -d keycloak postgres
```

2. **Wait for Keycloak to be ready:**

The Keycloak service takes approximately 2 minutes to start. You can check if it's ready by:

```bash
curl http://localhost:8080/health
```

3. **Run the setup script:**

```bash
./scripts/keycloak-setup.sh
```

This script will:

- Create the `kompass` realm
- Create `kompass-api` client (confidential, for backend)
- Create `kompass-frontend` client (public, for React app)
- Create roles: ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN
- Configure client redirect URIs

### Manual Setup (Alternative)

If the script fails, you can set up Keycloak manually:

1. **Access Keycloak Admin Console:**
   - URL: http://localhost:8080
   - Username: `admin`
   - Password: `devpassword` (or value from `KEYCLOAK_ADMIN_PASSWORD` env var)

2. **Create Realm:**
   - Click "Create Realm"
   - Name: `kompass`
   - Click "Create"

3. **Create API Client:**
   - Go to "Clients" → "Create client"
   - Client ID: `kompass-api`
   - Client authentication: **ON** (confidential)
   - Click "Next"
   - Valid redirect URIs: `*`
   - Web origins: `*`
   - Click "Save"
   - Copy the "Client secret" (needed for backend config)

4. **Create Frontend Client:**
   - Go to "Clients" → "Create client"
   - Client ID: `kompass-frontend`
   - Client authentication: **OFF** (public)
   - Click "Next"
   - Valid redirect URIs: `http://localhost:5173/*`, `http://localhost:3000/*`
   - Web origins: `*`
   - Click "Save"

5. **Create Roles:**
   - Go to "Realm roles" → "Create role"
   - Create each role: ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN

6. **Create Test User:**
   - Go to "Users" → "Add user"
   - Username: `testuser`
   - Email: `test@example.com`
   - Click "Create"
   - Go to "Credentials" tab
   - Set password (temporary: OFF)
   - Go to "Role mapping" tab
   - Assign roles (e.g., ADM, PLAN)

### Environment Variables

#### Backend (`apps/backend/.env`)

```bash
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=kompass
KEYCLOAK_CLIENT_ID=kompass-api
KEYCLOAK_CLIENT_SECRET=<client-secret-from-keycloak>
```

#### Frontend (`apps/frontend/.env`)

```bash
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=kompass
VITE_KEYCLOAK_CLIENT_ID=kompass-frontend
```

---

## 2. Backend Authentication Flow

### JWT Strategy

The backend uses a **JWT strategy** (`JwtStrategy`) that:

1. Extracts JWT token from `Authorization: Bearer {token}` header
2. Validates token signature using Keycloak's public keys (JWKS)
3. Verifies token expiry, issuer, and audience
4. Extracts user information and roles from token
5. Maps Keycloak roles to KOMPASS `UserRole` enum
6. Attaches user object to `request.user`

### JWT Guard

The `JwtAuthGuard` protects routes by:

- Validating JWT tokens on every request
- Throwing `401 Unauthorized` if token is invalid or missing
- Attaching authenticated user to request object

### Usage in Controllers

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RbacGuard } from "../auth/guards/rbac.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermission } from "../auth/decorators/require-permission.decorator";

@Controller("api/v1/customers")
@UseGuards(JwtAuthGuard, RbacGuard)
export class CustomerController {
  @Get()
  @RequirePermission("Customer", "READ")
  async findAll(@CurrentUser() user: User) {
    // user is automatically populated from JWT token
    return this.customerService.findAll(user);
  }
}
```

### Token Validation

The backend validates tokens using:

- **JWKS Endpoint**: `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs`
- **Public Key Caching**: Keys are cached to reduce requests
- **Automatic Refresh**: Keys are refreshed periodically

---

## 3. Frontend Authentication Flow

### Keycloak Client Initialization

The frontend uses `keycloak-js` to interact with Keycloak:

```typescript
import { initKeycloak, login, logout } from "./lib/auth";

// Initialize on app startup
await initKeycloak();

// Login (redirects to Keycloak)
await login();

// Logout (invalidates session)
await logout();
```

### Auth Context

The `AuthContext` provides:

- `user`: Current authenticated user
- `isAuthenticated`: Boolean authentication state
- `isLoading`: Loading state during auth check
- `login()`: Login function
- `logout()`: Logout function
- `getToken()`: Get current access token

### Protected Routes

Use `ProtectedRoute` component to protect routes:

```tsx
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>;
```

### Login Flow

1. User clicks "Sign In" button
2. Frontend calls `login()` function
3. User is redirected to Keycloak login page
4. User enters credentials in Keycloak
5. Keycloak validates credentials
6. Keycloak redirects back to app with authorization code
7. Frontend exchanges code for access token
8. Token is stored (handled by Keycloak JS adapter)
9. User is redirected to originally requested page or dashboard

### Logout Flow

1. User clicks "Logout" button
2. Frontend calls `logout()` function
3. Keycloak invalidates session
4. Local tokens are cleared
5. User is redirected to login page

---

## 4. Token Refresh Mechanism

### Automatic Token Refresh

The frontend automatically refreshes tokens before expiry:

- **Refresh Threshold**: 30 seconds before expiry
- **Refresh Interval**: Every 5 minutes (or when token is about to expire)
- **Failure Handling**: If refresh fails, user is logged out and redirected to login

### Implementation

```typescript
// In auth.ts
export function setupTokenRefresh(): void {
  setInterval(
    async () => {
      try {
        await keycloak.updateToken(30); // Refresh if expires within 30s
      } catch (error) {
        await logout(); // Refresh failed, logout user
      }
    },
    5 * 60 * 1000,
  ); // Check every 5 minutes
}
```

### API Client Token Refresh

The API client (`api-client.ts`) automatically:

1. Adds token to `Authorization` header on every request
2. Handles 401 errors by attempting token refresh
3. Retries original request with new token
4. Logs out user if refresh fails

---

## 5. Troubleshooting

### Common Issues

#### Issue: "Failed to initialize Keycloak"

**Symptoms:**

- Frontend shows error on load
- Keycloak connection fails

**Solutions:**

1. Verify Keycloak is running: `curl http://localhost:8080/health`
2. Check `VITE_KEYCLOAK_URL` in frontend `.env`
3. Verify Keycloak realm exists
4. Check browser console for CORS errors

#### Issue: "401 Unauthorized" on API requests

**Symptoms:**

- API requests return 401
- Token appears to be valid

**Solutions:**

1. Verify token is included in `Authorization` header
2. Check token expiry (may need refresh)
3. Verify backend `KEYCLOAK_URL` points to correct Keycloak instance
4. Check Keycloak realm and client ID match configuration
5. Verify JWKS endpoint is accessible: `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs`

#### Issue: "User has no assigned roles"

**Symptoms:**

- Login succeeds but user has no roles
- RBAC checks fail

**Solutions:**

1. Verify user has roles assigned in Keycloak
2. Check roles are in `realm_access.roles` or `resource_access.{client-id}.roles`
3. Verify role names match KOMPASS `UserRole` enum (ADM, INNEN, PLAN, etc.)
4. Check token in browser DevTools → Application → Local Storage → keycloak-token

#### Issue: Token refresh fails

**Symptoms:**

- User is logged out unexpectedly
- Token refresh errors in console

**Solutions:**

1. Check Keycloak session is still valid
2. Verify refresh token is not expired
3. Check network connectivity to Keycloak
4. Verify Keycloak client configuration allows refresh token flow

#### Issue: CORS errors

**Symptoms:**

- Browser console shows CORS errors
- Keycloak redirects fail

**Solutions:**

1. Verify `VITE_KEYCLOAK_URL` uses correct protocol (http vs https)
2. Check Keycloak client "Web origins" includes frontend URL
3. Verify "Valid redirect URIs" includes frontend callback URLs
4. Check backend `ALLOWED_ORIGINS` includes frontend URL

### Debugging Tips

1. **Check Keycloak Token:**
   - Open browser DevTools → Application → Local Storage
   - Look for `keycloak-token` or similar
   - Decode JWT at https://jwt.io to see claims

2. **Verify Backend Configuration:**
   - Check backend logs for JWT validation errors
   - Verify `KEYCLOAK_URL` is accessible from backend container
   - Test JWKS endpoint: `curl {KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs`

3. **Check Network Requests:**
   - Open browser DevTools → Network tab
   - Verify `Authorization: Bearer {token}` header is present
   - Check response status codes (401 = auth issue)

4. **Keycloak Admin Console:**
   - Access http://localhost:8080
   - Check realm settings
   - Verify clients are configured correctly
   - Check user role assignments

### Getting Help

If you encounter issues not covered here:

1. Check Keycloak logs: `docker-compose logs keycloak`
2. Check backend logs: `docker-compose logs backend`
3. Check frontend console for errors
4. Review [Keycloak Documentation](https://www.keycloak.org/docs/)
5. Check [API Specification](../specifications/api-specification.md#2-authentication)

---

## Related Documentation

- [API Specification](../specifications/api-specification.md#2-authentication) - API authentication details
- [RBAC Permissions](../specifications/rbac-permissions.md) - Role-based access control
- [System Architecture](../architecture/system-architecture.md) - Overall system design
