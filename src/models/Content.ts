/**
 * Content Model
 *
 * Media files and content library (customer-level).
 */

export type ContentType = 'Image' | 'Video' | 'HTML' | 'URL' | 'PDF';
export type ContentStatus = 'Processing' | 'Ready' | 'Failed';

export interface Content {
  contentId: number;
  customerId: number;
  name: string;
  description: string | null;
  contentType: ContentType;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  fileSize: number | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  status: ContentStatus;
  uploadedBy: number;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContentDto {
  customerId: number;
  name: string;
  description?: string;
  contentType: ContentType;
  fileUrl?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  duration?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  uploadedBy: number;
  tags?: string;
}

export interface UpdateContentDto {
  name?: string;
  description?: string;
  contentType?: ContentType;
  duration?: number;
  status?: ContentStatus;
  tags?: string;
}

export interface UploadContentDto {
  name: string;
  description?: string;
  contentType: ContentType;
  tags?: string;
  file: Express.Multer.File;
}
