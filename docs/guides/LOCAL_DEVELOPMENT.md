# Local Development Environment Guide

This guide explains how to set up and use the local development environment with hot reload for the KOMPASS project.

## Overview

The local development environment provides:

- **Hot reload** for backend (NestJS watch mode)
- **Hot Module Replacement (HMR)** for frontend (Vite dev server)
- **Complete infrastructure** (PostgreSQL, CouchDB, MeiliSearch, Keycloak, Neo4j, n8n)
- **Immediate code reflection** - changes appear instantly without manual rebuilds

## Quick Start

### 1. Start Development Environment

```bash
bash scripts/dev.sh up
```

This will:

- Build development images (first time only)
- Start all infrastructure services
- Start backend with hot reload
- Start frontend with HMR

### 2. Access Services

Once started, access services at:

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000
- **CouchDB**: http://localhost:5984
- **MeiliSearch**: http://localhost:7700
- **Keycloak**: http://localhost:8080
- **Neo4j Browser**: http://localhost:7474
- **n8n**: http://localhost:5678

### 3. Verify Hot Reload

**Backend Hot Reload:**

1. Edit a file in `apps/backend/src/`
2. Watch the backend logs: `bash scripts/dev.sh logs backend`
3. You should see the application restart automatically (< 5 seconds)

**Frontend HMR:**

1. Edit a React component in `apps/frontend/src/`
2. Open http://localhost:5173 in your browser
3. Changes should appear immediately without page refresh

## Development Workflow

### Recommended Workflow

1. **Start Environment**

   ```bash
   bash scripts/dev.sh up
   ```

2. **Make Changes**
   - Edit backend code in `apps/backend/src/`
   - Edit frontend code in `apps/frontend/src/`
   - Edit shared code in `packages/shared/src/`
   - Changes are reflected immediately via hot reload

3. **Test Changes**
   - Test in browser (frontend)
   - Test API endpoints (backend)
   - Run unit tests if needed

4. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat(KOM-XXX): description"
   git push
   ```

5. **Deploy to Staging**
   - Changes are automatically deployed to staging via CI/CD

### Viewing Logs

**All Services:**

```bash
bash scripts/dev.sh logs
```

**Specific Service:**

```bash
bash scripts/dev.sh logs backend
bash scripts/dev.sh logs frontend
bash scripts/dev.sh logs couchdb
```

**Follow Logs (Real-time):**

```bash
docker-compose logs -f backend
```

### Checking Status

```bash
bash scripts/dev.sh ps
```

This shows the status of all containers and their health.

### Restarting Services

**Restart All:**

```bash
bash scripts/dev.sh restart
```

**Restart Specific Service:**

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Stopping Environment

```bash
bash scripts/dev.sh down
```

## Hot Reload Details

### Backend (NestJS)

- **Mode**: Watch mode (`nest start --watch`)
- **Trigger**: Any change to `.ts` files in `apps/backend/src/`
- **Behavior**: Application restarts automatically
- **Time**: Usually < 5 seconds
- **Configuration**:
  - File watching uses polling (`CHOKIDAR_USEPOLLING=true`)
  - TypeScript watch options configured in `apps/backend/tsconfig.json`

### Frontend (Vite)

- **Mode**: Vite dev server with HMR
- **Trigger**: Any change to files in `apps/frontend/src/`
- **Behavior**:
  - React components: Fast Refresh (state preserved)
  - CSS: Instant update
  - Other files: Module replacement
- **Time**: Usually < 1 second
- **Configuration**:
  - File watching uses polling (`CHOKIDAR_USEPOLLING=true`)
  - HMR configured in `apps/frontend/vite.config.ts`

### Shared Package

Changes to `packages/shared/src/` are reflected in both backend and frontend:

- Backend: Restarts when shared code changes
- Frontend: HMR updates when shared code changes

## Troubleshooting

### File Changes Not Detected

**Problem**: Changes to files are not triggering hot reload.

**Solutions**:

1. Verify polling is enabled:

   ```bash
   docker-compose exec backend env | grep CHOKIDAR
   # Should show: CHOKIDAR_USEPOLLING=true
   ```

2. Check file permissions:

   ```bash
   ls -la apps/backend/src/
   ```

3. Restart the service:

   ```bash
   docker-compose restart backend
   ```

4. Check logs for errors:
   ```bash
   bash scripts/dev.sh logs backend
   ```

### Backend Not Starting

**Problem**: Backend container keeps restarting or shows unhealthy.

**Solutions**:

1. Check backend logs:

   ```bash
   bash scripts/dev.sh logs backend
   ```

2. Verify dependencies are installed:

   ```bash
   docker-compose exec backend pnpm list
   ```

3. Check if port 3000 is available:

   ```bash
   lsof -i :3000
   ```

4. Rebuild the image:
   ```bash
   docker-compose build --no-cache backend
   docker-compose up -d backend
   ```

### Frontend Not Loading

**Problem**: Frontend shows connection errors or doesn't load.

**Solutions**:

1. Check frontend logs:

   ```bash
   bash scripts/dev.sh logs frontend
   ```

2. Verify Vite dev server is running:

   ```bash
   curl http://localhost:5173
   ```

3. Check if port 5173 is available:

   ```bash
   lsof -i :5173
   ```

4. Verify backend is running:
   ```bash
   curl http://localhost:3000/health
   ```

### node_modules Issues

**Problem**: Module not found errors or dependency issues.

**Solutions**:

1. Rebuild containers (reinstalls dependencies):

   ```bash
   docker-compose build --no-cache backend frontend
   docker-compose up -d
   ```

2. Clear node_modules volumes:
   ```bash
   docker volume rm kompass_backend-node-modules
   docker volume rm kompass_frontend-node-modules
   docker volume rm kompass_shared-node-modules
   docker-compose up -d --build
   ```

### Database Connection Issues

**Problem**: Backend can't connect to CouchDB, PostgreSQL, etc.

**Solutions**:

1. Check if infrastructure services are running:

   ```bash
   bash scripts/dev.sh ps
   ```

2. Verify service health:

   ```bash
   docker-compose ps
   # All services should show "healthy" or "Up"
   ```

3. Check service logs:

   ```bash
   bash scripts/dev.sh logs couchdb
   bash scripts/dev.sh logs postgres
   ```

4. Restart infrastructure services:
   ```bash
   docker-compose restart couchdb postgres keycloak
   ```

### Port Conflicts

**Problem**: Port already in use errors.

**Solutions**:

1. Find what's using the port:

   ```bash
   lsof -i :3000  # Backend
   lsof -i :5173  # Frontend
   ```

2. Stop conflicting services or change ports in `docker-compose.yml`

3. Use different ports by creating `docker-compose.override.yml`:
   ```yaml
   services:
     backend:
       ports:
         - '3001:3000'
     frontend:
       ports:
         - '5174:5173'
   ```

### Slow File Watching

**Problem**: File changes take a long time to be detected.

**Solutions**:

1. This is expected with polling mode (trade-off for Docker compatibility)
2. Polling interval is set to 1 second (see `vite.config.ts`)
3. For faster detection, you can reduce the interval (may increase CPU usage)

### Permission Errors

**Problem**: Permission denied errors when accessing files.

**Solutions**:

1. Check file ownership:

   ```bash
   ls -la apps/backend/src/
   ```

2. Fix ownership if needed:

   ```bash
   sudo chown -R $USER:$USER apps/
   ```

3. Ensure Docker has proper permissions (Linux):
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

## Clean Development Environment

### Clean Everything

To completely clean the development environment (removes all containers, volumes, and data):

```bash
bash scripts/dev-clean.sh
```

**Warning**: This will delete all database data and node_modules volumes.

### Clean Specific Volumes

```bash
# Remove node_modules volumes only
docker volume rm kompass_backend-node-modules
docker volume rm kompass_frontend-node-modules
docker volume rm kompass_shared-node-modules

# Remove database volumes
docker volume rm kompass_couchdb-data
docker volume rm kompass_postgres-data
docker volume rm kompass_neo4j-data
```

## Advanced Usage

### Running Commands in Containers

**Backend:**

```bash
docker-compose exec backend pnpm --filter @kompass/backend test
docker-compose exec backend pnpm --filter @kompass/backend lint
```

**Frontend:**

```bash
docker-compose exec frontend pnpm --filter @kompass/frontend test
docker-compose exec frontend pnpm --filter @kompass/frontend lint
```

### Accessing Container Shells

**Backend:**

```bash
docker-compose exec backend sh
```

**Frontend:**

```bash
docker-compose exec frontend sh
```

### Rebuilding Images

**Rebuild All:**

```bash
docker-compose build --no-cache
docker-compose up -d
```

**Rebuild Specific Service:**

```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Environment Variables

Create a `.env` file in the project root to override default values:

```bash
# .env
COUCHDB_PASSWORD=mysecurepassword
POSTGRES_PASSWORD=mysecurepassword
KEYCLOAK_ADMIN_PASSWORD=mysecurepassword
MEILI_MASTER_KEY=mysecurekey
JWT_SECRET=my-jwt-secret-min-32-chars-long
```

## Architecture

### Volume Mounts

**Source Code** (bind mounts for immediate changes):

- `./apps/backend/src` → `/app/apps/backend/src`
- `./apps/frontend/src` → `/app/apps/frontend/src`
- `./packages/shared/src` → `/app/packages/shared/src`

**node_modules** (named volumes to avoid conflicts):

- `backend-node-modules` → `/app/apps/backend/node_modules`
- `frontend-node-modules` → `/app/apps/frontend/node_modules`
- `shared-node-modules` → `/app/packages/shared/node_modules`

### File Watching Strategy

- **Backend**: TypeScript compiler watch mode with polling
- **Frontend**: Vite file watcher with polling
- **Polling**: Enabled via `CHOKIDAR_USEPOLLING=true` for Docker compatibility

### Network

All services run on the `kompass-network` Docker network, allowing them to communicate using service names:

- Backend → CouchDB: `http://couchdb:5984`
- Backend → MeiliSearch: `http://meilisearch:7700`
- Frontend → Backend: `http://localhost:3000` (via host port mapping)

## Best Practices

1. **Always use the dev scripts**: Use `scripts/dev.sh` instead of `docker-compose` directly
2. **Check logs first**: When something doesn't work, check logs with `bash scripts/dev.sh logs`
3. **Keep dependencies in sync**: If you add dependencies, rebuild containers
4. **Clean regularly**: Use `bash scripts/dev-clean.sh` periodically to start fresh
5. **Test before committing**: Always test changes locally before committing
6. **Monitor resource usage**: Development environment uses significant resources

## Performance Tips

1. **Use named volumes for node_modules**: Already configured - don't bind mount from host
2. **Exclude unnecessary files**: Ensure `.dockerignore` is properly configured
3. **Limit services**: Comment out unused services in `docker-compose.yml` if not needed
4. **Use resource limits**: Add resource limits to `docker-compose.yml` if needed

## Related Documentation

- [Development Guide](./DEVELOPMENT.md) - General development practices
- [Coding Standards](./CODING_STANDARDS.md) - Code quality standards
- [Debugging Staging Locally](./DEBUGGING_STAGING_LOCALLY.md) - Staging environment debugging

## Support

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Review service logs: `bash scripts/dev.sh logs`
3. Check Docker status: `docker-compose ps`
4. Verify environment: `docker info`
5. Create an issue in Linear with details
