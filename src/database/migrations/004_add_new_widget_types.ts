/**
 * Add New Widget Types Migration
 *
 * Updates the LayerType CHECK constraint to include:
 * - scrolling-text
 * - background-image
 * - webpage
 */

import { getDatabase } from '../connection';

export const name = 'Add New Widget Types';

export const up = async (): Promise<void> => {
  const pool = getDatabase();

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

export const down = async (): Promise<void> => {
  const pool = getDatabase();

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
