#!/bin/bash

# Fleet Management Prototype - Quick Start Script
# This script automates the initial setup

set -e  # Exit on error

echo "🚀 Fleet Management Prototype - Quick Start"
echo "==========================================="
echo ""

# Check if we're in the prototype directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the prototype/ directory"
    exit 1
fi

# Step 1: Start Docker services
echo "📦 Step 1: Starting PostgreSQL and Redis..."
docker-compose up -d
sleep 5  # Wait for services to start

# Verify services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully"
else
    echo "❌ Error: Services failed to start"
    docker-compose logs
    exit 1
fi

# Step 2: Check if Composer is installed
echo ""
echo "🔍 Step 2: Checking for Composer..."
if ! command -v composer &> /dev/null; then
    echo "❌ Composer not found. Installing..."
    brew install composer
fi
echo "✅ Composer is installed"

# Step 3: Create Laravel project
echo ""
echo "🏗️  Step 3: Creating Laravel project..."
if [ ! -d "backend" ]; then
    composer create-project laravel/laravel backend --prefer-dist
    echo "✅ Laravel project created"
else
    echo "⚠️  Backend directory already exists, skipping..."
fi

# Step 4: Install Laravel packages
echo ""
echo "📦 Step 4: Installing Laravel packages..."
cd backend
composer require laravel/sanctum --quiet
echo "✅ Packages installed"

# Step 5: Configure environment
echo ""
echo "⚙️  Step 5: Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# Update .env file
sed -i '' 's/DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env
sed -i '' 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i '' 's/DB_PORT=.*/DB_PORT=5432/' .env
sed -i '' 's/DB_DATABASE=.*/DB_DATABASE=fleet_dev/' .env
sed -i '' 's/DB_USERNAME=.*/DB_USERNAME=fleet/' .env
sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=secret/' .env

# Generate app key
php artisan key:generate
echo "✅ Environment configured"

# Step 6: Copy migrations
echo ""
echo "📋 Step 6: Copying database migrations..."
cp ../database/migrations/*.php database/migrations/
echo "✅ Migrations copied"

# Step 7: Run migrations
echo ""
echo "🗄️  Step 7: Running database migrations..."
php artisan migrate --force
echo "✅ Database migrated"

# Step 8: Install API support
echo ""
echo "🔐 Step 8: Installing API support..."
php artisan install:api
echo "✅ API support installed"

# Done!
echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. cd backend"
echo "   2. php artisan serve"
echo "   3. Visit http://localhost:8000"
echo ""
echo "📚 Read DAY_1_CHECKLIST.md for detailed instructions"
echo ""
echo "🎉 Happy coding!"
