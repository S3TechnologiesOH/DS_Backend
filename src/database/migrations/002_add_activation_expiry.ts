/**
 * Add Activation Code Expiry to Players Table
 *
 * Adds ActivationCodeExpiresAt field to enable time-limited activation codes.
 */

import { getDatabase } from '../connection';

export const name = 'Add Activation Code Expiry to Players';

export const up = async (): Promise<void> => {
  const pool = getDatabase();

  // Add ActivationCodeExpiresAt column to Players table
  await pool.request().query(`
    ALTER TABLE Players
    ADD ActivationCodeExpiresAt DATETIME2 NULL;
  `);

  console.log('✅ Added ActivationCodeExpiresAt to Players table');
};

export const down = async (): Promise<void> => {
  const pool = getDatabase();

  // Remove ActivationCodeExpiresAt column
  await pool.request().query(`
    ALTER TABLE Players
    DROP COLUMN ActivationCodeExpiresAt;
  `);

  console.log('✅ Removed ActivationCodeExpiresAt from Players table');
};
