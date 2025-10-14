Overview

This database schema supports a multi-tenant digital signage platform with a hierarchical structure:

Customers: Top-level organizations (e.g., retail chains, corporations)
Sites: Physical locations belonging to customers (e.g., stores, offices, venues)
Players: Individual screens/devices at each site (e.g., lobby display, menu board)
Schema Design Principles
Three-tier hierarchy: Customer → Site → Player
Multi-tenancy: Complete data isolation per customer
Flexible scheduling: Assign content at customer, site, or player level
Site-based management: Group players by physical location
Audit trail: Track all changes for security and compliance
Performance: Strategic indexes for hierarchical queries
Table Relationships Diagram
Hierarchy Explained
Customer Level
Example: "RetailCorp", "Coffee Chain Inc.", "Hospital Network"
Manages: Users, content library, playlists, global schedules
Use case: Corporate headquarters manages content for all locations
Site Level
Example: "Store #42 - Manhattan", "Airport Terminal 3", "Downtown Office"
Manages: Physical location, local schedules, player groups
Use case: Store manager controls what plays in their location
Player Level
Example: "Lobby Display", "Menu Board #1", "Window Display"
Manages: Individual screen, specific overrides
Use case: Individual screen needs different content
Core Tables
Customers

Top-level organizations (your clients).

Column	Type	Description
CustomerId	INT	Primary key
Name	NVARCHAR(255)	Customer name
Subdomain	NVARCHAR(100)	Unique subdomain for login
IsActive	BIT	Active status
SubscriptionTier	NVARCHAR(50)	Free, Pro, Enterprise
MaxSites	INT	Maximum allowed sites
MaxPlayers	INT	Maximum total players
MaxStorageGB	INT	Storage quota in GB
ContactEmail	NVARCHAR(255)	Primary contact email
ContactPhone	NVARCHAR(50)	Primary contact phone

Example Records:

Sites

Physical locations belonging to customers.

Column	Type	Description
SiteId	INT	Primary key
CustomerId	INT	Foreign key to Customers
Name	NVARCHAR(255)	Site name
SiteCode	NVARCHAR(50)	Unique code (e.g., store number)
Address	NVARCHAR(500)	Physical address
City	NVARCHAR(100)	City
State	NVARCHAR(100)	State/Province
Country	NVARCHAR(100)	Country
PostalCode	NVARCHAR(20)	Postal/ZIP code
Latitude	DECIMAL(9,6)	GPS latitude
Longitude	DECIMAL(9,6)	GPS longitude
TimeZone	NVARCHAR(50)	IANA timezone (e.g., 'America/New_York')
IsActive	BIT	Active status
OpeningHours	NVARCHAR(500)	JSON or text for hours

Example Records:

Use Cases:

Assign schedules to all players at a site
Filter content by geography
Manage different timezones
Track site-specific analytics
Players

Individual screens/devices at sites.

Column	Type	Description
PlayerId	INT	Primary key
SiteId	INT	Foreign key to Sites
Name	NVARCHAR(255)	Player name (e.g., "Lobby Display")
PlayerCode	NVARCHAR(50)	Unique identifier at site
MACAddress	NVARCHAR(50)	MAC address
SerialNumber	NVARCHAR(100)	Device serial number
Location	NVARCHAR(500)	Specific location at site
ScreenResolution	NVARCHAR(50)	e.g., "1920x1080"
Orientation	NVARCHAR(20)	Landscape, Portrait
Status	NVARCHAR(50)	Online, Offline, Error
LastHeartbeat	DATETIME2	Last check-in time
IPAddress	NVARCHAR(50)	Current IP address
PlayerVersion	NVARCHAR(50)	Client software version
OSVersion	NVARCHAR(100)	Operating system
IsActive	BIT	Active status
ActivationCode	NVARCHAR(50)	One-time activation code
ActivatedAt	DATETIME2	Activation timestamp

Example Records:

Users

User accounts with customer-level access.

Column	Type	Description
UserId	INT	Primary key
CustomerId	INT	Foreign key to Customers
Email	NVARCHAR(255)	User email (unique per customer)
PasswordHash	NVARCHAR(255)	Bcrypt password hash
FirstName	NVARCHAR(100)	First name
LastName	NVARCHAR(100)	Last name
Role	NVARCHAR(50)	Admin, Editor, Viewer, SiteManager
IsActive	BIT	Active status
AssignedSiteId	INT	For SiteManager role (optional)
LastLoginAt	DATETIME2	Last login timestamp

Roles:

Admin: Full customer access
Editor: Create/edit content, playlists, schedules
Viewer: Read-only access
SiteManager: Manage specific site only
Content

Media files and content library (customer-level).

Column	Type	Description
ContentId	INT	Primary key
CustomerId	INT	Foreign key to Customers
Name	NVARCHAR(255)	Content name
Description	NVARCHAR(MAX)	Optional description
ContentType	NVARCHAR(50)	Image, Video, HTML, URL, PDF
FileUrl	NVARCHAR(1000)	Azure Blob Storage URL
ThumbnailUrl	NVARCHAR(1000)	Thumbnail image URL
FileSize	BIGINT	Size in bytes
Duration	INT	Duration in seconds
Width	INT	Width in pixels
Height	INT	Height in pixels
MimeType	NVARCHAR(100)	MIME type
Status	NVARCHAR(50)	Processing, Ready, Failed
UploadedBy	INT	Foreign key to Users
Tags	NVARCHAR(500)	Searchable tags

Note: Content is shared across all sites for a customer.

Playlists

Collections of content items (customer-level).

Column	Type	Description
PlaylistId	INT	Primary key
CustomerId	INT	Foreign key to Customers
Name	NVARCHAR(255)	Playlist name
Description	NVARCHAR(MAX)	Optional description
IsActive	BIT	Active status
CreatedBy	INT	Foreign key to Users
PlaylistItems

Junction table linking playlists and content.

Column	Type	Description
PlaylistItemId	INT	Primary key
PlaylistId	INT	Foreign key to Playlists
ContentId	INT	Foreign key to Content
DisplayOrder	INT	Order in playlist
Duration	INT	Override duration (seconds)
TransitionType	NVARCHAR(50)	Fade, Slide, None
TransitionDuration	INT	Transition time (ms)
Schedules

When and where to play playlists.

Column	Type	Description
ScheduleId	INT	Primary key
CustomerId	INT	Foreign key to Customers
Name	NVARCHAR(255)	Schedule name
PlaylistId	INT	Foreign key to Playlists
Priority	INT	Higher = higher priority
StartDate	DATE	Start date (optional)
EndDate	DATE	End date (optional)
StartTime	TIME	Daily start time (optional)
EndTime	TIME	Daily end time (optional)
DaysOfWeek	NVARCHAR(50)	e.g., "Mon,Tue,Wed"
IsActive	BIT	Active status
CreatedBy	INT	Foreign key to Users
ScheduleAssignments

Assigns schedules to customers, sites, or individual players.

Column	Type	Description
AssignmentId	INT	Primary key
ScheduleId	INT	Foreign key to Schedules
AssignmentType	NVARCHAR(50)	Customer, Site, Player
TargetCustomerId	INT	For customer-wide (optional)
TargetSiteId	INT	For site-wide (optional)
TargetPlayerId	INT	For individual player (optional)

Assignment Types:

Customer: Schedule applies to ALL sites and players for customer
Site: Schedule applies to ALL players at specific site
Player: Schedule applies to specific player only

Constraint: Exactly one of TargetCustomerId, TargetSiteId, or TargetPlayerId must be set.

Priority Resolution:

Player-specific schedule (highest priority)
Site-specific schedule
Customer-wide schedule (lowest priority)
Logging & Analytics Tables
PlayerLogs

System logs from players.

Column	Type	Description
LogId	BIGINT	Primary key
PlayerId	INT	Foreign key to Players
LogLevel	NVARCHAR(20)	Info, Warning, Error, Critical
Message	NVARCHAR(MAX)	Log message
EventType	NVARCHAR(100)	Heartbeat, Error, etc.
EventData	NVARCHAR(MAX)	JSON additional data
CreatedAt	DATETIME2	Timestamp
ProofOfPlay

Tracks actual content playback.

Column	Type	Description
ProofOfPlayId	BIGINT	Primary key
PlayerId	INT	Foreign key to Players
ContentId	INT	Foreign key to Content
PlaylistId	INT	Foreign key to Playlists
ScheduleId	INT	Foreign key to Schedules
PlaybackStartTime	DATETIME2	Start time
PlaybackEndTime	DATETIME2	End time
Duration	INT	Actual duration (seconds)
IsCompleted	BIT	Played to completion?
Supporting Tables
PlayerTokens

Authentication tokens for players.

Column	Type	Description
TokenId	INT	Primary key
PlayerId	INT	Foreign key to Players
Token	NVARCHAR(500)	Auth token
ExpiresAt	DATETIME2	Expiration time
RevokedAt	DATETIME2	When revoked
UserSessions

JWT refresh tokens for users.

Column	Type	Description
SessionId	INT	Primary key
UserId	INT	Foreign key to Users
RefreshToken	NVARCHAR(500)	Refresh token
ExpiresAt	DATETIME2	Expiration time
RevokedAt	DATETIME2	When revoked
AuditLog

Tracks all changes for compliance.

Column	Type	Description
AuditId	BIGINT	Primary key
UserId	INT	Foreign key to Users
CustomerId	INT	Foreign key to Customers
TableName	NVARCHAR(100)	Table changed
RecordId	INT	Record ID
Action	NVARCHAR(50)	Create, Update, Delete
OldValues	NVARCHAR(MAX)	JSON before
NewValues	NVARCHAR(MAX)	JSON after
IPAddress	NVARCHAR(50)	User IP
CreatedAt	DATETIME2	Timestamp
SystemSettings

Configuration per customer.

Column	Type	Description
SettingId	INT	Primary key
CustomerId	INT	Foreign key (NULL for global)
SettingKey	NVARCHAR(100)	Setting name
SettingValue	NVARCHAR(MAX)	Setting value
DataType	NVARCHAR(50)	String, Integer, Boolean
Description	NVARCHAR(500)	Description
Notifications

In-app notifications.

Column	Type	Description
NotificationId	INT	Primary key
CustomerId	INT	Foreign key to Customers
UserId	INT	Foreign key to Users (optional)
SiteId	INT	Related site (optional)
PlayerId	INT	Related player (optional)
Title	NVARCHAR(255)	Notification title
Message	NVARCHAR(MAX)	Message text
NotificationType	NVARCHAR(50)	Info, Warning, Error
IsRead	BIT	Has been read?
ReadAt	DATETIME2	When read
Views
vw_PlayerHierarchy

Complete hierarchy for each player.

vw_ActivePlayerSchedules

All active schedules applicable to each player.

vw_SitePlayerCount

Count of players per site with status.

vw_CustomerAnalytics

Customer-level statistics and usage.

Stored Procedures
sp_GetPlayerSchedule

Gets the highest-priority schedule for a player considering hierarchy.

Logic:

Check for player-specific schedule
If none, check site-level schedule
If none, check customer-level schedule
Return highest priority match
sp_GetSitePlayers

Returns all players for a site with current status.

sp_AssignScheduleToSite

Assigns a schedule to all players at a site.

sp_AssignScheduleToCustomer

Assigns a schedule to all sites and players for a customer.

Common Queries
Get all players for a customer
Get sites by customer with player counts
Find applicable schedule for player
Example Data Structure
Security Considerations
Row-Level Security

Filter all queries by CustomerId to ensure complete data isolation:

Site Manager Role

Users with SiteManager role can only see/edit their assigned site:

Performance Optimization
Critical Indexes
Customers(CustomerId) - Primary key
Sites(CustomerId, SiteId) - Hierarchical lookups
Players(SiteId, PlayerId) - Hierarchical lookups
Players(Status, LastHeartbeat) - Status queries
ScheduleAssignments(AssignmentType, TargetCustomerId, TargetSiteId, TargetPlayerId) - Schedule resolution
Query Patterns

Always filter top-down:

Migration from Flat Structure

If migrating from Organization → Player flat structure:

Scalability Considerations
Horizontal Scaling
Partition PlayerLogs by CustomerId
Partition ProofOfPlay by CustomerId
Separate read replicas per region
Vertical Scaling Path
Basic: 1-10 customers, 100 players
Standard: 10-100 customers, 1000 players
Premium: 100+ customers, 10,000+ players
Next Steps
Run schema creation script
Insert sample customer/site/player hierarchy
Test schedule resolution logic
Build API endpoints respecting hierarchy
Implement row-level security
Set up monitoring and alerts