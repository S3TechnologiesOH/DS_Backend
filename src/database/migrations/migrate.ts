/**
 * Database Migration Runner
 *
 * Runs database migrations in order.
 * Usage: npm run migrate
 */

import path from 'path';
import { promises as fs } from 'fs';
import { initializeDatabase, closeDatabase } from '../connection';
import logger from '../../utils/logger';

interface Migration {
  id: string;
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

/**
 * Load all migration files
 */
const loadMigrations = async (): Promise<Migration[]> => {
  const migrationsDir = __dirname;
  const files = await fs.readdir(migrationsDir);

  const migrationFiles = files
    .filter((file) => file.endsWith('.ts') && file !== 'migrate.ts')
    .sort();

  const migrations: Migration[] = [];

  for (const file of migrationFiles) {
    const migrationPath = path.join(migrationsDir, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const migration = require(migrationPath);

    const id = file.replace('.ts', '');
    migrations.push({
      id,
      name: migration.name || id,
      up: migration.up,
      down: migration.down,
    });
  }

  return migrations;
};

/**
 * Create migrations tracking table if it doesn't exist
 */
const createMigrationsTable = async (): Promise<void> => {
  const pool = await initializeDatabase();

  const sql = `
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Migrations')
    BEGIN
      CREATE TABLE Migrations (
        Id NVARCHAR(255) PRIMARY KEY,
        Name NVARCHAR(500) NOT NULL,
        AppliedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
      );
    END
  `;

  await pool.request().query(sql);
  logger.info('Migrations table ready');
};

/**
 * Get list of applied migrations
 */
const getAppliedMigrations = async (): Promise<string[]> => {
  const pool = await initializeDatabase();

  const result = await pool.request().query<{ Id: string }>(`
    SELECT Id FROM Migrations ORDER BY Id
  `);

  return result.recordset.map((row) => row.Id);
};

/**
 * Record a migration as applied
 */
const recordMigration = async (id: string, name: string): Promise<void> => {
  const pool = await initializeDatabase();

  await pool.request().input('id', id).input('name', name).query(`
    INSERT INTO Migrations (Id, Name) VALUES (@id, @name)
  `);
};

/**
 * Run all pending migrations
 */
const runMigrations = async (): Promise<void> => {
  try {
    logger.info('Starting database migrations...');

    // Ensure migrations table exists
    await createMigrationsTable();

    // Load all migrations
    const migrations = await loadMigrations();
    logger.info(`Found ${migrations.length} migration file(s)`);

    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations();
    logger.info(`${appliedMigrations.length} migration(s) already applied`);

    // Find pending migrations
    const pendingMigrations = migrations.filter((m) => !appliedMigrations.includes(m.id));

    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations');
      return;
    }

    logger.info(`Running ${pendingMigrations.length} pending migration(s)...`);

    // Run each pending migration
    for (const migration of pendingMigrations) {
      logger.info(`Applying migration: ${migration.name}`);

      try {
        await migration.up();
        await recordMigration(migration.id, migration.name);
        logger.info(` Migration ${migration.name} applied successfully`);
      } catch (error) {
        logger.error(` Migration ${migration.name} failed`, { error });
        throw error;
      }
    }

    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed', { error });
    throw error;
  }
};

/**
 * Main execution
 */
const main = async (): Promise<void> => {
  try {
    await runMigrations();
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Migration process failed', { error });
    await closeDatabase();
    process.exit(1);
  }
};

// Run migrations if executed directly
if (require.main === module) {
  main();
}

export { runMigrations };
