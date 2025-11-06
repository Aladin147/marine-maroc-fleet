# Start Development - Quick Guide

## Option 1: Docker (Easiest)

### 1. Start Database & Redis

```bash
cd prototype

# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### 2. Create Laravel Project

```bash
# Install Composer if not installed
brew install composer

# Create Laravel project
composer create-project laravel/laravel backend

# Navigate to backend
cd backend

# Install packages
composer require laravel/sanctum

# Copy migrations from prototype/database/migrations/ to backend/database/migrations/

# Configure .env
cp .env.example .env

# Edit .env:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fleet_dev
DB_USERNAME=fleet
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate

# Install API
php artisan install:api

# Start server
php artisan serve
```

### 3. Create React Frontend

```bash
cd prototype

# Create Vite + React project
npm create vite@latest frontend -- --template react

cd frontend

# Install dependencies
npm install
npm install react-router-dom @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev
```

## Option 2: Manual Installation

Follow `SETUP_INSTRUCTIONS.md` for detailed manual setup.

## Verify Everything Works

### Test Database
```bash
docker-compose exec postgres psql -U fleet -d fleet_dev -c "SELECT version();"
```

### Test Redis
```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Test Backend
```bash
curl http://localhost:8000/api/health
```

### Test Frontend
Open browser: http://localhost:5173

## Next Steps

1. ✅ Services running
2. ✅ Laravel installed
3. ✅ React installed
4. → Start building! Follow `docs/3_WEEK_PLAN.md`

## Stop Services

```bash
# Stop Docker services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :8000  # Laravel

# Kill process or change port in docker-compose.yml
```

### Database connection failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Redis connection failed
```bash
# Check if Redis is running
docker-compose ps redis

# View logs
docker-compose logs redis

# Restart
docker-compose restart redis
```

## Ready to Build! 🚀

Once everything is running, start with Day 1 of the 3-week plan!
