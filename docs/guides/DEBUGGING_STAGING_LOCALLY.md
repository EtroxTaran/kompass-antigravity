# Debugging Staging Deployment Locally

This guide explains how to run the staging environment locally to debug deployment issues.

## Quick Start

1. **Create environment file:**
   ```bash
   cp .env.staging.local.example .env.staging.local
   # Edit .env.staging.local with your values
   ```

2. **Build and start services:**
   ```bash
   bash scripts/run-staging-local.sh build up
   ```

3. **View logs:**
   ```bash
   bash scripts/run-staging-local.sh logs
   ```

4. **Run health checks:**
   ```bash
   bash scripts/run-staging-local.sh health
   ```

5. **Stop services:**
   ```bash
   bash scripts/run-staging-local.sh down
   ```

## How It Works

The local staging setup uses three docker-compose files:

1. **`docker-compose.yml`** - Base configuration (development)
2. **`docker-compose.staging.yml`** - Staging-specific overrides
3. **`docker-compose.staging.local.yml`** - Local testing overrides

The local override file:
- Uses a local bridge network instead of external `proxynet`
- Exposes ports directly (no Traefik required)
- Uses local Docker volumes instead of host bind mounts
- Removes Traefik labels

## Options

### Build Images Locally

Build Docker images from source:

```bash
bash scripts/run-staging-local.sh build up
```

This will:
1. Build the shared package
2. Build backend and frontend Docker images
3. Start all services

### Pull Images from GHCR

Pull pre-built images from GitHub Container Registry:

```bash
# Set GHCR credentials (optional, if images are public)
export GHCR_USERNAME=EtroxTaran
export GHCR_TOKEN=your_token_here

bash scripts/run-staging-local.sh pull up
```

## Available Commands

```bash
# Start services (build images locally)
bash scripts/run-staging-local.sh build up

# Start services (pull images from GHCR)
bash scripts/run-staging-local.sh pull up

# View logs
bash scripts/run-staging-local.sh logs

# Show service status
bash scripts/run-staging-local.sh ps

# Restart services
bash scripts/run-staging-local.sh restart

# Run health checks
bash scripts/run-staging-local.sh health

# Stop and remove containers
bash scripts/run-staging-local.sh down

# Open shell in backend container
bash scripts/run-staging-local.sh shell-backend

# Open shell in frontend container
bash scripts/run-staging-local.sh shell-frontend
```

## Accessing Services

Once started, services are available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **CouchDB**: http://localhost:5984
- **MeiliSearch**: http://localhost:7700
- **Keycloak**: http://localhost:8080
- **Neo4j Browser**: http://localhost:7474
- **n8n**: http://localhost:5678

## Debugging Common Issues

### Services Won't Start

1. **Check Docker is running:**
   ```bash
   docker ps
   ```

2. **Validate configuration:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.staging.local.yml config
   ```

3. **Check for port conflicts:**
   ```bash
   # Check if ports are already in use
   lsof -i :3000 -i :3001 -i :5984 -i :7700 -i :8080
   ```

### Backend Won't Connect to Database

1. **Check CouchDB is running:**
   ```bash
   curl http://localhost:5984/_up
   ```

2. **Check backend logs:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.staging.local.yml logs backend
   ```

3. **Verify environment variables:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.staging.local.yml exec backend env | grep COUCHDB
   ```

### Frontend Can't Connect to Backend

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check CORS settings:**
   - Backend `ALLOWED_ORIGINS` should include `http://localhost:3000`
   - Check backend logs for CORS errors

3. **Verify frontend environment:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.staging.local.yml exec frontend env | grep VITE_API_URL
   ```

### Images Won't Pull from GHCR

1. **Login to GHCR:**
   ```bash
   docker login ghcr.io
   ```

2. **Or set credentials:**
   ```bash
   export GHCR_USERNAME=EtroxTaran
   export GHCR_TOKEN=your_token_here
   ```

3. **Check image exists:**
   ```bash
   docker pull ghcr.io/etroxtaran/kompass/backend:staging
   ```

## Differences from Production Staging

The local staging environment differs from production staging in these ways:

| Feature | Production Staging | Local Staging |
|---------|-------------------|---------------|
| Network | External `proxynet` (Traefik) | Local bridge network |
| Ports | Via Traefik (HTTPS) | Direct port mapping |
| Volumes | Host bind mounts | Docker named volumes |
| Images | Pulled from GHCR | Built locally or pulled |
| Environment | `.env.staging` on server | `.env.staging.local` locally |

## Troubleshooting Deployment Issues

When debugging staging deployment failures:

1. **Run locally first:**
   ```bash
   bash scripts/run-staging-local.sh build up
   ```

2. **Check if services start:**
   ```bash
   bash scripts/run-staging-local.sh ps
   ```

3. **Review logs for errors:**
   ```bash
   bash scripts/run-staging-local.sh logs
   ```

4. **Run health checks:**
   ```bash
   bash scripts/run-staging-local.sh health
   ```

5. **Compare with production:**
   - Check environment variables match
   - Verify network configuration
   - Check volume mounts
   - Verify image tags

## Next Steps

If local staging works but production staging fails:

1. Check GitHub Actions workflow logs
2. Verify secrets are set correctly
3. Check server logs: `ssh deploy@staging-server 'cd /opt/kompass/staging && docker-compose logs'`
4. Compare docker-compose configurations
5. Check network connectivity on server

## Related Documentation

- [Deployment Guide](../deployment/)
- [Development Setup](./DEVELOPMENT.md)
- [Docker Compose Configuration](../../docker-compose.yml)

