/**
 * Migration Script: Customer Address → Billing Address
 * 
 * BREAKING CHANGE: Renames 'address' to 'billingAddress' in all Customer documents
 * Adds: locations[], contactPersons[], defaultDeliveryLocationId
 * 
 * Usage:
 *   node 001-customer-address-to-billing-address.ts --dry-run
 *   node 001-customer-address-to-billing-address.ts --execute
 * 
 * Based on DATA_MODEL_SPECIFICATION.md Section 7: Migration Strategy
 */

import * as Nano from 'nano';
import { CustomerType } from '@kompass/shared/types/enums';

// CouchDB configuration
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const COUCHDB_USER = process.env.COUCHDB_ADMIN_USER || 'admin';
const COUCHDB_PASSWORD = process.env.COUCHDB_ADMIN_PASSWORD || 'changeme';
const DATABASE = process.env.COUCHDB_DATABASE || 'kompass';

const nano = Nano.default(`http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_URL.replace('http://', '')}`);
const db = nano.use(DATABASE);

interface OldCustomer {
  _id: string;
  _rev: string;
  type: 'customer';
  address: any; // Old field
  [key: string]: any;
}

interface MigrationResult {
  total: number;
  updated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Migrate Customer documents
 */
async function migrateCustomers(dryRun: boolean = true): Promise<MigrationResult> {
  console.log(`🚀 Starting Customer migration (${dryRun ? 'DRY RUN' : 'EXECUTE'})...`);

  const result: MigrationResult = {
    total: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Find all customer documents
    const customers = await db.find({
      selector: {
        type: 'customer',
      },
      limit: 10000,
    });

    result.total = customers.docs.length;
    console.log(`Found ${result.total} customer documents`);

    for (const customer of customers.docs as OldCustomer[]) {
      try {
        // Check if already migrated
        if ('billingAddress' in customer && !('address' in customer)) {
          console.log(`⏭️  Skipping ${customer._id} (already migrated)`);
          result.skipped++;
          continue;
        }

        // Prepare updated document
        const updated: any = {
          ...customer,
          // Rename address → billingAddress
          billingAddress: customer.address || {
            street: '',
            zipCode: '',
            city: '',
            country: 'Deutschland',
          },
          // Add new fields
          locations: customer.locations || [],
          contactPersons: customer.contactPersons || [],
          defaultDeliveryLocationId: customer.defaultDeliveryLocationId,
          customerType: customer.customerType || CustomerType.ACTIVE,
          // Update metadata
          modifiedBy: 'system-migration',
          modifiedAt: new Date(),
          version: (customer.version || 0) + 1,
        };

        // Remove old 'address' field
        delete updated.address;

        if (dryRun) {
          console.log(`✓ Would migrate ${customer._id}`);
          console.log(`  - Rename: address → billingAddress`);
          console.log(`  - Add: locations=[], contactPersons=[]`);
        } else {
          // Execute migration
          await db.insert(updated);
          console.log(`✅ Migrated ${customer._id}`);
        }

        result.updated++;
      } catch (error) {
        console.error(`❌ Error migrating ${customer._id}:`, error.message);
        result.errors.push({ id: customer._id, error: error.message });
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`Total customers: ${result.total}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Skipped: ${result.skipped}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((err) => {
        console.log(`  - ${err.id}: ${err.error}`);
      });
    }

    if (dryRun) {
      console.log('\n⚠️  This was a DRY RUN. No changes were made.');
      console.log('To execute, run with --execute flag');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }

  return result;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');

  if (dryRun) {
    console.log('⚠️  Running in DRY RUN mode. Use --execute to apply changes.\n');
  } else {
    console.log('⚠️  EXECUTING migration. Changes will be applied!\n');
  }

  await migrateCustomers(dryRun);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { migrateCustomers };

