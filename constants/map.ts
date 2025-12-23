/**
 * Map Constants for Safe Almaty
 * 
 * Default center coordinates: Almaty, Kazakhstan
 */

export const ALMATY_CENTER: [number, number] = [43.238949, 76.889709];

export const DEFAULT_ZOOM = 13;

export const MIN_ZOOM = 10;
export const MAX_ZOOM = 18;

// Map tile provider (using OpenStreetMap by default)
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Marker clustering options
export const CLUSTER_OPTIONS = {
  maxClusterRadius: 50,
  disableClusteringAtZoom: 15,
} as const;

