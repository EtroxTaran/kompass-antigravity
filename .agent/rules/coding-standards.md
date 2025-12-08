# General Coding Standards

## TypeScript
- **Strict Mode**: Always enabled. No `any`, `strictNullChecks: true`.
- **Explicit Returns**: Functions must have explicit return types.
- **Type Safety**: Use `unknown` over `any`. Use interfaces for objects.
- **Immutability**: Use `readonly`, `const` assertions, and spread operators. Do not mutate state directly.

## Security
- **No Secrets**: Never hardcode secrets. Use environment variables.
- **Input Validation**: Validate all inputs using DTOs and validation libraries (e.g., class-validator).
- **RBAC**: Always check permissions (`RbacGuard` or manual checks) before accessing sensitive data/actions.

## Performance
- **Lazy Loading**: Lazy load React routes and heavy components.
- **Memoization**: Memoize expensive computations and stable callbacks.
- **Database**: Use indexes (`use_index`) and pagination for queries.
- **Caching**: Use caching interceptors for repetitive read operations.

## Offline-First
- **Repository Pattern**: Always use repositories to abstract data access (Local DB -> Remote DB fallback).
- **Conflict Handling**: Implement conflict detection (comparing `_rev`) and resolution strategies.
- **Queueing**: Queue offline changes if `!navigator.onLine`.
