/**
 * Player Model
 *
 * Individual screens/devices at sites.
 */

export interface Player {
  playerId: number;
  siteId: number;
  name: string;
  playerCode: string;
  macAddress: string | null;
  serialNumber: string | null;
  location: string | null;
  screenResolution: string | null;
  orientation: 'Landscape' | 'Portrait';
  status: 'Online' | 'Offline' | 'Error';
  lastHeartbeat: Date | null;
  ipAddress: string | null;
  playerVersion: string | null;
  osVersion: string | null;
  isActive: boolean;
  activationCode: string | null;
  activationCodeExpiresAt: Date | null;
  activatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customerId?: number; // Optional, only populated when needed
}

export interface CreatePlayerDto {
  siteId: number;
  name: string;
  playerCode: string;
  macAddress?: string;
  serialNumber?: string;
  location?: string;
  screenResolution?: string;
  orientation?: 'Landscape' | 'Portrait';
}

export interface UpdatePlayerDto {
  name?: string;
  playerCode?: string;
  macAddress?: string;
  serialNumber?: string;
  location?: string;
  screenResolution?: string;
  orientation?: 'Landscape' | 'Portrait';
  status?: 'Online' | 'Offline' | 'Error';
  ipAddress?: string;
  playerVersion?: string;
  osVersion?: string;
  isActive?: boolean;
}

export interface PlayerHeartbeatDto {
  playerId: number;
  status: 'Online' | 'Offline' | 'Error';
  ipAddress?: string;
  playerVersion?: string;
  osVersion?: string;
}
