---
description: how to start the development environment with all services
---

# Development Environment Setup

This workflow describes how to start the complete KOMPASS development environment.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- npm installed

## Steps

// turbo

1. **Start infrastructure services (CouchDB and Keycloak)**

   ```bash
   cd /home/etrox/workspace/kompass-antigravity
   docker-compose up -d
   ```

   - CouchDB will be available at http://localhost:5984
   - Keycloak will be available at http://localhost:8080

// turbo 2. **Build the shared package**

```bash
cd /home/etrox/workspace/kompass-antigravity/packages/shared
npm run build
```

// turbo 3. **Start the backend API (in a separate terminal)**

```bash
cd /home/etrox/workspace/kompass-antigravity/apps/api
npm run start:dev
```

- API will be available at http://localhost:3000

// turbo 4. **Start the frontend web app (in a separate terminal)**

```bash
cd /home/etrox/workspace/kompass-antigravity/apps/web
npm run dev
```

- Web app will be available at http://localhost:5173

## Environment Configuration

### Backend (.env)

Copy `apps/api/.env.example` to `apps/api/.env` and configure:

- `USE_MOCK_AUTH=true` for development without Keycloak
- `USE_MOCK_AUTH=false` for full Keycloak authentication

### Frontend (.env)

Copy `apps/web/.env.example` to `apps/web/.env` and configure:

- `VITE_USE_MOCK_AUTH=true` for development without Keycloak
- `VITE_USE_MOCK_AUTH=false` for full Keycloak authentication

## Keycloak Setup (Optional)

To enable full Keycloak authentication:

1. Access Keycloak Admin at http://localhost:8080/admin
2. Login with admin/admin
3. Create a new realm and import `infrastructure/keycloak/kompass-realm.json`
4. Update .env files to disable mock auth

## Test Users (with Keycloak)

| Username    | Password | Role      |
| ----------- | -------- | --------- |
| admin       | admin123 | ADMIN, GF |
| gf          | gf123    | GF        |
| adm         | adm123   | ADM       |
| innendienst | innen123 | INNEN     |
| planer      | plan123  | PLAN      |
| buchhalter  | buch123  | BUCH      |
| kalkulator  | kalk123  | KALK      |

## Useful Endpoints

- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:3000/auth/health
- **CouchDB**: http://localhost:5984/\_utils (admin/password)
- **Keycloak Admin**: http://localhost:8080/admin (admin/admin)
