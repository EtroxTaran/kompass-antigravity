/**
 * Data Model Validation Script
 *
 * Validates that all documents conform to the updated data model
 * Checks for missing fields, invalid relationships, and business rule violations
 *
 * Usage:
 *   node validate-data-model.ts
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

interface ValidationError {
  documentId: string;
  documentType: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationReport {
  totalDocuments: number;
  validatedDocuments: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate Customer documents
 */
async function validateCustomers(): Promise<ValidationError[]> {
  console.log('🔍 Validating Customer documents...');
  const errors: ValidationError[] = [];

  const customers = await db.find({
    selector: { type: 'customer' },
    limit: 10000,
  });

  for (const customer of customers.docs) {
    // Check for billingAddress (migrated from address)
    if (!customer.billingAddress) {
      errors.push({
        documentId: customer._id,
        documentType: 'customer',
        field: 'billingAddress',
        message: 'Missing billingAddress field (migration required)',
        severity: 'error',
      });
    }

    // Check for locations array
    if (!Array.isArray(customer.locations)) {
      errors.push({
        documentId: customer._id,
        documentType: 'customer',
        field: 'locations',
        message: 'Missing or invalid locations array',
        severity: 'error',
      });
    }

    // Check for contactPersons array
    if (!Array.isArray(customer.contactPersons)) {
      errors.push({
        documentId: customer._id,
        documentType: 'customer',
        field: 'contactPersons',
        message: 'Missing or invalid contactPersons array',
        severity: 'error',
      });
    }

    // Business rule CR-001: defaultDeliveryLocationId must be in locations
    if (customer.defaultDeliveryLocationId && customer.locations) {
      if (!customer.locations.includes(customer.defaultDeliveryLocationId)) {
        errors.push({
          documentId: customer._id,
          documentType: 'customer',
          field: 'defaultDeliveryLocationId',
          message: 'Default delivery location not in locations array',
          severity: 'error',
        });
      }
    }

    // Warning: Check if customer has locations but none are active
    if (customer.locations && customer.locations.length > 0) {
      // Query to check if any locations are active (would need separate query)
      // This is a simplified check
      errors.push({
        documentId: customer._id,
        documentType: 'customer',
        field: 'locations',
        message: 'Customer has locations - verify at least one is active',
        severity: 'warning',
      });
    }
  }

  console.log(
    `  Found ${customers.docs.length} customers, ${errors.length} issues`
  );
  return errors;
}

/**
 * Validate Location documents
 */
async function validateLocations(): Promise<ValidationError[]> {
  console.log('🔍 Validating Location documents...');
  const errors: ValidationError[] = [];

  const locations = await db.find({
    selector: { type: 'location' },
    limit: 10000,
  });

  for (const location of locations.docs) {
    // Check required fields
    if (!location.customerId) {
      errors.push({
        documentId: location._id,
        documentType: 'location',
        field: 'customerId',
        message: 'Missing customerId',
        severity: 'error',
      });
    }

    if (!location.deliveryAddress) {
      errors.push({
        documentId: location._id,
        documentType: 'location',
        field: 'deliveryAddress',
        message: 'Missing deliveryAddress',
        severity: 'error',
      });
    }

    // Check if customer exists
    if (location.customerId) {
      try {
        await db.get(location.customerId);
      } catch (error) {
        errors.push({
          documentId: location._id,
          documentType: 'location',
          field: 'customerId',
          message: `Referenced customer ${location.customerId} does not exist`,
          severity: 'error',
        });
      }
    }

    // Business rule LR-002: primaryContactPersonId must be in contactPersons
    if (location.primaryContactPersonId && location.contactPersons) {
      if (!location.contactPersons.includes(location.primaryContactPersonId)) {
        errors.push({
          documentId: location._id,
          documentType: 'location',
          field: 'primaryContactPersonId',
          message: 'Primary contact not in contactPersons array',
          severity: 'error',
        });
      }
    }
  }

  console.log(
    `  Found ${locations.docs.length} locations, ${errors.length} issues`
  );
  return errors;
}

/**
 * Validate Contact documents
 */
async function validateContacts(): Promise<ValidationError[]> {
  console.log('🔍 Validating Contact documents...');
  const errors: ValidationError[] = [];

  const contacts = await db.find({
    selector: { type: 'contact' },
    limit: 10000,
  });

  for (const contact of contacts.docs) {
    // Check required decision fields
    if (!contact.decisionMakingRole) {
      errors.push({
        documentId: contact._id,
        documentType: 'contact',
        field: 'decisionMakingRole',
        message: 'Missing decisionMakingRole (migration required)',
        severity: 'error',
      });
    }

    if (!contact.authorityLevel) {
      errors.push({
        documentId: contact._id,
        documentType: 'contact',
        field: 'authorityLevel',
        message: 'Missing authorityLevel (migration required)',
        severity: 'error',
      });
    }

    if (contact.canApproveOrders === undefined) {
      errors.push({
        documentId: contact._id,
        documentType: 'contact',
        field: 'canApproveOrders',
        message: 'Missing canApproveOrders (migration required)',
        severity: 'error',
      });
    }

    // Business rule CO-001: approvalLimitEur required if canApproveOrders=true
    if (contact.canApproveOrders === true) {
      if (!contact.approvalLimitEur || contact.approvalLimitEur <= 0) {
        errors.push({
          documentId: contact._id,
          documentType: 'contact',
          field: 'approvalLimitEur',
          message: 'Approval limit required when canApproveOrders is true',
          severity: 'error',
        });
      }
    }

    // Business rule CO-002: isPrimaryContactForLocations must be in assignedLocationIds
    if (contact.isPrimaryContactForLocations && contact.assignedLocationIds) {
      for (const locationId of contact.isPrimaryContactForLocations) {
        if (!contact.assignedLocationIds.includes(locationId)) {
          errors.push({
            documentId: contact._id,
            documentType: 'contact',
            field: 'isPrimaryContactForLocations',
            message: `Primary for location ${locationId} but not assigned to it`,
            severity: 'error',
          });
        }
      }
    }

    // Check if customer exists
    if (contact.customerId) {
      try {
        await db.get(contact.customerId);
      } catch (error) {
        errors.push({
          documentId: contact._id,
          documentType: 'contact',
          field: 'customerId',
          message: `Referenced customer ${contact.customerId} does not exist`,
          severity: 'error',
        });
      }
    }
  }

  console.log(
    `  Found ${contacts.docs.length} contacts, ${errors.length} issues`
  );
  return errors;
}

/**
 * Main validation
 */
async function main() {
  console.log('🚀 Starting data model validation...\n');

  const report: ValidationReport = {
    totalDocuments: 0,
    validatedDocuments: 0,
    errors: [],
    warnings: [],
  };

  try {
    // Validate all entity types
    const customerErrors = await validateCustomers();
    const locationErrors = await validateLocations();
    const contactErrors = await validateContacts();

    // Combine all errors
    const allErrors = [...customerErrors, ...locationErrors, ...contactErrors];

    // Separate errors and warnings
    report.errors = allErrors.filter((e) => e.severity === 'error');
    report.warnings = allErrors.filter((e) => e.severity === 'warning');

    // Summary
    console.log('\n📊 Validation Report:');
    console.log(`Errors: ${report.errors.length}`);
    console.log(`Warnings: ${report.warnings.length}`);

    if (report.errors.length > 0) {
      console.log('\n❌ Errors:');
      report.errors.forEach((err) => {
        console.log(
          `  - ${err.documentType} ${err.documentId}: ${err.field} - ${err.message}`
        );
      });
    }

    if (report.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      report.warnings.forEach((warn) => {
        console.log(
          `  - ${warn.documentType} ${warn.documentId}: ${warn.field} - ${warn.message}`
        );
      });
    }

    if (report.errors.length === 0) {
      console.log('\n✅ Data model validation passed!');
    } else {
      console.log(
        '\n❌ Data model validation failed. Please fix errors before proceeding.'
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Validation failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { validateCustomers, validateLocations, validateContacts };
