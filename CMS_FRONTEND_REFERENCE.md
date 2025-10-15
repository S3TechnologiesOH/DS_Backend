# Digital Signage Platform - CMS Frontend Development Reference

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Technology Recommendations](#architecture--technology-recommendations)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Models & Relationships](#data-models--relationships)
5. [API Integration Guide](#api-integration-guide)
6. [User Interface Components](#user-interface-components)
7. [Role-Based Access Control](#role-based-access-control)
8. [Multi-Tenancy Implementation](#multi-tenancy-implementation)
9. [File Upload & Media Management](#file-upload--media-management)
10. [Real-Time Features](#real-time-features)
11. [Best Practices & Security](#best-practices--security)

---

## Overview

This document provides comprehensive guidance for building a Content Management System (CMS) frontend for the Digital Signage Platform. The platform follows a three-tier hierarchy: **Customer → Site → Player**.

### Platform Purpose
Manage digital signage content across multiple organizations (customers), their physical locations (sites), and individual display devices (players).

### API Base URL
```
http://localhost:3000/api/v1
```

### Key Features to Implement
- Multi-tenant customer management
- Site and player configuration
- Content library with file uploads
- Playlist creation and management
- Schedule planning with priority-based assignments
- Real-time player status monitoring
- Analytics and proof-of-play reporting
- Webhook configuration for integrations

---

## Architecture & Technology Recommendations

### Recommended Frontend Stack

**Framework Options:**
- **React** with TypeScript (recommended)
- **Vue 3** with TypeScript
- **Next.js** for server-side rendering

**State Management:**
- React Query (TanStack Query) for API data
- Zustand or Redux Toolkit for global state
- Context API for authentication state

**UI Component Libraries:**
- Material-UI (MUI)
- Ant Design
- Shadcn/ui + Tailwind CSS

**Form Management:**
- React Hook Form
- Zod for validation (matching backend)

**File Upload:**
- react-dropzone
- Uppy

**Date/Time:**
- date-fns (matches backend)
- react-datepicker

**Routing:**
- React Router v6
- TanStack Router

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Buttons, inputs, modals
│   ├── customers/       # Customer-specific components
│   ├── sites/           # Site management components
│   ├── players/         # Player status and config
│   ├── content/         # Media library components
│   ├── playlists/       # Playlist builder
│   └── schedules/       # Schedule calendar/timeline
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
├── contexts/            # React contexts (auth, theme)
├── stores/              # State management stores
└── constants/           # Constants and enums
```

---

## Authentication & Authorization

### User Roles
```typescript
type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'SiteManager';
```

**Role Descriptions:**
- **Admin**: Platform super-admin, can manage all customers
- **Editor**: Can create/edit content, playlists, and schedules
- **Viewer**: Read-only access
- **SiteManager**: Restricted to a specific site (assignedSiteId)

### Authentication Flow

#### 1. Login
```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  subdomain: string; // Multi-tenant identifier
}

interface LoginResponse {
  status: 'success';
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      customerId: number;
      assignedSiteId: number | null;
    };
  };
}
```

**Implementation Steps:**
1. User enters email, password, and subdomain
2. POST to `/auth/login`
3. Store `accessToken` in memory (React state)
4. Store `refreshToken` in httpOnly cookie or secure localStorage
5. Store user info in global state
6. Redirect based on role

#### 2. Token Refresh
```typescript
// POST /api/v1/auth/refresh
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  status: 'success';
  data: {
    accessToken: string;
  };
}
```

**Implementation:**
- Implement automatic token refresh when access token expires (401 response)
- Use axios interceptors or fetch middleware

#### 3. Get Current User
```typescript
// GET /api/v1/auth/me
// Headers: Authorization: Bearer {accessToken}

interface CurrentUserResponse {
  status: 'success';
  data: User;
}
```

### Authorization Middleware (Frontend)

```typescript
// Example: Protect admin-only routes
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user.role !== 'Admin') {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

// Usage in router
<Route path="/customers" element={<RequireAdmin><CustomersPage /></RequireAdmin>} />
```

### Logout
```typescript
// POST /api/v1/auth/logout
// Clear tokens and redirect to login
```

---

## Data Models & Relationships

### Entity Relationship Overview
```
Customer (1) ──┬─→ (N) Sites
               ├─→ (N) Users
               ├─→ (N) Content
               ├─→ (N) Playlists
               ├─→ (N) Schedules
               └─→ (N) Webhooks

Site (1) ──┬─→ (N) Players
           └─→ (N) Schedule Assignments

Player (1) ──┬─→ (N) Player Logs
             ├─→ (N) Proof of Play Records
             └─→ (N) Schedule Assignments

Playlist (1) ──→ (N) Playlist Items ←─ (N) Content

Schedule (1) ──→ (N) Schedule Assignments
```

### TypeScript Interfaces

#### Customer
```typescript
interface Customer {
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
  createdAt: string; // ISO date
  updatedAt: string;
}

interface CreateCustomerDto {
  name: string;
  subdomain: string; // Unique, lowercase, alphanumeric + hyphens
  subscriptionTier?: 'Free' | 'Pro' | 'Enterprise';
  contactEmail: string;
  contactPhone?: string;
  maxSites?: number;
  maxPlayers?: number;
  maxStorageGB?: number;
}
```

#### Site
```typescript
interface Site {
  siteId: number;
  customerId: number;
  name: string;
  siteCode: string; // Unique within customer
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timeZone: string; // e.g., "America/New_York"
  isActive: boolean;
  openingHours: string | null; // JSON or structured format
  createdAt: string;
  updatedAt: string;
}

interface CreateSiteDto {
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
```

#### Player
```typescript
interface Player {
  playerId: number;
  siteId: number;
  name: string;
  playerCode: string;
  macAddress: string | null;
  serialNumber: string | null;
  location: string | null; // Within site (e.g., "Entrance", "Checkout")
  screenResolution: string | null; // e.g., "1920x1080"
  orientation: 'Landscape' | 'Portrait';
  status: 'Online' | 'Offline' | 'Error';
  lastHeartbeat: string | null; // ISO timestamp
  ipAddress: string | null;
  playerVersion: string | null;
  osVersion: string | null;
  isActive: boolean;
  activationCode: string | null;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlayerDto {
  siteId: number;
  name: string;
  playerCode: string;
  location?: string;
  screenResolution?: string;
  orientation?: 'Landscape' | 'Portrait';
}
```

#### User
```typescript
interface User {
  userId: number;
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'SiteManager';
  isActive: boolean;
  assignedSiteId: number | null; // Required for SiteManager role
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserDto {
  customerId: number;
  email: string;
  password: string; // Min 8 chars, must have uppercase, lowercase, number, special char
  firstName: string;
  lastName: string;
  role: UserRole;
  assignedSiteId?: number; // Required if role is SiteManager
}
```

#### Content
```typescript
type ContentType = 'Image' | 'Video' | 'HTML' | 'URL' | 'PDF';
type ContentStatus = 'Processing' | 'Ready' | 'Failed';

interface Content {
  contentId: number;
  customerId: number;
  name: string;
  description: string | null;
  contentType: ContentType;
  fileUrl: string | null; // Azure Blob Storage URL
  thumbnailUrl: string | null;
  fileSize: number | null; // Bytes
  duration: number | null; // Seconds (for video)
  width: number | null; // Pixels
  height: number | null;
  mimeType: string | null;
  status: ContentStatus;
  uploadedBy: number; // User ID
  tags: string | null; // Comma-separated
  createdAt: string;
  updatedAt: string;
}

interface CreateContentDto {
  customerId: number;
  name: string;
  description?: string;
  contentType: ContentType;
  uploadedBy: number;
  tags?: string;
  // File upload handled separately via multipart/form-data
}
```

#### Playlist
```typescript
type TransitionType = 'Fade' | 'Slide' | 'None';

interface Playlist {
  playlistId: number;
  customerId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistItem {
  playlistItemId: number;
  playlistId: number;
  contentId: number;
  displayOrder: number; // 1, 2, 3...
  duration: number | null; // Override content duration (seconds)
  transitionType: TransitionType;
  transitionDuration: number; // Milliseconds
  createdAt: string;
}

interface PlaylistWithItems extends Playlist {
  items: (PlaylistItem & {
    content: {
      name: string;
      contentType: string;
      thumbnailUrl: string;
    }
  })[];
}
```

#### Schedule
```typescript
type AssignmentType = 'Customer' | 'Site' | 'Player';

interface Schedule {
  scheduleId: number;
  customerId: number;
  name: string;
  playlistId: number;
  priority: number; // Higher number = higher priority
  startDate: string | null; // ISO date
  endDate: string | null;
  startTime: string | null; // HH:mm:ss (24-hour)
  endTime: string | null;
  daysOfWeek: string | null; // e.g., "Mon,Tue,Wed,Thu,Fri"
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleAssignment {
  assignmentId: number;
  scheduleId: number;
  assignmentType: AssignmentType;
  targetCustomerId: number | null;
  targetSiteId: number | null;
  targetPlayerId: number | null;
  createdAt: string;
}

interface ScheduleWithAssignments extends Schedule {
  assignments: ScheduleAssignment[];
  playlistName: string;
}
```

### Schedule Priority System
**CRITICAL CONCEPT**: When multiple schedules target the same player, the system resolves conflicts using this priority:

1. **Player-specific schedule** (highest priority)
2. **Site-specific schedule**
3. **Customer-wide schedule** (lowest priority)

Within the same level, the `priority` field is used (higher number wins).

---

## API Integration Guide

### HTTP Client Setup

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### API Service Examples

#### Customer Service
```typescript
// services/customerService.ts
import { apiClient } from './api';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '../types';

export const customerService = {
  // GET /api/v1/customers
  getAll: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get('/customers');
    return data.data;
  },

  // GET /api/v1/customers/:id
  getById: async (id: number): Promise<Customer> => {
    const { data } = await apiClient.get(`/customers/${id}`);
    return data.data;
  },

  // GET /api/v1/customers/:id/limits
  getLimits: async (id: number) => {
    const { data } = await apiClient.get(`/customers/${id}/limits`);
    return data.data;
  },

  // POST /api/v1/customers (Admin only)
  create: async (dto: CreateCustomerDto): Promise<Customer> => {
    const { data } = await apiClient.post('/customers', dto);
    return data.data;
  },

  // PATCH /api/v1/customers/:id (Admin only)
  update: async (id: number, dto: UpdateCustomerDto): Promise<Customer> => {
    const { data } = await apiClient.patch(`/customers/${id}`, dto);
    return data.data;
  },
};
```

#### Site Service
```typescript
// services/siteService.ts
import { apiClient } from './api';
import type { Site, CreateSiteDto, UpdateSiteDto } from '../types';

export const siteService = {
  // GET /api/v1/sites
  getAll: async (): Promise<Site[]> => {
    const { data } = await apiClient.get('/sites');
    return data.data;
  },

  // GET /api/v1/sites/:id
  getById: async (id: number): Promise<Site> => {
    const { data } = await apiClient.get(`/sites/${id}`);
    return data.data;
  },

  // GET /api/v1/sites/customer/:customerId
  getByCustomer: async (customerId: number): Promise<Site[]> => {
    const { data } = await apiClient.get(`/sites/customer/${customerId}`);
    return data.data;
  },

  // POST /api/v1/sites
  create: async (dto: CreateSiteDto): Promise<Site> => {
    const { data } = await apiClient.post('/sites', dto);
    return data.data;
  },

  // PATCH /api/v1/sites/:id
  update: async (id: number, dto: UpdateSiteDto): Promise<Site> => {
    const { data } = await apiClient.patch(`/sites/${id}`, dto);
    return data.data;
  },

  // DELETE /api/v1/sites/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sites/${id}`);
  },
};
```

#### Player Service
```typescript
// services/playerService.ts
import { apiClient } from './api';
import type { Player, CreatePlayerDto, UpdatePlayerDto } from '../types';

export const playerService = {
  // GET /api/v1/players
  getAll: async (): Promise<Player[]> => {
    const { data } = await apiClient.get('/players');
    return data.data;
  },

  // GET /api/v1/players/:id
  getById: async (id: number): Promise<Player> => {
    const { data } = await apiClient.get(`/players/${id}`);
    return data.data;
  },

  // GET /api/v1/players/site/:siteId
  getBySite: async (siteId: number): Promise<Player[]> => {
    const { data } = await apiClient.get(`/players/site/${siteId}`);
    return data.data;
  },

  // GET /api/v1/players/:id/schedule
  getSchedule: async (playerId: number) => {
    const { data } = await apiClient.get(`/players/${playerId}/schedule`);
    return data.data;
  },

  // POST /api/v1/players
  create: async (dto: CreatePlayerDto): Promise<Player> => {
    const { data } = await apiClient.post('/players', dto);
    return data.data;
  },

  // PATCH /api/v1/players/:id
  update: async (id: number, dto: UpdatePlayerDto): Promise<Player> => {
    const { data } = await apiClient.patch(`/players/${id}`, dto);
    return data.data;
  },

  // POST /api/v1/players/:id/regenerate-activation
  regenerateActivation: async (playerId: number) => {
    const { data } = await apiClient.post(`/players/${playerId}/regenerate-activation`);
    return data.data;
  },

  // DELETE /api/v1/players/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/players/${id}`);
  },
};
```

#### Content Service
```typescript
// services/contentService.ts
import { apiClient } from './api';
import type { Content, CreateContentDto, UpdateContentDto } from '../types';

export const contentService = {
  // GET /api/v1/content
  getAll: async (): Promise<Content[]> => {
    const { data } = await apiClient.get('/content');
    return data.data;
  },

  // GET /api/v1/content/:id
  getById: async (id: number): Promise<Content> => {
    const { data } = await apiClient.get(`/content/${id}`);
    return data.data;
  },

  // POST /api/v1/content/upload
  upload: async (file: File, metadata: Partial<CreateContentDto>) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', metadata.name || file.name);
    formData.append('contentType', metadata.contentType || 'Image');

    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.tags) formData.append('tags', metadata.tags);

    const { data } = await apiClient.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // PATCH /api/v1/content/:id
  update: async (id: number, dto: UpdateContentDto): Promise<Content> => {
    const { data } = await apiClient.patch(`/content/${id}`, dto);
    return data.data;
  },

  // DELETE /api/v1/content/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/content/${id}`);
  },
};
```

#### Playlist Service
```typescript
// services/playlistService.ts
import { apiClient } from './api';
import type {
  Playlist,
  PlaylistWithItems,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddPlaylistItemDto,
  UpdatePlaylistItemDto
} from '../types';

export const playlistService = {
  // GET /api/v1/playlists
  getAll: async (): Promise<Playlist[]> => {
    const { data } = await apiClient.get('/playlists');
    return data.data;
  },

  // GET /api/v1/playlists/:id
  getById: async (id: number): Promise<PlaylistWithItems> => {
    const { data } = await apiClient.get(`/playlists/${id}`);
    return data.data;
  },

  // POST /api/v1/playlists
  create: async (dto: CreatePlaylistDto): Promise<Playlist> => {
    const { data } = await apiClient.post('/playlists', dto);
    return data.data;
  },

  // PATCH /api/v1/playlists/:id
  update: async (id: number, dto: UpdatePlaylistDto): Promise<Playlist> => {
    const { data } = await apiClient.patch(`/playlists/${id}`, dto);
    return data.data;
  },

  // DELETE /api/v1/playlists/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/playlists/${id}`);
  },

  // POST /api/v1/playlists/:id/items
  addItem: async (playlistId: number, dto: Omit<AddPlaylistItemDto, 'playlistId'>) => {
    const { data } = await apiClient.post(`/playlists/${playlistId}/items`, dto);
    return data.data;
  },

  // PATCH /api/v1/playlists/:playlistId/items/:itemId
  updateItem: async (
    playlistId: number,
    itemId: number,
    dto: UpdatePlaylistItemDto
  ) => {
    const { data } = await apiClient.patch(
      `/playlists/${playlistId}/items/${itemId}`,
      dto
    );
    return data.data;
  },

  // DELETE /api/v1/playlists/:playlistId/items/:itemId
  deleteItem: async (playlistId: number, itemId: number): Promise<void> => {
    await apiClient.delete(`/playlists/${playlistId}/items/${itemId}`);
  },

  // PUT /api/v1/playlists/:id/items/reorder
  reorderItems: async (playlistId: number, itemIds: number[]) => {
    const { data } = await apiClient.put(`/playlists/${playlistId}/items/reorder`, {
      itemIds,
    });
    return data.data;
  },
};
```

#### Schedule Service
```typescript
// services/scheduleService.ts
import { apiClient } from './api';
import type {
  Schedule,
  ScheduleWithAssignments,
  CreateScheduleDto,
  UpdateScheduleDto,
  CreateScheduleAssignmentDto
} from '../types';

export const scheduleService = {
  // GET /api/v1/schedules
  getAll: async (): Promise<Schedule[]> => {
    const { data } = await apiClient.get('/schedules');
    return data.data;
  },

  // GET /api/v1/schedules/:id
  getById: async (id: number): Promise<ScheduleWithAssignments> => {
    const { data } = await apiClient.get(`/schedules/${id}`);
    return data.data;
  },

  // POST /api/v1/schedules
  create: async (dto: CreateScheduleDto): Promise<Schedule> => {
    const { data } = await apiClient.post('/schedules', dto);
    return data.data;
  },

  // PATCH /api/v1/schedules/:id
  update: async (id: number, dto: UpdateScheduleDto): Promise<Schedule> => {
    const { data } = await apiClient.patch(`/schedules/${id}`, dto);
    return data.data;
  },

  // DELETE /api/v1/schedules/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`);
  },

  // POST /api/v1/schedules/:id/assignments
  addAssignment: async (
    scheduleId: number,
    dto: Omit<CreateScheduleAssignmentDto, 'scheduleId'>
  ) => {
    const { data } = await apiClient.post(`/schedules/${scheduleId}/assignments`, dto);
    return data.data;
  },

  // DELETE /api/v1/schedules/:scheduleId/assignments/:assignmentId
  deleteAssignment: async (scheduleId: number, assignmentId: number): Promise<void> => {
    await apiClient.delete(`/schedules/${scheduleId}/assignments/${assignmentId}`);
  },
};
```

#### Analytics Service
```typescript
// services/analyticsService.ts
import { apiClient } from './api';
import type { AnalyticsFilter } from '../types';

export const analyticsService = {
  // GET /api/v1/analytics/summary
  getSummary: async (filters: AnalyticsFilter) => {
    const { data } = await apiClient.get('/analytics/summary', { params: filters });
    return data.data;
  },

  // GET /api/v1/analytics/content
  getContentAnalytics: async (filters: AnalyticsFilter) => {
    const { data } = await apiClient.get('/analytics/content', { params: filters });
    return data.data;
  },

  // GET /api/v1/analytics/players
  getPlayerAnalytics: async (filters: AnalyticsFilter) => {
    const { data } = await apiClient.get('/analytics/players', { params: filters });
    return data.data;
  },

  // GET /api/v1/analytics/sites
  getSiteAnalytics: async (filters: AnalyticsFilter) => {
    const { data } = await apiClient.get('/analytics/sites', { params: filters });
    return data.data;
  },

  // GET /api/v1/analytics/playback-report
  getPlaybackReport: async (filters: AnalyticsFilter) => {
    const { data } = await apiClient.get('/analytics/playback-report', {
      params: filters
    });
    return data.data;
  },
};
```

### React Query Hooks

```typescript
// hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import type { CreateCustomerDto, UpdateCustomerDto } from '../types';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
  });
};

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCustomerDto) => customerService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCustomerDto }) =>
      customerService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
};
```

---

## User Interface Components

### 1. Dashboard

**Admin Dashboard** (Platform-level):
- Total customers count
- Total sites and players across all customers
- System-wide statistics
- Recent activity feed
- Alert notifications (offline players, failed content)

**Customer Dashboard** (Tenant-level):
- Sites overview (count, status)
- Players overview (online/offline/error counts)
- Recent content uploads
- Top performing content (most played)
- Schedule calendar view
- Storage usage meter

**Visual Components:**
- KPI cards (total sites, total players, online percentage)
- Line chart (playback trends over time)
- Map view (sites with geo-coordinates)
- Recent activity timeline

### 2. Customer Management (Admin Only)

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│ Customers                                    [+ New Customer]│
├─────────────────────────────────────────────────────────────┤
│ Search: [_____________]  Filter: [All ▼]  Tier: [All ▼]     │
├──────┬──────────────┬────────────┬──────────┬──────┬────────┤
│ Name │ Subdomain    │ Tier       │ Sites    │ Active│ Actions│
├──────┼──────────────┼────────────┼──────────┼──────┼────────┤
│ Acme │ acme         │ Enterprise │ 45/50    │ ✓    │ Edit   │
│ Corp │              │            │          │      │ View   │
├──────┼──────────────┼────────────┼──────────┼──────┼────────┤
│ Beta │ beta-retail  │ Pro        │ 8/10     │ ✓    │ Edit   │
│ Ltd  │              │            │          │      │ View   │
└──────┴──────────────┴────────────┴──────────┴──────┴────────┘
```

**Create/Edit Customer Form:**
- Name (required)
- Subdomain (required, unique, lowercase)
- Subscription tier dropdown
- Contact email (required)
- Contact phone (optional)
- Resource limits: Max sites, max players, max storage (GB)
- Active status toggle

**Validation:**
- Subdomain: Lowercase, alphanumeric, hyphens only, 3-50 chars
- Email: Valid email format
- Resource limits: Positive integers

### 3. Site Management

**List View (Hierarchical):**
```
Customer: Acme Corp
┌─────────────────────────────────────────────────────────────┐
│ Sites                                            [+ New Site]│
├─────────────────────────────────────────────────────────────┤
│ Search: [_____________]  Status: [All ▼]  Sort: [Name ▼]    │
├──────────────┬────────────┬───────────────┬────────┬────────┤
│ Name         │ Code       │ Location      │ Players│ Actions│
├──────────────┼────────────┼───────────────┼────────┼────────┤
│ NYC Store #1 │ NYC-001    │ New York, NY  │ 5 🟢 3 │ Edit   │
│              │            │               │   🔴 1 │ View   │
├──────────────┼────────────┼───────────────┼────────┼────────┤
│ LA Warehouse │ LA-WH-01   │ Los Angeles   │ 2 🟢   │ Edit   │
│              │            │               │        │ View   │
└──────────────┴────────────┴───────────────┴────────┴────────┘
```

**Create/Edit Site Form:**
- Customer selection (dropdown) - for Admins only
- Name (required)
- Site code (required, unique within customer)
- Address, City, State, Country, Postal code (optional)
- Latitude/Longitude (optional, for map view)
- Time zone (dropdown with common zones)
- Opening hours (optional, time range picker)
- Active status toggle

**Map View:**
- Display sites on an interactive map using latitude/longitude
- Cluster markers for nearby sites
- Click marker to view site details and player status

### 4. Player Management

**Grid View:**
```
Site: NYC Store #1
┌──────────────────────────────────────────────────────────────┐
│ Players                                       [+ Add Player]  │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│ │ 🟢 Online      │  │ 🟢 Online      │  │ 🔴 Offline     │  │
│ │ Entrance       │  │ Checkout #1    │  │ Back Wall      │  │
│ │ Display        │  │                │  │ Display        │  │
│ │                │  │                │  │                │  │
│ │ NYC-001-ENT    │  │ NYC-001-CHK1   │  │ NYC-001-BACK   │  │
│ │ 1920x1080      │  │ 1920x1080      │  │ 3840x2160      │  │
│ │ Last seen: 2m  │  │ Last seen: 1m  │  │ Last seen: 3h  │  │
│ │ [View] [Edit]  │  │ [View] [Edit]  │  │ [View] [Edit]  │  │
│ └────────────────┘  └────────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Player Details Modal/Page:**
- Status indicator (Online/Offline/Error)
- Last heartbeat timestamp
- IP address
- MAC address, Serial number
- Screen resolution and orientation
- Player version, OS version
- Activation code (with regenerate button)
- Current schedule (what's playing now)
- Player logs (recent activity)
- Actions: Reboot, Update settings, Deactivate

**Status Logic:**
- **Online**: Last heartbeat < 5 minutes ago
- **Offline**: Last heartbeat 5-60 minutes ago
- **Error**: Status explicitly set to Error, or offline > 60 minutes

**Create/Edit Player Form:**
- Site selection (dropdown)
- Name (required)
- Player code (required, unique)
- Location within site (optional)
- Screen resolution (optional)
- Orientation: Landscape/Portrait
- Hardware info: MAC address, Serial number (optional)
- Active status toggle

### 5. Content Library

**Grid View with Thumbnails:**
```
┌──────────────────────────────────────────────────────────────┐
│ Content Library                             [+ Upload Content]│
├──────────────────────────────────────────────────────────────┤
│ Search: [_____________]  Type: [All ▼]  Tags: [_________]    │
├──────────────────────────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│ │ [Image] │  │ [Video] │  │ [PDF]   │  │ [HTML]  │          │
│ │ Summer  │  │ Product │  │ Menu    │  │ Weather │          │
│ │ Promo   │  │ Demo    │  │ Board   │  │ Widget  │          │
│ │         │  │         │  │         │  │         │          │
│ │ 🟢 Ready│  │ 🟢 Ready│  │ 🟢 Ready│  │ 🟠 Proc │          │
│ │ 2.3 MB  │  │ 45 MB   │  │ 1.1 MB  │  │ -       │          │
│ │ 1920x   │  │ 30s     │  │ -       │  │ -       │          │
│ │  1080   │  │         │  │         │  │         │          │
│ └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└──────────────────────────────────────────────────────────────┘
```

**Upload Content Modal:**
- Drag-and-drop file upload zone
- File picker button
- Content name input (auto-fill from filename)
- Description textarea
- Content type selector (Image/Video/HTML/URL/PDF)
- Tags input (comma-separated or tag picker)
- Upload progress bar
- Thumbnail auto-generation

**Supported MIME Types:**
- **Image**: image/jpeg, image/png, image/gif, image/webp
- **Video**: video/mp4, video/webm
- **PDF**: application/pdf
- **HTML**: text/html (upload .html or .zip)
- **URL**: Just a URL input, no file upload

**Content Details:**
- Preview (image, video player, PDF viewer, iframe for HTML/URL)
- Metadata (dimensions, file size, duration, MIME type)
- Usage count (how many playlists use this)
- Edit metadata (name, description, tags)
- Download original file
- Delete (with confirmation, check if in use)

### 6. Playlist Builder

**List View:**
```
┌──────────────────────────────────────────────────────────────┐
│ Playlists                                    [+ New Playlist] │
├──────────────────────────────────────────────────────────────┤
│ Name                 │ Items │ Status │ Created      │ Actions│
├──────────────────────┼───────┼────────┼──────────────┼────────┤
│ Morning Specials     │ 5     │ Active │ Jan 15, 2025 │ Edit   │
│ Afternoon Promotions │ 3     │ Active │ Jan 10, 2025 │ Edit   │
│ Holiday Campaign     │ 8     │ Inactive│ Dec 1, 2024 │ Edit   │
└──────────────────────┴───────┴────────┴──────────────┴────────┘
```

**Playlist Editor (Drag-and-Drop):**
```
┌──────────────────────────────────────────────────────────────┐
│ Edit Playlist: Morning Specials                   [Save]     │
├────────────────────┬─────────────────────────────────────────┤
│ Content Library    │ Playlist Items (Drag to reorder)        │
│ ─────────────────  │ ─────────────────────────────────────── │
│ [Search______]     │ 1. Summer Promo (Image)                 │
│                    │    Duration: 10s  Transition: Fade 500ms│
│ 📷 Summer Promo    │    [Edit] [Remove]                      │
│ [+ Add]            │                                         │
│                    │ 2. Product Demo (Video)                 │
│ 🎬 Product Demo    │    Duration: 30s  Transition: Slide 300ms│
│ [+ Add]            │    [Edit] [Remove]                      │
│                    │                                         │
│ 📄 Menu Board      │ 3. Menu Board (PDF)                     │
│ [+ Add]            │    Duration: 15s  Transition: None      │
│                    │    [Edit] [Remove]                      │
└────────────────────┴─────────────────────────────────────────┘
```

**Playlist Item Configuration:**
- Display order (drag to reorder)
- Duration override (default from content)
- Transition type: Fade, Slide, None
- Transition duration (milliseconds)

**Validation:**
- Playlist must have at least 1 item
- Display order must be sequential

### 7. Schedule Management

**Calendar/Timeline View:**
```
┌──────────────────────────────────────────────────────────────┐
│ Schedules                                    [+ New Schedule] │
├──────────────────────────────────────────────────────────────┤
│ View: [Calendar ▼]  Filter: Site [All ▼]  Player [All ▼]    │
├──────────────────────────────────────────────────────────────┤
│         Mon       Tue       Wed       Thu       Fri          │
│ 08:00  ┌────────────────────────────────────────┐            │
│ 09:00  │ Morning Specials                       │            │
│ 10:00  │ (All Sites)                            │            │
│ 11:00  └────────────────────────────────────────┘            │
│ 12:00  ┌──────────┐                                          │
│ 13:00  │ Lunch    │                                          │
│ 14:00  │ Menu     │  ┌─────────────────────────┐            │
│ 15:00  └──────────┘  │ Afternoon Promotions    │            │
│ 16:00                │ (NYC Store #1 only)     │            │
│ 17:00                └─────────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

**Create/Edit Schedule Form:**
- Schedule name (required)
- Playlist selection (dropdown)
- Priority (number, higher = more important)
- Date range: Start date - End date (optional)
- Time range: Start time - End time (optional, HH:mm format)
- Days of week: Mon, Tue, Wed, Thu, Fri, Sat, Sun (multi-select)
- Active status toggle

**Assignment Section:**
- Assignment type: Customer-wide, Specific Sites, Specific Players
- If "Specific Sites": Multi-select site picker
- If "Specific Players": Multi-select player picker (grouped by site)

**Priority Visualization:**
- Color-code schedules by priority in calendar view
- Show conflict warnings when multiple schedules overlap
- Tooltip explaining resolution order (Player > Site > Customer)

### 8. User Management

**List View:**
```
┌──────────────────────────────────────────────────────────────┐
│ Users                                             [+ New User]│
├──────────────────────────────────────────────────────────────┤
│ Name           │ Email              │ Role        │ Status   │
├────────────────┼────────────────────┼─────────────┼──────────┤
│ John Admin     │ john@acme.com      │ Admin       │ Active   │
│ Jane Editor    │ jane@acme.com      │ Editor      │ Active   │
│ Bob Manager    │ bob@acme.com       │ SiteManager │ Active   │
│                │                    │ (NYC #1)    │          │
└────────────────┴────────────────────┴─────────────┴──────────┘
```

**Create/Edit User Form:**
- Customer (dropdown, Admin only)
- Email (required, unique within customer)
- First name, Last name (required)
- Password (required on create, optional on edit)
- Role: Admin, Editor, Viewer, SiteManager
- Assigned site (required if role is SiteManager)
- Active status toggle

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### 9. Analytics Dashboard

**Summary Cards:**
- Total playback count (date range)
- Total duration played
- Unique content played
- Unique players active

**Charts:**
- **Playback Over Time**: Line chart (daily/weekly/monthly aggregation)
- **Top Content**: Bar chart (most played content items)
- **Player Uptime**: Bar chart or table (percentage online per player)
- **Site Performance**: Table (plays per site)

**Filters:**
- Date range picker (start date - end date)
- Site filter (dropdown)
- Player filter (dropdown)
- Content filter (dropdown)
- Playlist filter (dropdown)

**Export:**
- Download CSV report button
- Email scheduled reports (future feature)

### 10. Webhooks (Advanced)

**List View:**
```
┌──────────────────────────────────────────────────────────────┐
│ Webhooks                                      [+ New Webhook] │
├──────────────────────────────────────────────────────────────┤
│ Name           │ URL                   │ Events      │ Status │
├────────────────┼───────────────────────┼─────────────┼────────┤
│ Slack Alerts   │ https://hooks.slack...│ player.*    │ Active │
│ Analytics Feed │ https://analytics.ex..│ content.*   │ Active │
└────────────────┴───────────────────────┴─────────────┴────────┘
```

**Create/Edit Webhook Form:**
- Name (required)
- URL (required, HTTPS)
- Events (multi-select):
  - player.online, player.offline, player.error
  - content.created, content.updated, content.deleted
  - playlist.created, playlist.updated
  - schedule.created, schedule.updated
  - site.created
- Secret (auto-generated, for signature verification)
- Active status toggle
- [Test Webhook] button (sends test payload)

---

## Role-Based Access Control

### Role Permission Matrix

| Feature                | Admin | Editor | Viewer | SiteManager |
|------------------------|-------|--------|--------|-------------|
| **Customers**          |       |        |        |             |
| View all customers     | ✓     | ✗      | ✗      | ✗           |
| Create customer        | ✓     | ✗      | ✗      | ✗           |
| Edit customer          | ✓     | ✗      | ✗      | ✗           |
| **Sites**              |       |        |        |             |
| View all sites         | ✓     | ✓      | ✓      | Own only    |
| Create site            | ✓     | ✓      | ✗      | ✗           |
| Edit site              | ✓     | ✓      | ✗      | Own only    |
| Delete site            | ✓     | ✓      | ✗      | ✗           |
| **Players**            |       |        |        |             |
| View players           | ✓     | ✓      | ✓      | Own site    |
| Add player             | ✓     | ✓      | ✗      | Own site    |
| Edit player            | ✓     | ✓      | ✗      | Own site    |
| Delete player          | ✓     | ✓      | ✗      | ✗           |
| **Content**            |       |        |        |             |
| View content           | ✓     | ✓      | ✓      | ✓           |
| Upload content         | ✓     | ✓      | ✗      | ✓           |
| Edit content           | ✓     | ✓      | ✗      | ✓           |
| Delete content         | ✓     | ✓      | ✗      | ✗           |
| **Playlists**          |       |        |        |             |
| View playlists         | ✓     | ✓      | ✓      | ✓           |
| Create playlist        | ✓     | ✓      | ✗      | ✓           |
| Edit playlist          | ✓     | ✓      | ✗      | ✓           |
| Delete playlist        | ✓     | ✓      | ✗      | ✗           |
| **Schedules**          |       |        |        |             |
| View schedules         | ✓     | ✓      | ✓      | ✓           |
| Create schedule        | ✓     | ✓      | ✗      | Own site    |
| Edit schedule          | ✓     | ✓      | ✗      | Own site    |
| Delete schedule        | ✓     | ✓      | ✗      | ✗           |
| **Users**              |       |        |        |             |
| View users             | ✓     | ✓      | ✓      | ✗           |
| Create user            | ✓     | ✗      | ✗      | ✗           |
| Edit user              | ✓     | ✗      | ✗      | ✗           |
| **Analytics**          |       |        |        |             |
| View analytics         | ✓     | ✓      | ✓      | Own site    |
| Export reports         | ✓     | ✓      | ✗      | Own site    |
| **Webhooks**           |       |        |        |             |
| View webhooks          | ✓     | ✓      | ✗      | ✗           |
| Create webhook         | ✓     | ✗      | ✗      | ✗           |
| Edit webhook           | ✓     | ✗      | ✗      | ✗           |

### Frontend Permission Checks

```typescript
// utils/permissions.ts
import type { UserRole } from '../types';

export const can = (
  userRole: UserRole,
  action: string,
  resource: string
): boolean => {
  const permissions: Record<UserRole, Record<string, string[]>> = {
    Admin: {
      customers: ['view', 'create', 'edit'],
      sites: ['view', 'create', 'edit', 'delete'],
      players: ['view', 'create', 'edit', 'delete'],
      content: ['view', 'upload', 'edit', 'delete'],
      playlists: ['view', 'create', 'edit', 'delete'],
      schedules: ['view', 'create', 'edit', 'delete'],
      users: ['view', 'create', 'edit'],
      analytics: ['view', 'export'],
      webhooks: ['view', 'create', 'edit'],
    },
    Editor: {
      sites: ['view', 'create', 'edit', 'delete'],
      players: ['view', 'create', 'edit', 'delete'],
      content: ['view', 'upload', 'edit', 'delete'],
      playlists: ['view', 'create', 'edit', 'delete'],
      schedules: ['view', 'create', 'edit', 'delete'],
      users: ['view'],
      analytics: ['view', 'export'],
      webhooks: ['view'],
    },
    Viewer: {
      sites: ['view'],
      players: ['view'],
      content: ['view'],
      playlists: ['view'],
      schedules: ['view'],
      users: ['view'],
      analytics: ['view'],
    },
    SiteManager: {
      sites: ['view'], // Own site only
      players: ['view', 'create', 'edit'], // Own site only
      content: ['view', 'upload', 'edit'],
      playlists: ['view', 'create', 'edit'],
      schedules: ['view', 'create', 'edit'], // Own site only
      analytics: ['view', 'export'], // Own site only
    },
  };

  return permissions[userRole]?.[resource]?.includes(action) || false;
};

// Component example
const { user } = useAuth();

{can(user.role, 'create', 'customers') && (
  <Button onClick={handleCreateCustomer}>+ New Customer</Button>
)}
```

### SiteManager Restrictions

**CRITICAL**: SiteManager role is tied to a specific site via `assignedSiteId`.

**Implementation:**
1. Filter API responses to only show data for the assigned site
2. Disable site selection dropdowns (pre-select assigned site)
3. Hide navigation items for non-permitted resources
4. Show warning banner: "You are viewing Site: NYC Store #1"

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);

  const isSiteManager = user?.role === 'SiteManager';
  const assignedSiteId = user?.assignedSiteId;

  const canAccessSite = (siteId: number) => {
    if (user?.role === 'Admin' || user?.role === 'Editor') return true;
    if (isSiteManager) return siteId === assignedSiteId;
    return true; // Viewer can see all
  };

  return { user, isSiteManager, assignedSiteId, canAccessSite };
};
```

---

## Multi-Tenancy Implementation

### Subdomain-Based Authentication

**Login Flow:**
1. User enters email + password + **subdomain**
2. Backend validates subdomain exists, looks up customer
3. Backend authenticates user against that customer
4. Frontend stores `customerId` in user context

**Alternative Approach:**
- If using a single-domain CMS, show customer selector dropdown after login
- Admin users see all customers, others see only their own

### Customer Context

```typescript
// contexts/CustomerContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { Customer } from '../types';

interface CustomerContextValue {
  currentCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
}

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load customer from user.customerId
      fetchCustomer(user.customerId).then(setCurrentCustomer);
    }
  }, [user]);

  return (
    <CustomerContext.Provider value={{ currentCustomer, setCurrentCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer must be used within CustomerProvider');
  return context;
};
```

### Resource Limits Enforcement

Display warnings when approaching limits:

```typescript
// components/ResourceLimitWarning.tsx
const ResourceLimitWarning = () => {
  const { currentCustomer } = useCustomer();
  const { data: limits } = useQuery({
    queryKey: ['customer-limits', currentCustomer?.customerId],
    queryFn: () => customerService.getLimits(currentCustomer!.customerId),
  });

  if (!limits) return null;

  const siteUsagePercent = (limits.currentSites / limits.maxSites) * 100;
  const playerUsagePercent = (limits.currentPlayers / limits.maxPlayers) * 100;
  const storageUsagePercent = (limits.currentStorageGB / limits.maxStorageGB) * 100;

  const isNearLimit = (percent: number) => percent >= 80;

  return (
    <div>
      {isNearLimit(siteUsagePercent) && (
        <Alert severity="warning">
          You are using {limits.currentSites} of {limits.maxSites} sites ({siteUsagePercent.toFixed(0)}%)
        </Alert>
      )}
      {isNearLimit(storageUsagePercent) && (
        <Alert severity="warning">
          Storage: {limits.currentStorageGB.toFixed(1)} GB / {limits.maxStorageGB} GB
        </Alert>
      )}
    </div>
  );
};
```

---

## File Upload & Media Management

### File Upload Component

```typescript
// components/ContentUpload.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/contentService';

const ContentUpload = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { currentCustomer } = useCustomer();

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: any }) =>
      contentService.upload(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content uploaded successfully!');
    },
    onError: (error) => {
      toast.error('Upload failed: ' + error.message);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const contentType = getContentTypeFromMime(file.type);

      uploadMutation.mutate({
        file,
        metadata: {
          name: file.name,
          contentType,
          customerId: currentCustomer!.customerId,
          uploadedBy: user!.userId,
        },
      });
    });
  }, [uploadMutation, currentCustomer, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 100 * 1024 * 1024, // 100 MB
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ccc',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag & drop files here, or click to select files</p>
      )}
      {uploadMutation.isPending && <p>Uploading...</p>}
    </div>
  );
};

function getContentTypeFromMime(mime: string): ContentType {
  if (mime.startsWith('image/')) return 'Image';
  if (mime.startsWith('video/')) return 'Video';
  if (mime === 'application/pdf') return 'PDF';
  return 'HTML';
}
```

### File Preview Component

```typescript
// components/ContentPreview.tsx
interface ContentPreviewProps {
  content: Content;
}

const ContentPreview = ({ content }: ContentPreviewProps) => {
  if (content.status !== 'Ready') {
    return <div>Content is {content.status}...</div>;
  }

  switch (content.contentType) {
    case 'Image':
      return <img src={content.fileUrl!} alt={content.name} style={{ maxWidth: '100%' }} />;

    case 'Video':
      return (
        <video controls style={{ maxWidth: '100%' }}>
          <source src={content.fileUrl!} type={content.mimeType || 'video/mp4'} />
        </video>
      );

    case 'PDF':
      return (
        <iframe
          src={content.fileUrl!}
          style={{ width: '100%', height: '600px' }}
          title={content.name}
        />
      );

    case 'HTML':
      return (
        <iframe
          src={content.fileUrl!}
          style={{ width: '100%', height: '600px' }}
          title={content.name}
          sandbox="allow-scripts"
        />
      );

    case 'URL':
      return (
        <iframe
          src={content.fileUrl!}
          style={{ width: '100%', height: '600px' }}
          title={content.name}
        />
      );

    default:
      return <div>Preview not available</div>;
  }
};
```

### Storage Usage Tracking

Display storage meter in header or dashboard:

```typescript
// components/StorageMeter.tsx
const StorageMeter = () => {
  const { currentCustomer } = useCustomer();
  const { data: limits } = useQuery({
    queryKey: ['customer-limits', currentCustomer?.customerId],
    queryFn: () => customerService.getLimits(currentCustomer!.customerId),
  });

  if (!limits) return null;

  const usagePercent = (limits.currentStorageGB / limits.maxStorageGB) * 100;

  return (
    <div>
      <LinearProgress
        variant="determinate"
        value={Math.min(usagePercent, 100)}
        color={usagePercent > 90 ? 'error' : usagePercent > 80 ? 'warning' : 'primary'}
      />
      <Typography variant="caption">
        Storage: {limits.currentStorageGB.toFixed(1)} GB / {limits.maxStorageGB} GB
      </Typography>
    </div>
  );
};
```

---

## Real-Time Features

### Player Status Polling

Since the backend doesn't have WebSocket support, use polling:

```typescript
// hooks/usePlayers.ts
import { useQuery } from '@tanstack/react-query';
import { playerService } from '../services/playerService';

export const usePlayers = (siteId?: number) => {
  return useQuery({
    queryKey: siteId ? ['players', 'site', siteId] : ['players'],
    queryFn: () =>
      siteId ? playerService.getBySite(siteId) : playerService.getAll(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
```

### Real-Time Player Status Indicator

```typescript
// components/PlayerStatusBadge.tsx
const PlayerStatusBadge = ({ player }: { player: Player }) => {
  const isOnline = player.status === 'Online' &&
    player.lastHeartbeat &&
    (new Date().getTime() - new Date(player.lastHeartbeat).getTime()) < 5 * 60 * 1000;

  const isError = player.status === 'Error';

  return (
    <Chip
      label={player.status}
      color={isOnline ? 'success' : isError ? 'error' : 'default'}
      icon={isOnline ? <FiberManualRecordIcon /> : <ErrorIcon />}
    />
  );
};
```

### Activity Feed (Webhook Events)

If webhooks are configured to post to your CMS backend:

```typescript
// hooks/useActivityFeed.ts
export const useActivityFeed = () => {
  return useQuery({
    queryKey: ['activity-feed'],
    queryFn: () => analyticsService.getRecentActivity(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

// components/ActivityFeed.tsx
const ActivityFeed = () => {
  const { data: activities } = useActivityFeed();

  return (
    <List>
      {activities?.map((activity) => (
        <ListItem key={activity.id}>
          <ListItemIcon>{getIconForEvent(activity.event)}</ListItemIcon>
          <ListItemText
            primary={activity.message}
            secondary={formatDistanceToNow(new Date(activity.timestamp))}
          />
        </ListItem>
      ))}
    </List>
  );
};
```

---

## Best Practices & Security

### 1. Authentication Token Storage

**Recommended:**
- Store `accessToken` in memory (React state, not localStorage)
- Store `refreshToken` in httpOnly cookie (if backend supports) OR secure localStorage
- Clear tokens on logout

**Why:**
- Prevents XSS attacks from stealing tokens
- Refresh token has longer expiry, can regenerate access token

### 2. Input Validation

**Always validate on frontend before sending to backend:**

```typescript
// Use Zod for validation (matches backend)
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  subdomain: z.string()
    .min(3, 'Min 3 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Lowercase, alphanumeric, hyphens only'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().optional(),
  subscriptionTier: z.enum(['Free', 'Pro', 'Enterprise']).optional(),
});

// In form
const form = useForm({
  resolver: zodResolver(createCustomerSchema),
});
```

### 3. Error Handling

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);

    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }
  } else {
    toast.error('An unexpected error occurred');
  }
};

// Usage in mutation
const createCustomerMutation = useMutation({
  mutationFn: customerService.create,
  onError: handleApiError,
});
```

### 4. Loading States

Always show loading indicators:

```typescript
const CustomersPage = () => {
  const { data: customers, isLoading, isError, error } = useCustomers();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return <CustomerList customers={customers} />;
};
```

### 5. Optimistic Updates

For better UX, update UI before server responds:

```typescript
const deleteContentMutation = useMutation({
  mutationFn: contentService.delete,
  onMutate: async (contentId) => {
    await queryClient.cancelQueries({ queryKey: ['content'] });

    const previousContent = queryClient.getQueryData(['content']);

    queryClient.setQueryData(['content'], (old: Content[]) =>
      old.filter((c) => c.contentId !== contentId)
    );

    return { previousContent };
  },
  onError: (err, contentId, context) => {
    queryClient.setQueryData(['content'], context?.previousContent);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['content'] });
  },
});
```

### 6. Prevent XSS

- Never use `dangerouslySetInnerHTML` without sanitization
- Use libraries like `DOMPurify` for HTML content
- Validate all user input

### 7. Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Test with screen readers

### 8. Responsive Design

- Mobile-first approach
- Use CSS Grid/Flexbox for layouts
- Test on mobile devices
- Consider touch-friendly UI (larger buttons)

### 9. Performance Optimization

- **Code splitting**: Lazy-load routes
  ```typescript
  const DashboardPage = lazy(() => import('./pages/DashboardPage'));
  ```
- **Image optimization**: Use WebP, lazy-load images
- **Pagination**: For large lists (content, players)
- **Virtual scrolling**: For very large lists (react-window)
- **Debounce search inputs**: Reduce API calls

### 10. Testing

**Unit Tests:**
- Test utility functions
- Test custom hooks

**Integration Tests:**
- Test API service functions
- Mock API responses

**E2E Tests (Playwright/Cypress):**
- Test critical user flows (login, upload content, create schedule)

---

## Additional Features to Consider

### 1. User Preferences
- Theme toggle (light/dark mode)
- Language selection (i18n)
- Notification preferences

### 2. Audit Logs
- Track who created/edited/deleted resources
- Display activity history per resource

### 3. Bulk Operations
- Bulk upload content
- Bulk assign schedules to multiple players
- Bulk activate/deactivate sites

### 4. Advanced Scheduling
- Recurring schedules (e.g., every Monday at 9am)
- Holiday exception handling
- Weather-based triggers (if integrated with weather API)

### 5. Player Remote Control
- Send reboot command to player
- Clear cache
- Update player software version

### 6. Content Expiration
- Set expiration date for content
- Auto-archive expired content

### 7. Playlist Templates
- Save playlists as templates
- Clone playlists

### 8. Schedule Conflicts Resolution
- Visual conflict warnings in calendar view
- Automatic priority resolution explanation

### 9. Mobile App
- Consider React Native for on-the-go management
- Push notifications for offline players

### 10. Help & Documentation
- In-app help tooltips
- Link to user documentation
- Video tutorials

---

## API Response Format

All API responses follow this structure:

**Success:**
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": [ // Optional validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Environment Variables (Frontend)

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Digital Signage CMS
VITE_MAX_FILE_SIZE_MB=100
```

---

## Deployment Considerations

### Frontend Deployment
- **Static hosting**: Vercel, Netlify, AWS S3 + CloudFront
- **Build command**: `npm run build`
- **Environment variables**: Set in hosting platform
- **Routing**: Configure for SPA (all routes redirect to index.html)

### Backend Integration
- Ensure CORS is enabled on backend for frontend domain
- Use HTTPS in production
- Configure API URL via environment variable

---

## Summary Checklist

When building your CMS frontend, ensure you implement:

- [ ] Authentication (login, logout, token refresh)
- [ ] Role-based access control (Admin, Editor, Viewer, SiteManager)
- [ ] Customer management (Admin only)
- [ ] Site management (hierarchical, map view)
- [ ] Player management (status indicators, activation)
- [ ] Content library (upload, preview, tags)
- [ ] Playlist builder (drag-and-drop)
- [ ] Schedule calendar (visual timeline, conflict warnings)
- [ ] User management (password validation)
- [ ] Analytics dashboard (charts, filters, export)
- [ ] Webhooks (optional, advanced)
- [ ] Real-time player status (polling)
- [ ] Resource limit warnings
- [ ] Error handling and loading states
- [ ] Responsive design
- [ ] Accessibility features
- [ ] Input validation (Zod)
- [ ] File upload with progress
- [ ] Multi-tenancy support

---

## Resources & References

**API Documentation:**
- Swagger UI: `http://localhost:3000/api-docs` (if enabled)
- Backend CLAUDE.md file for detailed API specs

**Design Inspiration:**
- [Screenly CMS](https://www.screenly.io/)
- [Yodeck Dashboard](https://www.yodeck.com/)
- [NoviSign CMS](https://www.novisign.com/)

**Component Libraries:**
- [Material-UI](https://mui.com/)
- [Ant Design](https://ant.design/)
- [Shadcn/ui](https://ui.shadcn.com/)

**State Management:**
- [TanStack Query (React Query)](https://tanstack.com/query/)
- [Zustand](https://github.com/pmndrs/zustand)

**File Upload:**
- [react-dropzone](https://react-dropzone.js.org/)
- [Uppy](https://uppy.io/)

**Date/Time:**
- [date-fns](https://date-fns.org/)
- [react-datepicker](https://reactdatepicker.com/)

**Charts:**
- [Recharts](https://recharts.org/)
- [Chart.js](https://www.chartjs.org/)

---

## Contact & Support

For questions about the backend API, refer to the backend repository documentation or contact the backend development team.

**Happy building! 🚀**
