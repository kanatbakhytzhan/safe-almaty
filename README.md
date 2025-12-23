# Safe Almaty 🏔️

A comprehensive safety guide and emergency response system for tourists and residents in Almaty, Kazakhstan.

## 🚀 Project Status

**Phase 1: Project Setup** ✅ Complete

- Next.js 14 with App Router initialized
- TypeScript configured
- Tailwind CSS with glassmorphism utilities
- Prisma schema with PostGIS support
- Beautiful landing page with Almaty theme
- Folder structure established

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React-Leaflet
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL + PostGIS
- **Styling:** Tailwind CSS with custom glassmorphism effects

## 📁 Project Structure

```
safe-almaty/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                   # Utility functions (Prisma, PostGIS)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── constants/             # App constants
├── prisma/                # Database schema
└── public/                # Static assets
```

See `ARCHITECTURE.md` for detailed structure.

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with PostGIS extension
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `DATABASE_URL` with your PostgreSQL connection string.

3. **Set up database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database (or use migrations)
   npm run db:push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🗄️ Database Setup

### PostGIS Extension

After creating your PostgreSQL database, enable PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

See `prisma/POSTGIS_SETUP.md` for detailed PostGIS integration guide.

## 🎨 Design System

The app uses a **glassmorphism** design system with:
- Frosted glass effects
- Smooth animations (Framer Motion)
- Almaty-themed color palette
- Responsive mobile-first design

## 📚 Documentation

- `ARCHITECTURE.md` - Project architecture and folder structure
- `prisma/POSTGIS_SETUP.md` - PostGIS integration guide
- `prisma/schema.prisma` - Database schema

## 🔜 Next Steps

- Phase 2: UI/UX Foundation & Authentication
- Phase 3: Interactive Map Implementation
- Phase 4: Tourist Features & SOS System

## 📄 License

MIT

---

Built with ❤️ for Almaty, Kazakhstan

