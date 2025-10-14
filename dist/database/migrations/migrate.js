"use strict";
/**
 * Database Migration Runner
 *
 * Runs database migrations in order.
 * Usage: npm run migrate
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const connection_1 = require("../connection");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Load all migration files
 */
const loadMigrations = async () => {
    const migrationsDir = __dirname;
    const files = await fs_1.promises.readdir(migrationsDir);
    const migrationFiles = files
        .filter((file) => file.endsWith('.ts') && file !== 'migrate.ts')
        .sort();
    const migrations = [];
    for (const file of migrationFiles) {
        const migrationPath = path_1.default.join(migrationsDir, file);
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
const createMigrationsTable = async () => {
    const pool = await (0, connection_1.initializeDatabase)();
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
    logger_1.default.info('Migrations table ready');
};
/**
 * Get list of applied migrations
 */
const getAppliedMigrations = async () => {
    const pool = await (0, connection_1.initializeDatabase)();
    const result = await pool.request().query(`
    SELECT Id FROM Migrations ORDER BY Id
  `);
    return result.recordset.map((row) => row.Id);
};
/**
 * Record a migration as applied
 */
const recordMigration = async (id, name) => {
    const pool = await (0, connection_1.initializeDatabase)();
    await pool.request().input('id', id).input('name', name).query(`
    INSERT INTO Migrations (Id, Name) VALUES (@id, @name)
  `);
};
/**
 * Run all pending migrations
 */
const runMigrations = async () => {
    try {
        logger_1.default.info('Starting database migrations...');
        // Ensure migrations table exists
        await createMigrationsTable();
        // Load all migrations
        const migrations = await loadMigrations();
        logger_1.default.info(`Found ${migrations.length} migration file(s)`);
        // Get applied migrations
        const appliedMigrations = await getAppliedMigrations();
        logger_1.default.info(`${appliedMigrations.length} migration(s) already applied`);
        // Find pending migrations
        const pendingMigrations = migrations.filter((m) => !appliedMigrations.includes(m.id));
        if (pendingMigrations.length === 0) {
            logger_1.default.info('No pending migrations');
            return;
        }
        logger_1.default.info(`Running ${pendingMigrations.length} pending migration(s)...`);
        // Run each pending migration
        for (const migration of pendingMigrations) {
            logger_1.default.info(`Applying migration: ${migration.name}`);
            try {
                await migration.up();
                await recordMigration(migration.id, migration.name);
                logger_1.default.info(` Migration ${migration.name} applied successfully`);
            }
            catch (error) {
                logger_1.default.error(` Migration ${migration.name} failed`, { error });
                throw error;
            }
        }
        logger_1.default.info('All migrations completed successfully');
    }
    catch (error) {
        logger_1.default.error('Migration failed', { error });
        throw error;
    }
};
exports.runMigrations = runMigrations;
/**
 * Main execution
 */
const main = async () => {
    try {
        await runMigrations();
        await (0, connection_1.closeDatabase)();
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('Migration process failed', { error });
        await (0, connection_1.closeDatabase)();
        process.exit(1);
    }
};
// Run migrations if executed directly
if (require.main === module) {
    main();
}
//# sourceMappingURL=migrate.js.map