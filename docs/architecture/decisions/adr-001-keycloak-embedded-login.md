# ADR-001: Keycloak Embedded Login

**Status:** Accepted  
**Date:** 2025-01-27  
**Deciders:** Development Team  
**Tags:** authentication, security, ux

## Context

KOMPASS requires user authentication and authorization. We need to decide between:

1. **Redirect-based login**: Redirect users to Keycloak's login page
2. **Embedded login**: Show login form within the application

## Decision

We will use **embedded login forms** with Keycloak Direct Access Grants (Resource Owner Password Credentials flow).

## Rationale

### Advantages

1. **Better UX**: Users stay within the application, no redirects
2. **Consistent UI**: Login form matches application design system
3. **Faster**: No page redirects, smoother user experience
4. **Mobile-friendly**: Better for PWA experience
5. **Brand consistency**: Login page matches application branding

### Security Considerations

1. **Direct Access Grants**: Enabled on frontend client for embedded login
2. **Token Storage**: Tokens stored in memory (not localStorage) for security
3. **Token Refresh**: Automatic refresh before expiration
4. **HTTPS Required**: In production, all traffic must use HTTPS
5. **Password Policy**: Enforced by Keycloak (12+ chars, complexity requirements)

### Trade-offs

1. **Security**: Slightly less secure than redirect (password sent from frontend), but acceptable for internal applications
2. **Keycloak Features**: Some Keycloak features (social login, password reset UI) require redirect
3. **Maintenance**: Need to maintain custom login form

## Implementation

### Frontend

- Embedded login form component (`LoginForm.tsx`)
- Direct Access Grants API client (`auth-api.ts`)
- Token management in memory
- Automatic token refresh

### Backend

- JWT validation via JWKS
- Role extraction from token
- RBAC enforcement

### Keycloak Configuration

- Frontend client: Public client with Direct Access Grants enabled
- Backend client: Confidential client with service accounts
- Realm: `kompass` with all required roles

## Consequences

### Positive

- Improved user experience
- Consistent application design
- Better mobile/PWA support
- Faster login flow

### Negative

- Custom login form maintenance
- Less secure than redirect (acceptable for internal apps)
- Cannot use Keycloak's built-in password reset UI (must implement custom)

### Risks

- **Password exposure**: Passwords sent from frontend (mitigated by HTTPS in production)
- **Token security**: Tokens in memory (acceptable, but requires careful implementation)
- **Keycloak dependency**: Application depends on Keycloak being available

## Alternatives Considered

### Redirect-based Login

- **Pros**: More secure, uses Keycloak's built-in features
- **Cons**: Poor UX, redirects, inconsistent branding
- **Rejected**: User experience is priority for internal application

### Custom Authentication

- **Pros**: Full control
- **Cons**: Security risks, maintenance burden, reinventing the wheel
- **Rejected**: Keycloak provides proven, secure authentication

## References

- [Keycloak Direct Access Grants](https://www.keycloak.org/docs/latest/securing_apps/#_direct_access_grants)
- [OAuth2 Resource Owner Password Credentials](https://oauth.net/2/grant-types/password/)
- [Keycloak Security Best Practices](https://www.keycloak.org/docs/latest/securing_apps/)
