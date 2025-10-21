/**
 * Fix Architecture Migration
 *
 * Corrects the architecture to follow the proper data flow:
 * Content → Playlists → Layouts → Schedules → Players
 *
 * Changes:
 * 1. Revert PlaylistItems from LayoutId back to ContentId (playlists contain content)
 * 2. Change Schedules from PlaylistId to LayoutId (schedules reference layouts)
 */

import { getDatabase } from '../connection';

export const name = 'Fix Architecture - Content->Playlists->Layouts->Schedules';

export const up = async (): Promise<void> => {
  const pool = getDatabase();

  console.log('Starting architecture fix migration...');

  // ===== 1. FIX PLAYLIST ITEMS - Change from LayoutId back to ContentId =====
  console.log('Step 1: Fixing PlaylistItems to reference Content instead of Layouts...');

  // Drop the LayoutId foreign key
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Layouts')
      ALTER TABLE PlaylistItems DROP CONSTRAINT FK_PlaylistItems_Layouts;
  `);

  // Rename LayoutId column back to ContentId
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'LayoutId')
      EXEC sp_rename 'PlaylistItems.LayoutId', 'ContentId', 'COLUMN';
  `);

  // Add foreign key constraint for ContentId
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Content')
      ALTER TABLE PlaylistItems ADD CONSTRAINT FK_PlaylistItems_Content
        FOREIGN KEY (ContentId) REFERENCES Content(ContentId);
  `);

  console.log('  ✓ PlaylistItems now references Content');

  // ===== 2. FIX SCHEDULES - Change from PlaylistId to LayoutId =====
  console.log('Step 2: Fixing Schedules to reference Layouts instead of Playlists...');

  // Drop the PlaylistId foreign key
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Playlists')
      ALTER TABLE Schedules DROP CONSTRAINT FK_Schedules_Playlists;
  `);

  // Rename PlaylistId column to LayoutId
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Schedules') AND name = 'PlaylistId')
      EXEC sp_rename 'Schedules.PlaylistId', 'LayoutId', 'COLUMN';
  `);

  // Add foreign key for LayoutId
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Layouts')
      ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Layouts
        FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);
  `);

  console.log('  ✓ Schedules now references Layouts');

  // ===== 3. UPDATE INDEXES =====
  console.log('Step 3: Updating indexes...');

  // Drop old index if exists
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlaylistItems_LayoutId')
      DROP INDEX IX_PlaylistItems_LayoutId ON PlaylistItems;
  `);

  // Create new index
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlaylistItems_ContentId')
      CREATE INDEX IX_PlaylistItems_ContentId ON PlaylistItems(ContentId);
  `);

  console.log('  ✓ Indexes updated');

  console.log('Architecture fix completed successfully!');
  console.log('  Data flow: Content → Playlists → Layouts → Schedules → Players');
  console.log('  - Playlists now contain Content (via ContentId)');
  console.log('  - Schedules now reference Layouts (via LayoutId)');
  console.log('  - Layouts can have playlist widget layers that reference Playlists');
};

export const down = async (): Promise<void> => {
  const pool = getDatabase();

  console.log('Rolling back architecture fix...');

  // Reverse Step 2: Schedules back to PlaylistId
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Layouts')
      ALTER TABLE Schedules DROP CONSTRAINT FK_Schedules_Layouts;
  `);

  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Schedules') AND name = 'LayoutId')
      EXEC sp_rename 'Schedules.LayoutId', 'PlaylistId', 'COLUMN';
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Playlists')
      ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Playlists
        FOREIGN KEY (PlaylistId) REFERENCES Playlists(PlaylistId);
  `);

  // Reverse Step 1: PlaylistItems back to LayoutId
  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Content')
      ALTER TABLE PlaylistItems DROP CONSTRAINT FK_PlaylistItems_Content;
  `);

  await pool.request().query(`
    IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'ContentId')
      EXEC sp_rename 'PlaylistItems.ContentId', 'LayoutId', 'COLUMN';
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Layouts')
      ALTER TABLE PlaylistItems ADD CONSTRAINT FK_PlaylistItems_Layouts
        FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);
  `);

  console.log('Rollback completed');
};
