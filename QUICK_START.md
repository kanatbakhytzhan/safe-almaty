# Quick Start Guide - Safe Almaty

This guide will help you set up the Safe Almaty project on a new machine.

---

## 📋 Prerequisites

Before you begin, make sure you have the following software installed:

### 1. Node.js (v18 or higher)
- **Download:** [https://nodejs.org/](https://nodejs.org/)
- **Verify installation:** Open terminal/command prompt and run:
  ```bash
  node --version
  npm --version
  ```
  Both commands should show version numbers.

### 2. PostgreSQL (v14 or higher) with PostGIS Extension
- **Download:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **Important:** During installation, make sure to install the **PostGIS** extension
- **Verify installation:** 
  ```bash
  psql --version
  ```

### 3. Git (Optional, for version control)
- **Download:** [https://git-scm.com/downloads](https://git-scm.com/downloads)

---

## 🚀 Setup Steps

### Step 1: Extract the Project

1. Extract the ZIP archive to your desired location (e.g., `C:\Users\YourName\Desktop\starttup`)
2. Open a terminal/command prompt in the project folder

### Step 2: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`. Wait for it to complete (may take a few minutes).

### Step 3: Create Environment Variables File

The `.env` file is **not included** in the ZIP archive for security reasons. You need to create it manually.

1. In the project root folder, create a new file named `.env` (no extension)
2. Copy and paste the following template:

```env
# Database Connection
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=SCHEMA
# Replace YOUR_PASSWORD with your actual PostgreSQL password
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/safe_almaty_db?schema=public"

# NextAuth.js Configuration
# Generate a secure secret using: openssl rand -base64 32
# Or use any random string (minimum 32 characters recommended)
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters-long"

# NextAuth.js URL (usually localhost:3000 for development)
NEXTAUTH_URL="http://localhost:3000"
```

3. **Replace the placeholders:**
   - `YOUR_PASSWORD`: Replace with your PostgreSQL database password
   - `your-secret-key-here-minimum-32-characters-long`: Replace with a random secret string (at least 32 characters)
     - **Tip:** You can generate a secure secret using:
       ```bash
       openssl rand -base64 32
       ```
       Or use any random string generator online.
     - **Windows PowerShell alternative:**
       ```powershell
       -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
       ```

### Step 4: Create the Database

1. Open PostgreSQL (pgAdmin or command line)
2. Create a new database named `safe_almaty_db`:
   ```sql
   CREATE DATABASE safe_almaty_db;
   ```
3. Connect to the database and enable PostGIS extension:
   ```sql
   \c safe_almaty_db
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

---

## 🗄️ Database Sync

### Step 1: Generate Prisma Client

Generate the Prisma Client based on your schema:

```bash
npx prisma generate
```

### Step 2: Push Schema to Database

Sync your Prisma schema with the database (creates all tables):

```bash
npx prisma db push
```

### Step 3: Seed the Database

Populate the database with initial data (locations, safety tips, etc.):

```bash
npm run db:seed
```

**Note:** This will create:
- 64+ locations (tourist spots, police stations, hospitals, safe zones, evacuation points, mountain shelters)
- 8 safety tips
- Sample data for testing

---

## ▶️ Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### First-Time Access

1. Open your browser and go to `http://localhost:3000`
2. You should see the Safe Almaty landing page
3. To test the app, you'll need to:
   - **Register a new account** at `/register`
   - **Login** at `/login`
   - **Access the map** at `/map`
   - **View your profile** at `/profile`

---

## 🔧 Troubleshooting

### Issue: "EPERM: operation not permitted" when running `npx prisma generate`
**Solution:** Make sure no Node.js processes are running. Stop the dev server (Ctrl+C) and try again.

### Issue: "Connection refused" or database errors
**Solution:** 
- Verify PostgreSQL is running
- Check your `DATABASE_URL` in `.env` matches your PostgreSQL setup
- Ensure the database `safe_almaty_db` exists
- Verify PostGIS extension is installed

### Issue: "NEXTAUTH_SECRET is not set" warning
**Solution:** Make sure your `.env` file has `NEXTAUTH_SECRET` set with a valid value (at least 32 characters).

### Issue: Port 3000 already in use
**Solution:** Either:
- Stop the other application using port 3000
- Or change the port in `package.json` scripts (add `-p 3001` to the dev command)

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed the database with initial data
- `npx prisma studio` - Open Prisma Studio (database GUI)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env` file created with correct values
- [ ] Database created and PostGIS enabled
- [ ] Prisma Client generated (`npx prisma generate` succeeded)
- [ ] Schema pushed to database (`npx prisma db push` succeeded)
- [ ] Database seeded (`npm run db:seed` succeeded)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Landing page loads at `http://localhost:3000`
- [ ] Can register a new user account
- [ ] Can login and access the map

---

## 📚 Additional Resources

- **Prisma Documentation:** [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **PostGIS Documentation:** [https://postgis.net/documentation](https://postgis.net/documentation)

---

**Need Help?** Check the main `README.md` file for more detailed information about the project structure and architecture.

