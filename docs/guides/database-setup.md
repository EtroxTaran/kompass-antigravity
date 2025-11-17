# Database Setup Guide

**Purpose:** Guide for initializing and managing KOMPASS CouchDB database.

## Overview

KOMPASS uses CouchDB as its primary database for offline-first architecture. The database must be initialized before running migrations or starting the application.

## Prerequisites

- CouchDB running (via Docker Compose or standalone)
- Admin credentials configured
- Node.js 20+ and pnpm installed

## Initialization

### Automatic Initialization

The database is automatically initialized during `./scripts/setup-dev.sh` if CouchDB is running.

### Manual Initialization

If you need to initialize the database manually:

```bash
# Start CouchDB (if not already running)
docker-compose up -d couchdb

# Wait for CouchDB to be ready (~10 seconds)
sleep 10

# Initialize database
pnpm db:init
```

### Environment Variables

The initialization script uses these environment variables:

```bash
# CouchDB connection
COUCHDB_URL=http://localhost:5984          # CouchDB URL
COUCHDB_ADMIN_USER=admin                   # Admin username
COUCHDB_ADMIN_PASSWORD=changeme            # Admin password
COUCHDB_DATABASE=kompass                   # Database name
```

Default values work for local development with Docker Compose.

## What the Initialization Script Does

The `scripts/database/init-couchdb.ts` script performs:

1. **Connection Test**: Verifies CouchDB is accessible
2. **Database Creation**: Creates `kompass` database if it doesn't exist
3. **Security Configuration**: Sets up RBAC roles in security document:
   - **Admins**: `admin`, `ADMIN`, `GF` (Geschäftsführer)
   - **Members**: `ADM`, `INNEN`, `PLAN`, `KALK`, `BUCH`, `GF`
4. **Verification**: Confirms database is accessible and ready

## Idempotency

The script is **idempotent** - safe to run multiple times:

- If database exists, skips creation
- If security document already configured, only updates if needed
- Can be run repeatedly without side effects

## RBAC Roles

### Admin Roles (Full Access)

- `admin`: CouchDB system administrator
- `ADMIN`: KOMPASS system administrator role
- `GF`: Geschäftsführer (Executive Management)

### Member Roles (Application-Level Access)

- `ADM`: Außendienst (Field Sales)
- `INNEN`: Innendienst (Inside Sales)
- `PLAN`: Planungsabteilung (Project Planning)
- `KALK`: Kalkulation (Cost Calculation)
- `BUCH`: Buchhaltung (Accounting)
- `GF`: Geschäftsführer (also has admin access)

See [RBAC Permission Matrix](../reviews/RBAC_PERMISSION_MATRIX.md) for detailed permissions.

## Troubleshooting

### Connection Failed

**Error**: `Failed to connect to CouchDB`

**Solutions**:

1. Verify CouchDB is running: `docker-compose ps`
2. Check credentials in environment variables
3. Verify COUCHDB_URL is correct
4. Wait for CouchDB to fully start (~10 seconds after container start)

### Database Already Exists

**Message**: `Database 'kompass' already exists`

**Action**: This is normal - the script skips creation if database exists.

### Security Document Error

**Error**: `Failed to configure security`

**Solutions**:

1. Verify admin credentials are correct
2. Check CouchDB logs: `docker-compose logs couchdb`
3. Ensure CouchDB version supports security documents (3.3+)

## After Initialization

After successful initialization:

1. **Run Migrations**: Execute migration scripts to set up indexes and views

   ```bash
   # Run all migrations (after migration framework is implemented)
   pnpm db:migrate
   ```

2. **Start Application**: Database is ready for application use
   ```bash
   pnpm dev
   ```

## Related Documentation

- [Architecture Documentation](../architectur/) - System architecture
- [Data Model Specification](../specifications/data-model.md) - Entity definitions
- [RBAC Permission Matrix](../reviews/RBAC_PERMISSION_MATRIX.md) - Role permissions
- [Migration Guide](../implementation/migrations/MIGRATION_GUIDE.md) - Database migrations
