/**
 * Migration Runner CLI for KOMPASS
 *
 * Command-line interface for running database migrations.
 *
 * Usage:
 *   pnpm db:migrate                    # List migrations
 *   pnpm db:migrate --dry-run          # Run migrations in dry-run mode
 *   pnpm db:migrate --execute          # Execute pending migrations
 *   pnpm db:migrate --list             # List migration status
 *   pnpm db:migrate --execute --to 002 # Execute up to version 002
 */

import { runMigrations, listMigrations } from './migration-runner';

/**
 * Main CLI execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  const dryRun = !args.includes('--execute');
  const listOnly = args.includes('--list');
  const targetVersionIndex = args.indexOf('--to');
  const targetVersion =
    targetVersionIndex >= 0 && args[targetVersionIndex + 1]
      ? args[targetVersionIndex + 1]
      : undefined;

  try {
    if (listOnly) {
      // List migrations only
      await listMigrations();
    } else {
      // Run migrations
      await runMigrations({
        dryRun,
        targetVersion,
      });
    }

    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('\n❌ Migration runner failed:', errorMessage);
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

export { runMigrations, listMigrations };
