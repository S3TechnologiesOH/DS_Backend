-- Digital Signage Platform - Layouts Migration
-- Run this SQL script on your database to add Layouts support

-- 1. CREATE LAYOUTS TABLE
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

-- 2. CREATE LAYOUT LAYERS TABLE
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
  ))
);

-- 3. UPDATE PLAYLIST ITEMS TABLE - Drop old ContentId column and add LayoutId
-- First, drop the foreign key constraint on ContentId
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Content')
  ALTER TABLE PlaylistItems DROP CONSTRAINT FK_PlaylistItems_Content;

-- Drop the ContentId column
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'ContentId')
  ALTER TABLE PlaylistItems DROP COLUMN ContentId;

-- Add LayoutId column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PlaylistItems') AND name = 'LayoutId')
  ALTER TABLE PlaylistItems ADD LayoutId INT NOT NULL DEFAULT 1;

-- Add foreign key constraint for LayoutId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PlaylistItems_Layouts')
  ALTER TABLE PlaylistItems ADD CONSTRAINT FK_PlaylistItems_Layouts
    FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);

-- 4. UPDATE PROOF OF PLAY TABLE
-- Drop old ContentId foreign key
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProofOfPlay_Content')
  ALTER TABLE ProofOfPlay DROP CONSTRAINT FK_ProofOfPlay_Content;

-- Drop ContentId column
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProofOfPlay') AND name = 'ContentId')
  ALTER TABLE ProofOfPlay DROP COLUMN ContentId;

-- Add LayoutId column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProofOfPlay') AND name = 'LayoutId')
  ALTER TABLE ProofOfPlay ADD LayoutId INT NULL;

-- Add foreign key for LayoutId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProofOfPlay_Layouts')
  ALTER TABLE ProofOfPlay ADD CONSTRAINT FK_ProofOfPlay_Layouts
    FOREIGN KEY (LayoutId) REFERENCES Layouts(LayoutId);

PRINT 'Layouts migration completed successfully!';
