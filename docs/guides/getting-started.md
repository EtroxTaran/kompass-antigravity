# KOMPASS CI/CD Quick Start Guide

**For**: First-time setup  
**Time Required**: 2-4 hours

---

## Pre-Flight Checklist

Before you begin, ensure you have:
- [ ] GitHub repository admin access
- [ ] Two servers (staging + production) with root access
- [ ] Domain names configured (optional but recommended)
- [ ] Snyk account and API token

---

## Step 1: Install Dependencies (5 minutes)

```bash
pnpm install
```

---

## Step 2: Generate Secrets (10 minutes)

```bash
# Generate SSH key pair for deployment
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/kompass_deploy
# Save both public and private keys

# Generate secure secrets
openssl rand -base64 32  # JWT_SECRET (copy output)
openssl rand -base64 32  # COUCHDB_PASSWORD (copy output)
openssl rand -base64 24  # MEILI_MASTER_KEY (copy output)
openssl rand -base64 32  # KEYCLOAK_ADMIN_PASSWORD (copy output)
openssl rand -base64 32  # KEYCLOAK_CLIENT_SECRET (copy output)

# Do this for both staging AND production (use different values!)
```

---

## Step 3: Set Up Staging Server (30 minutes)

```bash
# SSH to staging server
ssh root@<staging-ip>

# Run setup script
curl -fsSL https://raw.githubusercontent.com/<your-org>/kompass/main/scripts/server-setup.sh | bash -s staging

# Or manual setup:
# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Create deploy user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# 4. Add SSH key
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy nano /home/deploy/.ssh/authorized_keys
# Paste public key from ~/.ssh/kompass_deploy.pub

# 5. Create directories
sudo mkdir -p /opt/kompass/staging
sudo chown -R deploy:deploy /opt/kompass/staging

# 6. Test SSH
exit
ssh -i ~/.ssh/kompass_deploy deploy@<staging-ip> "echo 'Success'"
```

---

## Step 4: Set Up Production Server (30 minutes)

Repeat Step 3, but:
- Use production server IP
- Use `/opt/kompass/production` directory
- Use different SSH key or same key (your choice)

---

## Step 5: Configure GitHub Secrets (20 minutes)

Go to: Settings → Secrets and variables → Actions → New repository secret

**Quick Add (Staging)**:
```
STAGING_HOST=<staging-ip>
STAGING_USER=deploy
STAGING_DEPLOY_KEY=<paste private key from ~/.ssh/kompass_deploy>
STAGING_API_URL=https://api.staging.kompass.de
STAGING_URL=https://staging.kompass.de
STAGING_DATABASE_URL=http://couchdb:5984
STAGING_COUCHDB_USER=admin
STAGING_COUCHDB_PASSWORD=<from Step 2>
STAGING_MEILISEARCH_URL=http://meilisearch:7700
STAGING_MEILI_MASTER_KEY=<from Step 2>
STAGING_KEYCLOAK_URL=http://keycloak:8080
STAGING_KEYCLOAK_ADMIN=admin
STAGING_KEYCLOAK_ADMIN_PASSWORD=<from Step 2>
STAGING_KEYCLOAK_CLIENT_SECRET=<from Step 2>
STAGING_JWT_SECRET=<from Step 2>
STAGING_ALLOWED_ORIGINS=https://staging.kompass.de
```

**Quick Add (Production)** - Same as staging but with `PRODUCTION_` prefix and different passwords!

**Shared**:
```
SNYK_TOKEN=<your-snyk-api-token>
```

---

## Step 6: Configure Branch Protection (10 minutes)

Settings → Branches → Add rule

**For `main`**:
- Pattern: `main`
- ✅ Require PR reviews: 1
- ✅ Require status checks: All 11 checks
- ✅ Require conversation resolution
- ✅ No bypass

**For `develop`**: Same as main

---

## Step 7: Test the Workflow (20 minutes)

```bash
# 1. Test commit hooks
git checkout -b feature/KOM-999-test-workflow
echo "# Test" > TEST.md
git add TEST.md

# This should succeed:
git commit -m "test(KOM-999): test commit hooks"

# This should fail:
git commit -m "bad commit message"

# 2. Test push
git push origin feature/KOM-999-test-workflow

# 3. Create PR on GitHub
# Watch CI/CD run (should take ~8-12 minutes)

# 4. Merge to develop
# Watch automatic staging deployment (~10 minutes)

# 5. Check staging
curl https://staging.kompass.de/health

# 6. Clean up
git branch -D feature/KOM-999-test-workflow
git push origin --delete feature/KOM-999-test-workflow
```

---

## Step 8: Copy Docker Compose Files to Servers (10 minutes)

```bash
# Staging server
scp -i ~/.ssh/kompass_deploy docker-compose.yml deploy@<staging-ip>:/opt/kompass/staging/
scp -i ~/.ssh/kompass_deploy docker-compose.staging.yml deploy@<staging-ip>:/opt/kompass/staging/

# Production server
scp -i ~/.ssh/kompass_deploy docker-compose.yml deploy@<production-ip>:/opt/kompass/production/
scp -i ~/.ssh/kompass_deploy docker-compose.production.yml deploy@<production-ip>:/opt/kompass/production/

# Copy scripts
scp -i ~/.ssh/kompass_deploy scripts/*.sh deploy@<staging-ip>:/opt/kompass/staging/scripts/
scp -i ~/.ssh/kompass_deploy scripts/*.sh deploy@<production-ip>:/opt/kompass/production/scripts/
```

---

## Troubleshooting Quick Fixes

### "Permission denied" during deployment

**Fix**: Check SSH key is correct in GitHub secrets
```bash
# Test SSH manually
ssh -i ~/.ssh/kompass_deploy deploy@<server-ip>
```

### Deployment fails with "Image not found"

**Fix**: Check GITHUB_TOKEN permissions
- Go to Settings → Actions → General
- Workflow permissions: Read and write

### Health checks fail

**Fix**: Check service logs
```bash
ssh deploy@<server>
cd /opt/kompass/<environment>
docker-compose logs -f
```

### Commit hook fails

**Fix**: Run the failing check manually
```bash
pnpm lint          # If linting fails
pnpm format        # If formatting fails
pnpm type-check    # If type checking fails
pnpm test:unit     # If tests fail
```

---

## Quick Command Reference

```bash
# Local Development
pnpm dev                    # Start dev servers
pnpm test                   # Run all tests
pnpm lint                   # Run linting
pnpm format                 # Auto-format code
pnpm generate:api-docs      # Generate API docs
pnpm changelog:generate     # Generate changelog

# Git Workflow
git checkout -b feature/KOM-123-description
git commit -m "feat(KOM-123): description"
git push origin feature/KOM-123-description

# Deployment (on server)
bash scripts/deploy-staging.sh      # Deploy staging
bash scripts/deploy-production.sh   # Deploy production
bash scripts/health-check.sh <env>  # Check health
bash scripts/rollback.sh <env>      # Rollback

# Docker
docker-compose up -d                # Start services
docker-compose logs -f              # View logs
docker-compose ps                   # Check status
docker stats                        # Resource usage
```

---

## Success!

After completing these steps, you'll have:

✅ Automated CI/CD pipeline  
✅ Quality gates enforced  
✅ Documentation automation  
✅ Dual-environment deployment  
✅ Linear integration  
✅ Automatic rollback  

**Your development workflow is now complete!**

For detailed information, see:
- Full guide: `docs/deployment/DEPLOYMENT_GUIDE.md`
- Workflow: `docs/processes/DEVELOPMENT_WORKFLOW.md`
- Secrets: `docs/deployment/GITHUB_SECRETS.md`

---

**Questions?** Create a Linear issue with tag `ci-cd`

