/**
 * Site Model
 *
 * Physical locations belonging to customers (stores, offices, venues).
 */

export interface Site {
  siteId: number;
  customerId: number;
  name: string;
  siteCode: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timeZone: string;
  isActive: boolean;
  openingHours: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSiteDto {
  customerId: number;
  name: string;
  siteCode: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
  openingHours?: string;
}

export interface UpdateSiteDto {
  name?: string;
  siteCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
  isActive?: boolean;
  openingHours?: string;
}
