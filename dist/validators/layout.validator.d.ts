/**
 * Layout Validation Schemas
 *
 * Zod schemas for layout-related requests.
 */
import { z } from 'zod';
export declare const createLayoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        backgroundColor: z.ZodDefault<z.ZodString>;
        tags: z.ZodOptional<z.ZodString>;
        layers: z.ZodOptional<z.ZodArray<z.ZodObject<{
            layerName: z.ZodString;
            layerType: z.ZodEnum<["text", "image", "video", "playlist", "html", "iframe", "weather", "rss", "news", "youtube", "clock", "shape"]>;
            zIndex: z.ZodDefault<z.ZodNumber>;
            positionX: z.ZodNumber;
            positionY: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotation: z.ZodDefault<z.ZodNumber>;
            opacity: z.ZodDefault<z.ZodNumber>;
            isVisible: z.ZodDefault<z.ZodBoolean>;
            isLocked: z.ZodDefault<z.ZodBoolean>;
            contentConfig: z.ZodOptional<z.ZodObject<{
                text: z.ZodOptional<z.ZodString>;
                fontSize: z.ZodOptional<z.ZodNumber>;
                fontFamily: z.ZodOptional<z.ZodString>;
                fontWeight: z.ZodOptional<z.ZodString>;
                fontStyle: z.ZodOptional<z.ZodString>;
                textAlign: z.ZodOptional<z.ZodEnum<["left", "center", "right", "justify"]>>;
                color: z.ZodOptional<z.ZodString>;
                lineHeight: z.ZodOptional<z.ZodNumber>;
                imageUrl: z.ZodOptional<z.ZodString>;
                objectFit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill", "scale-down", "none"]>>;
                videoUrl: z.ZodOptional<z.ZodString>;
                autoplay: z.ZodOptional<z.ZodBoolean>;
                loop: z.ZodOptional<z.ZodBoolean>;
                muted: z.ZodOptional<z.ZodBoolean>;
                controls: z.ZodOptional<z.ZodBoolean>;
                playlistId: z.ZodOptional<z.ZodNumber>;
                htmlContent: z.ZodOptional<z.ZodString>;
                iframeUrl: z.ZodOptional<z.ZodString>;
                allowFullscreen: z.ZodOptional<z.ZodBoolean>;
                location: z.ZodOptional<z.ZodString>;
                units: z.ZodOptional<z.ZodEnum<["metric", "imperial"]>>;
                apiKey: z.ZodOptional<z.ZodString>;
                feedUrl: z.ZodOptional<z.ZodString>;
                refreshInterval: z.ZodOptional<z.ZodNumber>;
                maxItems: z.ZodOptional<z.ZodNumber>;
                videoId: z.ZodOptional<z.ZodString>;
                format: z.ZodOptional<z.ZodString>;
                timezone: z.ZodOptional<z.ZodString>;
                shapeType: z.ZodOptional<z.ZodEnum<["rectangle", "circle", "ellipse", "polygon"]>>;
                fill: z.ZodOptional<z.ZodString>;
                stroke: z.ZodOptional<z.ZodString>;
                strokeWidth: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            }, {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            }>>;
            styleConfig: z.ZodOptional<z.ZodObject<{
                backgroundColor: z.ZodOptional<z.ZodString>;
                borderWidth: z.ZodOptional<z.ZodNumber>;
                borderColor: z.ZodOptional<z.ZodString>;
                borderRadius: z.ZodOptional<z.ZodNumber>;
                borderStyle: z.ZodOptional<z.ZodEnum<["solid", "dashed", "dotted"]>>;
                boxShadow: z.ZodOptional<z.ZodString>;
                padding: z.ZodOptional<z.ZodObject<{
                    top: z.ZodNumber;
                    right: z.ZodNumber;
                    bottom: z.ZodNumber;
                    left: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                }, {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                }>>;
                blendMode: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            }, {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            }>>;
            animationConfig: z.ZodOptional<z.ZodObject<{
                type: z.ZodOptional<z.ZodEnum<["none", "fadeIn", "fadeOut", "slideIn", "slideOut", "zoom", "rotate", "bounce"]>>;
                duration: z.ZodOptional<z.ZodNumber>;
                delay: z.ZodOptional<z.ZodNumber>;
                iterations: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
                easing: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            }, {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            }>>;
            scheduleConfig: z.ZodOptional<z.ZodObject<{
                startDate: z.ZodOptional<z.ZodString>;
                endDate: z.ZodOptional<z.ZodString>;
                startTime: z.ZodOptional<z.ZodString>;
                endTime: z.ZodOptional<z.ZodString>;
                daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            }, "strip", z.ZodTypeAny, {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            }, {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            }>>;
        }, "strip", z.ZodTypeAny, {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }, {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        description?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
        layers?: {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }[];
    }, {
        name?: string;
        description?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
        layers?: {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        description?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
        layers?: {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }[];
    };
}, {
    body?: {
        name?: string;
        description?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
        layers?: {
            width?: number;
            height?: number;
            layerName?: string;
            layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
            zIndex?: number;
            positionX?: number;
            positionY?: number;
            rotation?: number;
            opacity?: number;
            isVisible?: boolean;
            isLocked?: boolean;
            contentConfig?: {
                fill?: string;
                apiKey?: string;
                text?: string;
                location?: string;
                fontSize?: number;
                fontFamily?: string;
                fontWeight?: string;
                fontStyle?: string;
                textAlign?: "left" | "center" | "right" | "justify";
                color?: string;
                lineHeight?: number;
                imageUrl?: string;
                objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
                videoUrl?: string;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
                playlistId?: number;
                htmlContent?: string;
                iframeUrl?: string;
                allowFullscreen?: boolean;
                units?: "metric" | "imperial";
                feedUrl?: string;
                refreshInterval?: number;
                maxItems?: number;
                videoId?: string;
                format?: string;
                timezone?: string;
                shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
                stroke?: string;
                strokeWidth?: number;
            };
            styleConfig?: {
                backgroundColor?: string;
                borderWidth?: number;
                borderColor?: string;
                borderRadius?: number;
                borderStyle?: "solid" | "dashed" | "dotted";
                boxShadow?: string;
                padding?: {
                    left?: number;
                    right?: number;
                    top?: number;
                    bottom?: number;
                };
                blendMode?: string;
            };
            animationConfig?: {
                type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
                duration?: number;
                delay?: number;
                iterations?: number | "infinite";
                easing?: string;
            };
            scheduleConfig?: {
                startDate?: string;
                endDate?: string;
                startTime?: string;
                endTime?: string;
                daysOfWeek?: number[];
            };
        }[];
    };
}>;
export declare const updateLayoutSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        backgroundColor: z.ZodOptional<z.ZodString>;
        thumbnailUrl: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        name?: string;
        description?: string;
        thumbnailUrl?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
    }, {
        isActive?: boolean;
        name?: string;
        description?: string;
        thumbnailUrl?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        description?: string;
        thumbnailUrl?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
    };
}, {
    params?: {
        layoutId?: string;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        description?: string;
        thumbnailUrl?: string;
        width?: number;
        height?: number;
        tags?: string;
        backgroundColor?: string;
    };
}>;
export declare const getLayoutByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
}, {
    params?: {
        layoutId?: string;
    };
}>;
export declare const deleteLayoutSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
}, {
    params?: {
        layoutId?: string;
    };
}>;
export declare const duplicateLayoutSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
    }, {
        name?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
    body?: {
        name?: string;
    };
}, {
    params?: {
        layoutId?: string;
    };
    body?: {
        name?: string;
    };
}>;
export declare const listLayoutsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isActive?: "true" | "false";
        search?: string;
        limit?: number;
        page?: number;
    }, {
        isActive?: "true" | "false";
        search?: string;
        limit?: string;
        page?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        isActive?: "true" | "false";
        search?: string;
        limit?: number;
        page?: number;
    };
}, {
    query?: {
        isActive?: "true" | "false";
        search?: string;
        limit?: string;
        page?: string;
    };
}>;
export declare const getLayersSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
}, {
    params?: {
        layoutId?: string;
    };
}>;
export declare const addLayerSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
    }, {
        layoutId?: string;
    }>;
    body: z.ZodObject<{
        layerName: z.ZodString;
        layerType: z.ZodEnum<["text", "image", "video", "playlist", "html", "iframe", "weather", "rss", "news", "youtube", "clock", "shape"]>;
        zIndex: z.ZodDefault<z.ZodNumber>;
        positionX: z.ZodNumber;
        positionY: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        rotation: z.ZodDefault<z.ZodNumber>;
        opacity: z.ZodDefault<z.ZodNumber>;
        isVisible: z.ZodDefault<z.ZodBoolean>;
        isLocked: z.ZodDefault<z.ZodBoolean>;
        contentConfig: z.ZodOptional<z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            fontSize: z.ZodOptional<z.ZodNumber>;
            fontFamily: z.ZodOptional<z.ZodString>;
            fontWeight: z.ZodOptional<z.ZodString>;
            fontStyle: z.ZodOptional<z.ZodString>;
            textAlign: z.ZodOptional<z.ZodEnum<["left", "center", "right", "justify"]>>;
            color: z.ZodOptional<z.ZodString>;
            lineHeight: z.ZodOptional<z.ZodNumber>;
            imageUrl: z.ZodOptional<z.ZodString>;
            objectFit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill", "scale-down", "none"]>>;
            videoUrl: z.ZodOptional<z.ZodString>;
            autoplay: z.ZodOptional<z.ZodBoolean>;
            loop: z.ZodOptional<z.ZodBoolean>;
            muted: z.ZodOptional<z.ZodBoolean>;
            controls: z.ZodOptional<z.ZodBoolean>;
            playlistId: z.ZodOptional<z.ZodNumber>;
            htmlContent: z.ZodOptional<z.ZodString>;
            iframeUrl: z.ZodOptional<z.ZodString>;
            allowFullscreen: z.ZodOptional<z.ZodBoolean>;
            location: z.ZodOptional<z.ZodString>;
            units: z.ZodOptional<z.ZodEnum<["metric", "imperial"]>>;
            apiKey: z.ZodOptional<z.ZodString>;
            feedUrl: z.ZodOptional<z.ZodString>;
            refreshInterval: z.ZodOptional<z.ZodNumber>;
            maxItems: z.ZodOptional<z.ZodNumber>;
            videoId: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            timezone: z.ZodOptional<z.ZodString>;
            shapeType: z.ZodOptional<z.ZodEnum<["rectangle", "circle", "ellipse", "polygon"]>>;
            fill: z.ZodOptional<z.ZodString>;
            stroke: z.ZodOptional<z.ZodString>;
            strokeWidth: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        }, {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        }>>;
        styleConfig: z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodString>;
            borderWidth: z.ZodOptional<z.ZodNumber>;
            borderColor: z.ZodOptional<z.ZodString>;
            borderRadius: z.ZodOptional<z.ZodNumber>;
            borderStyle: z.ZodOptional<z.ZodEnum<["solid", "dashed", "dotted"]>>;
            boxShadow: z.ZodOptional<z.ZodString>;
            padding: z.ZodOptional<z.ZodObject<{
                top: z.ZodNumber;
                right: z.ZodNumber;
                bottom: z.ZodNumber;
                left: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            }, {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            }>>;
            blendMode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        }, {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        }>>;
        animationConfig: z.ZodOptional<z.ZodObject<{
            type: z.ZodOptional<z.ZodEnum<["none", "fadeIn", "fadeOut", "slideIn", "slideOut", "zoom", "rotate", "bounce"]>>;
            duration: z.ZodOptional<z.ZodNumber>;
            delay: z.ZodOptional<z.ZodNumber>;
            iterations: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
            easing: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        }, {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        }>>;
        scheduleConfig: z.ZodOptional<z.ZodObject<{
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            startTime: z.ZodOptional<z.ZodString>;
            endTime: z.ZodOptional<z.ZodString>;
            daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        }, {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    }, {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
    };
    body?: {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    };
}, {
    params?: {
        layoutId?: string;
    };
    body?: {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    };
}>;
export declare const updateLayerSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
        layerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
        layerId?: number;
    }, {
        layoutId?: string;
        layerId?: string;
    }>;
    body: z.ZodObject<{
        layerName: z.ZodOptional<z.ZodString>;
        layerType: z.ZodOptional<z.ZodEnum<["text", "image", "video", "playlist", "html", "iframe", "weather", "rss", "news", "youtube", "clock", "shape"]>>;
        zIndex: z.ZodOptional<z.ZodNumber>;
        positionX: z.ZodOptional<z.ZodNumber>;
        positionY: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        rotation: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
        isVisible: z.ZodOptional<z.ZodBoolean>;
        isLocked: z.ZodOptional<z.ZodBoolean>;
        contentConfig: z.ZodOptional<z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            fontSize: z.ZodOptional<z.ZodNumber>;
            fontFamily: z.ZodOptional<z.ZodString>;
            fontWeight: z.ZodOptional<z.ZodString>;
            fontStyle: z.ZodOptional<z.ZodString>;
            textAlign: z.ZodOptional<z.ZodEnum<["left", "center", "right", "justify"]>>;
            color: z.ZodOptional<z.ZodString>;
            lineHeight: z.ZodOptional<z.ZodNumber>;
            imageUrl: z.ZodOptional<z.ZodString>;
            objectFit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill", "scale-down", "none"]>>;
            videoUrl: z.ZodOptional<z.ZodString>;
            autoplay: z.ZodOptional<z.ZodBoolean>;
            loop: z.ZodOptional<z.ZodBoolean>;
            muted: z.ZodOptional<z.ZodBoolean>;
            controls: z.ZodOptional<z.ZodBoolean>;
            playlistId: z.ZodOptional<z.ZodNumber>;
            htmlContent: z.ZodOptional<z.ZodString>;
            iframeUrl: z.ZodOptional<z.ZodString>;
            allowFullscreen: z.ZodOptional<z.ZodBoolean>;
            location: z.ZodOptional<z.ZodString>;
            units: z.ZodOptional<z.ZodEnum<["metric", "imperial"]>>;
            apiKey: z.ZodOptional<z.ZodString>;
            feedUrl: z.ZodOptional<z.ZodString>;
            refreshInterval: z.ZodOptional<z.ZodNumber>;
            maxItems: z.ZodOptional<z.ZodNumber>;
            videoId: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            timezone: z.ZodOptional<z.ZodString>;
            shapeType: z.ZodOptional<z.ZodEnum<["rectangle", "circle", "ellipse", "polygon"]>>;
            fill: z.ZodOptional<z.ZodString>;
            stroke: z.ZodOptional<z.ZodString>;
            strokeWidth: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        }, {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        }>>;
        styleConfig: z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodString>;
            borderWidth: z.ZodOptional<z.ZodNumber>;
            borderColor: z.ZodOptional<z.ZodString>;
            borderRadius: z.ZodOptional<z.ZodNumber>;
            borderStyle: z.ZodOptional<z.ZodEnum<["solid", "dashed", "dotted"]>>;
            boxShadow: z.ZodOptional<z.ZodString>;
            padding: z.ZodOptional<z.ZodObject<{
                top: z.ZodNumber;
                right: z.ZodNumber;
                bottom: z.ZodNumber;
                left: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            }, {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            }>>;
            blendMode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        }, {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        }>>;
        animationConfig: z.ZodOptional<z.ZodObject<{
            type: z.ZodOptional<z.ZodEnum<["none", "fadeIn", "fadeOut", "slideIn", "slideOut", "zoom", "rotate", "bounce"]>>;
            duration: z.ZodOptional<z.ZodNumber>;
            delay: z.ZodOptional<z.ZodNumber>;
            iterations: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"infinite">]>>;
            easing: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        }, {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        }>>;
        scheduleConfig: z.ZodOptional<z.ZodObject<{
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            startTime: z.ZodOptional<z.ZodString>;
            endTime: z.ZodOptional<z.ZodString>;
            daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        }, {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    }, {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
        layerId?: number;
    };
    body?: {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    };
}, {
    params?: {
        layoutId?: string;
        layerId?: string;
    };
    body?: {
        width?: number;
        height?: number;
        layerName?: string;
        layerType?: "text" | "image" | "video" | "playlist" | "html" | "iframe" | "weather" | "rss" | "news" | "youtube" | "clock" | "shape";
        zIndex?: number;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        opacity?: number;
        isVisible?: boolean;
        isLocked?: boolean;
        contentConfig?: {
            fill?: string;
            apiKey?: string;
            text?: string;
            location?: string;
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textAlign?: "left" | "center" | "right" | "justify";
            color?: string;
            lineHeight?: number;
            imageUrl?: string;
            objectFit?: "fill" | "cover" | "contain" | "scale-down" | "none";
            videoUrl?: string;
            autoplay?: boolean;
            loop?: boolean;
            muted?: boolean;
            controls?: boolean;
            playlistId?: number;
            htmlContent?: string;
            iframeUrl?: string;
            allowFullscreen?: boolean;
            units?: "metric" | "imperial";
            feedUrl?: string;
            refreshInterval?: number;
            maxItems?: number;
            videoId?: string;
            format?: string;
            timezone?: string;
            shapeType?: "rectangle" | "circle" | "ellipse" | "polygon";
            stroke?: string;
            strokeWidth?: number;
        };
        styleConfig?: {
            backgroundColor?: string;
            borderWidth?: number;
            borderColor?: string;
            borderRadius?: number;
            borderStyle?: "solid" | "dashed" | "dotted";
            boxShadow?: string;
            padding?: {
                left?: number;
                right?: number;
                top?: number;
                bottom?: number;
            };
            blendMode?: string;
        };
        animationConfig?: {
            type?: "none" | "fadeIn" | "fadeOut" | "slideIn" | "slideOut" | "zoom" | "rotate" | "bounce";
            duration?: number;
            delay?: number;
            iterations?: number | "infinite";
            easing?: string;
        };
        scheduleConfig?: {
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
            daysOfWeek?: number[];
        };
    };
}>;
export declare const deleteLayerSchema: z.ZodObject<{
    params: z.ZodObject<{
        layoutId: z.ZodEffects<z.ZodString, number, string>;
        layerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        layoutId?: number;
        layerId?: number;
    }, {
        layoutId?: string;
        layerId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        layoutId?: number;
        layerId?: number;
    };
}, {
    params?: {
        layoutId?: string;
        layerId?: string;
    };
}>;
//# sourceMappingURL=layout.validator.d.ts.map