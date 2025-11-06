# Setup Instructions - Let's Build This!

## Prerequisites Installation

### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install PHP & Composer
```bash
# Install PHP 8.2
brew install php@8.2

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/php@8.2/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
php --version

# Install Composer
brew install composer

# Verify
composer --version
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb fleet_dev

# Verify
psql fleet_dev -c "SELECT version();"
```

### 4. Install Redis
```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Verify
redis-cli ping
# Should return: PONG
```

### 5. Install Docker (Optional but Recommended)
```bash
# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop from Applications
# Or use Homebrew services
```

## Project Setup

### Backend (Laravel)

```bash
# Navigate to prototype directory
cd prototype

# Create Laravel project
composer create-project laravel/laravel backend

# Navigate to backend
cd backend

# Install additional packages
composer require laravel/sanctum
composer require laravel/reverb

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# Edit .env file:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fleet_dev
DB_USERNAME=YOUR_USERNAME
DB_PASSWORD=

# Run migrations
php artisan migrate

# Install Sanctum
php artisan install:api

# Start development server
php artisan serve
# Backend will be available at http://localhost:8000
```

### Frontend (React)

```bash
# Navigate to prototype directory
cd prototype

# Create React + Vite project
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev
# Frontend will be available at http://localhost:5173
```

### Mobile (React Native)

```bash
# Navigate to prototype directory
cd prototype

# Create React Native project
npx react-native@latest init FleetMobile

# Rename to mobile
mv FleetMobile mobile

# Navigate to mobile
cd mobile

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-background-geolocation
npm install react-native-audio-recorder-player
npm install react-native-image-picker
npm install react-native-signature-canvas
npm install axios

# iOS setup (macOS only)
cd ios
pod install
cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios

# Or run Android
npm run android
```

## Quick Start (After Installation)

### Terminal 1: Backend
```bash
cd prototype/backend
php artisan serve
```

### Terminal 2: Frontend
```bash
cd prototype/frontend
npm run dev
```

### Terminal 3: Mobile (Optional)
```bash
cd prototype/mobile
npm start
```

## Verify Everything Works

### Test Backend
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"ok"}
```

### Test Frontend
Open browser: http://localhost:5173

### Test Mobile
Open iOS Simulator or Android Emulator

## Next Steps

Once everything is installed and running:

1. Read `prototype/docs/3_WEEK_PLAN.md`
2. Start with Day 1 tasks
3. Follow the architecture in `prototype/docs/ARCHITECTURE.md`

## Troubleshooting

### PHP not found
```bash
# Check PHP installation
brew list php@8.2

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/php@8.2/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### PostgreSQL connection failed
```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@16

# Check connection
psql -l
```

### Redis connection failed
```bash
# Check if Redis is running
brew services list

# Start Redis
brew services start redis

# Test connection
redis-cli ping
```

### Port already in use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill process
kill -9 PID

# Or use different port
php artisan serve --port=8001
```

## Ready to Build!

Once all prerequisites are installed, you're ready to start building! 🚀

Follow the 3-week plan in `prototype/docs/3_WEEK_PLAN.md`
```
