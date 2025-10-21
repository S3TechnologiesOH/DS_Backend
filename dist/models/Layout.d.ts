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
export type LayerType = 'text' | 'image' | 'video' | 'playlist' | 'html' | 'iframe' | 'weather' | 'rss' | 'news' | 'youtube' | 'clock' | 'shape';
export interface LayerContentConfig {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    lineHeight?: number;
    imageUrl?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    videoUrl?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    playlistId?: number;
    htmlContent?: string;
    iframeUrl?: string;
    allowFullscreen?: boolean;
    location?: string;
    units?: 'metric' | 'imperial';
    apiKey?: string;
    feedUrl?: string;
    refreshInterval?: number;
    maxItems?: number;
    videoId?: string;
    format?: string;
    timezone?: string;
    shapeType?: 'rectangle' | 'circle' | 'ellipse' | 'polygon';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}
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
export interface AnimationConfig {
    type?: 'none' | 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'zoom' | 'rotate' | 'bounce';
    duration?: number;
    delay?: number;
    iterations?: number | 'infinite';
    easing?: string;
}
export interface ScheduleConfig {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
}
export interface CreateLayoutDTO {
    name: string;
    description?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    tags?: string;
    layers?: CreateLayoutLayerDTO[];
}
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
//# sourceMappingURL=Layout.d.ts.map