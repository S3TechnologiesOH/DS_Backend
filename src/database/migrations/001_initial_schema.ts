/**
 * Initial Database Schema Migration
 *
 * Creates all tables for the Digital Signage Platform with proper relationships.
 * Three-tier hierarchy: Customer ’ Site ’ Player
 */

import { getDatabase } from '../connection';

export const name = 'Initial Schema - All Tables';

export const up = async (): Promise<void> => {
  const pool = getDatabase();

  // 1. CUSTOMERS TABLE
  await pool.request().query(`
    CREATE TABLE Customers (
      CustomerId INT IDENTITY(1,1) PRIMARY KEY,
      Name NVARCHAR(255) NOT NULL,
      Subdomain NVARCHAR(100) NOT NULL UNIQUE,
      IsActive BIT NOT NULL DEFAULT 1,
      SubscriptionTier NVARCHAR(50) NOT NULL DEFAULT 'Free',
      MaxSites INT NOT NULL DEFAULT 5,
      MaxPlayers INT NOT NULL DEFAULT 10,
      MaxStorageGB INT NOT NULL DEFAULT 10,
      ContactEmail NVARCHAR(255) NOT NULL,
      ContactPhone NVARCHAR(50),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
  `);

  // 2. SITES TABLE
  await pool.request().query(`
    CREATE TABLE Sites (
      SiteId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      SiteCode NVARCHAR(50) NOT NULL,
      Address NVARCHAR(500),
      City NVARCHAR(100),
      State NVARCHAR(100),
      Country NVARCHAR(100),
      PostalCode NVARCHAR(20),
      Latitude DECIMAL(9,6),
      Longitude DECIMAL(9,6),
      TimeZone NVARCHAR(50) NOT NULL DEFAULT 'UTC',
      IsActive BIT NOT NULL DEFAULT 1,
      OpeningHours NVARCHAR(500),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Sites_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT UQ_Sites_SiteCode UNIQUE (CustomerId, SiteCode)
    );
  `);

  // 3. PLAYERS TABLE
  await pool.request().query(`
    CREATE TABLE Players (
      PlayerId INT IDENTITY(1,1) PRIMARY KEY,
      SiteId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      PlayerCode NVARCHAR(50) NOT NULL,
      MACAddress NVARCHAR(50),
      SerialNumber NVARCHAR(100),
      Location NVARCHAR(500),
      ScreenResolution NVARCHAR(50),
      Orientation NVARCHAR(20) DEFAULT 'Landscape',
      Status NVARCHAR(50) NOT NULL DEFAULT 'Offline',
      LastHeartbeat DATETIME2,
      IPAddress NVARCHAR(50),
      PlayerVersion NVARCHAR(50),
      OSVersion NVARCHAR(100),
      IsActive BIT NOT NULL DEFAULT 1,
      ActivationCode NVARCHAR(50),
      ActivatedAt DATETIME2,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Players_Sites FOREIGN KEY (SiteId) REFERENCES Sites(SiteId),
      CONSTRAINT UQ_Players_PlayerCode UNIQUE (SiteId, PlayerCode)
    );
  `);

  // 4. USERS TABLE
  await pool.request().query(`
    CREATE TABLE Users (
      UserId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Email NVARCHAR(255) NOT NULL,
      PasswordHash NVARCHAR(255) NOT NULL,
      FirstName NVARCHAR(100) NOT NULL,
      LastName NVARCHAR(100) NOT NULL,
      Role NVARCHAR(50) NOT NULL DEFAULT 'Viewer',
      IsActive BIT NOT NULL DEFAULT 1,
      AssignedSiteId INT NULL,
      LastLoginAt DATETIME2,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Users_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Users_Sites FOREIGN KEY (AssignedSiteId) REFERENCES Sites(SiteId),
      CONSTRAINT UQ_Users_Email UNIQUE (CustomerId, Email),
      CONSTRAINT CK_Users_Role CHECK (Role IN ('Admin', 'Editor', 'Viewer', 'SiteManager'))
    );
  `);

  // 5. CONTENT TABLE
  await pool.request().query(`
    CREATE TABLE Content (
      ContentId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      Description NVARCHAR(MAX),
      ContentType NVARCHAR(50) NOT NULL,
      FileUrl NVARCHAR(1000),
      ThumbnailUrl NVARCHAR(1000),
      FileSize BIGINT,
      Duration INT,
      Width INT,
      Height INT,
      MimeType NVARCHAR(100),
      Status NVARCHAR(50) NOT NULL DEFAULT 'Processing',
      UploadedBy INT NOT NULL,
      Tags NVARCHAR(500),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Content_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Content_Users FOREIGN KEY (UploadedBy) REFERENCES Users(UserId),
      CONSTRAINT CK_Content_ContentType CHECK (ContentType IN ('Image', 'Video', 'HTML', 'URL', 'PDF')),
      CONSTRAINT CK_Content_Status CHECK (Status IN ('Processing', 'Ready', 'Failed'))
    );
  `);

  // 6. PLAYLISTS TABLE
  await pool.request().query(`
    CREATE TABLE Playlists (
      PlaylistId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      Description NVARCHAR(MAX),
      IsActive BIT NOT NULL DEFAULT 1,
      CreatedBy INT NOT NULL,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Playlists_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Playlists_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
    );
  `);

  // 7. PLAYLIST ITEMS TABLE
  await pool.request().query(`
    CREATE TABLE PlaylistItems (
      PlaylistItemId INT IDENTITY(1,1) PRIMARY KEY,
      PlaylistId INT NOT NULL,
      ContentId INT NOT NULL,
      DisplayOrder INT NOT NULL,
      Duration INT,
      TransitionType NVARCHAR(50) DEFAULT 'None',
      TransitionDuration INT DEFAULT 0,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_PlaylistItems_Playlists FOREIGN KEY (PlaylistId) REFERENCES Playlists(PlaylistId) ON DELETE CASCADE,
      CONSTRAINT FK_PlaylistItems_Content FOREIGN KEY (ContentId) REFERENCES Content(ContentId),
      CONSTRAINT CK_PlaylistItems_TransitionType CHECK (TransitionType IN ('Fade', 'Slide', 'None'))
    );
  `);

  // 8. SCHEDULES TABLE
  await pool.request().query(`
    CREATE TABLE Schedules (
      ScheduleId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      Name NVARCHAR(255) NOT NULL,
      PlaylistId INT NOT NULL,
      Priority INT NOT NULL DEFAULT 0,
      StartDate DATE,
      EndDate DATE,
      StartTime TIME,
      EndTime TIME,
      DaysOfWeek NVARCHAR(50),
      IsActive BIT NOT NULL DEFAULT 1,
      CreatedBy INT NOT NULL,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Schedules_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Schedules_Playlists FOREIGN KEY (PlaylistId) REFERENCES Playlists(PlaylistId),
      CONSTRAINT FK_Schedules_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
    );
  `);

  // 9. SCHEDULE ASSIGNMENTS TABLE
  await pool.request().query(`
    CREATE TABLE ScheduleAssignments (
      AssignmentId INT IDENTITY(1,1) PRIMARY KEY,
      ScheduleId INT NOT NULL,
      AssignmentType NVARCHAR(50) NOT NULL,
      TargetCustomerId INT,
      TargetSiteId INT,
      TargetPlayerId INT,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_ScheduleAssignments_Schedules FOREIGN KEY (ScheduleId) REFERENCES Schedules(ScheduleId) ON DELETE CASCADE,
      CONSTRAINT FK_ScheduleAssignments_Customers FOREIGN KEY (TargetCustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_ScheduleAssignments_Sites FOREIGN KEY (TargetSiteId) REFERENCES Sites(SiteId),
      CONSTRAINT FK_ScheduleAssignments_Players FOREIGN KEY (TargetPlayerId) REFERENCES Players(PlayerId),
      CONSTRAINT CK_ScheduleAssignments_Type CHECK (AssignmentType IN ('Customer', 'Site', 'Player')),
      CONSTRAINT CK_ScheduleAssignments_Target CHECK (
        (AssignmentType = 'Customer' AND TargetCustomerId IS NOT NULL AND TargetSiteId IS NULL AND TargetPlayerId IS NULL) OR
        (AssignmentType = 'Site' AND TargetSiteId IS NOT NULL AND TargetCustomerId IS NULL AND TargetPlayerId IS NULL) OR
        (AssignmentType = 'Player' AND TargetPlayerId IS NOT NULL AND TargetCustomerId IS NULL AND TargetSiteId IS NULL)
      )
    );
  `);

  // 10. PLAYER LOGS TABLE
  await pool.request().query(`
    CREATE TABLE PlayerLogs (
      LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
      PlayerId INT NOT NULL,
      LogLevel NVARCHAR(20) NOT NULL,
      Message NVARCHAR(MAX) NOT NULL,
      EventType NVARCHAR(100),
      EventData NVARCHAR(MAX),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_PlayerLogs_Players FOREIGN KEY (PlayerId) REFERENCES Players(PlayerId),
      CONSTRAINT CK_PlayerLogs_LogLevel CHECK (LogLevel IN ('Info', 'Warning', 'Error', 'Critical'))
    );
  `);

  // 11. PROOF OF PLAY TABLE
  await pool.request().query(`
    CREATE TABLE ProofOfPlay (
      ProofOfPlayId BIGINT IDENTITY(1,1) PRIMARY KEY,
      PlayerId INT NOT NULL,
      ContentId INT NOT NULL,
      PlaylistId INT,
      ScheduleId INT,
      PlaybackStartTime DATETIME2 NOT NULL,
      PlaybackEndTime DATETIME2,
      Duration INT,
      IsCompleted BIT NOT NULL DEFAULT 0,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_ProofOfPlay_Players FOREIGN KEY (PlayerId) REFERENCES Players(PlayerId),
      CONSTRAINT FK_ProofOfPlay_Content FOREIGN KEY (ContentId) REFERENCES Content(ContentId),
      CONSTRAINT FK_ProofOfPlay_Playlists FOREIGN KEY (PlaylistId) REFERENCES Playlists(PlaylistId),
      CONSTRAINT FK_ProofOfPlay_Schedules FOREIGN KEY (ScheduleId) REFERENCES Schedules(ScheduleId)
    );
  `);

  // 12. PLAYER TOKENS TABLE
  await pool.request().query(`
    CREATE TABLE PlayerTokens (
      TokenId INT IDENTITY(1,1) PRIMARY KEY,
      PlayerId INT NOT NULL,
      Token NVARCHAR(500) NOT NULL UNIQUE,
      ExpiresAt DATETIME2 NOT NULL,
      RevokedAt DATETIME2,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_PlayerTokens_Players FOREIGN KEY (PlayerId) REFERENCES Players(PlayerId)
    );
  `);

  // 13. USER SESSIONS TABLE
  await pool.request().query(`
    CREATE TABLE UserSessions (
      SessionId INT IDENTITY(1,1) PRIMARY KEY,
      UserId INT NOT NULL,
      RefreshToken NVARCHAR(500) NOT NULL UNIQUE,
      ExpiresAt DATETIME2 NOT NULL,
      RevokedAt DATETIME2,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_UserSessions_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );
  `);

  // 14. AUDIT LOG TABLE
  await pool.request().query(`
    CREATE TABLE AuditLog (
      AuditId BIGINT IDENTITY(1,1) PRIMARY KEY,
      UserId INT,
      CustomerId INT NOT NULL,
      TableName NVARCHAR(100) NOT NULL,
      RecordId INT NOT NULL,
      Action NVARCHAR(50) NOT NULL,
      OldValues NVARCHAR(MAX),
      NewValues NVARCHAR(MAX),
      IPAddress NVARCHAR(50),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_AuditLog_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
      CONSTRAINT FK_AuditLog_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT CK_AuditLog_Action CHECK (Action IN ('Create', 'Update', 'Delete'))
    );
  `);

  // 15. SYSTEM SETTINGS TABLE
  await pool.request().query(`
    CREATE TABLE SystemSettings (
      SettingId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT,
      SettingKey NVARCHAR(100) NOT NULL,
      SettingValue NVARCHAR(MAX),
      DataType NVARCHAR(50) NOT NULL DEFAULT 'String',
      Description NVARCHAR(500),
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_SystemSettings_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT UQ_SystemSettings_Key UNIQUE (CustomerId, SettingKey),
      CONSTRAINT CK_SystemSettings_DataType CHECK (DataType IN ('String', 'Integer', 'Boolean', 'JSON'))
    );
  `);

  // 16. NOTIFICATIONS TABLE
  await pool.request().query(`
    CREATE TABLE Notifications (
      NotificationId INT IDENTITY(1,1) PRIMARY KEY,
      CustomerId INT NOT NULL,
      UserId INT,
      SiteId INT,
      PlayerId INT,
      Title NVARCHAR(255) NOT NULL,
      Message NVARCHAR(MAX) NOT NULL,
      NotificationType NVARCHAR(50) NOT NULL DEFAULT 'Info',
      IsRead BIT NOT NULL DEFAULT 0,
      ReadAt DATETIME2,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
      CONSTRAINT FK_Notifications_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
      CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
      CONSTRAINT FK_Notifications_Sites FOREIGN KEY (SiteId) REFERENCES Sites(SiteId),
      CONSTRAINT FK_Notifications_Players FOREIGN KEY (PlayerId) REFERENCES Players(PlayerId),
      CONSTRAINT CK_Notifications_Type CHECK (NotificationType IN ('Info', 'Warning', 'Error'))
    );
  `);

  // CREATE INDEXES FOR PERFORMANCE
  await pool.request().query(`
    -- Hierarchical lookups
    CREATE INDEX IX_Sites_CustomerId ON Sites(CustomerId);
    CREATE INDEX IX_Players_SiteId ON Players(SiteId);
    CREATE INDEX IX_Users_CustomerId ON Users(CustomerId);

    -- Status and heartbeat queries
    CREATE INDEX IX_Players_Status ON Players(Status, LastHeartbeat);

    -- Content queries
    CREATE INDEX IX_Content_CustomerId ON Content(CustomerId);
    CREATE INDEX IX_Content_Status ON Content(Status);

    -- Playlist relationships
    CREATE INDEX IX_PlaylistItems_PlaylistId ON PlaylistItems(PlaylistId);
    CREATE INDEX IX_PlaylistItems_ContentId ON PlaylistItems(ContentId);

    -- Schedule lookups
    CREATE INDEX IX_Schedules_CustomerId ON Schedules(CustomerId);
    CREATE INDEX IX_Schedules_PlaylistId ON Schedules(PlaylistId);
    CREATE INDEX IX_ScheduleAssignments_ScheduleId ON ScheduleAssignments(ScheduleId);
    CREATE INDEX IX_ScheduleAssignments_Type ON ScheduleAssignments(AssignmentType, TargetCustomerId, TargetSiteId, TargetPlayerId);

    -- Logging and analytics
    CREATE INDEX IX_PlayerLogs_PlayerId ON PlayerLogs(PlayerId, CreatedAt);
    CREATE INDEX IX_ProofOfPlay_PlayerId ON ProofOfPlay(PlayerId, CreatedAt);
    CREATE INDEX IX_ProofOfPlay_ContentId ON ProofOfPlay(ContentId, CreatedAt);

    -- Token lookups
    CREATE INDEX IX_PlayerTokens_Token ON PlayerTokens(Token);
    CREATE INDEX IX_UserSessions_RefreshToken ON UserSessions(RefreshToken);

    -- Audit trail
    CREATE INDEX IX_AuditLog_CustomerId ON AuditLog(CustomerId, CreatedAt);
    CREATE INDEX IX_AuditLog_TableName ON AuditLog(TableName, RecordId);
  `);
};

export const down = async (): Promise<void> => {
  const pool = getDatabase();

  // Drop tables in reverse order (respecting foreign key constraints)
  const tables = [
    'Notifications',
    'SystemSettings',
    'AuditLog',
    'UserSessions',
    'PlayerTokens',
    'ProofOfPlay',
    'PlayerLogs',
    'ScheduleAssignments',
    'Schedules',
    'PlaylistItems',
    'Playlists',
    'Content',
    'Users',
    'Players',
    'Sites',
    'Customers',
  ];

  for (const table of tables) {
    await pool.request().query(`DROP TABLE IF EXISTS ${table};`);
  }
};
