# GitHub Secrets Reference

**Last Updated**: 2025-01-27

This document lists all required GitHub secrets for CI/CD pipelines.

---

## Shared Secrets

These secrets are used across multiple workflows.

| Secret Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `SNYK_TOKEN` | Snyk API token for security scanning | `abcd1234-...` | Yes |
| `DOCKER_REGISTRY_TOKEN` | Optional for private registry | `ghp_...` | No |

---

## Staging Environment Secrets

| Secret Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `STAGING_HOST` | Staging server IP or domain | `staging.kompass.de` or `192.168.1.100` | Yes |
| `STAGING_USER` | SSH user for deployment | `deploy` | Yes |
| `STAGING_DEPLOY_KEY` | Private SSH key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Yes |
| `STAGING_API_URL` | Backend API URL | `https://api.staging.kompass.de` | Yes |
| `STAGING_URL` | Frontend URL | `https://staging.kompass.de` | Yes |
| `STAGING_DATABASE_URL` | CouchDB connection URL | `http://couchdb:5984` | Yes |
| `STAGING_COUCHDB_USER` | CouchDB admin username | `admin` | Yes |
| `STAGING_COUCHDB_PASSWORD` | CouchDB admin password | `SecurePassword123!` | Yes |
| `STAGING_MEILISEARCH_URL` | MeiliSearch URL | `http://meilisearch:7700` | Yes |
| `STAGING_MEILI_MASTER_KEY` | MeiliSearch master key | `min32charssecurekey` | Yes |
| `STAGING_KEYCLOAK_URL` | Keycloak URL | `http://keycloak:8080` | Yes |
| `STAGING_KEYCLOAK_ADMIN` | Keycloak admin username | `admin` | Yes |
| `STAGING_KEYCLOAK_ADMIN_PASSWORD` | Keycloak admin password | `SecurePassword123!` | Yes |
| `STAGING_KEYCLOAK_CLIENT_SECRET` | Keycloak client secret | `client-secret-here` | Yes |
| `STAGING_JWT_SECRET` | JWT signing secret (min 32 chars) | `min-32-characters-random-string-here` | Yes |
| `STAGING_ALLOWED_ORIGINS` | CORS allowed origins | `https://staging.kompass.de` | Yes |

---

## Production Environment Secrets

| Secret Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `PRODUCTION_HOST` | Production server IP or domain | `kompass.de` or `192.168.1.200` | Yes |
| `PRODUCTION_USER` | SSH user for deployment | `deploy` | Yes |
| `PRODUCTION_DEPLOY_KEY` | Private SSH key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Yes |
| `PRODUCTION_API_URL` | Backend API URL | `https://api.kompass.de` | Yes |
| `PRODUCTION_URL` | Frontend URL | `https://kompass.de` | Yes |
| `PRODUCTION_DATABASE_URL` | CouchDB connection URL | `http://couchdb:5984` | Yes |
| `PRODUCTION_COUCHDB_USER` | CouchDB admin username | `admin` | Yes |
| `PRODUCTION_COUCHDB_PASSWORD` | CouchDB admin password | Use strong password! | Yes |
| `PRODUCTION_MEILISEARCH_URL` | MeiliSearch URL | `http://meilisearch:7700` | Yes |
| `PRODUCTION_MEILI_MASTER_KEY` | MeiliSearch master key | Use strong key (min 32 chars)! | Yes |
| `PRODUCTION_KEYCLOAK_URL` | Keycloak URL | `http://keycloak:8080` | Yes |
| `PRODUCTION_KEYCLOAK_ADMIN` | Keycloak admin username | `admin` | Yes |
| `PRODUCTION_KEYCLOAK_ADMIN_PASSWORD` | Keycloak admin password | Use strong password! | Yes |
| `PRODUCTION_KEYCLOAK_CLIENT_SECRET` | Keycloak client secret | Use strong secret! | Yes |
| `PRODUCTION_JWT_SECRET` | JWT signing secret | Use cryptographically secure random string (min 32 chars)! | Yes |
| `PRODUCTION_ALLOWED_ORIGINS` | CORS allowed origins | `https://kompass.de` | Yes |
| `PRODUCTION_POSTGRES_HOST` | PostgreSQL host for Keycloak | `postgres.example.com` | Yes |
| `PRODUCTION_POSTGRES_USER` | PostgreSQL username | `keycloak` | Yes |
| `PRODUCTION_POSTGRES_PASSWORD` | PostgreSQL password | Use strong password! | Yes |
| `PRODUCTION_HOSTNAME` | Public hostname for Keycloak | `kompass.de` | Yes |

---

## Generating Secure Secrets

### SSH Key Pair

```bash
# Generate SSH key pair for deployment
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key

# Public key (add to server ~/.ssh/authorized_keys)
cat deploy_key.pub

# Private key (add to GitHub secrets)
cat deploy_key
```

### Random Secrets

```bash
# Generate JWT secret (32+ characters)
openssl rand -base64 32

# Generate API key
openssl rand -hex 32

# Generate MeiliSearch master key (min 16 bytes)
openssl rand -base64 24
```

### Password Guidelines

- Minimum 16 characters
- Include uppercase, lowercase, numbers, special characters
- Use password manager to generate and store
- Never reuse passwords across environments
- Rotate credentials regularly (quarterly recommended)

---

## Setting Up GitHub Secrets

### Via Web Interface

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Enter secret name and value
5. Click "Add secret"

### Via GitHub CLI

```bash
# Set a secret
gh secret set STAGING_HOST --body "staging.kompass.de"

# Set from file
gh secret set STAGING_DEPLOY_KEY < deploy_key

# List secrets
gh secret list
```

---

## Secret Rotation Schedule

| Secret Type | Rotation Frequency | Notes |
|------------|-------------------|-------|
| SSH Deploy Keys | Annually | Rotate immediately if compromised |
| Database Passwords | Quarterly | Coordinate with database backups |
| JWT Secrets | Quarterly | Will invalidate all active sessions |
| API Keys | Quarterly | Update in dependent services |
| Keycloak Secrets | Annually | Test thoroughly in staging first |

---

## Security Best Practices

1. **Never Commit Secrets**
   - Use `.gitignore` for `.env` files
   - Scan for accidentally committed secrets with tools like `git-secrets`

2. **Principle of Least Privilege**
   - Staging and production use different credentials
   - Each service has dedicated credentials
   - Deploy user has minimal necessary permissions

3. **Audit Trail**
   - Log all secret access (built-in with GitHub Actions)
   - Review audit logs monthly
   - Monitor for unusual access patterns

4. **Backup & Recovery**
   - Store secrets in secure password manager
   - Document recovery procedures
   - Test secret rotation in staging first

5. **Team Access**
   - Limit GitHub repository admin access
   - Use teams for access control
   - Remove access promptly when team members leave

---

## Troubleshooting

### Deployment Fails with "Permission Denied"

**Check**: `STAGING_DEPLOY_KEY` or `PRODUCTION_DEPLOY_KEY` is correct
**Solution**: Regenerate SSH key pair and update both server and GitHub secret

### "Invalid Credentials" Error

**Check**: Database or service passwords are correct
**Solution**: Verify passwords match in both secrets and server environment

### Services Can't Connect

**Check**: Internal URLs are using container names (e.g., `http://couchdb:5984`)
**Solution**: Update URL secrets to use internal Docker network names

---

## Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Rollback Procedures](./ROLLBACK_PROCEDURES.md)

---

**Maintained By**: DevOps & Security Team  
**Last Review**: 2025-01-27  
**Next Review**: Q2 2025

