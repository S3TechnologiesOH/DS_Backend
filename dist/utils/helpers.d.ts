/**
 * Helper Utility Functions for Digital Signage Platform
 *
 * Common utility functions used throughout the application.
 */
/**
 * Convert database PascalCase column names to camelCase object keys
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Convert camelCase object keys to PascalCase for database columns
 */
export declare const toPascalCase: (str: string) => string;
/**
 * Transform database result object keys from PascalCase to camelCase
 */
export declare const transformKeys: <T>(obj: Record<string, unknown>) => T;
/**
 * Transform array of database result objects
 */
export declare const transformKeysArray: <T>(arr: Record<string, unknown>[]) => T[];
/**
 * Format date to ISO string for database storage
 */
export declare const toISOString: (date: Date | string) => string;
/**
 * Format date for display
 */
export declare const formatDate: (date: Date | string, formatStr?: string) => string;
/**
 * Check if a value is a valid UUID (v4)
 */
export declare const isValidUUID: (uuid: string) => boolean;
/**
 * Generate a random string (for tokens, etc.)
 */
export declare const generateRandomString: (length?: number) => string;
/**
 * Sleep/delay function for async operations
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Paginate an array
 */
export interface PaginationResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare const paginate: <T>(data: T[], page?: number, limit?: number) => PaginationResult<T>;
/**
 * Parse pagination parameters from query string
 */
export declare const parsePaginationParams: (query: {
    page?: string;
    limit?: string;
}) => {
    page: number;
    limit: number;
};
/**
 * Check if player is online based on last heartbeat
 */
export declare const isPlayerOnline: (lastHeartbeat: Date | null, timeoutMinutes?: number) => boolean;
/**
 * Sanitize filename for safe storage
 */
export declare const sanitizeFilename: (filename: string) => string;
/**
 * Get file extension from filename
 */
export declare const getFileExtension: (filename: string) => string;
/**
 * Validate MIME type against allowed types
 */
export declare const isAllowedMimeType: (mimeType: string, allowedTypes: string[]) => boolean;
//# sourceMappingURL=helpers.d.ts.map