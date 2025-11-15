/**
 * Migration Script: Create CouchDB Design Documents and Views
 *
 * Creates indexes and views for efficient querying:
 * - Location queries (by_customer, by_customer_and_active)
 * - Contact queries (by_customer, by_decision_role)
 * - Customer queries (by_owner, by_rating)
 *
 * Usage:
 *   node 002-create-couchdb-views.ts
 */

import * as Nano from 'nano';

// CouchDB configuration
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const COUCHDB_USER = process.env.COUCHDB_ADMIN_USER || 'admin';
const COUCHDB_PASSWORD = process.env.COUCHDB_ADMIN_PASSWORD || 'changeme';
const DATABASE = process.env.COUCHDB_DATABASE || 'kompass';

const nano = Nano.default(
  `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_URL.replace('http://', '')}`
);
const db = nano.use(DATABASE);

/**
 * Create Location views
 */
async function createLocationViews() {
  console.log('📋 Creating Location views...');

  const locationDesignDoc = {
    _id: '_design/location',
    views: {
      by_customer: {
        map: `function(doc) {
          if (doc.type === 'location') {
            emit(doc.customerId, doc);
          }
        }`,
      },
      by_customer_and_active: {
        map: `function(doc) {
          if (doc.type === 'location') {
            emit([doc.customerId, doc.isActive], doc);
          }
        }`,
      },
      by_type: {
        map: `function(doc) {
          if (doc.type === 'location') {
            emit(doc.locationType, doc);
          }
        }`,
      },
    },
  };

  try {
    await db.insert(locationDesignDoc);
    console.log('✅ Location views created');
  } catch (error) {
    if (error.statusCode === 409) {
      console.log('⏭️  Location views already exist');
    } else {
      throw error;
    }
  }
}

/**
 * Create Contact views
 */
async function createContactViews() {
  console.log('📋 Creating Contact views...');

  const contactDesignDoc = {
    _id: '_design/contact',
    views: {
      by_customer: {
        map: `function(doc) {
          if (doc.type === 'contact') {
            emit(doc.customerId, doc);
          }
        }`,
      },
      by_decision_role: {
        map: `function(doc) {
          if (doc.type === 'contact') {
            emit([doc.customerId, doc.decisionMakingRole], doc);
          }
        }`,
      },
      decision_makers_by_customer: {
        map: `function(doc) {
          if (doc.type === 'contact' && 
              (doc.decisionMakingRole === 'decision_maker' || 
               doc.decisionMakingRole === 'key_influencer')) {
            emit(doc.customerId, doc);
          }
        }`,
      },
    },
  };

  try {
    await db.insert(contactDesignDoc);
    console.log('✅ Contact views created');
  } catch (error) {
    if (error.statusCode === 409) {
      console.log('⏭️  Contact views already exist');
    } else {
      throw error;
    }
  }
}

/**
 * Create Customer views
 */
async function createCustomerViews() {
  console.log('📋 Creating Customer views...');

  const customerDesignDoc = {
    _id: '_design/customer',
    views: {
      by_owner: {
        map: `function(doc) {
          if (doc.type === 'customer') {
            emit(doc.owner, doc);
          }
        }`,
      },
      by_rating: {
        map: `function(doc) {
          if (doc.type === 'customer') {
            emit(doc.rating, doc);
          }
        }`,
      },
      by_type: {
        map: `function(doc) {
          if (doc.type === 'customer') {
            emit(doc.customerType, doc);
          }
        }`,
      },
    },
  };

  try {
    await db.insert(customerDesignDoc);
    console.log('✅ Customer views created');
  } catch (error) {
    if (error.statusCode === 409) {
      console.log('⏭️  Customer views already exist');
    } else {
      throw error;
    }
  }
}

/**
 * Create Mango indexes for efficient queries
 */
async function createIndexes() {
  console.log('📋 Creating Mango indexes...');

  const indexes = [
    // Location indexes
    {
      name: 'location-by-customer',
      ddoc: 'location-queries',
      index: {
        fields: ['type', 'customerId'],
      },
    },
    {
      name: 'location-by-customer-active',
      ddoc: 'location-queries',
      index: {
        fields: ['type', 'customerId', 'isActive'],
      },
    },
    // Contact indexes
    {
      name: 'contact-by-customer',
      ddoc: 'contact-queries',
      index: {
        fields: ['type', 'customerId'],
      },
    },
    {
      name: 'contact-by-decision-role',
      ddoc: 'contact-queries',
      index: {
        fields: ['type', 'customerId', 'decisionMakingRole'],
      },
    },
    // Customer indexes
    {
      name: 'customer-by-owner',
      ddoc: 'customer-queries',
      index: {
        fields: ['type', 'owner'],
      },
    },
  ];

  for (const indexDef of indexes) {
    try {
      await db.createIndex({
        name: indexDef.name,
        ddoc: indexDef.ddoc,
        index: indexDef.index,
      });
      console.log(`✅ Index created: ${indexDef.name}`);
    } catch (error) {
      console.error(`❌ Error creating index ${indexDef.name}:`, error.message);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating CouchDB views and indexes...\n');

  await createLocationViews();
  await createContactViews();
  await createCustomerViews();
  await createIndexes();

  console.log('\n✅ All views and indexes created successfully!');
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  createLocationViews,
  createContactViews,
  createCustomerViews,
  createIndexes,
};
