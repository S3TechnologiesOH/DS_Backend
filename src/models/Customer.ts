/**
 * Customer Model
 *
 * Top-level organizations (clients) in the multi-tenant system.
 */

export interface Customer {
  customerId: number;
  name: string;
  subdomain: string;
  isActive: boolean;
  subscriptionTier: 'Free' | 'Pro' | 'Enterprise';
  maxSites: number;
  maxPlayers: number;
  maxStorageGB: number;
  contactEmail: string;
  contactPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  name: string;
  subdomain: string;
  subscriptionTier?: 'Free' | 'Pro' | 'Enterprise';
  maxSites?: number;
  maxPlayers?: number;
  maxStorageGB?: number;
  contactEmail: string;
  contactPhone?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  subdomain?: string;
  isActive?: boolean;
  subscriptionTier?: 'Free' | 'Pro' | 'Enterprise';
  maxSites?: number;
  maxPlayers?: number;
  maxStorageGB?: number;
  contactEmail?: string;
  contactPhone?: string;
}
