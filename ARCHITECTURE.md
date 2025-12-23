# Safe Almaty - Architecture Documentation

## Project Overview
A production-ready geospatial platform for safety guidance and emergency response in Almaty, Kazakhstan. Built with Next.js 14, PostgreSQL + PostGIS, and React-Leaflet.

---

## Folder Structure

```
safe-almaty/
├── .env.local                    # Environment variables
├── .env.example                  # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── prisma/
│   ├── schema.prisma            # Database schema with PostGIS
│   └── migrations/              # Prisma migrations
├── public/
│   ├── images/
│   │   ├── almaty-backgrounds/  # High-quality Almaty images
│   │   └── icons/
│   └── fonts/
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── map/
│   │   │   │   └── page.tsx     # Main map view
│   │   │   ├── locations/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx # Location detail page
│   │   │   │   └── page.tsx     # Locations list
│   │   │   ├── safety-tips/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── locations/
│   │   │   │   ├── route.ts     # GET all, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts # GET one, PUT, DELETE
│   │   │   │   ├── nearby/
│   │   │   │   │   └── route.ts # Geospatial query
│   │   │   │   └── search/
│   │   │   │       └── route.ts # Search with filters
│   │   │   ├── emergency/
│   │   │   │   ├── sos/
│   │   │   │   │   └── route.ts # SOS endpoint
│   │   │   │   └── contacts/
│   │   │   │       └── route.ts
│   │   │   └── safety-tips/
│   │   │       └── route.ts
│   │   └── globals.css           # Global styles + Tailwind
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   ├── map/
│   │   │   ├── MapContainer.tsx # Main map wrapper
│   │   │   ├── MapControls.tsx  # Layer toggles, filters
│   │   │   ├── LocationMarker.tsx
│   │   │   ├── MarkerCluster.tsx
│   │   │   ├── UserLocation.tsx  # Geolocation tracking
│   │   │   └── MapLegend.tsx
│   │   ├── location/
│   │   │   ├── LocationCard.tsx
│   │   │   ├── LocationDetail.tsx
│   │   │   ├── SafetyRating.tsx
│   │   │   └── LocationFilters.tsx
│   │   ├── emergency/
│   │   │   ├── SOSButton.tsx    # Prominent emergency button
│   │   │   ├── EmergencyModal.tsx
│   │   │   └── EmergencyContacts.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── GlassmorphicCard.tsx
│   │   └── safety/
│   │       ├── SafetyTipsList.tsx
│   │       └── SafetyTipCard.tsx
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── postgis.ts           # PostGIS utility functions
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── geospatial.ts        # Geospatial calculations
│   │   └── utils.ts             # General utilities
│   ├── hooks/
│   │   ├── useGeolocation.ts    # Browser geolocation hook
│   │   ├── useMapData.ts        # Map data fetching
│   │   ├── useAuth.ts           # Authentication hook
│   │   └── useSOS.ts            # SOS functionality hook
│   ├── types/
│   │   ├── database.ts          # Prisma-generated types
│   │   ├── map.ts               # Map-related types
│   │   ├── location.ts          # Location types
│   │   └── auth.ts              # Auth types
│   ├── styles/
│   │   └── animations.ts        # Framer Motion variants
│   └── constants/
│       ├── map.ts               # Map constants (center, zoom, etc.)
│       ├── locations.ts         # Location type enums
│       └── emergency.ts         # Emergency contact constants
```

---

## Database Architecture

### Technology Stack
- **Database:** PostgreSQL 14+ with PostGIS 3.0+ extension
- **ORM:** Prisma with raw SQL support for PostGIS functions
- **Connection:** Connection pooling via Prisma

### PostGIS Integration Strategy

1. **Schema Setup:**
   - PostGIS extension enabled in PostgreSQL
   - Coordinates stored as `geometry(Point, 4326)` (WGS84)
   - Spatial indexes on geometry columns for performance

2. **Prisma Limitations:**
   - Prisma doesn't natively support PostGIS geometry types
   - Solution: Use `Unsupported("geometry")` type in Prisma schema
   - Access PostGIS functions via raw SQL queries in API routes

3. **Geospatial Queries:**
   - Use `ST_Distance`, `ST_Within`, `ST_Buffer` for spatial operations
   - Create spatial indexes: `CREATE INDEX idx_locations_coordinates ON locations USING GIST (coordinates);`
   - Use `ST_SetSRID` and `ST_MakePoint` for coordinate creation

4. **Data Access Pattern:**
   - Standard CRUD: Use Prisma for non-spatial fields
   - Geospatial queries: Use `prisma.$queryRaw` with PostGIS SQL
   - Hybrid approach: Combine Prisma queries with raw SQL for complex spatial operations

---

## Key Design Decisions

### 1. Authentication
- JWT-based authentication with httpOnly cookies
- Role-based access control (Tourist vs. Resident)
- Protected routes via middleware

### 2. Map Performance
- Marker clustering for large datasets
- Lazy loading of location data
- Debounced filtering and search
- Efficient bounding box queries

### 3. UI/UX
- Glassmorphism design system
- Framer Motion for smooth animations
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities

### 4. Security
- Input validation on both client and server
- SQL injection prevention via Prisma parameterized queries
- Rate limiting on API routes
- CORS configuration

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/safe_almaty?schema=public"

# NextAuth (if using)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (if needed)
MAP_API_KEY="your-map-tile-provider-key"
```

---

## Next Steps

After confirmation, we will proceed with:
1. Initializing Next.js 14 project with TypeScript
2. Setting up Prisma with PostGIS schema
3. Creating database migrations
4. Implementing authentication system
5. Building the map infrastructure

