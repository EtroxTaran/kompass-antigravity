# KOMPASS CI/CD Setup Checklist

**Use this checklist to set up your complete CI/CD pipeline**

---

## Phase 1: Local Setup ✅

- [x] Implementation complete (all files created)
- [ ] Install new dependencies: `pnpm install`
- [ ] Review implementation: `docs/deployment/IMPLEMENTATION_COMPLETE.md`
- [ ] Test Docker locally: `docker-compose up -d`
- [ ] Test commit hooks: Create test commit with format `test(KOM-999): test`

---

## Phase 2: Server Preparation 🖥️

### Staging Server

- [ ] Server provisioned (Ubuntu 22.04+ recommended)
- [ ] Root SSH access confirmed
- [ ] Run setup script: `bash scripts/server-setup.sh staging`
  - OR manual setup following `docs/deployment/DEPLOYMENT_GUIDE.md`
- [ ] Add GitHub Actions SSH public key to `/home/deploy/.ssh/authorized_keys`
- [ ] Test SSH connection: `ssh deploy@<staging-ip> "echo Success"`
- [ ] Copy docker-compose files to server
- [ ] Create `.env.staging` file with actual values

### Production Server

- [ ] Server provisioned (Ubuntu 22.04+ recommended)
- [ ] Root SSH access confirmed
- [ ] Run setup script: `bash scripts/server-setup.sh production`
  - OR manual setup following `docs/deployment/DEPLOYMENT_GUIDE.md`
- [ ] Add GitHub Actions SSH public key to `/home/deploy/.ssh/authorized_keys`
- [ ] Test SSH connection: `ssh deploy@<production-ip> "echo Success"`
- [ ] Copy docker-compose files to server
- [ ] Create `.env.production` file with actual values

---

## Phase 3: Generate Secrets 🔐

### Staging Secrets

Generate with: `openssl rand -base64 32`

- [ ] `STAGING_JWT_SECRET` (32+ chars)
- [ ] `STAGING_COUCHDB_PASSWORD` (strong password)
- [ ] `STAGING_MEILI_MASTER_KEY` (32+ chars)
- [ ] `STAGING_KEYCLOAK_ADMIN_PASSWORD` (strong password)
- [ ] `STAGING_KEYCLOAK_CLIENT_SECRET` (32+ chars)
- [ ] SSH key pair for deployment (`ssh-keygen -t ed25519`)

### Production Secrets

**Use DIFFERENT values than staging!**

- [ ] `PRODUCTION_JWT_SECRET` (32+ chars)
- [ ] `PRODUCTION_COUCHDB_PASSWORD` (strong password)
- [ ] `PRODUCTION_MEILI_MASTER_KEY` (32+ chars)
- [ ] `PRODUCTION_KEYCLOAK_ADMIN_PASSWORD` (strong password)
- [ ] `PRODUCTION_KEYCLOAK_CLIENT_SECRET` (32+ chars)
- [ ] `PRODUCTION_POSTGRES_PASSWORD` (for Keycloak)
- [ ] SSH key pair for deployment (can reuse or generate new)

### Other Secrets

- [ ] `SNYK_TOKEN` - Get from https://snyk.io

---

## Phase 4: GitHub Configuration ⚙️

### GitHub Secrets (Settings → Secrets → Actions)

#### Staging Secrets (17 secrets)

- [ ] `STAGING_HOST`
- [ ] `STAGING_USER`
- [ ] `STAGING_DEPLOY_KEY`
- [ ] `STAGING_API_URL`
- [ ] `STAGING_URL`
- [ ] `STAGING_DATABASE_URL`
- [ ] `STAGING_COUCHDB_USER`
- [ ] `STAGING_COUCHDB_PASSWORD`
- [ ] `STAGING_MEILISEARCH_URL`
- [ ] `STAGING_MEILI_MASTER_KEY`
- [ ] `STAGING_KEYCLOAK_URL`
- [ ] `STAGING_KEYCLOAK_ADMIN`
- [ ] `STAGING_KEYCLOAK_ADMIN_PASSWORD`
- [ ] `STAGING_KEYCLOAK_CLIENT_SECRET`
- [ ] `STAGING_JWT_SECRET`
- [ ] `STAGING_ALLOWED_ORIGINS`

#### Production Secrets (20 secrets)

- [ ] `PRODUCTION_HOST`
- [ ] `PRODUCTION_USER`
- [ ] `PRODUCTION_DEPLOY_KEY`
- [ ] `PRODUCTION_API_URL`
- [ ] `PRODUCTION_URL`
- [ ] `PRODUCTION_DATABASE_URL`
- [ ] `PRODUCTION_COUCHDB_USER`
- [ ] `PRODUCTION_COUCHDB_PASSWORD`
- [ ] `PRODUCTION_MEILISEARCH_URL`
- [ ] `PRODUCTION_MEILI_MASTER_KEY`
- [ ] `PRODUCTION_KEYCLOAK_URL`
- [ ] `PRODUCTION_KEYCLOAK_ADMIN`
- [ ] `PRODUCTION_KEYCLOAK_ADMIN_PASSWORD`
- [ ] `PRODUCTION_KEYCLOAK_CLIENT_SECRET`
- [ ] `PRODUCTION_JWT_SECRET`
- [ ] `PRODUCTION_ALLOWED_ORIGINS`
- [ ] `PRODUCTION_POSTGRES_HOST`
- [ ] `PRODUCTION_POSTGRES_USER`
- [ ] `PRODUCTION_POSTGRES_PASSWORD`
- [ ] `PRODUCTION_HOSTNAME`

#### Shared Secrets (1 secret)

- [ ] `SNYK_TOKEN`

**See**: `docs/deployment/GITHUB_SECRETS.md` for detailed descriptions

### Branch Protection Rules (Settings → Branches)

#### For `main` branch

- [ ] Pattern: `main`
- [ ] ✅ Require pull request reviews: 1 approval
- [ ] ✅ Require status checks to pass:
  - [ ] `lint`
  - [ ] `type-check`
  - [ ] `format-check`
  - [ ] `unit-tests`
  - [ ] `integration-tests`
  - [ ] `e2e-tests`
  - [ ] `build-check`
  - [ ] `security-audit`
  - [ ] `documentation-check`
  - [ ] `commit-message-check`
  - [ ] `branch-name-check`
  - [ ] `pr-quality-gate`
- [ ] ✅ Require branches to be up to date
- [ ] ✅ Require conversation resolution
- [ ] ✅ Do not allow bypassing

#### For `develop` branch

- [ ] Same rules as `main`

### GitHub Environments (Settings → Environments)

- [ ] Create `staging` environment
  - [ ] Set URL: Your staging URL
- [ ] Create `production` environment
  - [ ] Set URL: Your production URL
  - [ ] (Optional) Add required reviewers

---

## Phase 5: Test the Pipeline 🧪

### Test Locally

- [ ] Test commit hooks: `git commit -m "test(KOM-999): test hooks"`
- [ ] Test invalid commit (should fail): `git commit -m "bad message"`
- [ ] Test push hooks: `git push origin feature/KOM-999-test`
- [ ] Test Docker: `docker-compose up -d`
- [ ] Test health checks: `bash scripts/health-check.sh staging`

### Test CI/CD

- [ ] Create test branch: `feature/KOM-999-test-workflow`
- [ ] Make a small change (add test file)
- [ ] Commit with proper format: `test(KOM-999): test CI/CD workflow`
- [ ] Push and create PR to `develop`
- [ ] Verify all GitHub Actions run (~8-12 minutes)
- [ ] Verify quality gates pass
- [ ] Merge to `develop`
- [ ] Verify automatic deployment to staging (~10 minutes)
- [ ] Test staging URL
- [ ] Clean up test branch

### Test Production Deployment

- [ ] Create PR from `develop` to `main`
- [ ] Get approval
- [ ] Merge to `main`
- [ ] Verify automatic deployment to production (~15 minutes)
- [ ] Verify GitHub release created
- [ ] Verify CHANGELOG.md updated
- [ ] Test production URL

---

## Phase 6: Optional Enhancements 🎯

### SSL Certificates (Recommended)

- [ ] Install certbot: `apt-get install certbot`
- [ ] Generate certificate: `certbot certonly --standalone -d kompass.de`
- [ ] Copy certificates to deployment directory
- [ ] Configure nginx-proxy in docker-compose

### Monitoring (Recommended)

- [ ] Set up Sentry for error tracking
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up log aggregation (ELK, Loki)
- [ ] Configure alerting (email, Slack, Discord)

### DNS Configuration (Required for Production)

- [ ] Point domain to production server
- [ ] Point staging subdomain to staging server
- [ ] Verify DNS propagation: `dig kompass.de`

### Backups (Production - Critical)

- [ ] Verify automatic backups configured (runs daily at 2 AM)
- [ ] Test backup script: `bash scripts/backup-couchdb.sh`
- [ ] Test restore procedure
- [ ] Document backup retention policy

---

## Verification Checklist ✅

After completing all phases:

### Local Development

- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts all services
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm type-check` passes
- [ ] `pnpm build` succeeds
- [ ] `docker-compose up -d` works

### Git Workflow

- [ ] Commit with wrong format fails
- [ ] Commit with correct format succeeds
- [ ] Push runs unit tests
- [ ] Push validates branch name
- [ ] Push checks documentation

### GitHub Actions

- [ ] All workflows appear in Actions tab
- [ ] PR triggers `pr-checks.yml` workflow
- [ ] Merge to `develop` triggers `deploy-staging.yml`
- [ ] Merge to `main` triggers `deploy-production.yml`
- [ ] Documentation workflow runs on doc changes

### Deployments

- [ ] Staging deploys successfully
- [ ] Staging is accessible via URL
- [ ] Staging health checks pass
- [ ] Production deploys successfully
- [ ] Production is accessible via URL
- [ ] Production health checks pass

### Rollback

- [ ] Test rollback on staging
- [ ] Rollback succeeds and services restart
- [ ] Health checks pass after rollback

---

## Success Criteria 🎉

You're ready to go when:

✅ All checklist items completed  
✅ Test deployment succeeded  
✅ Team can follow development workflow  
✅ Quality gates enforced  
✅ Documentation is clear  
✅ Rollback tested and works  

---

## Next Steps

1. **Train the team** on the new workflow
   - Share `docs/processes/DEVELOPMENT_WORKFLOW.md`
   - Demo the CI/CD pipeline
   - Walk through a sample PR

2. **Monitor first deployments**
   - Watch GitHub Actions logs
   - Check server logs
   - Verify health metrics

3. **Iterate and improve**
   - Collect team feedback
   - Adjust quality gates if needed
   - Enhance documentation based on questions

---

## Getting Help

**Documentation**:
- Quick Start: `docs/deployment/QUICK_START.md`
- Full Guide: `docs/deployment/DEPLOYMENT_GUIDE.md`
- Workflow: `docs/processes/DEVELOPMENT_WORKFLOW.md`

**Issues**:
- Create Linear issue with `ci-cd` tag
- Check GitHub Actions logs
- Review server logs: `docker-compose logs`

**Emergency**:
- Rollback: `docs/deployment/ROLLBACK_PROCEDURES.md`
- Health check: `bash scripts/health-check.sh`

---

**Estimated Total Setup Time**: 2-4 hours

**Next**: Start with Phase 1 and work through sequentially

