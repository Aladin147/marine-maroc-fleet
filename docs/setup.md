# Marine Maroc Fleet Management - Development Setup

## Overview

This guide walks through setting up the Marine Maroc fleet management system for local development.

---

## Prerequisites

### Required Software

**System Requirements:**
- macOS, Linux, or Windows (WSL2)
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

**Development Tools:**
- Git 2.30+
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for mobile app)
- Yarn or npm
- Code editor (VS Code recommended)

**Optional:**
- Xcode 12+ (for iOS development)
- Android Studio (for Android development)
- Postman or Insomnia (API testing)

### Install Docker

**macOS:**
```bash
# Install Docker Desktop
brew install --cask docker
```

**Linux (Ubuntu):**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Install Node.js

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify
node --version  # Should be v18.x.x
npm --version
```

---

## Project Setup

### 1. Clone Repositories

```bash
# Create project directory
mkdir marine-maroc-fleet
cd marine-maroc-fleet

# Clone Fleetbase core
git clone https://github.com/fleetbase/fleetbase.git
cd fleetbase
git submodule update --init --recursive
cd ..

# Clone FleetOps extension
git clone https://github.com/fleetbase/fleetops.git

# Clone Navigator mobile app
git clone https://github.com/fleetbase/navigator-app.git
```

**Directory Structure:**
```
marine-maroc-fleet/
├── fleetbase/          # Core platform
├── fleetops/           # Fleet operations extension
├── navigator-app/      # Driver mobile app
├── assets/             # Marine Maroc branding
└── docs/               # Documentation
```

---

## Backend Setup (Fleetbase)

### 1. Start Docker Services

```bash
cd fleetbase

# Start all services
./scripts/docker-install.sh

# This will start:
# - MySQL (port 3306)
# - Redis (port 6379)
# - API (port 8000)
# - Console (port 4200)
# - SocketCluster (port 38000)
# - Queue worker
# - Scheduler
```

**Wait for services to start** (2-3 minutes). You'll see:
```
✓ Database is ready
✓ Redis is ready
✓ Application is ready
```

### 2. Verify Installation

```bash
# Check running containers
docker-compose ps

# Should show all services as "Up"
```

**Access Points:**
- Console: http://localhost:4200
- API: http://localhost:8000
- API Health: http://localhost:8000/health

### 3. Create Admin Account

**Option A: Via Console**
1. Open http://localhost:4200
2. Click "Create Account"
3. Fill in details:
   - Name: Admin User
   - Email: admin@marinemaroc.com
   - Password: (choose strong password)
   - Company: Marine Maroc

**Option B: Via Command Line**
```bash
docker-compose exec application php artisan fleetbase:create-user \
  --name="Admin User" \
  --email="admin@marinemaroc.com" \
  --password="YourPassword123" \
  --company="Marine Maroc"
```

### 4. Configure Environment

```bash
# Copy environment file
cp api/.env.example api/.env

# Edit configuration
nano api/.env
```

**Key Settings:**
```bash
APP_NAME="Marine Maroc Fleet"
APP_URL=http://localhost:8000
CONSOLE_HOST=http://localhost:4200

# Database (already configured by Docker)
DATABASE_URL=mysql://root@database/fleetbase

# Cache & Queue
REDIS_URL=tcp://cache:6379
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis

# Google Maps (get your own key)
GOOGLE_MAPS_API_KEY=your_key_here
GOOGLE_MAPS_LOCALE=fr

# OSRM Routing
OSRM_HOST=https://router.project-osrm.org

# Email (optional for development)
MAIL_MAILER=log
MAIL_FROM_NAME="Marine Maroc Fleet"
MAIL_FROM_ADDRESS=noreply@marinemaroc.com
```

### 5. Restart Services

```bash
docker-compose restart application
```

---

## Console Setup (Frontend)

### 1. Install Dependencies

```bash
cd fleetbase/console

# Install packages
pnpm install
# or
npm install
```

### 2. Configure Environment

```bash
# Edit configuration
nano config/environment.js
```

**Update Settings:**
```javascript
ENV.APP = {
  name: 'Marine Maroc Fleet',
  title: 'Gestion de Flotte Marine Maroc',
  locale: 'fr-fr',
  defaultLocale: 'fr-fr'
};

ENV.API = {
  host: 'http://localhost:8000',
  namespace: 'api/v1'
};
```

### 3. Add Marine Maroc Branding

```bash
# Copy logo to public directory
cp ../../assets/logo-footer.png public/images/logo-header.png

# Create custom CSS
touch app/styles/custom.css
```

**Custom CSS:**
```css
/* app/styles/custom.css */
:root {
  --primary-color: #0047AB;
  --accent-color: #00CED1;
}

.console-header {
  background-color: var(--primary-color);
}
```

### 4. Start Development Server

```bash
# Start Ember dev server
pnpm start
# or
npm start

# Console will be available at http://localhost:4200
```

---

## Mobile App Setup (Navigator)

### 1. Install Dependencies

```bash
cd navigator-app

# Install Node packages
yarn install
# or
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env
```

**Configuration:**
```bash
APP_NAME=Marine Maroc Fleet
APP_IDENTIFIER=ma.marinemaroc.fleet
APP_LINK_PREFIX=marinemaroc://

# Point to local API
FLEETBASE_HOST=http://localhost:8000

# Google Maps (get your own key)
GOOGLE_MAPS_API_KEY=your_key_here
```

### 3. iOS Setup (macOS only)

```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..

# Or use yarn script
yarn pod:install
```

### 4. Android Setup

```bash
# No additional setup needed
# Android dependencies are managed by Gradle
```

### 5. Run on Simulator

**iOS:**
```bash
# Start Metro bundler
yarn start

# In another terminal, run iOS
yarn ios

# Or specify device
yarn ios --simulator="iPhone 14 Pro"
```

**Android:**
```bash
# Start Metro bundler
yarn start

# In another terminal, run Android
yarn android

# Make sure Android emulator is running
```

### 6. Configure API Connection

**For iOS Simulator:**
- API at `http://localhost:8000` works directly

**For Android Emulator:**
```bash
# Android emulator uses 10.0.2.2 for host machine
# Update .env:
FLEETBASE_HOST=http://10.0.2.2:8000

# Or use adb reverse
adb reverse tcp:8000 tcp:8000
```

---

## Database Setup

### Access MySQL

```bash
# Connect to MySQL container
docker-compose exec database mysql -u root fleetbase

# Or use MySQL client
mysql -h 127.0.0.1 -P 3306 -u root fleetbase
```

### Run Migrations

```bash
# Run database migrations
docker-compose exec application php artisan migrate

# Seed sample data (optional)
docker-compose exec application php artisan db:seed
```

### Backup Database

```bash
# Create backup
docker-compose exec database mysqldump -u root fleetbase > backup.sql

# Restore backup
docker-compose exec -T database mysql -u root fleetbase < backup.sql
```

---

## Common Development Tasks

### View Logs

```bash
# API logs
docker-compose logs -f application

# Queue worker logs
docker-compose logs -f queue

# All services
docker-compose logs -f
```

### Clear Cache

```bash
# Clear application cache
docker-compose exec application php artisan cache:clear

# Clear config cache
docker-compose exec application php artisan config:clear

# Clear route cache
docker-compose exec application php artisan route:clear
```

### Run Queue Worker

```bash
# Queue worker runs automatically in Docker
# To manually process jobs:
docker-compose exec application php artisan queue:work
```

### Run Tests

**Backend:**
```bash
docker-compose exec application php artisan test
```

**Console:**
```bash
cd fleetbase/console
pnpm test
```

**Mobile App:**
```bash
cd navigator-app
yarn test
```

---

## Troubleshooting

### Docker Issues

**Services won't start:**
```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild and start
docker-compose up --build -d
```

**Port conflicts:**
```bash
# Check what's using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Console Won't Load

```bash
# Clear browser cache
# Check API is running: http://localhost:8000/health

# Check console logs
cd fleetbase/console
pnpm start --verbose
```

### Mobile App Issues

**Metro bundler errors:**
```bash
# Clear Metro cache
yarn start --reset-cache
```

**iOS build errors:**
```bash
# Clean build
cd ios
xcodebuild clean
pod deintegrate
pod install
cd ..
```

**Android build errors:**
```bash
# Clean Gradle
cd android
./gradlew clean
cd ..
```

---

## Development Workflow

### Daily Workflow

1. **Start Services:**
```bash
cd fleetbase
docker-compose up -d
```

2. **Start Console:**
```bash
cd fleetbase/console
pnpm start
```

3. **Start Mobile App:**
```bash
cd navigator-app
yarn start
yarn ios  # or yarn android
```

4. **Make Changes:**
- Edit code in your editor
- Changes auto-reload in browser/simulator

5. **Test Changes:**
- Test in console (http://localhost:4200)
- Test in mobile simulator
- Check API logs

6. **Stop Services:**
```bash
cd fleetbase
docker-compose down
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/marine-maroc-branding

# Make changes
git add .
git commit -m "Add Marine Maroc branding"

# Push to remote
git push origin feature/marine-maroc-branding
```

---

## Next Steps

1. ✅ Development environment set up
2. → Review [MVP Scope](mvp-scope.md)
3. → Follow [Branding Guide](branding.md)
4. → Read [Architecture](architecture.md)
5. → Prepare for [Deployment](deployment.md)

---

## Useful Commands Reference

```bash
# Docker
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose ps                 # List services
docker-compose logs -f <service>  # View logs

# Laravel
php artisan migrate               # Run migrations
php artisan cache:clear           # Clear cache
php artisan queue:work            # Process jobs
php artisan tinker                # Interactive shell

# Ember
pnpm start                        # Dev server
pnpm build                        # Production build
pnpm test                         # Run tests

# React Native
yarn start                        # Metro bundler
yarn ios                          # Run iOS
yarn android                      # Run Android
yarn test                         # Run tests
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Active
