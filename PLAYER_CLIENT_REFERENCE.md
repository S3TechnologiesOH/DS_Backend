# Digital Signage Player Client - Development Reference

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Authentication & Security](#authentication--security)
4. [API Integration](#api-integration)
5. [Content Playback Engine](#content-playback-engine)
6. [Schedule Resolution](#schedule-resolution)
7. [Offline Mode & Caching](#offline-mode--caching)
8. [Heartbeat & Health Monitoring](#heartbeat--health-monitoring)
9. [Logging & Diagnostics](#logging--diagnostics)
10. [Configuration & Deployment](#configuration--deployment)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The **Digital Signage Player Client** is the application that runs on physical display devices (screens, kiosks, TVs) to fetch and display content scheduled via the CMS backend. This client communicates with the backend API to:

- Authenticate the player device
- Retrieve scheduled playlists and content
- Download and cache media files
- Display content with transitions
- Send heartbeat signals to maintain online status
- Report logs and playback analytics
- Operate in offline mode when network is unavailable

### Key Responsibilities
- **Content Display**: Render images, videos, HTML widgets, PDFs, and URLs
- **Schedule Management**: Fetch and apply schedules based on priority
- **Network Resilience**: Cache content locally for offline playback
- **Health Reporting**: Send heartbeat and diagnostic data
- **Analytics Tracking**: Record proof-of-play events

---

## Architecture & Technology Stack

### Recommended Technology Stacks

#### Option 1: Electron (Cross-Platform Desktop)
**Best for**: Windows, macOS, Linux kiosks
- **Framework**: Electron + TypeScript
- **UI**: React or Vue.js
- **Media Playback**: HTML5 `<video>`, `<img>`, `<iframe>`
- **Storage**: IndexedDB or SQLite for offline cache
- **Networking**: axios or fetch API
- **Logging**: winston or electron-log

**Pros**: Write once, run on Windows/macOS/Linux
**Cons**: Larger application size (~100MB+)

#### Option 2: Web Browser (Kiosk Mode)
**Best for**: Raspberry Pi, Linux devices, Chrome OS
- **Framework**: Progressive Web App (PWA) with React/Vue
- **Media**: HTML5 APIs
- **Storage**: IndexedDB, Cache API
- **Deployment**: Run in fullscreen kiosk mode (Chromium)

**Pros**: Lightweight, easy to update
**Cons**: Browser-dependent, limited system access

#### Option 3: Native Mobile (Android/iOS)
**Best for**: Tablet displays, Android TV
- **Android**: Kotlin/Java with Jetpack Compose or native XML
- **iOS**: Swift with SwiftUI
- **Media**: Native video players (ExoPlayer for Android, AVPlayer for iOS)
- **Storage**: SQLite, Realm

**Pros**: Best performance on mobile devices
**Cons**: Platform-specific development

#### Option 4: Raspberry Pi Specialized
**Best for**: Low-cost deployments
- **OS**: Raspberry Pi OS (Debian-based Linux)
- **Framework**: Python + PyQt5 or Kivy
- **Media**: VLC, mpv, or omxplayer
- **Storage**: SQLite

**Pros**: Very low cost hardware
**Cons**: Limited performance for 4K content

---

### Recommended Architecture (Electron Example)

```
player-client/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Entry point
│   │   ├── api/                 # API client service
│   │   │   ├── AuthService.ts   # Player authentication
│   │   │   ├── ScheduleService.ts
│   │   │   ├── ContentService.ts
│   │   │   └── HeartbeatService.ts
│   │   ├── storage/             # Local data management
│   │   │   ├── CacheManager.ts  # Content file cache
│   │   │   └── Database.ts      # SQLite for metadata
│   │   ├── scheduler/           # Schedule resolution
│   │   │   └── ScheduleResolver.ts
│   │   └── config/              # Configuration
│   │       └── PlayerConfig.ts
│   ├── renderer/                # Electron renderer process (UI)
│   │   ├── components/          # React components
│   │   │   ├── Player.tsx       # Main playback component
│   │   │   ├── ImagePlayer.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── HTMLPlayer.tsx
│   │   │   └── Transition.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── usePlaylist.ts
│   │   │   └── useContentCache.ts
│   │   ├── App.tsx              # Main React app
│   │   └── index.html           # HTML entry
│   ├── shared/                  # Shared types/utils
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── constants.ts
│   └── preload/                 # Electron preload scripts
│       └── index.ts
├── package.json
├── tsconfig.json
└── electron-builder.yml         # Build configuration
```

---

## Authentication & Security

### Player Authentication Flow

Players use a **separate authentication mechanism** from CMS users. Each player device has a unique **Player Code** and **Activation Code**.

#### Step 1: Initial Activation (One-Time Setup)

**Admin/Site Manager creates player in CMS:**
1. Navigate to CMS → Players → Add Player
2. Enter player name, site, and generate activation code
3. Activation code is displayed (e.g., `ABC-123-XYZ`)

**Player device activation:**
1. Player app launches for first time (no credentials stored)
2. Shows activation screen: "Enter Activation Code"
3. User enters activation code
4. App calls activation endpoint

```http
POST /api/v1/player-auth/activate
Content-Type: application/json

{
  "playerCode": "NYC-001-ENT",
  "activationCode": "ABC-123-XYZ"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playerId": 42,
    "customerId": 1,
    "siteId": 5,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Player app saves:**
- `playerId`, `customerId`, `siteId`
- `refreshToken` (encrypted in secure storage)
- `accessToken` (in-memory, short-lived)

#### Step 2: Subsequent Logins (Automatic)

On app restart, player automatically authenticates using saved `refreshToken`:

```http
POST /api/v1/player-auth/refresh
Content-Type: application/json

{
  "refreshToken": "saved-refresh-token"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "new-access-token"
  }
}
```

#### Step 3: Token Usage

All API requests include the JWT token:

```http
GET /api/v1/player-devices/{playerId}/schedule
Authorization: Bearer {accessToken}
```

### Security Best Practices

1. **Secure Token Storage**
   - Electron: Use `electron-store` with encryption
   - Web: Use `IndexedDB` with encryption (crypto-js)
   - Mobile: Use platform keychain (Android Keystore, iOS Keychain)

2. **Automatic Token Refresh**
   - Refresh access token before expiry (check JWT `exp` field)
   - Implement retry logic for 401 responses

3. **HTTPS Only**
   - Never communicate over HTTP in production
   - Validate SSL certificates

4. **Configuration File**
   ```json
   {
     "apiBaseUrl": "https://api.digitalsignage.com/api/v1",
     "playerId": 42,
     "playerCode": "NYC-001-ENT",
     "refreshToken": "encrypted-token-here"
   }
   ```

---

## API Integration

### Required API Endpoints

#### 1. Get Player Schedule

**Endpoint:**
```http
GET /api/v1/player-devices/{playerId}/schedule
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "schedule": {
      "scheduleId": 10,
      "name": "Morning Promotions",
      "playlistId": 5,
      "priority": 50,
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "daysOfWeek": "Mon,Tue,Wed,Thu,Fri"
    },
    "playlist": {
      "playlistId": 5,
      "name": "Spring Campaign",
      "description": "Spring sale content"
    },
    "content": [
      {
        "contentId": 101,
        "name": "Spring Sale Banner",
        "contentType": "Image",
        "fileUrl": "https://storage.azure.com/.../banner.jpg",
        "thumbnailUrl": "https://storage.azure.com/.../banner-thumb.jpg",
        "duration": 10,
        "width": 1920,
        "height": 1080,
        "mimeType": "image/jpeg",
        "fileSize": 2485760,
        "displayOrder": 0,
        "transitionType": "Fade",
        "transitionDuration": 500
      },
      {
        "contentId": 102,
        "name": "Product Demo Video",
        "contentType": "Video",
        "fileUrl": "https://storage.azure.com/.../demo.mp4",
        "duration": 30,
        "mimeType": "video/mp4",
        "fileSize": 45678900,
        "displayOrder": 1,
        "transitionType": "Slide",
        "transitionDuration": 300
      }
    ]
  }
}
```

**Implementation:**

```typescript
// api/ScheduleService.ts
import axios from 'axios';
import { getAuthHeaders } from './AuthService';

export interface ScheduleResponse {
  schedule: {
    scheduleId: number;
    name: string;
    playlistId: number;
    startTime: string | null;
    endTime: string | null;
    daysOfWeek: string | null;
  };
  playlist: {
    playlistId: number;
    name: string;
    description: string | null;
  };
  content: ContentItem[];
}

export interface ContentItem {
  contentId: number;
  name: string;
  contentType: 'Image' | 'Video' | 'HTML' | 'URL' | 'PDF';
  fileUrl: string;
  duration: number;
  displayOrder: number;
  transitionType: 'Fade' | 'Slide' | 'None';
  transitionDuration: number;
  mimeType?: string;
  fileSize?: number;
}

export class ScheduleService {
  private apiBaseUrl: string;
  private playerId: number;

  constructor(apiBaseUrl: string, playerId: number) {
    this.apiBaseUrl = apiBaseUrl;
    this.playerId = playerId;
  }

  async getCurrentSchedule(): Promise<ScheduleResponse | null> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/player-devices/${this.playerId}/schedule`,
        { headers: await getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('No active schedule found');
        return null;
      }
      throw error;
    }
  }
}
```

#### 2. Send Heartbeat

**Endpoint:**
```http
POST /api/v1/player-devices/{playerId}/heartbeat
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "Online",
  "ipAddress": "192.168.1.100",
  "playerVersion": "2.5.1",
  "osVersion": "Windows 10 Build 19045"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Heartbeat recorded"
}
```

**Implementation:**

```typescript
// api/HeartbeatService.ts
export class HeartbeatService {
  private apiBaseUrl: string;
  private playerId: number;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(apiBaseUrl: string, playerId: number) {
    this.apiBaseUrl = apiBaseUrl;
    this.playerId = playerId;
  }

  async sendHeartbeat(): Promise<void> {
    const osInfo = await this.getOsInfo();
    const ipAddress = await this.getLocalIpAddress();

    await axios.post(
      `${this.apiBaseUrl}/player-devices/${this.playerId}/heartbeat`,
      {
        status: 'Online',
        ipAddress,
        playerVersion: '2.5.1', // From package.json
        osVersion: osInfo,
      },
      { headers: await getAuthHeaders() }
    );
  }

  startHeartbeat(intervalMs: number = 60000): void {
    // Send initial heartbeat
    this.sendHeartbeat().catch(console.error);

    // Send heartbeat every 60 seconds (1 minute)
    this.intervalId = setInterval(() => {
      this.sendHeartbeat().catch(console.error);
    }, intervalMs);
  }

  stopHeartbeat(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async getOsInfo(): Promise<string> {
    // Electron example
    const os = require('os');
    return `${os.type()} ${os.release()}`;
  }

  private async getLocalIpAddress(): Promise<string> {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '0.0.0.0';
  }
}
```

#### 3. Get All Content (for caching)

**Endpoint:**
```http
GET /api/v1/player-devices/{playerId}/content
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "contentId": 101,
      "name": "Spring Sale Banner",
      "contentType": "Image",
      "fileUrl": "https://storage.azure.com/.../banner.jpg",
      "fileSize": 2485760,
      "mimeType": "image/jpeg"
    }
  ]
}
```

#### 4. Submit Logs

**Endpoint:**
```http
POST /api/v1/player-devices/{playerId}/logs
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "level": "error",
  "message": "Failed to load content item",
  "metadata": {
    "contentId": 123,
    "errorCode": "NETWORK_ERROR"
  }
}
```

---

## Content Playback Engine

### Playback Component Architecture

```typescript
// renderer/components/Player.tsx
import React, { useEffect, useState } from 'react';
import ImagePlayer from './ImagePlayer';
import VideoPlayer from './VideoPlayer';
import HTMLPlayer from './HTMLPlayer';
import Transition from './Transition';
import { ContentItem } from '../shared/types';

interface PlayerProps {
  playlist: ContentItem[];
}

export const Player: React.FC<PlayerProps> = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentContent = playlist[currentIndex];

  useEffect(() => {
    if (!currentContent) return;

    const duration = currentContent.duration * 1000; // Convert to ms

    const timer = setTimeout(() => {
      goToNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, currentContent]);

  const goToNext = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= playlist.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, currentContent.transitionDuration || 500);
  };

  if (!currentContent) {
    return <div>No content to display</div>;
  }

  return (
    <div className="player-container">
      <Transition
        type={currentContent.transitionType}
        duration={currentContent.transitionDuration}
        isActive={isTransitioning}
      >
        {renderContent(currentContent)}
      </Transition>
    </div>
  );
};

function renderContent(content: ContentItem): JSX.Element {
  switch (content.contentType) {
    case 'Image':
      return <ImagePlayer content={content} />;
    case 'Video':
      return <VideoPlayer content={content} />;
    case 'HTML':
    case 'URL':
      return <HTMLPlayer content={content} />;
    case 'PDF':
      return <HTMLPlayer content={content} />; // Can use iframe
    default:
      return <div>Unsupported content type</div>;
  }
}
```

### Individual Player Components

#### Image Player

```typescript
// renderer/components/ImagePlayer.tsx
import React, { useEffect, useState } from 'react';
import { ContentItem } from '../shared/types';

interface ImagePlayerProps {
  content: ContentItem;
}

export const ImagePlayer: React.FC<ImagePlayerProps> = ({ content }) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Try to load from cache first, fallback to URL
    loadImage(content.fileUrl).then(setImageSrc);
  }, [content.contentId]);

  const loadImage = async (url: string): Promise<string> => {
    // Check cache first (IndexedDB or filesystem)
    const cachedPath = await window.electronAPI.getCachedContent(content.contentId);
    if (cachedPath) {
      return cachedPath; // File path or blob URL
    }
    return url; // Fallback to remote URL
  };

  return (
    <div className="image-player">
      <img
        src={imageSrc}
        alt={content.name}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
```

#### Video Player

```typescript
// renderer/components/VideoPlayer.tsx
import React, { useRef, useEffect } from 'react';
import { ContentItem } from '../shared/types';

interface VideoPlayerProps {
  content: ContentItem;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ content }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [content.contentId]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={content.fileUrl}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
        }}
        muted // Auto-play requires muted
        playsInline
      />
    </div>
  );
};
```

#### HTML/URL Player

```typescript
// renderer/components/HTMLPlayer.tsx
import React from 'react';
import { ContentItem } from '../shared/types';

interface HTMLPlayerProps {
  content: ContentItem;
}

export const HTMLPlayer: React.FC<HTMLPlayerProps> = ({ content }) => {
  return (
    <div className="html-player">
      <iframe
        src={content.fileUrl}
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin"
        title={content.name}
      />
    </div>
  );
};
```

#### Transition Component

```typescript
// renderer/components/Transition.tsx
import React from 'react';
import './Transition.css';

interface TransitionProps {
  type: 'Fade' | 'Slide' | 'None';
  duration: number; // milliseconds
  isActive: boolean;
  children: React.ReactNode;
}

export const Transition: React.FC<TransitionProps> = ({
  type,
  duration,
  isActive,
  children,
}) => {
  const getClassName = () => {
    if (type === 'None') return '';
    return `transition-${type.toLowerCase()} ${isActive ? 'transitioning' : ''}`;
  };

  return (
    <div
      className={getClassName()}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
```

**Transition.css:**
```css
.transition-fade {
  opacity: 1;
  transition: opacity ease-in-out;
}

.transition-fade.transitioning {
  opacity: 0;
}

.transition-slide {
  transform: translateX(0);
  transition: transform ease-in-out;
}

.transition-slide.transitioning {
  transform: translateX(-100%);
}
```

---

## Schedule Resolution

### Schedule Logic

The backend returns the **highest priority schedule** that applies to the player. Priority resolution:

1. **Player-specific schedule** (highest)
2. **Site-specific schedule**
3. **Customer-wide schedule** (lowest)

Within the same level, higher `priority` field wins.

### Time-Based Schedule Filtering

The player client should validate the schedule's time constraints:

```typescript
// scheduler/ScheduleResolver.ts
import { ScheduleResponse } from '../api/ScheduleService';
import { isWithinInterval, parseISO, format } from 'date-fns';

export class ScheduleResolver {
  isScheduleActive(schedule: ScheduleResponse['schedule']): boolean {
    const now = new Date();

    // Check date range
    if (schedule.startDate && now < parseISO(schedule.startDate)) {
      return false; // Schedule hasn't started yet
    }
    if (schedule.endDate && now > parseISO(schedule.endDate)) {
      return false; // Schedule has ended
    }

    // Check days of week
    if (schedule.daysOfWeek) {
      const currentDay = format(now, 'EEE'); // "Mon", "Tue", etc.
      const allowedDays = schedule.daysOfWeek.split(',');
      if (!allowedDays.includes(currentDay)) {
        return false; // Not scheduled for today
      }
    }

    // Check time range
    if (schedule.startTime && schedule.endTime) {
      const currentTime = format(now, 'HH:mm:ss');
      if (currentTime < schedule.startTime || currentTime > schedule.endTime) {
        return false; // Outside time window
      }
    }

    return true; // Schedule is active
  }

  async getActivePlaylist(): Promise<ContentItem[] | null> {
    const scheduleData = await scheduleService.getCurrentSchedule();

    if (!scheduleData) {
      console.log('No schedule found');
      return null;
    }

    if (!this.isScheduleActive(scheduleData.schedule)) {
      console.log('Schedule exists but not active at this time');
      return null;
    }

    // Sort content by displayOrder
    return scheduleData.content.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
```

### Schedule Refresh

Poll the backend periodically to check for schedule updates:

```typescript
// main/index.ts
const SCHEDULE_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

let currentPlaylist: ContentItem[] = [];

async function refreshSchedule() {
  const resolver = new ScheduleResolver();
  const playlist = await resolver.getActivePlaylist();

  if (playlist) {
    currentPlaylist = playlist;
    // Notify renderer process to update UI
    mainWindow.webContents.send('playlist-updated', playlist);
  }
}

// Refresh schedule every 5 minutes
setInterval(refreshSchedule, SCHEDULE_REFRESH_INTERVAL);
```

---

## Offline Mode & Caching

### Cache Strategy

To ensure playback during network outages, the player must cache all content locally.

#### Content Download Flow

```typescript
// storage/CacheManager.ts
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class CacheManager {
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getFilePath(contentId: number, extension: string): string {
    return path.join(this.cacheDir, `content_${contentId}${extension}`);
  }

  async downloadContent(content: ContentItem): Promise<string> {
    const extension = this.getExtensionFromMimeType(content.mimeType || '');
    const filePath = this.getFilePath(content.contentId, extension);

    // Check if already cached
    if (fs.existsSync(filePath)) {
      console.log(`Content ${content.contentId} already cached`);
      return filePath;
    }

    console.log(`Downloading content ${content.contentId}...`);

    const response = await axios.get(content.fileUrl, {
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  }

  async cachePlaylist(playlist: ContentItem[]): Promise<void> {
    const downloadPromises = playlist.map((content) =>
      this.downloadContent(content).catch((error) => {
        console.error(`Failed to download content ${content.contentId}:`, error);
        return null; // Continue with other downloads
      })
    );

    await Promise.all(downloadPromises);
    console.log('Playlist caching complete');
  }

  getCachedPath(contentId: number, mimeType: string): string | null {
    const extension = this.getExtensionFromMimeType(mimeType);
    const filePath = this.getFilePath(contentId, extension);

    return fs.existsSync(filePath) ? filePath : null;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'application/pdf': '.pdf',
      'text/html': '.html',
    };
    return mimeMap[mimeType] || '.bin';
  }

  clearCache(): void {
    fs.rmSync(this.cacheDir, { recursive: true, force: true });
    this.ensureCacheDir();
  }
}
```

#### Offline Detection

```typescript
// main/index.ts
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  console.log('Network connection restored');
  isOnline = true;
  refreshSchedule(); // Fetch latest schedule
});

window.addEventListener('offline', () => {
  console.log('Network connection lost - entering offline mode');
  isOnline = false;
  // Continue playing cached content
});
```

---

## Heartbeat & Health Monitoring

### Heartbeat Implementation

Send heartbeat every 60 seconds to maintain "Online" status:

```typescript
// main/index.ts
import { HeartbeatService } from './api/HeartbeatService';

const heartbeatService = new HeartbeatService(config.apiBaseUrl, config.playerId);

// Start heartbeat on app launch
heartbeatService.startHeartbeat(60000); // 60 seconds

// Stop heartbeat on app close
app.on('before-quit', () => {
  heartbeatService.stopHeartbeat();
});
```

### Health Checks

Monitor player health and report issues:

```typescript
// main/HealthMonitor.ts
export class HealthMonitor {
  private logService: LogService;

  constructor(logService: LogService) {
    this.logService = logService;
  }

  async checkHealth(): Promise<void> {
    const issues: string[] = [];

    // Check disk space
    const diskSpace = await this.getDiskSpace();
    if (diskSpace < 1024 * 1024 * 1024) { // Less than 1GB
      issues.push('Low disk space');
      await this.logService.submitLog('warn', 'Low disk space', {
        availableBytes: diskSpace,
      });
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // More than 500MB
      issues.push('High memory usage');
    }

    // Check network connectivity
    if (!navigator.onLine) {
      issues.push('Offline');
    }

    if (issues.length > 0) {
      console.warn('Health issues detected:', issues);
    }
  }

  private async getDiskSpace(): Promise<number> {
    // Platform-specific implementation
    // On Windows: use `wmic` or `diskusage` library
    // On Linux: use `df` command
    return 1024 * 1024 * 1024 * 10; // Placeholder: 10GB
  }

  startMonitoring(intervalMs: number = 5 * 60 * 1000): void {
    setInterval(() => this.checkHealth(), intervalMs);
  }
}
```

---

## Logging & Diagnostics

### Log Submission

```typescript
// api/LogService.ts
import axios from 'axios';
import { getAuthHeaders } from './AuthService';

export class LogService {
  private apiBaseUrl: string;
  private playerId: number;
  private logQueue: LogEntry[] = [];

  constructor(apiBaseUrl: string, playerId: number) {
    this.apiBaseUrl = apiBaseUrl;
    this.playerId = playerId;
  }

  async submitLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const logEntry: LogEntry = { level, message, metadata, timestamp: new Date() };

    // Add to queue
    this.logQueue.push(logEntry);

    // Submit if online
    if (navigator.onLine) {
      await this.flushLogs();
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const logs = [...this.logQueue];
    this.logQueue = [];

    for (const log of logs) {
      try {
        await axios.post(
          `${this.apiBaseUrl}/player-devices/${this.playerId}/logs`,
          {
            level: log.level,
            message: log.message,
            metadata: log.metadata,
          },
          { headers: await getAuthHeaders() }
        );
      } catch (error) {
        console.error('Failed to submit log:', error);
        this.logQueue.push(log); // Re-queue
      }
    }
  }
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
```

### Error Handling

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  logService.submitLog('error', event.message, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logService.submitLog('error', 'Unhandled promise rejection', {
    reason: event.reason,
  });
});
```

---

## Configuration & Deployment

### Configuration File

Create a `config.json` file (auto-generated after activation):

```json
{
  "apiBaseUrl": "https://digital-signage-backend.azurewebsites.net/api/v1",
  "playerId": 42,
  "playerCode": "NYC-001-ENT",
  "customerId": 1,
  "siteId": 5,
  "refreshToken": "encrypted-token",
  "cacheDir": "./cache",
  "logLevel": "info",
  "heartbeatInterval": 60000,
  "scheduleRefreshInterval": 300000
}
```

### Build & Packaging

#### Electron Build (electron-builder)

**electron-builder.yml:**
```yaml
appId: com.digitalsignage.player
productName: Digital Signage Player

directories:
  output: dist
  buildResources: build

win:
  target:
    - nsis
  icon: build/icon.ico

mac:
  target:
    - dmg
  icon: build/icon.icns
  category: public.app-category.utilities

linux:
  target:
    - AppImage
  icon: build/icon.png
  category: Utility

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  runAfterFinish: true
```

**Build commands:**
```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

#### Auto-Start Configuration

**Windows:**
Create a startup shortcut in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`

**Linux:**
Create a systemd service:

```ini
[Unit]
Description=Digital Signage Player
After=network.target

[Service]
Type=simple
User=signage
ExecStart=/usr/bin/digitalsignage-player
Restart=always

[Install]
WantedBy=multi-user.target
```

**macOS:**
Use LaunchAgent (`~/Library/LaunchAgents/com.digitalsignage.player.plist`)

---

## Best Practices

### 1. Performance Optimization

- **Preload Next Content**: While displaying current item, preload next item in background
- **Hardware Acceleration**: Enable GPU acceleration for video playback
- **Memory Management**: Clear unused content from memory
- **Lazy Loading**: Only cache content from active/upcoming schedules

### 2. Reliability

- **Auto-Recovery**: Restart player automatically on crash
- **Watchdog Timer**: Monitor app responsiveness
- **Graceful Degradation**: Show default content if schedule unavailable
- **Network Retry**: Exponential backoff for failed API requests

### 3. Security

- **Encrypted Storage**: Encrypt tokens and sensitive config
- **Validate Content**: Check file integrity (checksums)
- **Sandbox Iframes**: Use `sandbox` attribute for HTML content
- **No Remote Code Execution**: Disable developer tools in production

### 4. User Experience

- **Fullscreen Mode**: Launch in fullscreen/kiosk mode
- **Hide Cursor**: Hide mouse cursor during playback
- **Silent Updates**: Update app in background, apply on restart
- **Status Indicator**: Subtle overlay showing online/offline status (optional)

### 5. Monitoring

- **Track Playback**: Record when each content item starts/ends (Proof of Play)
- **Error Reporting**: Log all errors to backend
- **Performance Metrics**: Track FPS, memory usage, load times

---

## Troubleshooting

### Common Issues

#### Issue: Player shows "No active schedule"

**Causes:**
- No schedule assigned to this player in CMS
- Schedule time constraints don't match current time
- Network issue preventing schedule fetch

**Solutions:**
1. Check CMS: Go to Schedules → Verify assignment to this player/site
2. Verify schedule time/date constraints
3. Check player logs for API errors

#### Issue: Content not displaying (black screen)

**Causes:**
- Content file download failed
- Unsupported file format
- Rendering error

**Solutions:**
1. Check cache folder for downloaded files
2. Verify content URL is accessible
3. Check browser/player console for errors
4. Test content type manually

#### Issue: Player shows as "Offline" in CMS

**Causes:**
- Network connectivity issue
- Heartbeat service stopped
- Token expired

**Solutions:**
1. Check network connection
2. Verify API is reachable (`ping` or `curl`)
3. Check token expiration
4. Restart player app

#### Issue: High memory usage

**Causes:**
- Video memory leaks
- Too many cached files in memory

**Solutions:**
1. Restart player app
2. Clear cache and re-download
3. Reduce playlist size
4. Use lower resolution content

---

## Example: Minimal Player Implementation

Here's a minimal example to get started:

```typescript
// minimal-player.ts
import axios from 'axios';

const API_BASE_URL = 'https://your-api.com/api/v1';
const PLAYER_ID = 1;
const ACCESS_TOKEN = 'your-token';

interface ContentItem {
  contentId: number;
  contentType: string;
  fileUrl: string;
  duration: number;
}

async function fetchSchedule(): Promise<ContentItem[]> {
  const response = await axios.get(
    `${API_BASE_URL}/player-devices/${PLAYER_ID}/schedule`,
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
  );
  return response.data.data.content;
}

async function playContent(content: ContentItem): Promise<void> {
  console.log(`Playing: ${content.fileUrl}`);

  // Display content (implementation depends on your platform)
  if (content.contentType === 'Image') {
    // Show image for duration
    await new Promise((resolve) => setTimeout(resolve, content.duration * 1000));
  } else if (content.contentType === 'Video') {
    // Play video
    await new Promise((resolve) => setTimeout(resolve, content.duration * 1000));
  }
}

async function main() {
  const playlist = await fetchSchedule();

  while (true) {
    for (const content of playlist) {
      await playContent(content);
    }
  }
}

main().catch(console.error);
```

---

## Additional Resources

### API Documentation
- Backend API: `https://your-api.com/api-docs`
- Swagger UI for testing endpoints

### Libraries & Tools
- **Electron**: [electronjs.org](https://www.electronjs.org/)
- **React**: [react.dev](https://react.dev/)
- **axios**: HTTP client
- **date-fns**: Date/time utilities
- **electron-store**: Persistent storage
- **electron-builder**: Packaging/distribution

### Reference Implementations
- Screenly OSE: Open-source digital signage player
- Xibo Player: Cross-platform digital signage
- PiSignage: Raspberry Pi player

---

## Summary Checklist

When building your player client, ensure you implement:

- [ ] Player authentication and activation
- [ ] Token storage and automatic refresh
- [ ] Schedule fetching from backend
- [ ] Time-based schedule validation
- [ ] Content playback for all types (Image, Video, HTML, PDF, URL)
- [ ] Playlist looping with transitions
- [ ] Content caching for offline mode
- [ ] Heartbeat service (every 60 seconds)
- [ ] Log submission to backend
- [ ] Offline mode detection and handling
- [ ] Auto-recovery on errors
- [ ] Fullscreen/kiosk mode
- [ ] Auto-start on boot
- [ ] Configuration management
- [ ] Health monitoring
- [ ] Build/packaging for target platform

---

## Support

For backend API issues, refer to the backend repository or contact your backend team.

For player client development questions, consult the relevant framework documentation (Electron, React, etc.).

**Happy building!**
