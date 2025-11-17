# KOMPASS Data Model Migration Guide

This guide provides step-by-step instructions for migrating existing KOMPASS installations to the new data model with Location and Contact decision-making enhancements.

## Overview

### Breaking Changes

1. **Customer Entity**: `address` renamed to `billingAddress`
2. **Customer Entity**: Added `locations[]`, `contactPersons[]`, `defaultDeliveryLocationId`
3. **Contact Entity**: Added decision-making fields (role, authority, approval limits)

### New Entities

1. **Location**: Physical locations for customers (delivery addresses)
2. Enhanced **Contact**: Decision-making roles and authority levels

## Pre-Migration Checklist

- [ ] **Backup database** (see step 1 below)
- [ ] **Review documentation**: `docs/specifications/data-model.md`
- [ ] **Verify environment**: Node.js 18+, CouchDB running
- [ ] **Inform users**: System will be read-only during migration
- [ ] **Schedule downtime**: Estimate 30-60 minutes for full migration

## Migration Steps

### Step 1: Backup Database

```bash
# Full database backup
curl -X GET http://admin:password@localhost:5984/kompass/_all_docs?include_docs=true > backup-$(date +%Y%m%d-%H%M%S).json

# Verify backup
ls -lh backup-*.json

# Test restore capability (on test instance)
curl -X POST http://admin:password@localhost:5984/kompass_test/_bulk_docs \
  -H "Content-Type: application/json" \
  -d @backup-YYYYMMDD-HHMMSS.json
```

### Step 2: Customer Migration (BREAKING CHANGE)

```bash
# Dry run first (no changes)
cd /home/etrox/workspace/kompass
node scripts/migrations/001-customer-address-to-billing-address.ts --dry-run

# Review output carefully
# Expected: "Total customers: X, Updated: Y, Skipped: 0, Errors: 0"

# Execute migration
node scripts/migrations/001-customer-address-to-billing-address.ts --execute

# Verify
node scripts/validate-data-model.ts
```

**What This Does:**

- Renames `address` → `billingAddress` in all Customer documents
- Adds `locations: []`, `contactPersons: []` with empty arrays
- Adds `customerType` if missing (defaults to 'active')
- Increments version number and updates modifiedBy/modifiedAt

### Step 3: Contact Migration (Decision Fields)

```bash
# Dry run first
node scripts/migrations/003-add-contact-decision-fields.ts --dry-run

# Review inferred roles
# Script intelligently infers decision roles from position titles:
#   - "Geschäftsführer" → decision_maker, final_authority
#   - "Einkaufsleiter" → key_influencer, high
#   - "Filialleiter" → recommender, medium
#   - Default → operational_contact, low

# Execute migration
node scripts/migrations/003-add-contact-decision-fields.ts --execute

# Review generated report
cat contact-migration-report.csv
```

**What This Does:**

- Adds `decisionMakingRole`, `authorityLevel`, `canApproveOrders` fields
- Intelligently infers roles from position titles
- Sets `canApproveOrders: false` by default (must be manually enabled)
- Adds empty arrays for `functionalRoles`, `assignedLocationIds`, etc.
- Generates CSV report for manual review

### Step 4: Create CouchDB Views and Indexes

```bash
# Create views for efficient queries
node scripts/migrations/002-create-couchdb-views.ts
```

**What This Does:**

- Creates views: `location/by_customer`, `contact/by_customer`, `contact/decision_makers_by_customer`
- Creates Mango indexes for Location and Contact queries
- Improves query performance

### Step 5: Validate Data Model

```bash
# Run validation
node scripts/validate-data-model.ts

# Expected output: "✅ Data model validation passed!"
```

**Validation Checks:**

- All customers have `billingAddress` field
- All locations have valid `customerId` references
- All contacts have required decision fields
- Business rules compliance (CR-001, LR-002, CO-001, CO-002)

### Step 6: Update Application Code

#### Backend Updates

```typescript
// ❌ OLD CODE
const customerAddress = customer.address;

// ✅ NEW CODE
const customerBillingAddress = customer.billingAddress;
const customerLocations = customer.locations; // Array of Location IDs
```

#### Frontend Updates

```typescript
// ❌ OLD CODE
<p>{customer.address.city}</p>

// ✅ NEW CODE
<p>{customer.billingAddress.city}</p>

// NEW: Display locations
<LocationList customerId={customer._id} />
```

### Step 7: Manual Review Required

#### Contact Decision Roles

1. Login as PLAN or GF user
2. Review all contacts: `/contacts`
3. For each contact, verify decision role assignment
4. Update roles as needed via UI or API
5. Set approval limits for contacts who can approve orders

**Priority Contacts to Review:**

- Geschäftsführer (CEO/Owner) → Should be decision_maker
- Einkaufsleiter (Purchasing Manager) → Should be key_influencer
- Assistants → Should be gatekeeper
- Store/Facility Managers → Should be recommender

#### Customer Locations

1. For each customer, create actual Location records
2. Move delivery addresses from notes/fields to Location entities
3. Set `defaultDeliveryLocationId` for customers with multiple locations
4. Assign contacts to appropriate locations

### Step 8: Deploy and Monitor

```bash
# Restart application
pm2 restart kompass-backend
pm2 restart kompass-frontend

# Monitor logs
pm2 logs kompass-backend --lines 100

# Watch for errors
grep -i "error\|exception" /var/log/kompass/*.log

# Check API health
curl http://localhost:3000/health
```

## Post-Migration Tasks

### Data Cleanup (Optional)

After verifying migration success, you may want to:

1. **Remove old `address` field** (if still present due to partial migration):

   ```javascript
   // CouchDB admin console
   db.allDocs({ include_docs: true }).then((result) => {
     result.rows.forEach((row) => {
       if (row.doc.type === 'customer' && row.doc.address) {
         delete row.doc.address;
         db.put(row.doc);
       }
     });
   });
   ```

2. **Compact database**:
   ```bash
   curl -X POST http://admin:password@localhost:5984/kompass/_compact
   ```

### User Training

Train users on new features:

1. **ADM Users**: How to manage locations for their customers
2. **PLAN/GF Users**: How to assign decision-making roles to contacts
3. **All Users**: How to view contact decision authority
4. **PLAN Users**: How to use contact authority info in opportunity qualification

## Rollback Procedure

If migration fails or issues are discovered:

### Immediate Rollback

```bash
# Stop application
pm2 stop kompass-backend

# Restore from backup
curl -X DELETE http://admin:password@localhost:5984/kompass
curl -X PUT http://admin:password@localhost:5984/kompass
curl -X POST http://admin:password@localhost:5984/kompass/_bulk_docs \
  -H "Content-Type: application/json" \
  -d @backup-YYYYMMDD-HHMMSS.json

# Deploy previous version of application
git checkout previous-stable-tag
pnpm install
pnpm build
pm2 restart all
```

### Partial Rollback (Data Only)

If only data needs to be rolled back:

```bash
# Revert Customer documents
# (Restore address field, remove billingAddress/locations)
node scripts/migrations/rollback-001-customer.ts

# Revert Contact documents
# (Remove decision fields)
node scripts/migrations/rollback-003-contact.ts
```

## Troubleshooting

### Issue: Migration Script Fails

**Symptom**: Script exits with error

**Solution**:

1. Check CouchDB is running: `curl http://localhost:5984`
2. Verify credentials in environment variables
3. Check disk space: `df -h`
4. Review error message and fix specific document issues
5. Run dry-run again to identify problematic documents

### Issue: Validation Errors After Migration

**Symptom**: `validate-data-model.ts` reports errors

**Solution**:

1. Review specific error messages
2. Fix documents manually via CouchDB admin UI (Fauxton)
3. Re-run validation
4. If systematic error, create fix script and re-run migration

### Issue: Frontend Shows Old Data Structure

**Symptom**: UI displays undefined or errors

**Solution**:

1. Clear browser cache and localStorage
2. Hard refresh (Ctrl+Shift+R)
3. Check that backend returns new structure: `curl http://localhost:3000/api/v1/customers/{id}`
4. Verify frontend API client uses correct field names

### Issue: RBAC Errors for Decision Authority

**Symptom**: ADM users see "Forbidden" when updating contacts

**Solution**:

- **Expected Behavior**: ADM users CANNOT update decision-making roles
- Only PLAN and GF users have `Contact.UPDATE_DECISION_ROLE` permission
- ADM users can update basic contact info (name, email, phone)

## Testing After Migration

Run full test suite to verify migration:

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Specific tests for Location and Contact
pnpm test location
pnpm test contact
```

## Support

For migration issues or questions:

- Check documentation: `docs/specifications/data-model.md`
- Review architecture: `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
- Contact dev team: dev@kompass.de

## Version Compatibility

| Component  | Minimum Version | Recommended |
| ---------- | --------------- | ----------- |
| Node.js    | 18.0.0          | 20.x LTS    |
| CouchDB    | 3.2.0           | 3.3.x       |
| pnpm       | 8.0.0           | 8.x         |
| TypeScript | 5.0.0           | 5.3.x       |

## Next Steps

After successful migration:

1. **Phase 2.1 (Q2 2025)**: Implement RAG features
2. **Phase 2.2 (Q2 2025)**: Integrate n8n automation
3. **Phase 2.3 (Q3 2025)**: Add ML predictive analytics
4. **Phase 3 (Q4 2025)**: Neo4j knowledge graph integration
