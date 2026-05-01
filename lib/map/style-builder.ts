  import maplibregl from "maplibre-gl";
import { MapConfig } from "@/types/map";
import { BASEMAPS } from "./basemaps";

export const buildMapStyle = (config: MapConfig) => {
  return BASEMAPS[config.basemap].url;
};

/**
 * Pattern-based layer classifier.
 * Iterates ALL layers in the loaded style and classifies each one
 * by matching its ID and source-layer against known patterns.
 * This is robust across different style versions and tile providers.
 */
type LayerCategory =
  | "background"
  | "land"
  | "landcover"
  | "water"
  | "waterways"
  | "parks"
  | "buildings"
  | "roads_major"
  | "roads_minor_high"
  | "roads_minor_mid"
  | "roads_minor_low"
  | "roads_path"
  | "road_outline"
  | "rail"
  | "aeroway"
  | null;

function classifyLayer(layer: maplibregl.LayerSpecification): LayerCategory {
  const id = layer.id.toLowerCase();
  const sourceLayer = ("source-layer" in layer ? (layer as any)["source-layer"] : "")?.toLowerCase() ?? "";

  if (layer.type === "background") return "background";

  // Water
  if (id.includes("water") && !id.includes("waterway") && !id.includes("way")) {
    if (sourceLayer.includes("water") || id.includes("water")) return "water";
  }
  if (id.includes("waterway") || id.includes("river") || id.includes("stream") || id.includes("canal")) return "waterways";
  if (sourceLayer === "waterway") return "waterways";
  if (sourceLayer === "water") return "water";

  // Parks / green
  if (id.includes("park") || id.includes("grass") || id.includes("meadow") || id.includes("forest") || id.includes("wood")) return "parks";
  if (sourceLayer === "park") return "parks";

  // Buildings
  if (id.includes("building") || sourceLayer === "building") return "buildings";

  // Rail / transit
  if (id.includes("rail") || id.includes("subway") || id.includes("transit") || sourceLayer === "transportation" && id.includes("rail")) return "rail";

  // Aeroway
  if (id.includes("aeroway") || id.includes("airport") || id.includes("runway") || id.includes("taxiway")) return "aeroway";

  // Roads — classify by rank
  if (
    sourceLayer === "transportation" ||
    id.includes("road") ||
    id.includes("highway") ||
    id.includes("street") ||
    id.includes("path")
  ) {
    // Check specific modifiers first (Outline/Casing)
    if (id.includes("outline") || id.includes("casing") || id.includes("border")) return "road_outline";
    
    // Check Paths
    if (id.includes("path") || id.includes("track") || id.includes("foot") || id.includes("cycle") || id.includes("pedestrian") || id.includes("steps")) return "roads_path";

    // Check Major Roads
    if (id.includes("motorway") || id.includes("trunk") || id.includes("primary")) return "roads_major";
    
    // Check Minor High/Mid
    if (id.includes("secondary")) return "roads_minor_high";
    if (id.includes("tertiary")) return "roads_minor_mid";
    
    // Check Minor Low
    if (id.includes("residential") || id.includes("minor") || id.includes("service") || id.includes("street") || id.includes("unclassified") || id.includes("link")) return "roads_minor_low";
    
    // Generic fallback for any other transportation lines
    return "roads_minor_mid";
  }

  // Landcover / landuse
  if (id.includes("landcover") || id.includes("landuse") || sourceLayer === "landcover" || sourceLayer === "landuse") {
    return "landcover";
  }

  // Land (fill catch-all)
  if (id.includes("land") && layer.type === "fill") return "land";

  return null;
}

/**
 * Maps a category to the correct paint property key for this layer type.
 */
function getPaintKey(layerType: string): string | null {
  if (layerType === "fill") return "fill-color";
  if (layerType === "line") return "line-color";
  if (layerType === "background") return "background-color";
  if (layerType === "fill-extrusion") return "fill-extrusion-color";
  if (layerType === "circle") return "circle-color";
  return null;
}

/**
 * Main function: applies theme colours + layer visibility to the map.
 * Works by scanning all layers in the loaded style at runtime.
 */
export const applyLayerStyling = (map: maplibregl.Map, config: MapConfig) => {
  const style = map.getStyle();
  if (!style?.layers) return;

  const { themeColors } = config;

  // Category → colour lookup
  const colorMap: Record<string, string> = {
    background:       themeColors.land,
    land:             themeColors.land,
    landcover:        themeColors.landcover,
    water:            themeColors.water,
    waterways:        themeColors.waterways,
    parks:            themeColors.parks,
    buildings:        themeColors.buildings,
    roads_major:      themeColors.roads_major,
    roads_minor_high: themeColors.roads_minor_high,
    roads_minor_mid:  themeColors.roads_minor_mid,
    roads_minor_low:  themeColors.roads_minor_low,
    roads_path:       themeColors.roads_path,
    road_outline:     themeColors.road_outline,
    rail:             themeColors.rail,
    aeroway:          themeColors.aeroway,
  };

  // 1. Apply theme colours to all classified layers
  for (const layer of style.layers) {
    const category = classifyLayer(layer);
    if (!category) continue;

    const color = colorMap[category];
    const paintKey = getPaintKey(layer.type);
    if (!color || !paintKey) continue;

    try {
      map.setPaintProperty(layer.id, paintKey, color);

      // Also set opacity for fill layers
      if (layer.type === "fill") {
        map.setPaintProperty(layer.id, "fill-opacity", 1);
        try {
          map.setPaintProperty(layer.id, "fill-outline-color", color);
        } catch (_) {}
      }
    } catch (_) {
      // Skip layers that don't support this property
    }
  }

  // 2. Apply visibility from config.layers
  // Build lookup: layerId → visible
  const layerVisibility: Record<string, boolean> = {};
  config.layers.forEach(l => { layerVisibility[l.id] = l.visible; });

  const visibilityPatterns: Record<string, string[]> = {
    land:      ["background", "land"],
    landcover: ["landcover", "landuse"],
    water:     ["water"],
    waterways: ["waterways"],
    parks:     ["parks"],
    buildings: ["buildings"],
    roads:     ["roads_minor_mid", "roads_minor_low", "roads_path"],
    rail:      ["rail"],
    aeroway:   ["aeroway"],
  };

  for (const layer of style.layers) {
    const category = classifyLayer(layer);
    if (!category) continue;

    const configLayerId = Object.entries(visibilityPatterns).find(([, cats]) =>
      cats.includes(category)
    )?.[0];

    if (configLayerId && configLayerId in layerVisibility) {
      const visible = layerVisibility[configLayerId];
      try {
        map.setLayoutProperty(layer.id, "visibility", visible ? "visible" : "none");
      } catch (_) {}
    }
  }

  // 3. POSTER MODE — Hide all symbol layers (road names, POI icons, route shields,
  //    neighbourhood labels). This is the single change that converts a navigation
  //    map into clean cartographic art.
  for (const layer of style.layers) {
    if (layer.type === "symbol") {
      try {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } catch (_) {}
    }
  }

  // 4. Hide administrative boundary lines (dashed circles for districts / states).
  for (const layer of style.layers) {
    const id = layer.id.toLowerCase();
    if (
      id.includes("admin") ||
      id.includes("boundary") ||
      id.includes("border") ||
      id.includes("disputed")
    ) {
      try {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } catch (_) {}
    }
  }

  // 5. Delicate, persistent road network interpolation
  //    Keeps roads extremely thin but ensures they are ALWAYS visible
  //    (never fade to 0 opacity or 0 width) even when zoomed far out.
  const roadWidths: Record<string, any> = {
    roads_major:      ["interpolate", ["linear"], ["zoom"], 5, 0.4, 10, 1.0, 15, 2.5, 20, 5],
    roads_minor_high: ["interpolate", ["linear"], ["zoom"], 5, 0.2, 10, 0.6, 15, 1.8, 20, 4],
    roads_minor_mid:  ["interpolate", ["linear"], ["zoom"], 5, 0.15, 10, 0.4, 15, 1.2, 20, 3.5],
    roads_minor_low:  ["interpolate", ["linear"], ["zoom"], 5, 0.1, 10, 0.25, 15, 0.8, 20, 2.5],
    roads_path:       ["interpolate", ["linear"], ["zoom"], 5, 0.1, 10, 0.2, 15, 0.5, 20, 2],
    waterways:        ["interpolate", ["linear"], ["zoom"], 5, 0.3, 10, 0.8, 15, 1.5, 20, 3],
    rail:             ["interpolate", ["linear"], ["zoom"], 5, 0.2, 10, 0.4, 15, 1.0, 20, 2],
  };

  for (const layer of style.layers) {
    if (layer.type !== "line") continue;
    const category = classifyLayer(layer);
    if (!category) continue;

    const widthExpr = roadWidths[category];
    if (widthExpr !== undefined) {
      try {
        map.setPaintProperty(layer.id, "line-width", widthExpr);
        // Force opacity to 1 so the default style doesn't fade them out at low zooms
        map.setPaintProperty(layer.id, "line-opacity", 1);
      } catch (_) {}
    }
  }
  // 6. Aggressive cleanup of all native map textures, dashes, and patterns.
  //    This forces the map into a pure vector aesthetic.
  for (const layer of style.layers) {
    if (layer.type === "fill") {
      try {
        map.setPaintProperty(layer.id, "fill-pattern", undefined as any);
      } catch (_) {}
    } else if (layer.type === "line") {
      try {
        map.setPaintProperty(layer.id, "line-pattern", undefined as any);
        map.setPaintProperty(layer.id, "line-dasharray", undefined as any);
      } catch (_) {}
    }
  }
};

/**
 * Applies 3D terrain and hillshading to the map.
 * Shared between MapCanvas and ExportPanel.
 */
export const applyTerrainStyling = (map: maplibregl.Map, config: MapConfig) => {
  if (!map.isStyleLoaded()) return;

  if (config.terrain3d) {
    if (!map.getSource('terrarium')) {
      map.addSource('terrarium', {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14
      });
    }
    // @ts-ignore
    map.setTerrain({ source: 'terrarium', exaggeration: 1.2 });

    // Add or update hillshade layer to make mountains visible
    if (!map.getLayer('terrarium-hillshade')) {
      const layers = map.getStyle().layers;
      const waterLayer = layers?.find(l => l.id.includes('water'));
      
      map.addLayer({
        id: 'terrarium-hillshade',
        type: 'hillshade',
        source: 'terrarium',
        paint: {
          'hillshade-shadow-color': config.themeColors.land,
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': config.themeColors.land,
          'hillshade-exaggeration': 1
        }
      }, waterLayer ? waterLayer.id : undefined);
    } else {
      map.setPaintProperty('terrarium-hillshade', 'hillshade-shadow-color', config.themeColors.land);
      map.setPaintProperty('terrarium-hillshade', 'hillshade-accent-color', config.themeColors.land);
    }
  } else {
    // @ts-ignore
    map.setTerrain(null);
    if (map.getLayer('terrarium-hillshade')) {
      map.removeLayer('terrarium-hillshade');
    }
  }
};
