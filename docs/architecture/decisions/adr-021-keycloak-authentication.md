# ADR-021: Keycloak OIDC Authentication

**Status**: Accepted  
**Date**: 2025-01-28  
**Deciders**: Architecture Team, KOM-21 Implementation

## Context

KOMPASS requires secure authentication for all users with role-based access control (RBAC). The system needs to support multiple user roles (ADM, INNEN, PLAN, BUCH, GF) and provide single sign-on (SSO) capabilities. The authentication solution must:

- Support offline-first PWA architecture
- Integrate with NestJS backend and React frontend
- Provide JWT tokens for stateless authentication
- Enable role extraction for RBAC enforcement
- Support token refresh for long-lived sessions
- Be self-hosted (no vendor lock-in)

## Decision

**Use Keycloak as the identity provider with OpenID Connect (OIDC) protocol.**

### Implementation Details

**Backend (NestJS):**
- Use `passport-jwt` with `jwks-rsa` for JWT token validation
- Implement `JwtStrategy` to validate tokens using Keycloak's JWKS endpoint
- Create `JwtAuthGuard` to protect all endpoints (with `@Public()` decorator for exceptions)
- Extract user roles from JWT token claims (`resource_access.{client-id}.roles` or `realm_access.roles`)
- Map Keycloak roles to KOMPASS `UserRole` enum (ADM, INNEN, PLAN, BUCH, GF)

**Frontend (React):**
- Use `keycloak-js` library for OIDC client integration
- Implement `AuthContext` for global authentication state management
- Create `ProtectedRoute` component to guard routes
- Configure API client (Axios) with automatic JWT token injection
- Implement automatic token refresh (30 seconds before expiration)
- Handle 401 errors with automatic logout and redirect to login

**Token Flow:**
1. User initiates login → Redirect to Keycloak
2. Keycloak authenticates → Issues JWT token
3. Frontend stores token → Includes in API requests
4. Backend validates token → Extracts user and roles
5. RBAC enforcement → Based on extracted roles

## Rationale

### Why Keycloak?

1. **Open Source & Self-Hosted**: No vendor lock-in, full control over identity data
2. **OIDC Standard**: Industry-standard protocol, well-supported by libraries
3. **Role Management**: Built-in role assignment and mapping capabilities
4. **JWT Support**: Native JWT token issuance with configurable claims
5. **SSO Ready**: Can integrate with other services in the future
6. **Active Development**: Well-maintained project with active community

### Why OIDC over OAuth 2.0?

- **User Information**: OIDC provides user identity claims (email, roles) in tokens
- **Standardized Claims**: Consistent token structure across implementations
- **Better UX**: Built-in user info endpoint for additional user data
- **Library Support**: Better frontend library support (keycloak-js)

### Why JWKS for Token Validation?

- **Security**: Public keys fetched from Keycloak, no secret sharing
- **Key Rotation**: Automatic support for key rotation without code changes
- **Scalability**: No need to store keys in application configuration
- **Standard**: Industry-standard approach for JWT validation

## Alternatives Considered

### Option A: Custom JWT Implementation (Rejected)

- **Pros**: Full control, no external dependencies
- **Cons**: Security risks, maintenance burden, no SSO capabilities
- **Verdict**: ❌ Rejected - Security and maintenance concerns

### Option B: Auth0 / Okta (Rejected)

- **Pros**: Managed service, excellent documentation
- **Cons**: Vendor lock-in, cost, data privacy concerns
- **Verdict**: ❌ Rejected - Self-hosted requirement

### Option C: Keycloak OIDC (Accepted) ✅

- **Pros**: Open source, self-hosted, OIDC standard, role management
- **Cons**: Requires infrastructure setup
- **Verdict**: ✅ **Accepted** - Best fit for requirements

### Option D: Session-Based Authentication (Rejected)

- **Pros**: Simple implementation, server-side control
- **Cons**: Not stateless, doesn't work well with offline-first, scaling challenges
- **Verdict**: ❌ Rejected - Doesn't fit offline-first architecture

## Consequences

### Positive

- **Secure Authentication**: Industry-standard OIDC protocol
- **RBAC Integration**: Seamless role extraction from tokens
- **SSO Capability**: Foundation for future SSO requirements
- **Stateless Backend**: JWT tokens enable horizontal scaling
- **Offline Support**: Tokens can be cached for offline API calls
- **Self-Hosted**: Full control over identity data and compliance

### Negative

- **Infrastructure Overhead**: Requires Keycloak server setup and maintenance
- **Initial Complexity**: More complex than simple username/password
- **Token Management**: Frontend must handle token refresh logic
- **Learning Curve**: Team needs to understand OIDC/JWT concepts

### Mitigations

- **Setup Script**: Automated Keycloak setup script (`scripts/keycloak-setup.sh`)
- **Documentation**: Comprehensive authentication guide
- **Docker Compose**: Keycloak included in development environment
- **Error Handling**: Clear error messages and automatic token refresh

## Implementation

### Backend Components

1. **JWT Strategy** (`apps/backend/src/modules/auth/strategies/jwt.strategy.ts`)
   - Validates tokens using JWKS
   - Extracts user information and roles
   - Maps Keycloak roles to KOMPASS roles

2. **JWT Auth Guard** (`apps/backend/src/modules/auth/guards/jwt-auth.guard.ts`)
   - Protects all endpoints by default
   - Supports `@Public()` decorator for public routes
   - Throws `UnauthorizedException` on invalid tokens

3. **Current User Decorator** (`apps/backend/src/modules/auth/decorators/current-user.decorator.ts`)
   - Provides easy access to authenticated user in controllers
   - Type-safe user object with roles

4. **Auth Controller** (`apps/backend/src/modules/auth/auth.controller.ts`)
   - `/auth/me` endpoint for user information

### Frontend Components

1. **Keycloak Client** (`apps/frontend/src/lib/auth.ts`)
   - Initializes Keycloak instance
   - Handles login, logout, token refresh
   - Extracts user information from tokens

2. **Auth Context** (`apps/frontend/src/contexts/AuthContext.tsx`)
   - Global authentication state
   - Provides `useAuth()` hook
   - Manages token refresh intervals

3. **Protected Route** (`apps/frontend/src/components/auth/ProtectedRoute.tsx`)
   - Redirects unauthenticated users
   - Shows loading state during authentication check

4. **API Client** (`apps/frontend/src/lib/api-client.ts`)
   - Automatic JWT token injection
   - 401 error handling with automatic logout
   - Token refresh on 401 errors

### Configuration

**Environment Variables:**
- `KEYCLOAK_URL`: Keycloak server URL
- `KEYCLOAK_REALM`: Realm name (default: `kompass`)
- `KEYCLOAK_CLIENT_ID`: Client ID for backend/frontend

**Keycloak Setup:**
- Realm: `kompass`
- Clients: `kompass-api` (backend), `kompass-frontend` (frontend)
- Roles: ADM, INNEN, PLAN, BUCH, GF
- Token settings: 5-minute access tokens, 30-minute refresh tokens

## Testing

### Unit Tests
- JWT strategy validation and role extraction
- JWT guard public route handling
- Auth context state management

### Integration Tests
- `/auth/me` endpoint with valid/invalid tokens
- Token validation with Keycloak JWKS

### E2E Tests
- Complete login flow
- Logout and session cleanup
- Token refresh on expiration

## Monitoring

### Success Criteria

- ✅ All endpoints protected by JWT authentication
- ✅ User roles correctly extracted from tokens
- ✅ Token refresh working automatically
- ✅ 401 errors handled gracefully
- ✅ No security vulnerabilities in token handling

### Metrics to Track

- Authentication success/failure rates
- Token refresh frequency
- 401 error rates (indicates token expiration issues)
- Keycloak server health and response times

## Related

- **KOM-21**: Keycloak authentication implementation
- **Authentication Guide**: `docs/guides/authentication.md`
- **API Specification**: `docs/specifications/api-specification.md` (Authentication section)
- **RBAC Matrix**: `docs/reviews/RBAC_PERMISSION_MATRIX.md`
- **Security Best Practices**: `.cursor/rules/security-best-practices.mdc`

## Future Considerations

### Potential Enhancements

1. **Multi-Factor Authentication (MFA)**: Keycloak supports TOTP, SMS, email MFA
2. **Social Login**: Keycloak can integrate with Google, Microsoft, etc.
3. **Session Management**: Advanced session timeout and concurrent session limits
4. **Password Policies**: Enforce strong password requirements
5. **Account Lockout**: Automatic account lockout after failed login attempts

### Migration Path

If Keycloak needs to be replaced in the future:
- OIDC standard ensures compatibility with other providers
- JWT token structure is provider-agnostic
- Only Keycloak-specific configuration needs updating
- No changes required to application code (if using standard OIDC claims)

This ADR establishes Keycloak as the authentication foundation for KOMPASS, providing secure, scalable, and maintainable identity management.
