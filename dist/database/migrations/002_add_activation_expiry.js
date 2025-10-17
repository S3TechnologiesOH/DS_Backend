"use strict";
/**
 * Add Activation Code Expiry to Players Table
 *
 * Adds ActivationCodeExpiresAt field to enable time-limited activation codes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = exports.name = void 0;
const connection_1 = require("../connection");
exports.name = 'Add Activation Code Expiry to Players';
const up = async () => {
    const pool = (0, connection_1.getDatabase)();
    // Add ActivationCodeExpiresAt column to Players table
    await pool.request().query(`
    ALTER TABLE Players
    ADD ActivationCodeExpiresAt DATETIME2 NULL;
  `);
    console.log('✅ Added ActivationCodeExpiresAt to Players table');
};
exports.up = up;
const down = async () => {
    const pool = (0, connection_1.getDatabase)();
    // Remove ActivationCodeExpiresAt column
    await pool.request().query(`
    ALTER TABLE Players
    DROP COLUMN ActivationCodeExpiresAt;
  `);
    console.log('✅ Removed ActivationCodeExpiresAt from Players table');
};
exports.down = down;
//# sourceMappingURL=002_add_activation_expiry.js.map