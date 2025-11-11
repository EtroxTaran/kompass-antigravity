# KOMPASS Deployment Guide

**Last Updated**: 2025-01-27  
**Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Server Setup](#server-setup)
4. [GitHub Configuration](#github-configuration)
5. [Deployment Process](#deployment-process)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Overview

KOMPASS uses a dual-environment deployment strategy:

- **Staging**: Auto-deploys from `develop` branch
- **Production**: Auto-deploys from `main` branch

Both environments use Docker containers orchestrated with docker-compose, deployed via GitHub Actions.

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

## Server Setup

### Staging Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create deployment user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# Set up SSH key for GitHub Actions
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh
# Add the public key to authorized_keys
sudo -u deploy nano /home/deploy/.ssh/authorized_keys
sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys

# Create deployment directory
sudo mkdir -p /opt/kompass/staging
sudo chown -R deploy:deploy /opt/kompass/staging

# Create directories for data and configuration
sudo mkdir -p /opt/kompass/staging/{data,config,backups,logs}
sudo mkdir -p /opt/kompass/staging/data/{couchdb,meilisearch,keycloak}
sudo mkdir -p /opt/kompass/staging/config/{couchdb,nginx}
sudo chown -R deploy:deploy /opt/kompass/staging

# Copy docker-compose files
cd /opt/kompass/staging
sudo -u deploy git clone <repo-url> temp
sudo -u deploy cp temp/docker-compose.yml .
sudo -u deploy cp temp/docker-compose.staging.yml .
sudo -u deploy cp -r temp/scripts .
sudo -u deploy chmod +x scripts/*.sh
sudo -u deploy rm -rf temp

# Copy deployment scripts
cd /opt/kompass/staging
# Scripts will be deployed via GitHub Actions

# Test SSH connection
ssh deploy@staging-server-ip "echo 'SSH connection successful'"
```

### Production Server

Follow the same steps as staging, but use `/opt/kompass/production` as the deployment directory.

---

## GitHub Configuration

### 1. Create GitHub Secrets

Go to Settings → Secrets and variables → Actions → New repository secret

#### Staging Secrets

```
STAGING_HOST=<staging-server-ip-or-domain>
STAGING_USER=deploy
STAGING_DEPLOY_KEY=<private-ssh-key-content>
STAGING_API_URL=https://api.staging.kompass.de
STAGING_URL=https://staging.kompass.de
STAGING_DATABASE_URL=http://couchdb:5984
STAGING_COUCHDB_USER=admin
STAGING_COUCHDB_PASSWORD=<secure-password>
STAGING_MEILISEARCH_URL=http://meilisearch:7700
STAGING_MEILI_MASTER_KEY=<secure-key>
STAGING_KEYCLOAK_URL=http://keycloak:8080
STAGING_KEYCLOAK_ADMIN=admin
STAGING_KEYCLOAK_ADMIN_PASSWORD=<secure-password>
STAGING_KEYCLOAK_CLIENT_SECRET=<client-secret>
STAGING_JWT_SECRET=<min-32-char-random-string>
STAGING_ALLOWED_ORIGINS=https://staging.kompass.de
```

#### Production Secrets

```
PRODUCTION_HOST=<production-server-ip-or-domain>
PRODUCTION_USER=deploy
PRODUCTION_DEPLOY_KEY=<private-ssh-key-content>
PRODUCTION_API_URL=https://api.kompass.de
PRODUCTION_URL=https://kompass.de
PRODUCTION_DATABASE_URL=http://couchdb:5984
PRODUCTION_COUCHDB_USER=admin
PRODUCTION_COUCHDB_PASSWORD=<secure-password>
PRODUCTION_MEILISEARCH_URL=http://meilisearch:7700
PRODUCTION_MEILI_MASTER_KEY=<secure-key>
PRODUCTION_KEYCLOAK_URL=http://keycloak:8080
PRODUCTION_KEYCLOAK_ADMIN=admin
PRODUCTION_KEYCLOAK_ADMIN_PASSWORD=<secure-password>
PRODUCTION_KEYCLOAK_CLIENT_SECRET=<client-secret>
PRODUCTION_JWT_SECRET=<min-32-char-random-string>
PRODUCTION_ALLOWED_ORIGINS=https://kompass.de
PRODUCTION_POSTGRES_HOST=<postgres-host>
PRODUCTION_POSTGRES_USER=keycloak
PRODUCTION_POSTGRES_PASSWORD=<secure-password>
```

#### Shared Secrets

```
SNYK_TOKEN=<snyk-api-token>
```

### 2. Set Up Branch Protection Rules

#### For `main` branch:

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

#### For `develop` branch:

Same rules as `main`

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

**Trigger**: Automatic on push to `develop` branch

**Process**:
1. Developer merges PR to `develop`
2. GitHub Actions triggers `deploy-staging.yml` workflow
3. Quality gates run (tests, linting, security)
4. Docker images are built and pushed to ghcr.io
5. Images are deployed to staging server via SSH
6. Health checks are performed
7. Smoke tests are run
8. Changelog is updated

**Timeline**: ~10-15 minutes

### Production Deployment

**Trigger**: Automatic on push to `main` branch

**Process**:
1. PR from `develop` to `main` is approved and merged
2. GitHub Actions triggers `deploy-production.yml` workflow
3. All quality gates run (full test suite)
4. Docker images are built with version tags
5. Images are deployed to production server
6. Comprehensive health checks run
7. On failure: automatic rollback
8. On success: GitHub release created with changelog

**Timeline**: ~15-20 minutes

### Manual Deployment

If needed, you can trigger deployments manually:

```bash
# On deployment server

# Staging
cd /opt/kompass/staging
bash scripts/deploy-staging.sh

# Production
cd /opt/kompass/production
bash scripts/deploy-production.sh
```

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
**Last Review**: 2025-01-27  
**Next Review**: Q2 2025

