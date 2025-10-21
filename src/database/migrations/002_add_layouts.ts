/**
 * Layouts Migration
 *
 * Adds Layouts and LayoutLayers tables to support layout-based content composition.
 * Updates Playlists to reference Layouts instead of direct Content.
 */

import { getDatabase } from '../connection';

export const name = 'Add Layouts Support';

export const up = async (): Promise<void> => {
  const pool = getDatabase();

  // 1. LAYOUTS TABLE
  await pool.request().query(`
    CREATE TABLE Layouts (
      LayoutId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      Description NVARCHAR(MAX),
      Width INT NOT NULL DEFAULT 1920,
      Height INT NOT NULL DEFAULT 1080,
      BackgroundColor NVARCHAR(50) DEFAULT '#000000',
      ThumbnailUrl NVARCHAR(1000),
      Tags NVARCHAR(500),
      IsActive BIT NOT NULL DEFAULT 1,
      CreatedBy INT NOT NULL,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Layouts_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Layouts_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
    );
  `);

  // 2. LAYOUT LAYERS TABLE (Widgets/Zones in the layout)
  await pool.request().query(`
    CREATE TABLE LayoutLayers (
      LayerId INT IDENTITY(1,1) PRIMARY KEY,
      LayoutId INT NOT NULL,
      LayerName NVARCHAR(255) NOT NULL,
      LayerType NVARCHAR(50) NOT NULL,
      ZIndex INT NOT NULL DEFAULT 0,
      PositionX INT NOT NULL DEFAULT 0,
      PositionY INT NOT NULL DEFAULT 0,
      Width INT NOT NULL,
      Height INT NOT NULL,
      Rotation DECIMAL(5,2) NOT NULL DEFAULT 0,
      Opacity DECIMAL(3,2) NOT NULL DEFAULT 1.0,
      IsVisible BIT NOT NULL DEFAULT 1,
      IsLocked BIT NOT NULL DEFAULT 0,
      ContentConfig NVARCHAR(MAX),
      StyleConfig NVARCHAR(MAX),
      AnimationConfig NVARCHAR(MAX),
      ScheduleConfig NVARCHAR(MAX),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_LayoutLayers_Layouts FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId) ON DELETE CASCADE,
      CONSTRAINT CK_LayoutLayers_Type CHECK (LayerType IN (
        'text', 'image', 'video', 'playlist', 'html', 'iframe',
        'weather', 'rss', 'news', 'youtube', 'clock', 'shape'
      )),
      CONSTRAINT CK_LayoutLayers_Opacity CHECK (Opacity >= 0 AND Opacity <= 1)
    );
  `);

  // 3. DROP OLD FOREIGN KEY ON PLAYLISTITEMS
  await pool.request().query(`
    ALTER TABLE PlaylistItems
    DROP CONSTRAINT FK_PlaylistItems_Content;
  `);

  // 4. RENAME CONTENTID TO LAYOUTID IN PLAYLISTITEMS
  await pool.request().query(`
    EXEC sp_rename 'PlaylistItems.ContentId', 'LayoutId', 'COLUMN';
  `);

  // 5. ADD NEW FOREIGN KEY TO LAYOUTS
  await pool.request().query(`
    ALTER TABLE PlaylistItems
    ADD CONSTRAINT FK_PlaylistItems_Layouts FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);
  `);

  // 6. UPDATE PROOFOFPLAY TO USE LAYOUTID
  await pool.request().query(`
    ALTER TABLE ProofOfPlay
    DROP CONSTRAINT FK_ProofOfPlay_Content;
  `);

  await pool.request().query(`
    EXEC sp_rename 'ProofOfPlay.ContentId', 'LayoutId', 'COLUMN';
  `);

  await pool.request().query(`
    ALTER TABLE ProofOfPlay
    ADD CONSTRAINT FK_ProofOfPlay_Layouts FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);
  `);

  // 7. CREATE INDEXES
  await pool.request().query(`
    CREATE INDEX IX_Layouts_CustomerId ON Layouts(CustomerId);
    CREATE INDEX IX_Layouts_IsActive ON Layouts(IsActive);
    CREATE INDEX IX_LayoutLayers_LayoutId ON LayoutLayers(LayoutId, ZIndex);
    CREATE INDEX IX_PlaylistItems_LayoutId ON PlaylistItems(LayoutId);
  `);
};

export const down = async (): Promise<void> => {
  const pool = getDatabase();

  // Reverse the changes
  await pool.request().query(`DROP TABLE IF EXISTS LayoutLayers;`);
  await pool.request().query(`DROP TABLE IF EXISTS Layouts;`);

  // Restore original ContentId columns (this would lose data in a real rollback)
  await pool.request().query(`
    ALTER TABLE PlaylistItems
    DROP CONSTRAINT FK_PlaylistItems_Layouts;
  `);

  await pool.request().query(`
    EXEC sp_rename 'PlaylistItems.LayoutId', 'ContentId', 'COLUMN';
  `);

  await pool.request().query(`
    ALTER TABLE PlaylistItems
    ADD CONSTRAINT FK_PlaylistItems_Content FOREIGN KEY (ContentId) REFERENCES Content(ContentId);
  `);

  await pool.request().query(`
    ALTER TABLE ProofOfPlay
    DROP CONSTRAINT FK_ProofOfPlay_Layouts;
  `);

  await pool.request().query(`
    EXEC sp_rename 'ProofOfPlay.LayoutId', 'ContentId', 'COLUMN';
  `);

  await pool.request().query(`
    ALTER TABLE ProofOfPlay
    ADD CONSTRAINT FK_ProofOfPlay_Content FOREIGN KEY (ContentId) REFERENCES Content(ContentId);
  `);
};
