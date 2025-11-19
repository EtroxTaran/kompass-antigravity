/**
 * CouchDB Validate Functions Setup Script
 *
 * Creates design document with validate_doc_update function to enforce:
 * - Document type validation
 * - Required fields validation
 * - Field format validation (email, VAT, etc.)
 * - RBAC: ADM can only modify own records
 *
 * This script is idempotent - safe to run multiple times.
 *
 * Usage:
 *   pnpm db:setup-validate
 *   node scripts/database/setup-validate-functions.ts
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
 * Validate function for CouchDB
 *
 * Enforces:
 * 1. Document type exists and is valid
 * 2. Required fields present (based on type)
 * 3. Field format validation (email, VAT, etc.)
 * 4. RBAC: ADM can only modify own records
 */
const validateFunction = `
function(newDoc, oldDoc, userCtx, secObj) {
  // Skip validation for design documents
  if (newDoc._id && newDoc._id.indexOf('_design/') === 0) {
    return;
  }

  // Skip validation for _security document
  if (newDoc._id === '_security') {
    return;
  }

  // 1. Validate document type exists
  if (!newDoc.type) {
    throw({forbidden: 'Document must have a type field'});
  }

  // Valid document types
  const validTypes = [
    'customer', 'contact', 'location', 'opportunity', 'project',
    'invoice', 'user', 'expense', 'meeting', 'tour', 'timeTracking',
    'projectCost', 'calendar', 'role'
  ];

  if (validTypes.indexOf(newDoc.type) === -1) {
    throw({forbidden: 'Invalid document type: ' + newDoc.type});
  }

  // 2. Validate required base fields
  if (!newDoc._id) {
    throw({forbidden: 'Document must have _id field'});
  }

  // 3. Type-specific validation
  if (newDoc.type === 'customer') {
    // Required fields for customer
    if (!newDoc.companyName || typeof newDoc.companyName !== 'string') {
      throw({forbidden: 'Customer must have companyName field'});
    }
    if (newDoc.companyName.length < 2 || newDoc.companyName.length > 200) {
      throw({forbidden: 'Company name must be 2-200 characters'});
    }
    if (!newDoc.billingAddress) {
      throw({forbidden: 'Customer must have billingAddress field'});
    }
    if (!newDoc.owner || typeof newDoc.owner !== 'string') {
      throw({forbidden: 'Customer must have owner field (User ID)'});
    }

    // Optional field validation: VAT number format
    if (newDoc.vatNumber && typeof newDoc.vatNumber === 'string') {
      if (!/^DE\\d{9}$/.test(newDoc.vatNumber)) {
        throw({forbidden: 'VAT number must be format: DE123456789'});
      }
    }

    // Optional field validation: email format
    if (newDoc.email && typeof newDoc.email === 'string') {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(newDoc.email)) {
        throw({forbidden: 'Invalid email format'});
      }
    }
  }

  if (newDoc.type === 'contact') {
    // Required fields for contact
    if (!newDoc.firstName || typeof newDoc.firstName !== 'string') {
      throw({forbidden: 'Contact must have firstName field'});
    }
    if (newDoc.firstName.length < 2 || newDoc.firstName.length > 50) {
      throw({forbidden: 'First name must be 2-50 characters'});
    }
    if (!newDoc.lastName || typeof newDoc.lastName !== 'string') {
      throw({forbidden: 'Contact must have lastName field'});
    }
    if (newDoc.lastName.length < 2 || newDoc.lastName.length > 50) {
      throw({forbidden: 'Last name must be 2-50 characters'});
    }
    if (!newDoc.customerId || typeof newDoc.customerId !== 'string') {
      throw({forbidden: 'Contact must have customerId field'});
    }
    if (!newDoc.decisionMakingRole) {
      throw({forbidden: 'Contact must have decisionMakingRole field'});
    }
    if (!newDoc.authorityLevel) {
      throw({forbidden: 'Contact must have authorityLevel field'});
    }
    if (typeof newDoc.canApproveOrders !== 'boolean') {
      throw({forbidden: 'Contact must have canApproveOrders field (boolean)'});
    }

    // Business rule: Approval limit required if canApproveOrders=true
    if (newDoc.canApproveOrders === true) {
      if (!newDoc.approvalLimitEur || newDoc.approvalLimitEur <= 0) {
        throw({forbidden: 'Contacts who can approve orders must have approvalLimitEur > 0'});
      }
    }
  }

  if (newDoc.type === 'location') {
    // Required fields for location
    if (!newDoc.locationName || typeof newDoc.locationName !== 'string') {
      throw({forbidden: 'Location must have locationName field'});
    }
    if (newDoc.locationName.length < 2 || newDoc.locationName.length > 100) {
      throw({forbidden: 'Location name must be 2-100 characters'});
    }
    if (!newDoc.locationType) {
      throw({forbidden: 'Location must have locationType field'});
    }
    if (!newDoc.deliveryAddress) {
      throw({forbidden: 'Location must have deliveryAddress field'});
    }
    if (typeof newDoc.isActive !== 'boolean') {
      throw({forbidden: 'Location must have isActive field (boolean)'});
    }
    if (!newDoc.customerId || typeof newDoc.customerId !== 'string') {
      throw({forbidden: 'Location must have customerId field'});
    }
  }

  if (newDoc.type === 'user') {
    // Required fields for user
    if (!newDoc.email || typeof newDoc.email !== 'string') {
      throw({forbidden: 'User must have email field'});
    }
    if (!newDoc.roles || !Array.isArray(newDoc.roles) || newDoc.roles.length === 0) {
      throw({forbidden: 'User must have roles array with at least one role'});
    }
    if (!newDoc.primaryRole) {
      throw({forbidden: 'User must have primaryRole field'});
    }
    if (typeof newDoc.active !== 'boolean') {
      throw({forbidden: 'User must have active field (boolean)'});
    }
  }

  // 4. RBAC: ADM can only modify own records
  // Check if user has ADM role (case-insensitive)
  const userRoles = userCtx.roles || [];
  const isADM = userRoles.some(function(role) {
    return role.toUpperCase() === 'ADM';
  });

  if (isADM) {
    // ADM can only modify records they own
    // Check ownership for customer, opportunity, project entities
    if (newDoc.type === 'customer' || newDoc.type === 'opportunity' || newDoc.type === 'project') {
      if (newDoc.owner && newDoc.owner !== userCtx.name) {
        // Allow if user is creating new document (no oldDoc) and setting themselves as owner
        if (!oldDoc && newDoc.owner === userCtx.name) {
          return; // OK - creating own record
        }
        // For updates, check if owner changed
        if (oldDoc && oldDoc.owner !== newDoc.owner) {
          throw({forbidden: 'ADM users cannot change record ownership'});
        }
        // For updates, check if user owns the record
        if (oldDoc && oldDoc.owner !== userCtx.name) {
          throw({forbidden: 'ADM users can only modify their own records'});
        }
      }
    }
  }

  // 5. Validate audit trail fields (if present)
  if (newDoc.createdBy && typeof newDoc.createdBy !== 'string') {
    throw({forbidden: 'createdBy must be a string (User ID)'});
  }
  if (newDoc.modifiedBy && typeof newDoc.modifiedBy !== 'string') {
    throw({forbidden: 'modifiedBy must be a string (User ID)'});
  }
  if (newDoc.version && typeof newDoc.version !== 'number') {
    throw({forbidden: 'version must be a number'});
  }
}
`;

/**
 * Setup validate functions
 */
async function setupValidateFunctions(): Promise<void> {
  console.log('🚀 Setting up CouchDB validate functions...\n');

  const db = nano.use(DATABASE);

  // Check if design document already exists
  let existingDesignDoc: any = null;
  try {
    existingDesignDoc = await db.get('_design/validate');
  } catch (error) {
    // Design document doesn't exist yet - that's fine
    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      error.statusCode !== 404
    ) {
      throw error;
    }
  }

  // Create or update design document
  const designDoc = {
    _id: '_design/validate',
    _rev: existingDesignDoc?._rev,
    validate_doc_update: validateFunction,
    language: 'javascript',
  };

  try {
    if (existingDesignDoc) {
      await db.insert(designDoc);
      console.log('   ✅ Updated validate function design document');
    } else {
      await db.insert(designDoc);
      console.log('   ✅ Created validate function design document');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('   ❌ Failed to setup validate functions:', errorMessage);
    throw new Error(`Validate functions setup failed: ${errorMessage}`);
  }

  console.log('\n✅ Validate functions setup completed successfully!');
  console.log('   Validate function will enforce:');
  console.log('   - Document type validation');
  console.log('   - Required fields validation');
  console.log('   - Field format validation (email, VAT, etc.)');
  console.log('   - RBAC: ADM can only modify own records\n');
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await setupValidateFunctions();
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('\n❌ Validate functions setup failed:', errorMessage);
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

export { setupValidateFunctions };
