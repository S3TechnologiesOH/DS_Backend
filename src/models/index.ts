/**
 * Model Exports
 *
 * Central export point for all model interfaces and types.
 */

export * from './Customer';
export * from './Site';
export * from './Player';
export * from './User';
export * from './Content';
export * from './Layout';
export * from './Playlist';
export * from './Schedule';
export * from './Analytics';
export * from './Webhook';
export * from './PlayerToken';
export * from './ProofOfPlay';

// Additional supporting models

export interface PlayerLog {
  logId: number;
  playerId: number;
  logLevel: 'Info' | 'Warning' | 'Error' | 'Critical';
  message: string;
  eventType: string | null;
  eventData: string | null;
  createdAt: Date;
}

export interface UserSession {
  sessionId: number;
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface AuditLog {
  auditId: number;
  userId: number | null;
  customerId: number;
  tableName: string;
  recordId: number;
  action: 'Create' | 'Update' | 'Delete';
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

export interface SystemSetting {
  settingId: number;
  customerId: number | null;
  settingKey: string;
  settingValue: string | null;
  dataType: 'String' | 'Integer' | 'Boolean' | 'JSON';
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  notificationId: number;
  customerId: number;
  userId: number | null;
  siteId: number | null;
  playerId: number | null;
  title: string;
  message: string;
  notificationType: 'Info' | 'Warning' | 'Error';
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}
