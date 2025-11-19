# CouchDB Backup Strategy

**Last Updated**: 2025-01-28  
**Status**: Active  
**Database**: `kompass`

## Overview

This document describes the backup strategy for the KOMPASS CouchDB database to ensure data safety and compliance with GoBD requirements (10-year retention for financial records).

## Backup Frequency

- **Daily automated backups**: Full database backup
- **Retention**: 30 days for daily backups
- **Long-term retention**: Monthly backups retained for 10 years (GoBD compliance)

## Backup Procedure

### Automated Daily Backup

Daily backups are performed via cron job on the CouchDB server:

```bash
# Crontab entry (runs daily at 2:00 AM)
0 2 * * * /usr/local/bin/couchdb-backup.sh -d kompass -f /backups/kompass-$(date +\%Y\%m\%d).json
```

### Manual Backup

To create a manual backup:

```bash
# Using couchdb-backup script
./scripts/database/couchdb-backup.sh -d kompass -f /backups/kompass-manual-$(date +%Y%m%d-%H%M%S).json

# Or using curl directly
curl -X GET "http://admin:password@localhost:5984/kompass/_all_docs?include_docs=true" \
  -o /backups/kompass-$(date +%Y%m%d).json
```

### Backup Script

Create `scripts/database/couchdb-backup.sh`:

```bash
#!/bin/bash
# CouchDB Backup Script

DATABASE=${1:-kompass}
OUTPUT_FILE=${2:-/backups/kompass-$(date +%Y%m%d).json}
COUCHDB_URL=${COUCHDB_URL:-http://localhost:5984}
COUCHDB_USER=${COUCHDB_USER:-admin}
COUCHDB_PASSWORD=${COUCHDB_PASSWORD:-password}

# Create backup directory if it doesn't exist
mkdir -p $(dirname "$OUTPUT_FILE")

# Perform backup
curl -X GET "${COUCHDB_URL}/${DATABASE}/_all_docs?include_docs=true" \
  -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
  -o "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Backup completed: $OUTPUT_FILE"
  # Compress backup
  gzip "$OUTPUT_FILE"
  echo "✅ Backup compressed: ${OUTPUT_FILE}.gz"
else
  echo "❌ Backup failed"
  exit 1
fi
```

## Backup Storage

### Local Storage

- **Path**: `/backups/kompass-*.json.gz`
- **Format**: Gzip-compressed JSON
- **Retention**: 30 days (automated cleanup)

### Remote Storage (Recommended)

For production, backups should be stored remotely:

1. **S3-compatible storage** (MinIO, AWS S3)
2. **Network-attached storage** (NFS, CIFS)
3. **Cloud backup service** (Backblaze, Wasabi)

### Backup Rotation

Automated cleanup script removes backups older than 30 days:

```bash
#!/bin/bash
# Cleanup old backups (keep last 30 days)
find /backups -name "kompass-*.json.gz" -mtime +30 -delete
```

## Restore Procedure

### Full Database Restore

```bash
# 1. Stop CouchDB service
docker-compose stop couchdb

# 2. Delete existing database (if needed)
curl -X DELETE "http://admin:password@localhost:5984/kompass"

# 3. Recreate database
curl -X PUT "http://admin:password@localhost:5984/kompass"

# 4. Restore from backup
# Decompress if needed
gunzip /backups/kompass-20250128.json.gz

# Restore documents
cat /backups/kompass-20250128.json | \
  jq -r '.rows[] | .doc | tostring' | \
  while read doc; do
    curl -X POST "http://admin:password@localhost:5984/kompass/_bulk_docs" \
      -H "Content-Type: application/json" \
      -d "{\"docs\":[$doc]}"
  done

# 5. Restart CouchDB service
docker-compose start couchdb
```

### Selective Document Restore

To restore specific documents:

```bash
# Extract specific document from backup
jq '.rows[] | select(.doc._id == "customer-123") | .doc' \
  /backups/kompass-20250128.json > /tmp/customer-123.json

# Restore document
curl -X PUT "http://admin:password@localhost:5984/kompass/customer-123" \
  -H "Content-Type: application/json" \
  -d @/tmp/customer-123.json
```

## Verification

### Verify Backup Integrity

```bash
# Check backup file exists and is valid JSON
jq empty /backups/kompass-20250128.json && echo "✅ Backup is valid JSON"

# Count documents in backup
jq '.rows | length' /backups/kompass-20250128.json

# Compare with live database
curl -s "http://admin:password@localhost:5984/kompass/_all_docs" | \
  jq '.total_rows'
```

### Test Restore

Periodically test restore procedure:

1. Create test database: `kompass-test`
2. Restore backup to test database
3. Verify document count matches
4. Sample check: Verify specific documents exist
5. Delete test database

## Monitoring

### Backup Status Monitoring

Monitor backup success/failure:

```bash
# Check last backup timestamp
ls -lt /backups/kompass-*.json.gz | head -1

# Check backup size (should be consistent)
du -h /backups/kompass-*.json.gz | tail -1
```

### Alerting

Set up alerts for:

- Backup failures (script exit code != 0)
- Backup file size anomalies (unusually small/large)
- Missing backups (no backup in last 25 hours)
- Disk space low (< 10% free)

## GoBD Compliance

### Long-Term Retention

For GoBD compliance (10-year retention for financial records):

1. **Monthly backups**: Create monthly full backup
2. **Archive storage**: Store monthly backups in long-term storage
3. **Retention**: Keep monthly backups for 10 years
4. **Verification**: Periodically verify archived backups are readable

### Audit Trail

All backup operations are logged:

- Backup creation timestamp
- Backup file size
- Backup verification status
- Restore operations (who, when, what)

## Disaster Recovery

### Recovery Time Objective (RTO)

- **Target**: < 1 hour
- **Procedure**: Restore from latest daily backup

### Recovery Point Objective (RPO)

- **Target**: < 24 hours (daily backups)
- **Data loss**: Maximum 24 hours of data

### Disaster Recovery Plan

1. **Identify failure**: Database corruption, hardware failure, etc.
2. **Assess damage**: Determine scope of data loss
3. **Select backup**: Choose most recent valid backup
4. **Restore database**: Follow restore procedure
5. **Verify integrity**: Check document counts, sample documents
6. **Resume operations**: Start application services
7. **Document incident**: Log what happened and recovery steps

## Best Practices

1. **Test backups regularly**: Verify backups are restorable
2. **Store backups off-site**: Protect against local disasters
3. **Encrypt backups**: Use encryption for sensitive data
4. **Monitor backup health**: Automated alerts for failures
5. **Document procedures**: Keep restore procedures up-to-date
6. **Regular audits**: Review backup logs and verify retention

## Related Documentation

- [CouchDB Replication Guide](./couchdb-replication.md) - Offline sync setup
- [Database Setup](../specifications/data-model.md) - Database structure
- [GoBD Compliance](../specifications/security.md) - Compliance requirements
