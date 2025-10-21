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
export declare const name = "Fix Architecture - Content->Playlists->Layouts->Schedules";
export declare const up: () => Promise<void>;
export declare const down: () => Promise<void>;
//# sourceMappingURL=003_fix_architecture.d.ts.map