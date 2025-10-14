/**
 * Playlist Models
 *
 * Collections of content items (customer-level).
 */

export type TransitionType = 'Fade' | 'Slide' | 'None';

export interface Playlist {
  playlistId: number;
  customerId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistItem {
  playlistItemId: number;
  playlistId: number;
  contentId: number;
  displayOrder: number;
  duration: number | null;
  transitionType: TransitionType;
  transitionDuration: number;
  createdAt: Date;
}

export interface CreatePlaylistDto {
  customerId: number;
  name: string;
  description?: string;
  createdBy: number;
}

export interface UpdatePlaylistDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AddPlaylistItemDto {
  playlistId: number;
  contentId: number;
  displayOrder: number;
  duration?: number;
  transitionType?: TransitionType;
  transitionDuration?: number;
}

export interface UpdatePlaylistItemDto {
  displayOrder?: number;
  duration?: number;
  transitionType?: TransitionType;
  transitionDuration?: number;
}

export interface PlaylistWithItems extends Playlist {
  items: (PlaylistItem & { content: { name: string; contentType: string } })[];
}
