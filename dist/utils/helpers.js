"use strict";
/**
 * Helper Utility Functions for Digital Signage Platform
 *
 * Common utility functions used throughout the application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedMimeType = exports.getFileExtension = exports.sanitizeFilename = exports.isPlayerOnline = exports.parsePaginationParams = exports.paginate = exports.sleep = exports.generateRandomString = exports.isValidUUID = exports.formatDate = exports.toISOString = exports.transformKeysArray = exports.transformKeys = exports.toPascalCase = exports.toCamelCase = void 0;
const date_fns_1 = require("date-fns");
/**
 * Convert database PascalCase column names to camelCase object keys
 */
const toCamelCase = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.toCamelCase = toCamelCase;
/**
 * Convert camelCase object keys to PascalCase for database columns
 */
const toPascalCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.toPascalCase = toPascalCase;
/**
 * Transform database result object keys from PascalCase to camelCase
 */
const transformKeys = (obj) => {
    const transformed = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            transformed[(0, exports.toCamelCase)(key)] = obj[key];
        }
    }
    return transformed;
};
exports.transformKeys = transformKeys;
/**
 * Transform array of database result objects
 */
const transformKeysArray = (arr) => {
    return arr.map((obj) => (0, exports.transformKeys)(obj));
};
exports.transformKeysArray = transformKeysArray;
/**
 * Format date to ISO string for database storage
 */
const toISOString = (date) => {
    if (typeof date === 'string') {
        return (0, date_fns_1.parseISO)(date).toISOString();
    }
    return date.toISOString();
};
exports.toISOString = toISOString;
/**
 * Format date for display
 */
const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
    const dateObj = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : date;
    return (0, date_fns_1.format)(dateObj, formatStr);
};
exports.formatDate = formatDate;
/**
 * Check if a value is a valid UUID (v4)
 */
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
/**
 * Generate a random string (for tokens, etc.)
 */
const generateRandomString = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
/**
 * Sleep/delay function for async operations
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const paginate = (data, page = 1, limit = 10) => {
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
exports.paginate = paginate;
/**
 * Parse pagination parameters from query string
 */
const parsePaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    return { page, limit };
};
exports.parsePaginationParams = parsePaginationParams;
/**
 * Check if player is online based on last heartbeat
 */
const isPlayerOnline = (lastHeartbeat, timeoutMinutes = 5) => {
    if (!lastHeartbeat)
        return false;
    const now = new Date();
    const heartbeatDate = typeof lastHeartbeat === 'string' ? (0, date_fns_1.parseISO)(lastHeartbeat) : lastHeartbeat;
    const diffMinutes = (now.getTime() - heartbeatDate.getTime()) / (1000 * 60);
    return diffMinutes <= timeoutMinutes;
};
exports.isPlayerOnline = isPlayerOnline;
/**
 * Sanitize filename for safe storage
 */
const sanitizeFilename = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
};
exports.sanitizeFilename = sanitizeFilename;
/**
 * Get file extension from filename
 */
const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};
exports.getFileExtension = getFileExtension;
/**
 * Validate MIME type against allowed types
 */
const isAllowedMimeType = (mimeType, allowedTypes) => {
    return allowedTypes.includes(mimeType);
};
exports.isAllowedMimeType = isAllowedMimeType;
//# sourceMappingURL=helpers.js.map