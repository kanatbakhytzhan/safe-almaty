# PostGIS Integration Guide for Safe Almaty

## Overview
This document explains how PostGIS is integrated into the Safe Almaty project, given Prisma's limitations with geospatial data types.

---

## Prisma Limitations

Prisma does **not natively support** PostGIS geometry types (`Point`, `Polygon`, etc.). Therefore, we use a hybrid approach:

1. **Schema Definition:** Use `Unsupported("geometry(Point, 4326)")` in Prisma schema
2. **Data Access:** Use Prisma for standard CRUD, raw SQL for geospatial queries
3. **Migrations:** Create PostGIS extension and spatial indexes via raw SQL

---

## Database Setup

### 1. Enable PostGIS Extension

After creating your PostgreSQL database, run:

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify installation
SELECT PostGIS_version();
```

### 2. Create Spatial Indexes

Run these after Prisma creates the base tables:

```sql
-- Spatial index on locations.coordinates (Point)
CREATE INDEX idx_locations_coordinates 
ON locations 
USING GIST (coordinates);

-- Spatial index on safe_zones.boundary (Polygon)
CREATE INDEX idx_safe_zones_boundary 
ON safe_zones 
USING GIST (boundary);

-- Spatial index on emergency_contacts.service_area (Polygon, nullable)
CREATE INDEX idx_emergency_contacts_service_area 
ON emergency_contacts 
USING GIST (service_area)
WHERE service_area IS NOT NULL;

-- Spatial index on emergency_logs.coordinates (Point)
CREATE INDEX idx_emergency_logs_coordinates 
ON emergency_logs 
USING GIST (coordinates);
```

---

## Data Access Patterns

### Pattern 1: Inserting Location with Coordinates

```typescript
// Using raw SQL to insert PostGIS Point
const longitude = 76.9126; // Almaty coordinates
const latitude = 43.2220;

await prisma.$executeRaw`
  INSERT INTO locations (
    id, name, type, safety_rating, coordinates, created_at
  ) VALUES (
    ${locationId},
    ${name},
    ${type},
    ${safetyRating},
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
    NOW()
  )
`;
```

### Pattern 2: Finding Nearest Locations

```typescript
// Find nearest 10 hospitals within 5km
const userLng = 76.9126;
const userLat = 43.2220;
const radiusKm = 5;

const nearestLocations = await prisma.$queryRaw`
  SELECT 
    id,
    name,
    type,
    safety_rating,
    ST_Distance(
      coordinates,
      ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography
    ) / 1000 AS distance_km
  FROM locations
  WHERE 
    type = 'HOSPITAL'
    AND ST_DWithin(
      coordinates::geography,
      ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography,
      ${radiusKm * 1000} -- Convert km to meters
    )
  ORDER BY distance_km ASC
  LIMIT 10
`;
```

### Pattern 3: Checking if Point is in Safe Zone

```typescript
// Check if user location is within any safe zone
const userLng = 76.9126;
const userLat = 43.2220;

const safeZones = await prisma.$queryRaw`
  SELECT 
    id,
    name,
    safety_level
  FROM safe_zones
  WHERE 
    is_active = true
    AND ST_Within(
      ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326),
      boundary
    )
`;
```

### Pattern 4: Bounding Box Query (Map Viewport)

```typescript
// Get all locations within map viewport (bounding box)
const bounds = {
  north: 43.3,
  south: 43.1,
  east: 77.1,
  west: 76.7
};

const locations = await prisma.$queryRaw`
  SELECT 
    id,
    name,
    type,
    safety_rating,
    ST_X(coordinates) AS longitude,
    ST_Y(coordinates) AS latitude
  FROM locations
  WHERE 
    ST_Within(
      coordinates,
      ST_MakeEnvelope(
        ${bounds.west}, ${bounds.south},
        ${bounds.east}, ${bounds.north},
        4326
      )
    )
`;
```

### Pattern 5: Hybrid Query (Prisma + Raw SQL)

```typescript
// Get location with standard fields via Prisma, then add distance via raw SQL
const location = await prisma.location.findUnique({
  where: { id: locationId },
  select: {
    id: true,
    name: true,
    type: true,
    safetyRating: true,
    // ... other non-spatial fields
  }
});

// Add distance calculation
const distanceResult = await prisma.$queryRaw<Array<{ distance_km: number }>>`
  SELECT 
    ST_Distance(
      coordinates::geography,
      ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography
    ) / 1000 AS distance_km
  FROM locations
  WHERE id = ${locationId}
`;

const distance = distanceResult[0]?.distance_km || null;
```

---

## Utility Functions

Create helper functions in `src/lib/postgis.ts`:

```typescript
// Example structure (to be implemented in Phase 1)
export function createPoint(longitude: number, latitude: number) {
  // Returns SQL fragment for ST_MakePoint
}

export function calculateDistance(
  point1: { lng: number; lat: number },
  point2: { lng: number; lat: number }
) {
  // Calculate distance in kilometers
}

export function isWithinRadius(
  center: { lng: number; lat: number },
  point: { lng: number; lat: number },
  radiusKm: number
) {
  // Check if point is within radius
}
```

---

## Migration Strategy

1. **Initial Migration:** Run `npx prisma migrate dev` to create base tables
2. **PostGIS Migration:** Create a separate SQL migration file for PostGIS setup
3. **Spatial Indexes:** Add indexes after tables are created

### Example Migration File: `prisma/migrations/XXXXX_add_postgis/migration.sql`

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add spatial indexes
CREATE INDEX IF NOT EXISTS idx_locations_coordinates 
ON locations USING GIST (coordinates);

CREATE INDEX IF NOT EXISTS idx_safe_zones_boundary 
ON safe_zones USING GIST (boundary);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_service_area 
ON emergency_contacts USING GIST (service_area)
WHERE service_area IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_emergency_logs_coordinates 
ON emergency_logs USING GIST (coordinates);
```

---

## Performance Considerations

1. **Always use spatial indexes** on geometry columns
2. **Use `::geography`** for distance calculations (more accurate for lat/lng)
3. **Use `::geometry`** for geometric operations (faster, less accurate)
4. **Limit result sets** with `LIMIT` clauses
5. **Use bounding box queries** for map viewport filtering
6. **Consider materialized views** for frequently queried aggregations

---

## Testing PostGIS

```sql
-- Test PostGIS is working
SELECT 
  ST_SetSRID(ST_MakePoint(76.9126, 43.2220), 4326) AS almaty_point;

-- Test distance calculation
SELECT 
  ST_Distance(
    ST_SetSRID(ST_MakePoint(76.9126, 43.2220), 4326)::geography,
    ST_SetSRID(ST_MakePoint(76.9500, 43.2500), 4326)::geography
  ) / 1000 AS distance_km;
```

---

## Coordinate System

- **SRID:** 4326 (WGS84) - Standard for GPS coordinates
- **Format:** Longitude (X), Latitude (Y)
- **Almaty Center:** ~76.9126° E, 43.2220° N

