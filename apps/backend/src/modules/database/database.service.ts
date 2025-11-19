import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Nano from 'nano';

import { DATABASE_CONNECTION, DATABASE_NAME } from './database.constants';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly nano: Nano.ServerScope,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureDatabaseExists();
    // Setup validate functions and indexes after database is created
    await this.setupValidateFunctions();
    await this.setupIndexes();
  }

  async ensureDatabaseExists(): Promise<void> {
    try {
      const dbList = await this.nano.db.list();
      if (!dbList.includes(DATABASE_NAME)) {
        this.logger.log(
          `Database ${DATABASE_NAME} does not exist. Creating...`
        );
        await this.nano.db.create(DATABASE_NAME);
        this.logger.log(`Database ${DATABASE_NAME} created successfully.`);
      } else {
        this.logger.log(`Database ${DATABASE_NAME} already exists.`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to check/create database: ${errorMessage}`,
        errorStack
      );
      // Don't throw here to allow app to start, but log critical error
      // In production, we might want to fail fast or have retry logic
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.nano.db.list();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Database connection check failed: ${errorMessage}`);
      return false;
    }
  }

  getDb(): Nano.DocumentScope<any> {
    return this.nano.use(DATABASE_NAME);
  }

  /**
   * Setup CouchDB validate functions
   * Creates design document with validate_doc_update function
   */
  private async setupValidateFunctions(): Promise<void> {
    try {
      const db = this.getDb();

      // Validate function code (same as in setup-validate-functions.ts)
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

  // 3. Type-specific validation (basic checks)
  if (newDoc.type === 'customer') {
    if (!newDoc.companyName || typeof newDoc.companyName !== 'string') {
      throw({forbidden: 'Customer must have companyName field'});
    }
    if (newDoc.companyName.length < 2 || newDoc.companyName.length > 200) {
      throw({forbidden: 'Company name must be 2-200 characters'});
    }
    if (!newDoc.owner || typeof newDoc.owner !== 'string') {
      throw({forbidden: 'Customer must have owner field (User ID)'});
    }
  }

  // 4. RBAC: ADM can only modify own records
  const userRoles = userCtx.roles || [];
  const isADM = userRoles.some(function(role) {
    return role.toUpperCase() === 'ADM';
  });

  if (isADM) {
    if (newDoc.type === 'customer' || newDoc.type === 'opportunity' || newDoc.type === 'project') {
      if (newDoc.owner && newDoc.owner !== userCtx.name) {
        if (!oldDoc && newDoc.owner === userCtx.name) {
          return; // OK - creating own record
        }
        if (oldDoc && oldDoc.owner !== newDoc.owner) {
          throw({forbidden: 'ADM users cannot change record ownership'});
        }
        if (oldDoc && oldDoc.owner !== userCtx.name) {
          throw({forbidden: 'ADM users can only modify their own records'});
        }
      }
    }
  }
}
`;

      // Check if design document already exists
      let existingDesignDoc: { _rev?: string } | null = null;
      try {
        existingDesignDoc = await db.get('_design/validate');
      } catch (error) {
        // Design document doesn't exist yet
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
      const designDoc: {
        _id: string;
        _rev?: string;
        validate_doc_update: string;
        language: string;
      } = {
        _id: '_design/validate',
        _rev: existingDesignDoc?._rev,
        validate_doc_update: validateFunction,
        language: 'javascript',
      };

      await db.insert(designDoc);
      this.logger.log('Validate functions setup completed');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to setup validate functions: ${errorMessage}. Continuing...`
      );
      // Don't throw - allow app to start even if validate functions fail
    }
  }

  /**
   * Setup CouchDB indexes
   * Creates Mango query indexes for common queries
   */
  private async setupIndexes(): Promise<void> {
    try {
      const db = this.getDb();

      const indexes: Array<{
        index: { fields: Array<{ [key: string]: 'asc' | 'desc' }> };
        name: string;
        ddoc: string;
      }> = [
        {
          index: {
            fields: [{ type: 'asc' as const }, { owner: 'asc' as const }],
          },
          name: 'type-owner-index',
          ddoc: 'type-owner-index',
        },
        {
          index: {
            fields: [{ type: 'asc' as const }, { companyName: 'asc' as const }],
          },
          name: 'type-companyName-index',
          ddoc: 'type-companyName-index',
        },
        {
          index: {
            fields: [{ type: 'asc' as const }, { modifiedAt: 'desc' as const }],
          },
          name: 'type-modifiedAt-index',
          ddoc: 'type-modifiedAt-index',
        },
        {
          index: {
            fields: [{ type: 'asc' as const }, { rating: 'asc' as const }],
          },
          name: 'type-rating-index',
          ddoc: 'type-rating-index',
        },
        {
          index: {
            fields: [{ type: 'asc' as const }, { customerId: 'asc' as const }],
          },
          name: 'type-customerId-index',
          ddoc: 'type-customerId-index',
        },
      ];

      for (const index of indexes) {
        try {
          await db.createIndex(index);
          this.logger.debug(`Index created: ${index.name}`);
        } catch (error) {
          // Index might already exist - that's fine
          this.logger.debug(`Index ${index.name} already exists or failed`);
        }
      }

      this.logger.log('Indexes setup completed');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to setup indexes: ${errorMessage}. Continuing...`
      );
      // Don't throw - allow app to start even if indexes fail
    }
  }
}
