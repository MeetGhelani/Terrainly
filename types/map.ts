export interface LocationConfig {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
  bearing: number;
  label: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  opacity: number;
  gradient?: {
    enabled: boolean;
    stops: { offset: number; color: string }[];
  };
}

export interface Overlay {
  id: string;
  type: 'marker' | 'label' | 'text-label';
  lat: number;
  lng: number;
  label: string;
  icon?: string;
  color: string;
  size: number;
  // Text-label specific
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  textColor?: string;
  draggable?: boolean;
}

export interface Route {
  id: string;
  name: string;
  points: [number, number][]; // [lng, lat] for GeoJSON
  color: string;
  width: number;
  opacity: number;
  dashArray?: number[];
}

export interface CartographyConfig {
  compass: boolean;
  compassStyle: 'minimal' | 'classic' | 'ornate' | 'nautical' | 'modern';
  compassPosition: 'tl' | 'tr' | 'bl' | 'br';
  compassSize?: number;
  compassOpacity?: number;
  compassMargin?: number;
  neighborhoodLabels: boolean;
  grid: {
    enabled: boolean;
    color: string;
    opacity: number;
    dashArray: number[];
    showLabels: boolean;
    spacing: number;
    thickness: number;
  };
}

export interface FrameConfig {
  style: 'none' | 'thin' | 'double' | 'ornate' | 'oak' | 'walnut' | 'aluminum' | 'gold' | 'black-gallery' | 'mahogany';
  color: string;
  thickness: number;
  texture: 'none' | 'parchment' | 'linen' | 'aged' | 'kraft' | 'noise' | 'crumpled';
  textureOpacity: number; // 0 to 100
  shadow: boolean;
}

export interface TypographyConfig {
  city: string;
  subtitle: string;
  tagline: string;
  font: string;
  size: number;
  color: string;
  position: 'top' | 'bottom' | 'overlay';
  alignment: 'left' | 'center' | 'right';
  offsetX: number;
  offsetY: number;
}

export interface PosterConfig {
  ratio: 
    | 'A3' | 'A4' | 'A5' | 'LETTER'
    | 'A3-LANDSCAPE' | 'A4-LANDSCAPE' | 'A5-LANDSCAPE' | 'LETTER-LANDSCAPE'
    | '50x70' | '18x24' | '24x36'
    | '50x70-LANDSCAPE' | '18x24-LANDSCAPE' | '24x36-LANDSCAPE'
    | '1:1' | 'INSTA-PORTRAIT' | '9:16' | '16:9' | 'LINKEDIN' | 'TWITTER'
    | 'CUSTOM';
  width: number;
  height: number;
  dpi: 72 | 150 | 300;
  bgColor: string;
  layout: 'single' | 'grid-2x2' | 'grid-3x3' | 'collage';
}

export interface ThemeColors {
  land: string;
  landcover: string;
  water: string;
  waterways: string;
  parks: string;
  buildings: string;
  roads_major: string;
  roads_minor_high: string;
  roads_minor_mid: string;
  roads_minor_low: string;
  roads_path: string;
  road_outline: string;
  aeroway: string;
  rail: string;
  text: string;
  overlay: string;
}

export interface ThemePalette {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  colors: ThemeColors;
  swatchColors: string[]; // 5 preview swatches
}

export interface MapConfig {
  location: LocationConfig;
  basemap: 'vector' | 'satellite' | 'antique' | 'terrain';
  layers: LayerConfig[];
  overlays: Overlay[];
  routes: Route[];
  cartography: CartographyConfig;
  frame: FrameConfig;
  text: TypographyConfig;
  poster: PosterConfig;
  activeThemeId: string;
  themeColors: ThemeColors;
  showPosterText: boolean;
  showOverlayLayer: boolean;
  overlayTopFade: number; // 0 to 100
  overlayBottomFade: number; // 0 to 100
  overlayLeftFade: number; // 0 to 100
  overlayRightFade: number; // 0 to 100
  mapRadius: number; // in metres, controls zoom
  isLocked: boolean;
  terrain3d: boolean;
  watermark: boolean;
  uploadedMarkers: { id: string; url: string; name: string }[];
}
