# Quick Start Guide

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 16
- Redis 7
- Docker (optional but recommended)

## Option 1: Docker (Recommended)

```bash
# Clone and navigate
cd prototype

# Start all services
docker-compose up -d

# Install backend dependencies
docker-compose exec backend composer install

# Run migrations
docker-compose exec backend php artisan migrate

# Create admin user
docker-compose exec backend php artisan make:admin

# Install frontend dependencies
docker-compose exec frontend npm install

# Access
# Backend API: http://localhost:8000
# Frontend: http://localhost:3000
```

## Option 2: Manual Setup

### Backend Setup

```bash
cd prototype/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fleet_dev
DB_USERNAME=fleet
DB_PASSWORD=secret

# Run migrations
php artisan migrate

# Create admin user
php artisan make:admin

# Start server
php artisan serve
# API available at http://localhost:8000
```

### Frontend Setup

```bash
cd prototype/frontend

# Install dependencies
npm install

# Configure API endpoint
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
# Frontend available at http://localhost:3000
```

### Mobile Setup

```bash
cd prototype/mobile

# Install dependencies
npm install

# iOS (macOS only)
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

## First Steps

### 1. Login to Admin Dashboard

```
URL: http://localhost:3000
Email: admin@example.com
Password: password
```

### 2. Create Test Data

```bash
# Seed database with test data
php artisan db:seed

# Or create manually via API/dashboard
```

### 3. Test Mobile App

```bash
# Start Metro bundler
cd prototype/mobile
npm start

# Run on simulator
npm run ios    # or npm run android
```

### 4. Test API Endpoints

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get orders (use token from login)
curl http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development Workflow

### Backend Development

```bash
# Watch for changes
php artisan serve

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Frontend Development

```bash
# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Development

```bash
# Start Metro
npm start

# Clear cache
npm start -- --reset-cache

# Run on device
npm run ios -- --device
npm run android -- --deviceId=DEVICE_ID
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 8000
lsof -i :8000

# Kill process
kill -9 PID

# Or change port in .env
APP_PORT=8001
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql # Linux
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### Mobile App Won't Build

```bash
# iOS: Clean build
cd ios
xcodebuild clean
pod deintegrate
pod install
cd ..

# Android: Clean Gradle
cd android
./gradlew clean
cd ..

# Clear Metro cache
npm start -- --reset-cache
```

## Next Steps

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
2. Check [API_REFERENCE.md](API_REFERENCE.md) for endpoint documentation
3. Review [MOBILE_UX.md](MOBILE_UX.md) for Arabic-first UI guidelines
4. Start building features!

---

**Need help?** Check the docs or create an issue.
