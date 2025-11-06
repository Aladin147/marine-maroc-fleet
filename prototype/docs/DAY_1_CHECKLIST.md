# Day 1 Checklist - Backend Foundation

## Morning: Setup & Database

### ✅ Step 1: Start Services (5 minutes)

```bash
cd prototype

# Start PostgreSQL and Redis
docker-compose up -d

# Verify
docker-compose ps
# Both should show "Up"
```

### ✅ Step 2: Create Laravel Project (10 minutes)

```bash
# Install Composer (if needed)
brew install composer

# Create Laravel project
composer create-project laravel/laravel backend

cd backend

# Install Sanctum for API authentication
composer require laravel/sanctum
```

### ✅ Step 3: Configure Environment (5 minutes)

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

Update these values in `.env`:
```env
APP_NAME="Fleet Management API"
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fleet_dev
DB_USERNAME=fleet
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

```bash
# Generate application key
php artisan key:generate
```

### ✅ Step 4: Copy Migrations (5 minutes)

```bash
# Copy all migration files from prototype/database/migrations/ 
# to backend/database/migrations/

# On macOS/Linux:
cp ../database/migrations/*.php database/migrations/

# Verify files are copied
ls -la database/migrations/
```

### ✅ Step 5: Run Migrations (2 minutes)

```bash
# Run migrations
php artisan migrate

# You should see:
# Migration table created successfully.
# Migrating: 001_create_companies_table
# Migrated:  001_create_companies_table
# ... (all 9 migrations)
```

### ✅ Step 6: Install API Support (2 minutes)

```bash
# Install Sanctum for API authentication
php artisan install:api

# This creates:
# - API routes
# - Sanctum configuration
# - Personal access token support
```

## Afternoon: Multi-Tenancy & Models

### ✅ Step 7: Create Company Scope (15 minutes)

Create `app/Models/Scopes/CompanyScope.php`:

```php
<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (auth()->check() && auth()->user()->company_id) {
            $builder->where('company_id', auth()->user()->company_id);
        }
    }
}
```

### ✅ Step 8: Create Base Model Trait (10 minutes)

Create `app/Models/Traits/BelongsToCompany.php`:

```php
<?php

namespace App\Models\Traits;

use App\Models\Company;
use App\Models\Scopes\CompanyScope;

trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope(new CompanyScope);
        
        static::creating(function ($model) {
            if (auth()->check() && !$model->company_id) {
                $model->company_id = auth()->user()->company_id;
            }
        });
    }
    
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
```

### ✅ Step 9: Create Models (30 minutes)

Run these commands:

```bash
php artisan make:model Company
php artisan make:model Driver
php artisan make:model Vehicle
php artisan make:model Location
php artisan make:model Order
php artisan make:model TrackingPoint
php artisan make:model ProofOfDelivery
php artisan make:model Message
```

Then update each model (see prototype/models/ directory for full code).

### ✅ Step 10: Create Seeders (20 minutes)

```bash
# Create seeder
php artisan make:seeder DevelopmentSeeder

# Run seeder
php artisan db:seed --class=DevelopmentSeeder
```

## Evening: Testing & Verification

### ✅ Step 11: Test Database (5 minutes)

```bash
# Open Tinker
php artisan tinker

# Test queries
>>> App\Models\Company::count()
=> 2

>>> App\Models\Driver::count()
=> 5

>>> App\Models\Order::count()
=> 10
```

### ✅ Step 12: Start Development Server (2 minutes)

```bash
# Start Laravel server
php artisan serve

# Server running at: http://localhost:8000
```

### ✅ Step 13: Test API Health Endpoint (5 minutes)

Create `routes/api.php` health check:

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'redis' => Redis::connection()->ping() ? 'connected' : 'disconnected',
    ]);
});
```

Test it:
```bash
curl http://localhost:8000/api/health
```

## Day 1 Complete! ✅

You should now have:
- ✅ PostgreSQL and Redis running
- ✅ Laravel project created
- ✅ Database schema migrated
- ✅ Multi-tenant architecture in place
- ✅ Models created
- ✅ Test data seeded
- ✅ API server running

## Next Steps

Tomorrow (Day 2):
- Authentication endpoints
- Multi-tenancy middleware
- Test company isolation

## Troubleshooting

### Migration failed
```bash
# Reset database
php artisan migrate:fresh

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo()
```

### Composer install slow
```bash
# Use faster mirror
composer config -g repo.packagist composer https://packagist.org
```

### Port 8000 already in use
```bash
# Use different port
php artisan serve --port=8001
```

## Time Estimate

- Morning (Setup): ~30 minutes
- Afternoon (Models): ~1.5 hours
- Evening (Testing): ~15 minutes
- **Total: ~2-2.5 hours**

## Celebrate! 🎉

You've completed Day 1! The foundation is solid. Tomorrow we'll add authentication and start building the API.
