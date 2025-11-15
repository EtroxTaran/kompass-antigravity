# KOMPASS Deployment Guide

**Last Updated**: 2025-01-28  
**Version**: 2.0.0 (Trunk-Based + Tag-Triggered)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Hetzner Server Setup](#hetzner-server-setup)
4. [GitHub Configuration](#github-configuration)
5. [Deployment Process](#deployment-process)
6. [Feature Flag Configuration](#feature-flag-configuration)
7. [Monitoring & Health Checks](#monitoring--health-checks)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Overview

KOMPASS uses a **trunk-based development** deployment strategy with tag-triggered production releases:

- **Staging**: Auto-deploys on push to `main` branch (trunk-based)
- **Production**: Deploys on Git tag push matching `v*.*.*` pattern (e.g., `v1.2.3`)

Both environments use Docker containers orchestrated with docker-compose, deployed to **Hetzner Cloud servers** (EU-based, GDPR compliant) via GitHub Actions.

## Prerequisites

### Required Software

- Docker Engine 24.0+
- Docker Compose 2.20+
- Git 2.40+
- curl
- SSH access to deployment servers

### Required Accounts & Access

- GitHub repository access with write permissions
- Server SSH access for both staging and production
- Docker registry access (ghcr.io)
- CouchDB, MeiliSearch, and Keycloak credentials

---

## Hetzner Server Setup

KOMPASS deploys to **Hetzner Cloud servers** located in the EU region for GDPR compliance. Both staging and production environments run on separate Hetzner servers.

### Initial Server Setup (Both Environments)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Create deployment user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# Set up SSH key for GitHub Actions
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh

# Generate SSH key pair (on your local machine)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f hetzner_deploy_key

# Copy public key to server
ssh-copy-id -i hetzner_deploy_key.pub deploy@<hetzner-server-ip>

# Add private key to GitHub Secrets (STAGING_DEPLOY_KEY or PRODUCTION_DEPLOY_KEY)
cat hetzner_deploy_key  # Copy this to GitHub Secrets

# Secure SSH configuration
sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys

# Configure firewall (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (if needed)
sudo ufw allow 443/tcp   # HTTPS (if needed)
sudo ufw enable

# Test SSH connection
ssh -i hetzner_deploy_key deploy@<hetzner-server-ip> "echo 'SSH connection successful'"
```

### Staging Server Setup

```bash
# Create deployment directory structure
sudo mkdir -p /opt/kompass/staging
sudo chown -R deploy:deploy /opt/kompass/staging

# Create directories for data, configuration, backups, and logs
sudo mkdir -p /opt/kompass/staging/{data,config,backups,logs}
sudo mkdir -p /opt/kompass/staging/data/{couchdb,meilisearch,keycloak,neo4j,n8n}
sudo mkdir -p /opt/kompass/staging/config/{couchdb,nginx}
sudo mkdir -p /opt/kompass/staging/backups/{couchdb,neo4j}
sudo chown -R deploy:deploy /opt/kompass/staging

# Clone repository (one-time setup)
cd /opt/kompass/staging
sudo -u deploy git clone <repo-url> .
sudo -u deploy chmod +x scripts/*.sh

# Copy docker-compose files (if not already in repo)
# Files will be updated via GitHub Actions deployment
```

### Production Server Setup

```bash
# Create deployment directory structure
sudo mkdir -p /opt/kompass/production
sudo chown -R deploy:deploy /opt/kompass/production

# Create directories for data, configuration, backups, and logs
sudo mkdir -p /opt/kompass/production/{data,config,backups,logs}
sudo mkdir -p /opt/kompass/production/data/{couchdb,meilisearch,keycloak,neo4j,n8n}
sudo mkdir -p /opt/kompass/production/config/{couchdb,nginx}
sudo mkdir -p /opt/kompass/production/backups/{couchdb,neo4j}
sudo chown -R deploy:deploy /opt/kompass/production

# Clone repository (one-time setup)
cd /opt/kompass/production
sudo -u deploy git clone <repo-url> .
sudo -u deploy chmod +x scripts/*.sh
```

### SSL Certificate Setup (Production)

For production, set up SSL certificates:

```bash
# Install Certbot
sudo apt install certbot

# Obtain certificate (replace with your domain)
sudo certbot certonly --standalone -d kompass.de -d www.kompass.de

# Certificates will be in /etc/letsencrypt/live/kompass.de/
# Copy to production config directory
sudo cp /etc/letsencrypt/live/kompass.de/fullchain.pem /opt/kompass/production/certs/tls.crt
sudo cp /etc/letsencrypt/live/kompass.de/privkey.pem /opt/kompass/production/certs/tls.key
sudo chown -R deploy:deploy /opt/kompass/production/certs

# Set up auto-renewal
sudo certbot renew --dry-run
```

---

## GitHub Configuration

### 1. Create GitHub Secrets

Go to Settings → Secrets and variables → Actions → New repository secret

#### Staging Secrets

```
# Hetzner Server Configuration
STAGING_HOST=<hetzner-staging-server-ip-or-domain>
STAGING_USER=deploy
STAGING_DEPLOY_KEY=<private-ssh-key-content>

# Application URLs
STAGING_API_URL=https://api.staging.kompass.de
STAGING_URL=https://staging.kompass.de

# Database Configuration
STAGING_DATABASE_URL=http://couchdb:5984
STAGING_COUCHDB_USER=admin
STAGING_COUCHDB_PASSWORD=<secure-password>
STAGING_COUCHDB_DATABASE=kompass_staging

# MeiliSearch Configuration
STAGING_MEILISEARCH_URL=http://meilisearch:7700
STAGING_MEILI_MASTER_KEY=<secure-key>

# Keycloak Configuration
STAGING_KEYCLOAK_URL=http://keycloak:8080
STAGING_KEYCLOAK_ADMIN=admin
STAGING_KEYCLOAK_ADMIN_PASSWORD=<secure-password>
STAGING_KEYCLOAK_CLIENT_SECRET=<client-secret>

# Security
STAGING_JWT_SECRET=<min-32-char-random-string>
STAGING_ALLOWED_ORIGINS=https://staging.kompass.de

# Feature Flags (optional)
STAGING_AI_N8N_ENABLED=false
STAGING_AI_RAG_ENABLED=false
STAGING_AI_ML_ENABLED=false

# Neo4j Configuration (if used)
STAGING_NEO4J_AUTH=neo4j/<secure-password>

# n8n Configuration (if used)
STAGING_N8N_BASIC_AUTH_USER=admin
STAGING_N8N_BASIC_AUTH_PASSWORD=<secure-password>
STAGING_N8N_WEBHOOK_URL=https://n8n.staging.kompass.de
```

#### Production Secrets

```
# Hetzner Server Configuration
PRODUCTION_HOST=<hetzner-production-server-ip-or-domain>
PRODUCTION_USER=deploy
PRODUCTION_DEPLOY_KEY=<private-ssh-key-content>

# Application URLs
PRODUCTION_API_URL=https://api.kompass.de
PRODUCTION_URL=https://kompass.de

# Database Configuration
PRODUCTION_DATABASE_URL=http://couchdb:5984
PRODUCTION_COUCHDB_USER=admin
PRODUCTION_COUCHDB_PASSWORD=<secure-password>
PRODUCTION_COUCHDB_DATABASE=kompass

# MeiliSearch Configuration
PRODUCTION_MEILISEARCH_URL=http://meilisearch:7700
PRODUCTION_MEILI_MASTER_KEY=<secure-key>

# Keycloak Configuration
PRODUCTION_KEYCLOAK_URL=http://keycloak:8080
PRODUCTION_KEYCLOAK_ADMIN=admin
PRODUCTION_KEYCLOAK_ADMIN_PASSWORD=<secure-password>
PRODUCTION_KEYCLOAK_CLIENT_SECRET=<client-secret>
PRODUCTION_HOSTNAME=kompass.de

# PostgreSQL for Keycloak (Production)
PRODUCTION_POSTGRES_HOST=<postgres-host>
PRODUCTION_POSTGRES_USER=keycloak
PRODUCTION_POSTGRES_PASSWORD=<secure-password>

# Security
PRODUCTION_JWT_SECRET=<min-32-char-random-string>
PRODUCTION_ALLOWED_ORIGINS=https://kompass.de

# Feature Flags (optional)
PRODUCTION_AI_N8N_ENABLED=false
PRODUCTION_AI_RAG_ENABLED=false
PRODUCTION_AI_ML_ENABLED=false

# Neo4j Configuration (if used)
PRODUCTION_NEO4J_AUTH=neo4j/<secure-password>

# n8n Configuration (if used)
PRODUCTION_N8N_BASIC_AUTH_USER=admin
PRODUCTION_N8N_BASIC_AUTH_PASSWORD=<secure-password>
PRODUCTION_N8N_WEBHOOK_URL=https://n8n.kompass.de
```

#### Shared Secrets

```
SNYK_TOKEN=<snyk-api-token>
```

### 2. Set Up Branch Protection Rules

#### For `main` branch (trunk-based development):

- ✅ Require pull request reviews (min 1 approval)
- ✅ Require status checks to pass before merging:
  - `lint`
  - `type-check`
  - `format-check`
  - `unit-tests`
  - `integration-tests`
  - `e2e-tests`
  - `build-check`
  - `security-audit`
  - `documentation-check`
  - `commit-message-check`
  - `branch-name-check`
  - `pr-quality-gate`
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings
- ✅ Require branches to be up to date before merging

**Note**: With trunk-based development, there is no `develop` branch. All feature branches merge directly to `main`.

### 3. Configure Environments

Go to Settings → Environments

#### Create `staging` environment:

- Add protection rules (optional)
- Add `STAGING_URL` as environment URL

#### Create `production` environment:

- Required reviewers: 1 (for manual approval if desired)
- Add `PRODUCTION_URL` as environment URL

---

## Deployment Process

### Staging Deployment

**Trigger**: Automatic on push to `main` branch (trunk-based)

**Process**:

1. Developer merges PR to `main` branch
2. GitHub Actions triggers `deploy-staging.yml` workflow
3. Quality gates run (tests, linting, security)
4. Docker images are built and tagged with `staging` and `staging-<sha>`
5. Images are pushed to GitHub Container Registry (ghcr.io)
6. SSH deployment to Hetzner staging server
7. `docker-compose pull && docker-compose up -d` executed on server
8. Health checks are performed
9. Smoke tests are run
10. Changelog is updated and committed to `main`

**Timeline**: ~10-15 minutes

**Deployment Target**: Hetzner Cloud server (EU region)

**Image Tags**: `staging`, `staging-<git-sha>`

### Production Deployment

**Trigger**: Push of Git tag matching `v*.*.*` pattern (e.g., `v1.2.3`)

**Process**:

1. Create and push version tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
2. GitHub Actions triggers `deploy-prod.yml` workflow
3. Semantic version extracted from tag (`v1.2.3` → `1.2.3`)
4. All quality gates run (full test suite)
5. Docker images are built and tagged with version (`v1.2.3`) and `prod-<sha>`
6. Images are pushed to GitHub Container Registry
7. Manual approval (optional, configured in GitHub Environments)
8. SSH deployment to Hetzner production server
9. `docker-compose pull && docker-compose up -d` executed on server
10. Comprehensive health checks run
11. Smoke tests run
12. On failure: automatic rollback to previous version
13. On success: GitHub release created with changelog

**Timeline**: ~15-20 minutes

**Deployment Target**: Hetzner Cloud server (EU region)

**Image Tags**: `v1.2.3` (version), `prod-<git-sha>` (for rollback)

**Tag Format**: `v<major>.<minor>.<patch>` (semantic versioning)

**Example**:

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Update version in package.json (if needed)
npm version patch  # or minor, major

# Create and push tag
git tag v1.2.3
git push origin v1.2.3
# This triggers production deployment
```

### Manual Deployment

If needed, you can trigger deployments manually:

```bash
# On Hetzner deployment server

# Staging
cd /opt/kompass/staging
bash scripts/deploy-staging.sh

# Production (requires version tag)
cd /opt/kompass/production
export IMAGE_TAG=v1.2.3  # Specify version
bash scripts/deploy-production.sh
```

### Emergency Manual Deployment via GitHub Actions

Both workflows support `workflow_dispatch` for manual triggers:

1. Go to GitHub Actions → Workflows
2. Select `deploy-staging.yml` or `deploy-prod.yml`
3. Click "Run workflow"
4. Select branch (staging: `main`, production: specify tag)
5. Click "Run workflow"

---

## Feature Flag Configuration

KOMPASS uses feature flags for gradual feature rollout. Flags are configured via GitHub Secrets and injected into containers via environment variables.

### Available Feature Flags

See `packages/shared/src/constants/feature-flags.ts` for all available flags. Common flags include:

- `AI_N8N_ENABLED`: Enable n8n workflow automation
- `AI_RAG_ENABLED`: Enable RAG knowledge management
- `AI_ML_ENABLED`: Enable ML forecasting features

### Configuring Feature Flags

1. **Add to GitHub Secrets**:
   - Staging: `STAGING_AI_N8N_ENABLED=true`
   - Production: `PRODUCTION_AI_N8N_ENABLED=false`

2. **Flags are automatically injected** via `docker-compose.staging.yml` and `docker-compose.production.yml`:

   ```yaml
   backend:
     environment:
       - AI_N8N_ENABLED=${STAGING_AI_N8N_ENABLED:-false}
   ```

3. **Deploy**: Flags take effect on next deployment

### Feature Flag Best Practices

- **Test in staging first**: Enable flags in staging, verify functionality
- **Gradual rollout**: Enable for specific users/groups before full rollout
- **Monitor**: Watch logs and metrics after enabling flags
- **Document**: Update documentation when adding new flags
- **Clean up**: Remove flags after full rollout and stabilization

---

## Monitoring & Health Checks

### Automated Health Checks

The deployment process includes comprehensive health checks:

1. Container status verification
2. Backend health endpoint (`/health`)
3. Frontend health endpoint (`/health`)
4. CouchDB health (`/_up`)
5. MeiliSearch health (`/health`)
6. Resource usage monitoring
7. Error log analysis

### Manual Health Check

```bash
# SSH to server
ssh deploy@<server>

# Run health check script
cd /opt/kompass/<environment>
bash scripts/health-check.sh <environment>
```

### Monitoring Endpoints

- Backend: `http://localhost:3001/health`
- Frontend: `http://localhost:3000/health`
- CouchDB: `http://localhost:5984/_up`
- MeiliSearch: `http://localhost:7700/health`
- Keycloak: `http://localhost:8080/health`
- Neo4j: `http://localhost:7474` (HTTP interface)
- n8n: `http://localhost:5678/health` (if enabled)

### View Logs

```bash
# All logs
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs -f

# Specific service
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs --tail=100
```

---

## Rollback Procedures

See [ROLLBACK_PROCEDURES.md](./ROLLBACK_PROCEDURES.md) for detailed rollback instructions.

### Quick Rollback

```bash
# SSH to server
ssh deploy@<server>

# Run rollback script
cd /opt/kompass/<environment>
bash scripts/rollback.sh <environment>
```

The rollback script will:

1. Stop current containers
2. Restore previous Docker images
3. Restart services
4. Run health checks
5. Verify rollback success

---

## Troubleshooting

### Deployment Fails in GitHub Actions

**Check**:

1. Review GitHub Actions logs
2. Verify all secrets are configured correctly
3. Check SSH connectivity: `ssh deploy@<server>`
4. Ensure disk space is available: `df -h`

### Services Won't Start

**Check**:

1. Docker daemon running: `sudo systemctl status docker`
2. Port conflicts: `netstat -tulpn | grep LISTEN`
3. Logs: `docker-compose logs`
4. Resource limits: `docker stats`

### Database Connection Issues

**Check**:

1. CouchDB is running: `curl http://localhost:5984/_up`
2. Credentials are correct in environment variables
3. Network connectivity between containers
4. Database logs: `docker logs kompass-couchdb`

### Frontend Not Accessible

**Check**:

1. Nginx is running: `docker ps | grep frontend`
2. Nginx logs: `docker logs kompass-frontend`
3. Build was successful (check GitHub Actions)
4. API URL is configured correctly

### Memory Issues

**Check**:

1. Available memory: `free -h`
2. Docker stats: `docker stats --no-stream`
3. Adjust resource limits in docker-compose.production.yml

### SSL Certificate Issues

**Check**:

1. Certificate expiration: `openssl x509 -in cert.pem -noout -dates`
2. Certificate chain: `openssl s_client -connect domain:443`
3. Renew Let's Encrypt: `certbot renew`

---

## Related Documentation

- [GitHub Secrets Reference](./GITHUB_SECRETS.md)
- [Rollback Procedures](./ROLLBACK_PROCEDURES.md)
- [Development Workflow](../processes/DEVELOPMENT_WORKFLOW.md)

---

**Maintained By**: DevOps Team  
**Last Review**: 2025-01-28  
**Next Review**: Q2 2025
