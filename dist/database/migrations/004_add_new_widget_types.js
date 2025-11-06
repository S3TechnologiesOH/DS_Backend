"use strict";
/**
 * Add New Widget Types Migration
 *
 * Updates the LayerType CHECK constraint to include:
 * - scrolling-text
 * - background-image
 * - webpage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = exports.name = void 0;
const connection_1 = require("../connection");
exports.name = 'Add New Widget Types';
const up = async () => {
    const pool = (0, connection_1.getDatabase)();
    // Drop the existing CHECK constraint
    await pool.request().query(`
    ALTER TABLE LayoutLayers
    DROP CONSTRAINT CK_LayoutLayers_Type;
  `);
    // Recreate the CHECK constraint with all widget types
    await pool.request().query(`
    ALTER TABLE LayoutLayers
    ADD CONSTRAINT CK_LayoutLayers_Type CHECK (LayerType IN (
      'text',
      'scrolling-text',
      'image',
      'background-image',
      'video',
      'playlist',
      'html',
      'iframe',
      'webpage',
      'weather',
      'rss',
      'news',
      'youtube',
      'clock',
      'shape'
    ));
  `);
};
exports.up = up;
const down = async () => {
    const pool = (0, connection_1.getDatabase)();
    // Drop the updated constraint
    await pool.request().query(`
    ALTER TABLE LayoutLayers
    DROP CONSTRAINT CK_LayoutLayers_Type;
  `);
    // Restore the original constraint (without new widget types)
    await pool.request().query(`
    ALTER TABLE LayoutLayers
    ADD CONSTRAINT CK_LayoutLayers_Type CHECK (LayerType IN (
      'text', 'image', 'video', 'playlist', 'html', 'iframe',
      'weather', 'rss', 'news', 'youtube', 'clock', 'shape'
    ));
  `);
};
exports.down = down;
//# sourceMappingURL=004_add_new_widget_types.js.map