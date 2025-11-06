-- =============================================
-- Migration 004: Add New Widget Types
-- =============================================
-- This script updates the LayoutLayers table CHECK constraint
-- to accept the 3 new widget types:
--   - scrolling-text
--   - background-image
--   - webpage
--
-- Run this in Azure Portal → SQL Database → Query Editor
-- =============================================

BEGIN TRANSACTION;

BEGIN TRY
    -- Step 1: Drop existing CHECK constraint
    PRINT 'Dropping existing CK_LayoutLayers_Type constraint...';
    ALTER TABLE LayoutLayers
    DROP CONSTRAINT CK_LayoutLayers_Type;
    PRINT '✓ Old constraint dropped';

    -- Step 2: Recreate constraint with all 15 widget types
    PRINT 'Creating new constraint with 15 widget types...';
    ALTER TABLE LayoutLayers
    ADD CONSTRAINT CK_LayoutLayers_Type CHECK (LayerType IN (
        'text',
        'scrolling-text',      -- ✅ NEW
        'image',
        'background-image',    -- ✅ NEW
        'video',
        'playlist',
        'html',
        'iframe',
        'webpage',             -- ✅ NEW
        'weather',
        'rss',
        'news',
        'youtube',
        'clock',
        'shape'
    ));
    PRINT '✓ New constraint created';

    -- Step 3: Record migration in Migrations table
    PRINT 'Recording migration...';

    -- Ensure Migrations table exists
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Migrations')
    BEGIN
        CREATE TABLE Migrations (
            Id NVARCHAR(255) PRIMARY KEY,
            Name NVARCHAR(500) NOT NULL,
            AppliedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
        );
        PRINT '✓ Migrations table created';
    END

    -- Insert migration record
    INSERT INTO Migrations (Id, Name, AppliedAt)
    VALUES ('004_add_new_widget_types', 'Add New Widget Types', GETUTCDATE());
    PRINT '✓ Migration recorded';

    -- Commit transaction
    COMMIT TRANSACTION;
    PRINT '';
    PRINT '========================================';
    PRINT 'Migration completed successfully!';
    PRINT '========================================';
    PRINT '';
    PRINT 'Widget types now supported:';
    PRINT '  1. text';
    PRINT '  2. scrolling-text      ← NEW';
    PRINT '  3. image';
    PRINT '  4. background-image    ← NEW';
    PRINT '  5. video';
    PRINT '  6. playlist';
    PRINT '  7. html';
    PRINT '  8. iframe';
    PRINT '  9. webpage             ← NEW';
    PRINT ' 10. weather';
    PRINT ' 11. rss';
    PRINT ' 12. news';
    PRINT ' 13. youtube';
    PRINT ' 14. clock';
    PRINT ' 15. shape';

END TRY
BEGIN CATCH
    -- Rollback on error
    ROLLBACK TRANSACTION;

    PRINT '';
    PRINT '========================================';
    PRINT 'ERROR: Migration failed!';
    PRINT '========================================';
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS NVARCHAR(10));

    -- Re-throw error
    THROW;
END CATCH;

GO

-- =============================================
-- Verification Queries (Optional - Run after)
-- =============================================

-- Check migration status
SELECT * FROM Migrations ORDER BY AppliedAt DESC;

-- Verify new constraint
SELECT
    CONSTRAINT_NAME,
    CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
WHERE CONSTRAINT_NAME = 'CK_LayoutLayers_Type';

-- Test insert (will be rolled back automatically)
BEGIN TRANSACTION;
    INSERT INTO LayoutLayers (
        LayoutId, LayerName, LayerType, Width, Height,
        PositionX, PositionY
    )
    VALUES (1, 'Test Scrolling Text', 'scrolling-text', 400, 100, 0, 0);

    PRINT 'Test insert successful - scrolling-text widget type is accepted!';
ROLLBACK TRANSACTION;

PRINT 'Verification complete!';
