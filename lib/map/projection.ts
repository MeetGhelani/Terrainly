/**
 * Precision Mercator Projection Engine
 * Translates geographic coordinates to canvas pixel space.
 * Matches MapLibre's internal projection for perfect alignment.
 */

export interface Point {
  x: number;
  y: number;
}

export interface LngLat {
  lng: number;
  lat: number;
}

/**
 * Projects a LngLat coordinate to Canvas pixel space
 * 
 * @param point - The target [lng, lat] to project
 * @param center - The map center [lng, lat]
 * @param zoom - The map zoom level
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @param bearing - Map bearing in degrees (0 = North)
 * @returns {Point} - The {x, y} coordinates on the canvas
 */
export function project(
  point: LngLat,
  center: LngLat,
  zoom: number,
  width: number,
  height: number,
  bearing: number = 0
): Point {
  // World size at zoom level (MapLibre uses 512px tiles)
  const worldSize = 512 * Math.pow(2, zoom);

  // Project to Mercator World Space (0 to worldSize)
  const lonToX = (lon: number) => ((lon + 180) / 360) * worldSize;
  const latToY = (lat: number) => {
    const sinLat = Math.sin((lat * Math.PI) / 180);
    return (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize;
  };

  const centerWorldX = lonToX(center.lng);
  const centerWorldY = latToY(center.lat);
  const pointWorldX = lonToX(point.lng);
  const pointWorldY = latToY(point.lat);

  // Delta in world pixels relative to center
  let dx = pointWorldX - centerWorldX;
  let dy = pointWorldY - centerWorldY;

  // Apply Rotation (Bearing)
  // Map bearing is clockwise, so we rotate the point relative to center counter-clockwise
  if (bearing !== 0) {
    const angle = (-bearing * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    
    dx = rx;
    dy = ry;
  }

  // Translate to Canvas Space
  // (width/2, height/2) is the map center on the canvas
  return {
    x: width / 2 + dx,
    y: height / 2 + dy,
  };
}

/**
 * Calculates the relative ratio (0-1) of a point on the canvas.
 * Useful for checking if a point is within the viewport.
 */
export function projectToRatio(
  point: LngLat,
  center: LngLat,
  zoom: number,
  width: number,
  height: number,
  bearing: number = 0
): Point {
  const p = project(point, center, zoom, width, height, bearing);
  return {
    x: p.x / width,
    y: p.y / height,
  };
}
