/**
 * Helper Utility Functions for Digital Signage Platform
 *
 * Common utility functions used throughout the application.
 */

import { format, parseISO } from 'date-fns';

/**
 * Convert database PascalCase column names to camelCase object keys
 */
export const toCamelCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Convert camelCase object keys to PascalCase for database columns
 */
export const toPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Transform database result object keys from PascalCase to camelCase
 */
export const transformKeys = <T>(obj: Record<string, unknown>): T => {
  const transformed: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      transformed[toCamelCase(key)] = obj[key];
    }
  }

  return transformed as T;
};

/**
 * Transform array of database result objects
 */
export const transformKeysArray = <T>(arr: Record<string, unknown>[]): T[] => {
  return arr.map((obj) => transformKeys<T>(obj));
};

/**
 * Format date to ISO string for database storage
 */
export const toISOString = (date: Date | string): string => {
  if (typeof date === 'string') {
    return parseISO(date).toISOString();
  }
  return date.toISOString();
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Check if a value is a valid UUID (v4)
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Generate a random string (for tokens, etc.)
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Sleep/delay function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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

export const paginate = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginationResult<T> => {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  return {
    data: paginatedData,
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  };
};

/**
 * Parse pagination parameters from query string
 */
export const parsePaginationParams = (query: {
  page?: string;
  limit?: string;
}): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));

  return { page, limit };
};

/**
 * Check if player is online based on last heartbeat
 */
export const isPlayerOnline = (lastHeartbeat: Date | null, timeoutMinutes: number = 5): boolean => {
  if (!lastHeartbeat) return false;

  const now = new Date();
  const heartbeatDate = typeof lastHeartbeat === 'string' ? parseISO(lastHeartbeat) : lastHeartbeat;
  const diffMinutes = (now.getTime() - heartbeatDate.getTime()) / (1000 * 60);

  return diffMinutes <= timeoutMinutes;
};

/**
 * Sanitize filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Validate MIME type against allowed types
 */
export const isAllowedMimeType = (mimeType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimeType);
};
