/**
 * Layout Models
 *
 * Layouts are the building blocks for creating custom content displays.
 * Each layout contains multiple layers (widgets/zones) that can display
 * different types of content.
 */

export interface Layout {
  layoutId: number;
  customerId: number;
  name: string;
  description: string | null;
  width: number;
  height: number;
  backgroundColor: string;
  thumbnailUrl: string | null;
  tags: string | null;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  layers?: LayoutLayer[];
}

export interface LayoutLayer {
  layerId: number;
  layoutId: number;
  layerName: string;
  layerType: LayerType;
  zIndex: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  isVisible: boolean;
  isLocked: boolean;
  contentConfig: LayerContentConfig | null;
  styleConfig: LayerStyleConfig | null;
  animationConfig: AnimationConfig | null;
  scheduleConfig: ScheduleConfig | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LayerType =
  | 'text'
  | 'image'
  | 'video'
  | 'playlist'
  | 'html'
  | 'iframe'
  | 'weather'
  | 'rss'
  | 'news'
  | 'youtube'
  | 'clock'
  | 'shape';

// Content configuration for different layer types
export interface LayerContentConfig {
  // Text widget
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  lineHeight?: number;

  // Image widget
  imageUrl?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

  // Video widget
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;

  // Playlist widget
  playlistId?: number;

  // HTML widget
  htmlContent?: string;

  // Iframe widget
  iframeUrl?: string;
  allowFullscreen?: boolean;

  // Weather widget
  location?: string;
  units?: 'metric' | 'imperial';
  apiKey?: string;

  // RSS/News widget
  feedUrl?: string;
  refreshInterval?: number;
  maxItems?: number;

  // YouTube widget
  videoId?: string;

  // Clock widget
  format?: string;
  timezone?: string;

  // Shape widget
  shapeType?: 'rectangle' | 'circle' | 'ellipse' | 'polygon';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// Style configuration
export interface LayerStyleConfig {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  boxShadow?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  blendMode?: string;
}

// Animation configuration
export interface AnimationConfig {
  type?: 'none' | 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'zoom' | 'rotate' | 'bounce';
  duration?: number;
  delay?: number;
  iterations?: number | 'infinite';
  easing?: string;
}

// Schedule configuration for layer visibility
export interface ScheduleConfig {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
}

// DTO for creating a layout
export interface CreateLayoutDTO {
  name: string;
  description?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  tags?: string;
  layers?: CreateLayoutLayerDTO[];
}

// DTO for creating a layout layer
export interface CreateLayoutLayerDTO {
  layerName: string;
  layerType: LayerType;
  zIndex?: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  isVisible?: boolean;
  isLocked?: boolean;
  contentConfig?: LayerContentConfig;
  styleConfig?: LayerStyleConfig;
  animationConfig?: AnimationConfig;
  scheduleConfig?: ScheduleConfig;
}

// DTO for updating a layout
export interface UpdateLayoutDTO {
  name?: string;
  description?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  thumbnailUrl?: string;
  tags?: string;
  isActive?: boolean;
}

// DTO for updating a layout layer
export interface UpdateLayoutLayerDTO {
  layerName?: string;
  layerType?: LayerType;
  zIndex?: number;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  isVisible?: boolean;
  isLocked?: boolean;
  contentConfig?: LayerContentConfig;
  styleConfig?: LayerStyleConfig;
  animationConfig?: AnimationConfig;
  scheduleConfig?: ScheduleConfig;
}
