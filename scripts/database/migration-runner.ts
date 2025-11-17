/**
 * Migration Runner for KOMPASS
 *
 * Core logic for executing, tracking, and managing database migrations.
 * Ensures migrations run in order and are not executed twice.
 *
 * This module provides the migration framework that tracks executed migrations
 * in the `_migrations` collection in CouchDB.
 */

import * as Nano from 'nano';
import * as fs from 'fs';
import * as path from 'path';
// Import migration types and enums
// Note: Using relative path to avoid tsconfig-paths dependency in scripts
import {
  MigrationStatus,
  type MigrationRecord,
  type MigrationScript,
  type MigrationResult,
} from '../../packages/shared/src/types/migration';

// CouchDB configuration
const COUCHDB_URL = process.env['COUCHDB_URL'] || 'http://localhost:5984';
const COUCHDB_USER =
  process.env['COUCHDB_ADMIN_USER'] || process.env['COUCHDB_USER'] || 'admin';
const COUCHDB_PASSWORD =
  process.env['COUCHDB_ADMIN_PASSWORD'] ||
  process.env['COUCHDB_PASSWORD'] ||
  'devpassword';
const DATABASE = process.env['COUCHDB_DATABASE'] || 'kompass';
const MIGRATIONS_DIR =
  process.env['MIGRATIONS_DIR'] || path.join(__dirname, '../migrations');

// Construct CouchDB connection URL
const couchdbUrl = COUCHDB_URL.startsWith('http')
  ? COUCHDB_URL.replace('http://', '').replace('https://', '')
  : COUCHDB_URL;
const authUrl = `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${couchdbUrl}`;

const nano = Nano(authUrl);
const db = nano.use(DATABASE);

/**
 * Migration execution context
 */
interface MigrationContext {
  /** Migration file path */
  filePath: string;
  /** Migration version (extracted from filename) */
  version: string;
  /** Migration name (extracted from filename) */
  name: string;
  /** Migration module */
  module: any;
}

/**
 * Get all migration files from migrations directory
 */
function getMigrationFiles(migrationsDir: string): string[] {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
    .sort(); // Sort alphabetically (001, 002, 003...)

  return files.map((file) => path.join(migrationsDir, file));
}

/**
 * Extract migration version and name from filename
 * Example: "001-customer-address-to-billing-address.ts" -> { version: "001", name: "customer-address-to-billing-address" }
 */
function parseMigrationFilename(filename: string): {
  version: string;
  name: string;
} {
  const basename = path.basename(filename, '.ts');
  const match = basename.match(/^(\d{3})-(.+)$/);

  if (!match || !match[1] || !match[2]) {
    throw new Error(
      `Invalid migration filename format: ${filename}. Expected: NNN-description.ts`
    );
  }

  return {
    version: match[1],
    name: match[2],
  };
}

/**
 * Load migration module from file
 * Uses require() for compatibility with ts-node
 */
function loadMigration(filePath: string): MigrationContext {
  const { version, name } = parseMigrationFilename(filePath);

  // Use require() to load migration module
  // ts-node handles TypeScript files automatically via require.extensions
  // Remove .ts extension for require
  const modulePath = filePath.replace(/\.ts$/, '');
  const migrationModule = require(modulePath);

  return {
    filePath,
    version,
    name,
    module: migrationModule,
  };
}

/**
 * Get executed migrations from database
 */
async function getExecutedMigrations(): Promise<MigrationRecord[]> {
  try {
    const result = await db.find({
      selector: {
        type: 'migration',
      },
      limit: 10000,
    });

    // Type-safe conversion
    return result.docs as unknown[] as MigrationRecord[];
  } catch (error) {
    // Migration collection doesn't exist yet - return empty array
    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      error.statusCode === 404
    ) {
      return [];
    }
    throw error;
  }
}

/**
 * Save migration record to database
 */
async function saveMigrationRecord(
  record: Omit<
    MigrationRecord,
    '_id' | '_rev' | 'type' | 'createdAt' | 'modifiedAt'
  >
): Promise<void> {
  const migrationId = `migration-${record.version}-${record.name}`;
  const now = new Date();

  try {
    // Check if migration record already exists
    let existing: MigrationRecord | null = null;
    try {
      const existingDoc = await db.get(migrationId);
      // Type-safe conversion
      existing = existingDoc as unknown as MigrationRecord;
    } catch (error) {
      // Record doesn't exist yet - that's fine
      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode !== 404
      ) {
        throw error;
      }
    }

    const migrationRecord: MigrationRecord = {
      _id: migrationId,
      ...(existing?._rev ? { _rev: existing._rev } : {}),
      type: 'migration',
      version: record.version,
      name: record.name,
      description: record.description,
      status: record.status,
      executedAt: record.executedAt,
      executedBy: record.executedBy,
      result: record.result,
      error: record.error,
      duration: record.duration,
      dryRun: record.dryRun,
      createdAt: existing?.createdAt || now,
      modifiedAt: now,
    };

    await db.insert(migrationRecord);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save migration record: ${errorMessage}`);
  }
}

/**
 * Find migration function in module
 * Supports both default export and named export
 */
function findMigrationFunction(module: any): MigrationScript | null {
  // Check for default export
  if (module.default && typeof module.default.execute === 'function') {
    return module.default;
  }

  // Check for named exports (common pattern: export async function migrateCustomers)
  // Look for function names starting with 'migrate'
  const functionNames = Object.keys(module).filter(
    (key) =>
      typeof module[key] === 'function' &&
      (key.startsWith('migrate') || key.startsWith('create'))
  );

  if (functionNames.length > 0 && functionNames[0]) {
    // Use first matching function
    const migrateFunction = module[functionNames[0]];

    // Wrap function to match MigrationScript interface
    return {
      execute: migrateFunction,
      getMetadata: () => ({
        version: '',
        name: '',
        description: '',
      }),
    };
  }

  return null;
}

/**
 * Execute a single migration
 */
async function executeMigration(
  context: MigrationContext,
  dryRun: boolean
): Promise<MigrationResult> {
  const { version, name, module } = context;

  console.log(`\n📦 Migration ${version}: ${name}`);

  // Find migration function
  const migrationScript = findMigrationFunction(module);

  if (!migrationScript) {
    throw new Error(
      `No migration function found in ${context.filePath}. ` +
        `Expected default export or function starting with 'migrate' or 'create'.`
    );
  }

  // Execute migration
  const startTime = Date.now();
  let result: MigrationResult;
  let error: string | undefined;

  try {
    result = await migrationScript.execute(dryRun);
    const duration = Date.now() - startTime;

    // Save migration record
    await saveMigrationRecord({
      version,
      name,
      description: migrationScript.getMetadata?.()?.description || '',
      status: MigrationStatus.COMPLETED,
      executedAt: new Date(),
      executedBy: 'system',
      result,
      duration,
      dryRun,
    });

    console.log(`✅ Migration ${version} completed in ${duration}ms`);
    return result;
  } catch (err) {
    const duration = Date.now() - startTime;
    error = err instanceof Error ? err.message : String(err);

    // Save failed migration record
    await saveMigrationRecord({
      version,
      name,
      description: migrationScript.getMetadata?.()?.description || '',
      status: MigrationStatus.FAILED,
      executedAt: new Date(),
      executedBy: 'system',
      duration,
      error,
      dryRun,
    });

    console.error(`❌ Migration ${version} failed:`, error);
    throw err;
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(options: {
  dryRun?: boolean;
  targetVersion?: string;
}): Promise<void> {
  const { dryRun = false, targetVersion } = options;

  console.log('🚀 Starting migration runner...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`);
  if (targetVersion) {
    console.log(`Target version: ${targetVersion}`);
  }
  console.log('');

  // Get all migration files
  const migrationFiles = getMigrationFiles(MIGRATIONS_DIR);
  console.log(`Found ${migrationFiles.length} migration files`);

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  // Get executed migrations
  const executedMigrations = await getExecutedMigrations();
  const executedVersions = new Set(
    executedMigrations
      .filter((m) => m.status === MigrationStatus.COMPLETED && !m.dryRun)
      .map((m) => m.version)
  );

  console.log(`Executed migrations: ${executedVersions.size}`);
  console.log('');

  // Load and filter migrations
  const migrations: MigrationContext[] = [];
  for (const filePath of migrationFiles) {
    try {
      const context = loadMigration(filePath);

      // Skip if already executed (unless dry run)
      if (executedVersions.has(context.version) && !dryRun) {
        console.log(
          `⏭️  Skipping migration ${context.version} (already executed)`
        );
        continue;
      }

      // Stop at target version if specified
      if (targetVersion && context.version > targetVersion) {
        console.log(
          `⏭️  Stopping at target version ${targetVersion} (found ${context.version})`
        );
        break;
      }

      migrations.push(context);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to load migration ${filePath}:`, errorMessage);
      throw new Error(`Migration loading failed: ${errorMessage}`);
    }
  }

  if (migrations.length === 0) {
    console.log('✅ No pending migrations');
    return;
  }

  console.log(`\n📋 Will execute ${migrations.length} migration(s):`);
  migrations.forEach((m) => {
    console.log(`  - ${m.version}: ${m.name}`);
  });

  if (dryRun) {
    console.log('\n⚠️  DRY RUN mode - no changes will be made');
  } else {
    console.log('\n⚠️  EXECUTE mode - changes will be applied!');
  }

  // Execute migrations in order
  const results: Array<{
    version: string;
    name: string;
    result: MigrationResult;
  }> = [];

  for (const migration of migrations) {
    try {
      const result = await executeMigration(migration, dryRun);
      results.push({
        version: migration.version,
        name: migration.name,
        result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `\n❌ Migration ${migration.version} failed:`,
        errorMessage
      );
      console.error('\n⚠️  Stopping migration execution due to error');
      console.error(
        '   Fix the error and run migrations again to continue from this point'
      );
      throw new Error(`Migration ${migration.version} failed: ${errorMessage}`);
    }
  }

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log(`Total migrations: ${migrations.length}`);
  console.log(`Completed: ${results.length}`);
  console.log(`Failed: ${migrations.length - results.length}`);

  if (!dryRun) {
    console.log('\n✅ All migrations completed successfully!');
  } else {
    console.log('\n⚠️  This was a DRY RUN. No changes were made.');
    console.log('Run with --execute to apply migrations.');
  }
}

/**
 * List all migrations and their status
 */
export async function listMigrations(): Promise<void> {
  console.log('📋 Migration Status:\n');

  const migrationFiles = getMigrationFiles(MIGRATIONS_DIR);
  const executedMigrations = await getExecutedMigrations();

  const executedMap = new Map<string, MigrationRecord>();
  executedMigrations.forEach((m) => {
    executedMap.set(m.version, m);
  });

  if (migrationFiles.length === 0) {
    console.log('No migration files found');
    return;
  }

  for (const filePath of migrationFiles) {
    try {
      const { version, name } = parseMigrationFilename(filePath);
      const executed = executedMap.get(version);

      if (executed) {
        const status =
          executed.status === MigrationStatus.COMPLETED ? '✅' : '❌';
        const dryRun = executed.dryRun ? ' (dry-run)' : '';
        const executedDate = executed.executedAt
          ? new Date(executed.executedAt).toISOString()
          : 'N/A';
        console.log(
          `${status} ${version}: ${name} - ${executed.status}${dryRun} (${executedDate})`
        );
      } else {
        console.log(`⏳ ${version}: ${name} - pending`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to parse migration ${filePath}:`, errorMessage);
    }
  }
}
