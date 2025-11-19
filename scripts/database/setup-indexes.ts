/**
 * CouchDB Indexes Setup Script
 *
 * Creates Mango query indexes for common queries:
 * - ["type", "owner"] - For ADM filtering (own customers)
 * - ["type", "companyName"] - For search/sorting
 * - ["type", "modifiedAt"] - For sorting by modification date
 * - ["type", "rating"] - For filtering by rating
 *
 * This script is idempotent - safe to run multiple times.
 *
 * Usage:
 *   pnpm db:setup-indexes
 *   node scripts/database/setup-indexes.ts
 *
 * Environment Variables:
 *   COUCHDB_URL - CouchDB URL (default: http://localhost:5984)
 *   COUCHDB_ADMIN_USER - Admin username (default: admin)
 *   COUCHDB_ADMIN_PASSWORD - Admin password
 *   COUCHDB_DATABASE - Database name (default: kompass)
 */

import Nano from 'nano';

// CouchDB configuration from environment variables
const COUCHDB_URL = process.env['COUCHDB_URL'] || 'http://localhost:5984';
const COUCHDB_USER =
  process.env['COUCHDB_ADMIN_USER'] || process.env['COUCHDB_USER'] || 'admin';
const COUCHDB_PASSWORD =
  process.env['COUCHDB_ADMIN_PASSWORD'] ||
  process.env['COUCHDB_PASSWORD'] ||
  'devpassword';
const DATABASE = process.env['COUCHDB_DATABASE'] || 'kompass';

// Construct CouchDB connection URL
const couchdbUrl = COUCHDB_URL.startsWith('http')
  ? COUCHDB_URL.replace('http://', '').replace('https://', '')
  : COUCHDB_URL;
const authUrl = `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${couchdbUrl}`;

const nano = Nano(authUrl);

/**
 * Index definitions
 */
interface IndexDefinition {
  name: string;
  fields: Array<{ [key: string]: string }>;
  description: string;
}

const indexes: IndexDefinition[] = [
  {
    name: 'type-owner-index',
    fields: [{ type: 'asc' }, { owner: 'asc' }],
    description: 'For ADM filtering (own customers, opportunities, projects)',
  },
  {
    name: 'type-companyName-index',
    fields: [{ type: 'asc' }, { companyName: 'asc' }],
    description: 'For search and sorting by company name',
  },
  {
    name: 'type-modifiedAt-index',
    fields: [{ type: 'asc' }, { modifiedAt: 'desc' }],
    description: 'For sorting by modification date (newest first)',
  },
  {
    name: 'type-rating-index',
    fields: [{ type: 'asc' }, { rating: 'asc' }],
    description: 'For filtering by customer rating',
  },
  {
    name: 'type-customerId-index',
    fields: [{ type: 'asc' }, { customerId: 'asc' }],
    description: 'For finding contacts/locations by customer',
  },
  {
    name: 'type-email-index',
    fields: [{ type: 'asc' }, { email: 'asc' }],
    description: 'For finding users/customers by email',
  },
  {
    name: 'type-status-index',
    fields: [{ type: 'asc' }, { status: 'asc' }],
    description: 'For filtering opportunities/projects by status',
  },
];

/**
 * Setup indexes
 */
async function setupIndexes(): Promise<void> {
  console.log('🚀 Setting up CouchDB indexes...\n');

  const db = nano.use(DATABASE);

  for (const indexDef of indexes) {
    try {
      // Check if index already exists by querying
      // CouchDB will use existing index if it matches
      const index = {
        index: {
          fields: indexDef.fields,
        },
        name: indexDef.name,
        ddoc: indexDef.name,
      };

      // Create index (idempotent - won't fail if exists)
      await db.createIndex(index);

      console.log(`   ✅ Index created: ${indexDef.name}`);
      console.log(`      ${indexDef.description}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `   ❌ Failed to create index ${indexDef.name}:`,
        errorMessage
      );
      // Continue with other indexes even if one fails
    }
  }

  console.log('\n✅ Index setup completed successfully!');
  console.log(`   Created ${indexes.length} indexes for common queries\n`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await setupIndexes();
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('\n❌ Index setup failed:', errorMessage);
    if (errorStack) {
      console.error('\nStack trace:', errorStack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { setupIndexes };
