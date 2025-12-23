# Prisma 7 Setup Notes

## Current Status

Prisma 7.2.0 has been installed, but it requires a different configuration approach than Prisma 6.

## Prisma 7 Changes

In Prisma 7, the `url` property in `datasource` is no longer supported in the schema file. The connection string should be:

1. **Option 1: Pass to PrismaClient constructor** (Recommended for now)
   - The connection is handled in `lib/prisma.ts`
   - Schema file only needs `provider = "postgresql"`

2. **Option 2: Use prisma.config.ts**
   - Create a `prisma.config.ts` file in the root
   - Define datasource there

## Current Schema Configuration

The schema file currently has:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // This causes error in Prisma 7
}
```

## Solution Options

### Option A: Downgrade to Prisma 6 (Stable)
```bash
npm install prisma@^6.0.0 @prisma/client@^6.0.0
```
This allows the traditional schema format with `url` in datasource.

### Option B: Update for Prisma 7
1. Remove `url` from schema.prisma datasource
2. Update `lib/prisma.ts` to pass connection string to PrismaClient
3. Or create `prisma.config.ts` with proper configuration

## Recommendation

For Phase 1, we can proceed without generating Prisma Client. The database connection will be configured in Phase 2 when we set up the actual database.

The app will run fine without Prisma Client generated - we just need it when we start making database queries.

## Next Steps

When ready to connect to database:
1. Choose Prisma version (6 or 7)
2. Configure connection string in `.env.local`
3. Run `npm run db:generate`
4. Run `npm run db:push` or create migrations

