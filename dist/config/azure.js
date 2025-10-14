"use strict";
/**
 * Azure Blob Storage Configuration
 *
 * Configuration for Azure Blob Storage service used for media files.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.azureConfig = exports.getContainerClient = exports.getBlobServiceClient = exports.initializeBlobStorage = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const environment_1 = require("./environment");
const logger_1 = __importDefault(require("../utils/logger"));
let blobServiceClient = null;
/**
 * Initialize Azure Blob Storage client
 */
const initializeBlobStorage = () => {
    try {
        if (!blobServiceClient) {
            blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(environment_1.env.AZURE_STORAGE_CONNECTION_STRING);
            logger_1.default.info('Azure Blob Storage client initialized');
        }
        return blobServiceClient;
    }
    catch (error) {
        logger_1.default.error('Failed to initialize Azure Blob Storage client', { error });
        throw error;
    }
};
exports.initializeBlobStorage = initializeBlobStorage;
/**
 * Get Azure Blob Storage client instance
 */
const getBlobServiceClient = () => {
    if (!blobServiceClient) {
        return (0, exports.initializeBlobStorage)();
    }
    return blobServiceClient;
};
exports.getBlobServiceClient = getBlobServiceClient;
/**
 * Get container client for media storage
 */
const getContainerClient = () => {
    const blobService = (0, exports.getBlobServiceClient)();
    return blobService.getContainerClient(environment_1.env.AZURE_STORAGE_CONTAINER);
};
exports.getContainerClient = getContainerClient;
exports.azureConfig = {
    containerName: environment_1.env.AZURE_STORAGE_CONTAINER,
    connectionString: environment_1.env.AZURE_STORAGE_CONNECTION_STRING,
};
//# sourceMappingURL=azure.js.map