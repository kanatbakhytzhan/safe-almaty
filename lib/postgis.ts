/**
 * PostGIS Utility Functions
 * 
 * Since Prisma doesn't natively support PostGIS geometry types,
 * we use raw SQL queries for geospatial operations.
 * 
 * All coordinates are in WGS84 (SRID 4326)
 */

/**
 * Creates a PostGIS Point from longitude and latitude
 * @param longitude - Longitude (X coordinate)
 * @param latitude - Latitude (Y coordinate)
 * @returns SQL fragment for ST_MakePoint
 */
export function createPointSQL(longitude: number, latitude: number): string {
  return `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
}

/**
 * Calculates distance between two points in kilometers
 * Uses PostGIS geography type for accurate calculations
 */
export function distanceQuery(
  point1: { lng: number; lat: number },
  point2: { lng: number; lat: number }
): string {
  return `
    ST_Distance(
      ST_SetSRID(ST_MakePoint(${point1.lng}, ${point1.lat}), 4326)::geography,
      ST_SetSRID(ST_MakePoint(${point2.lng}, ${point2.lat}), 4326)::geography
    ) / 1000
  `;
}

/**
 * Checks if a point is within a radius (in kilometers)
 */
export function withinRadiusQuery(
  center: { lng: number; lat: number },
  radiusKm: number
): string {
  const radiusMeters = radiusKm * 1000;
  return `
    ST_DWithin(
      coordinates::geography,
      ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326)::geography,
      ${radiusMeters}
    )
  `;
}

/**
 * Creates a bounding box envelope for map viewport queries
 */
export function boundingBoxQuery(bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): string {
  return `
    ST_MakeEnvelope(
      ${bounds.west}, ${bounds.south},
      ${bounds.east}, ${bounds.north},
      4326
    )
  `;
}

/**
 * Extracts longitude from a PostGIS Point
 */
export const extractLongitude = 'ST_X(coordinates) AS longitude';

/**
 * Extracts latitude from a PostGIS Point
 */
export const extractLatitude = 'ST_Y(coordinates) AS latitude';

