-- Fix Digital Signage Architecture
-- Playlists should contain Content, not Layouts
-- Schedules should reference Layouts, not Playlists

-- 1. REVERT PLAYLIST ITEMS - Change from LayoutId back to ContentId
-- Drop the LayoutId foreign key
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Layouts')
  ALTER TABLE PlaylistItems DROP CONSTRAINT FK_PlaylistItems_Layouts;

-- Drop the LayoutId column
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'LayoutId')
  ALTER TABLE PlaylistItems DROP COLUMN LayoutId;

-- Add ContentId column back
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'ContentId')
  ALTER TABLE PlaylistItems ADD ContentId INT NOT NULL DEFAULT 1;

-- Add foreign key constraint for ContentId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Content')
  ALTER TABLE PlaylistItems ADD CONSTRAINT FK_PlaylistItems_Content
    FOREIGN KEY (ContentId) REFERENCES Content(ContentId);

-- 2. UPDATE SCHEDULES - Change from PlaylistId to LayoutId
-- Drop the PlaylistId foreign key
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Playlists')
  ALTER TABLE Schedules DROP CONSTRAINT FK_Schedules_Playlists;

-- Drop the PlaylistId column
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Schedules') AND name = 'PlaylistId')
  ALTER TABLE Schedules DROP COLUMN PlaylistId;

-- Add LayoutId column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Schedules') AND name = 'LayoutId')
  ALTER TABLE Schedules ADD LayoutId INT NOT NULL DEFAULT 1;

-- Add foreign key for LayoutId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Schedules_Layouts')
  ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Layouts
    FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);

-- 3. ProofOfPlay already uses LayoutId - this is correct, no changes needed

PRINT 'Architecture fix completed successfully!';
PRINT 'Playlists now contain Content (via ContentId)';
PRINT 'Schedules now reference Layouts (via LayoutId)';
PRINT 'Layouts can have playlist widgets that reference Playlists';
