# Rollback Procedures

**Last Updated**: 2025-01-27

This document describes procedures for rolling back deployments when issues are detected.

---

## Table of Contents

1. [When to Rollback](#when-to-rollback)
2. [Automatic Rollback](#automatic-rollback)
3. [Manual Rollback](#manual-rollback)
4. [Database Rollback](#database-rollback)
5. [Verification](#verification)
6. [Post-Rollback](#post-rollback)

---

## When to Rollback

Rollback immediately if you encounter:

### Critical Issues ❌
- Application crashes or won't start
- Database corruption or data loss
- Security vulnerabilities introduced
- Complete loss of functionality
- Critical API endpoints returning 500 errors

### High Priority Issues ⚠️
- Major features completely broken
- Authentication/authorization failures
- Data inconsistency issues
- Performance degradation >50%
- Memory leaks or resource exhaustion

### Monitor Before Rolling Back ℹ️
- Minor UI issues
- Non-critical feature bugs
- Performance degradation <20%
- Cosmetic issues
- Edge case bugs affecting <5% of users

---

## Automatic Rollback

### Production Deployment

The production deployment workflow includes automatic rollback:

1. **Trigger**: Health checks fail after deployment
2. **Process**:
   - Stop new containers
   - Restore previous Docker images (tagged as `rollback`)
   - Restart services with previous version
   - Run health checks
   - Alert team via GitHub Actions

**Timeline**: ~5 minutes

### Staging Deployment

Staging deployments also include automatic rollback on health check failure.

**Note**: Automatic rollback only works if the deployment script detects the failure. Manual intervention may be needed for issues that appear later.

---

## Manual Rollback

### Prerequisites

- SSH access to the server
- Rollback Docker images available (tagged automatically on deployment)
- Database backup from before deployment

### Rollback Steps

#### 1. SSH to Server

```bash
# Staging
ssh deploy@<staging-server>

# Production
ssh deploy@<production-server>
```

#### 2. Navigate to Deployment Directory

```bash
# Staging
cd /opt/kompass/staging

# Production
cd /opt/kompass/production
```

#### 3. Run Rollback Script

```bash
# Use automated rollback script
bash scripts/rollback.sh <environment>

# Examples:
bash scripts/rollback.sh staging
bash scripts/rollback.sh production
```

#### 4. Verify Rollback

```bash
# Check containers are running
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml ps

# Check health endpoints
curl http://localhost:3001/health  # Backend
curl http://localhost:3000/health  # Frontend

# View logs
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs --tail=100
```

### Manual Rollback (Without Script)

If the rollback script fails, perform manual rollback:

```bash
# Stop current containers
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml stop

# Check available rollback images
docker images | grep rollback

# Tag rollback images
docker tag ghcr.io/<org>/<repo>/backend:rollback ghcr.io/<org>/<repo>/backend:latest
docker tag ghcr.io/<org>/<repo>/frontend:rollback ghcr.io/<org>/<repo>/frontend:latest

# Start containers with previous version
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml up -d --force-recreate

# Monitor startup
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs -f
```

---

## Database Rollback

Database rollbacks are more complex and should be performed carefully.

### CouchDB Rollback

CouchDB uses replication for backups. To restore from backup:

```bash
# List available backups
curl http://admin:<password>@localhost:5984/_all_dbs | grep backup

# Restore from backup (replace YYYYMMDD-HHMMSS with backup timestamp)
curl -X POST http://admin:<password>@localhost:5984/_replicate \
  -H "Content-Type: application/json" \
  -d '{"source":"kompass_backup_YYYYMMDD-HHMMSS","target":"kompass","create_target":false}'

# Verify restoration
curl http://admin:<password>@localhost:5984/kompass
```

### MeiliSearch Rollback

MeiliSearch data is rebuilt from CouchDB:

```bash
# Clear current index
curl -X DELETE 'http://localhost:7700/indexes/customers' \
  -H 'Authorization: Bearer <MEILI_MASTER_KEY>'

# Restart backend to trigger re-indexing
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml restart backend
```

---

## Verification

After rollback, verify system health:

### 1. Health Checks

```bash
# Automated health check
bash scripts/health-check.sh <environment>

# Manual checks
curl -f http://localhost:3001/health  # Backend
curl -f http://localhost:3000/health  # Frontend
curl -f http://localhost:5984/_up     # CouchDB
curl -f http://localhost:7700/health  # MeiliSearch
```

### 2. Functional Tests

```bash
# Test key endpoints
curl -X GET http://localhost:3001/api/v1/customers \
  -H "Authorization: Bearer <token>"

# Test login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. Monitor Logs

```bash
# Watch for errors
docker-compose -f docker-compose.yml -f docker-compose.<environment>.yml logs -f | grep -i "error\|exception"

# Check resource usage
docker stats --no-stream
```

### 4. User Verification

- Have a team member test critical user flows
- Check that data is accessible
- Verify recent changes are preserved (if database wasn't rolled back)

---

## Post-Rollback

### 1. Document the Issue

Create incident report:
- What went wrong?
- When was it detected?
- What was the impact?
- Who performed the rollback?
- Root cause (if known)

### 2. Notify Stakeholders

- Update status page
- Notify affected users (if applicable)
- Inform development team
- Create Linear issue for bug fix

### 3. Plan Fix

- Identify root cause
- Create fix plan
- Test thoroughly in staging
- Schedule redeployment

### 4. Prevention

- Add tests to prevent recurrence
- Update deployment checklist
- Review what warning signs were missed
- Improve monitoring/alerting

---

## Rollback Decision Matrix

| Severity | Impact | Response Time | Action |
|----------|--------|---------------|--------|
| Critical | All users affected | Immediate | Rollback immediately, investigate later |
| High | Major features broken | <15 minutes | Rollback if no quick fix available |
| Medium | Some users affected | <1 hour | Attempt fix first, rollback if needed |
| Low | Minor issues | <24 hours | Fix forward, no rollback needed |

---

## Emergency Contacts

### During Business Hours
- DevOps Team: devops@kompass.de
- Tech Lead: tech-lead@kompass.de
- Product Owner: product@kompass.de

### After Hours
- On-Call Engineer: +49-XXX-XXX-XXXX
- Emergency Escalation: emergency@kompass.de

---

## Rollback History

Track all production rollbacks:

| Date | Environment | Reason | Rolled Back By | Duration | Resolution |
|------|-------------|--------|----------------|----------|------------|
| - | - | - | - | - | - |

---

## Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [GitHub Secrets Reference](./GITHUB_SECRETS.md)
- [Health Check Scripts](../../scripts/health-check.sh)

---

**Maintained By**: DevOps Team  
**Last Review**: 2025-01-27  
**Next Review**: Q2 2025

**Emergency Hotline**: Available 24/7 for critical production issues

