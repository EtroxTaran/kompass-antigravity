# Backend Development Rules (NestJS)

## Module Structure
Every domain module logic must serve a specific purpose and follow strict separation of concerns:
- `*.module.ts`: Module definition and imports.
- `*.controller.ts`: HTTP handling, Input validation (DTOs), Guards. NO business logic.
- `*.service.ts`: Business logic, Orchestration. NO direct DB access.
- `*.repository.ts`: Data access layer. ONLY layer accessing the DB.
- `dto/*.dto.ts`: Data Transfer Objects with validation decorators.
- `entities/*.entity.ts`: Domain entities.

## Layered Architecture
`Controller -> Service -> Repository -> Database`
- **Controller**: Handles HTTP request/response, validation, guards. Delegates to Service.
- **Service**: Contains business logic. Uses Repository.
- **Repository**: Handles database interactions.

## Guards & Security
- **Guards Required**: ALL endpoints must have `UseGuards` (e.g., `JwtAuthGuard`, `RbacGuard`).
- **Permissions**: Use `@RequirePermission` or manual checks.

## Entity Fields
All entities must extend `BaseEntity` and include:
- `_id`, `_rev`, `type`
- `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt`
- `version`
