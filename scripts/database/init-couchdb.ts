/**
 * Database Initialization Script for KOMPASS
 *
 * Initializes CouchDB database with proper configuration:
 * - Creates database if it doesn't exist
 * - Sets up security document with RBAC roles
 * - Verifies database accessibility
 *
 * This script is idempotent - safe to run multiple times.
 *
 * Usage:
 *   pnpm db:init
 *   node scripts/database/init-couchdb.ts
 *
 * Environment Variables:
 *   COUCHDB_URL - CouchDB URL (default: http://localhost:5984)
 *   COUCHDB_ADMIN_USER - Admin username (default: admin)
 *   COUCHDB_ADMIN_PASSWORD - Admin password (default: changeme)
 *   COUCHDB_DATABASE - Database name (default: kompass)
 */

import Nano from 'nano';

// CouchDB configuration from environment variables
// Supports both COUCHDB_ADMIN_* (for scripts) and COUCHDB_* (for docker-compose) naming
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
 * CouchDB security document structure
 * Based on KOMPASS RBAC roles: ADM, INNEN, PLAN, KALK, BUCH, GF, ADMIN
 */
interface CouchDBSecurity {
  admins: {
    names: string[];
    roles: string[];
  };
  members: {
    names: string[];
    roles: string[];
  };
}

/**
 * Initialize CouchDB database with security configuration
 */
async function initDatabase(): Promise<void> {
  console.log('🚀 Initializing KOMPASS CouchDB database...\n');

  // Test connection
  console.log('1️⃣  Testing CouchDB connection...');
  try {
    await nano.db.list();
    console.log('   ✅ Connected to CouchDB');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('   ❌ Failed to connect to CouchDB:', errorMessage);
    console.error('\n   Troubleshooting:');
    console.error('   - Verify CouchDB is running: docker-compose ps');
    console.error('   - Check credentials in environment variables');
    console.error('   - Verify COUCHDB_URL is correct:', COUCHDB_URL);
    throw new Error(`CouchDB connection failed: ${errorMessage}`);
  }

  // Create database if it doesn't exist
  console.log(`\n2️⃣  Ensuring database '${DATABASE}' exists...`);
  try {
    // Check if database exists by listing all databases
    const databases = await nano.db.list();
    if (databases.includes(DATABASE)) {
      console.log(`   ⏭️  Database '${DATABASE}' already exists`);
    } else {
      await nano.db.create(DATABASE);
      console.log(`   ✅ Created database '${DATABASE}'`);
    }
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      error.statusCode === 412
    ) {
      // Database already exists (412 Precondition Failed)
      console.log(`   ⏭️  Database '${DATABASE}' already exists`);
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `   ❌ Failed to create database '${DATABASE}':`,
        errorMessage
      );
      throw new Error(`Database creation failed: ${errorMessage}`);
    }
  }

  const db = nano.use(DATABASE);

  // Setup security document
  console.log('\n3️⃣  Configuring database security...');
  try {
    // Get existing security document
    let existingSecurity: CouchDBSecurity | null = null;
    try {
      const securityResponse = await nano.request({
        db: DATABASE,
        path: '_security',
        method: 'GET',
      });
      existingSecurity = securityResponse as CouchDBSecurity;
    } catch (error) {
      // Security document doesn't exist yet - that's fine
      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode !== 404
      ) {
        throw error;
      }
    }

    // Define security document with RBAC roles
    // Admins: ADMIN, GF (Geschäftsführer) - full access
    // Members: ADM, INNEN, PLAN, KALK, BUCH - application-level access
    const securityDoc: CouchDBSecurity = {
      admins: {
        names: [],
        roles: ['admin', 'ADMIN', 'GF'], // System admin, ADMIN role, Geschäftsführer
      },
      members: {
        names: [],
        roles: [
          'ADM', // Außendienst - Field Sales
          'INNEN', // Innendienst - Inside Sales
          'PLAN', // Planungsabteilung - Project Planning
          'KALK', // Kalkulation - Cost Calculation
          'BUCH', // Buchhaltung - Accounting
          'GF', // Geschäftsführer - Executive (also admin, but in members for app-level access)
        ],
      },
    };

    // Check if security document needs updating
    const needsUpdate =
      !existingSecurity ||
      JSON.stringify(existingSecurity) !== JSON.stringify(securityDoc);

    if (needsUpdate) {
      await nano.request({
        db: DATABASE,
        path: '_security',
        method: 'PUT',
        body: securityDoc,
      });
      console.log('   ✅ Security document configured');
      console.log('      Admin roles: admin, ADMIN, GF');
      console.log('      Member roles: ADM, INNEN, PLAN, KALK, BUCH, GF');
    } else {
      console.log('   ⏭️  Security document already configured correctly');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('   ❌ Failed to configure security:', errorMessage);
    throw new Error(`Security configuration failed: ${errorMessage}`);
  }

  // Verify database is accessible
  console.log('\n4️⃣  Verifying database accessibility...');
  try {
    const dbInfo = await db.info();
    console.log('   ✅ Database is accessible');
    console.log(`      Name: ${dbInfo.db_name}`);
    console.log(`      Doc count: ${dbInfo.doc_count}`);
    console.log(`      Update seq: ${dbInfo.update_seq}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('   ❌ Failed to verify database:', errorMessage);
    throw new Error(`Database verification failed: ${errorMessage}`);
  }

  console.log('\n✅ Database initialization completed successfully!');
  console.log(`\n   Database: ${DATABASE}`);
  console.log(`   URL: ${COUCHDB_URL}`);
  console.log(`   Status: Ready for migrations and data\n`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await initDatabase();
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('\n❌ Database initialization failed:', errorMessage);
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

export { initDatabase };
