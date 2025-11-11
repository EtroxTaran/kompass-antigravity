/**
 * Migration Script: Add Contact Decision-Making Fields
 * 
 * Adds new decision-making fields to existing Contact documents
 * Fields: decisionMakingRole, authorityLevel, canApproveOrders, functionalRoles, etc.
 * 
 * Usage:
 *   node 003-add-contact-decision-fields.ts --dry-run
 *   node 003-add-contact-decision-fields.ts --execute
 * 
 * Based on DATA_MODEL_SPECIFICATION.md Section 7: Migration Strategy
 */

import * as Nano from 'nano';
import { DecisionMakingRole, FunctionalRole } from '@kompass/shared/types/enums';
import * as fs from 'fs';

// CouchDB configuration
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const COUCHDB_USER = process.env.COUCHDB_ADMIN_USER || 'admin';
const COUCHDB_PASSWORD = process.env.COUCHDB_ADMIN_PASSWORD || 'changeme';
const DATABASE = process.env.COUCHDB_DATABASE || 'kompass';

const nano = Nano.default(`http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_URL.replace('http://', '')}`);
const db = nano.use(DATABASE);

interface OldContact {
  _id: string;
  _rev: string;
  type: 'contact';
  position?: string;
  [key: string]: any;
}

interface MigrationResult {
  total: number;
  updated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
  report: Array<{
    contactId: string;
    contactName: string;
    position: string;
    suggestedRole: DecisionMakingRole;
    suggestedAuthority: string;
  }>;
}

/**
 * Infer decision-making role from position title
 */
function inferDecisionMakingRole(position?: string): {
  role: DecisionMakingRole;
  authorityLevel: 'low' | 'medium' | 'high' | 'final_authority';
  functionalRoles: FunctionalRole[];
} {
  const positionLower = (position || '').toLowerCase();

  // Decision maker patterns
  if (
    positionLower.includes('geschäftsführer') ||
    positionLower.includes('ceo') ||
    positionLower.includes('inhaber') ||
    positionLower.includes('owner')
  ) {
    return {
      role: DecisionMakingRole.DECISION_MAKER,
      authorityLevel: 'final_authority',
      functionalRoles: [FunctionalRole.OWNER_CEO],
    };
  }

  // Key influencer patterns
  if (
    positionLower.includes('einkaufsleiter') ||
    positionLower.includes('procurement') ||
    positionLower.includes('purchasing') ||
    positionLower.includes('leiter')
  ) {
    return {
      role: DecisionMakingRole.KEY_INFLUENCER,
      authorityLevel: 'high',
      functionalRoles: [FunctionalRole.PURCHASING_MANAGER],
    };
  }

  // Facility/Store manager patterns
  if (
    positionLower.includes('filialleiter') ||
    positionLower.includes('store manager') ||
    positionLower.includes('facility')
  ) {
    return {
      role: DecisionMakingRole.RECOMMENDER,
      authorityLevel: 'medium',
      functionalRoles: [FunctionalRole.STORE_MANAGER],
    };
  }

  // Financial controller patterns
  if (positionLower.includes('controller') || positionLower.includes('finanz')) {
    return {
      role: DecisionMakingRole.RECOMMENDER,
      authorityLevel: 'medium',
      functionalRoles: [FunctionalRole.FINANCIAL_CONTROLLER],
    };
  }

  // Gatekeeper patterns
  if (
    positionLower.includes('assistent') ||
    positionLower.includes('assistant') ||
    positionLower.includes('sekretär')
  ) {
    return {
      role: DecisionMakingRole.GATEKEEPER,
      authorityLevel: 'low',
      functionalRoles: [FunctionalRole.ADMINISTRATIVE],
    };
  }

  // Default: operational contact
  return {
    role: DecisionMakingRole.OPERATIONAL_CONTACT,
    authorityLevel: 'low',
    functionalRoles: [],
  };
}

/**
 * Migrate Contact documents
 */
async function migrateContacts(dryRun: boolean = true): Promise<MigrationResult> {
  console.log(`🚀 Starting Contact migration (${dryRun ? 'DRY RUN' : 'EXECUTE'})...`);

  const result: MigrationResult = {
    total: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    report: [],
  };

  try {
    // Find all contact documents
    const contacts = await db.find({
      selector: {
        type: 'contact',
      },
      limit: 10000,
    });

    result.total = contacts.docs.length;
    console.log(`Found ${result.total} contact documents`);

    for (const contact of contacts.docs as OldContact[]) {
      try {
        // Check if already migrated
        if ('decisionMakingRole' in contact && 'authorityLevel' in contact) {
          console.log(`⏭️  Skipping ${contact._id} (already migrated)`);
          result.skipped++;
          continue;
        }

        // Infer decision role from position
        const inferred = inferDecisionMakingRole(contact.position);

        // Prepare updated document
        const updated: any = {
          ...contact,
          // Add decision-making fields
          decisionMakingRole: inferred.role,
          authorityLevel: inferred.authorityLevel,
          canApproveOrders: false, // Default: no approval authority
          approvalLimitEur: undefined,
          functionalRoles: inferred.functionalRoles,
          departmentInfluence: [],
          // Add location assignment fields
          assignedLocationIds: [],
          isPrimaryContactForLocations: [],
          // Update metadata
          modifiedBy: 'system-migration',
          modifiedAt: new Date(),
          version: (contact.version || 0) + 1,
        };

        // Add to report
        result.report.push({
          contactId: contact._id,
          contactName: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          position: contact.position || 'N/A',
          suggestedRole: inferred.role,
          suggestedAuthority: inferred.authorityLevel,
        });

        if (dryRun) {
          console.log(`✓ Would migrate ${contact._id}`);
          console.log(`  - Add: decisionMakingRole=${inferred.role}`);
          console.log(`  - Add: authorityLevel=${inferred.authorityLevel}`);
        } else {
          // Execute migration
          await db.insert(updated);
          console.log(`✅ Migrated ${contact._id}`);
        }

        result.updated++;
      } catch (error) {
        console.error(`❌ Error migrating ${contact._id}:`, error.message);
        result.errors.push({ id: contact._id, error: error.message });
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`Total contacts: ${result.total}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Skipped: ${result.skipped}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((err) => {
        console.log(`  - ${err.id}: ${err.error}`);
      });
    }

    // Generate CSV report
    if (!dryRun) {
      const csvHeader = 'Contact ID,Name,Position,Assigned Role,Authority Level\n';
      const csvRows = result.report.map(
        (r) => `${r.contactId},"${r.contactName}","${r.position}",${r.suggestedRole},${r.suggestedAuthority}`
      );
      const csv = csvHeader + csvRows.join('\n');

      fs.writeFileSync('contact-migration-report.csv', csv);
      console.log('\n📄 Report saved to: contact-migration-report.csv');
      console.log('⚠️  Please review assigned roles and adjust manually if needed!');
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
    
    // Confirmation prompt
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise<void>((resolve) => {
      rl.question('Are you sure you want to execute this migration? (yes/no): ', (answer: string) => {
        rl.close();
        if (answer.toLowerCase() !== 'yes') {
          console.log('Migration cancelled.');
          process.exit(0);
        }
        resolve();
      });
    });
  }

  await migrateContacts(dryRun);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { migrateContacts };

