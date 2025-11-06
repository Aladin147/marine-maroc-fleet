# Manual Setup - Network Issues Workaround

## Current Status

✅ **Docker services running** (PostgreSQL + Redis)  
❌ **Composer installation failed** (network issues)  
❌ **PHP not installed**

## Option 1: Fix Network & Install (Recommended)

### Fix Network Issues

Your Mac can't resolve `ghcr.io` and `getcomposer.org`. Try:

```bash
# Check DNS
scutil --dns

# Try changing DNS to Google's
networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4

# Or Cloudflare's
networksetup -setdnsservers Wi-Fi 1.1.1.1 1.0.0.1

# Test
ping ghcr.io
```

### Then Install PHP & Composer

```bash
# Install PHP
brew install php

# Verify
php --version

# Install Composer directly
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# Verify
composer --version
```

### Continue Setup

```bash
cd prototype

# Create Laravel project
composer create-project laravel/laravel backend

# Continue with Day 1 checklist
```

## Option 2: Use Pre-Downloaded Laravel (If Network Persists)

If network issues persist, we can work with a minimal setup:

### 1. Create Basic Laravel Structure Manually

```bash
cd prototype
mkdir -p backend
cd backend

# We'll create a minimal Laravel-like structure
# and add proper Laravel later when network is fixed
```

### 2. Use SQLite Instead of PostgreSQL (Temporary)

```bash
# Create database file
touch database.sqlite

# We can migrate to PostgreSQL later
```

### 3. Build API with Minimal Framework

We can start with a simple PHP API structure and migrate to Laravel once network is fixed.

## Option 3: Work Offline with What We Have

Since Docker is working, let's focus on planning and design:

### Today's Alternative Tasks

1. **Review Architecture** ✅
   ```bash
   cat docs/ARCHITECTURE.md
   ```

2. **Study Database Schema** ✅
   ```bash
   ls database/migrations/
   cat database/migrations/001_create_companies_table.php
   ```

3. **Plan API Endpoints** ✅
   - Document what endpoints we need
   - Design request/response formats
   - Plan authentication flow

4. **Design Frontend Components** ✅
   - Sketch UI layouts
   - Plan component structure
   - Design state management

5. **Mobile UX Mockups** ✅
   - Review Arabic UI guidelines
   - Sketch screen layouts
   - Plan navigation flow

## Recommended: Fix Network First

The network issue is blocking Homebrew. Let's fix it:

### Check Your Network

```bash
# Check if you're behind a proxy
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Check DNS
scutil --dns | grep nameserver

# Test connectivity
ping 8.8.8.8
ping google.com
ping ghcr.io
```

### Common Fixes

**1. VPN Issues**
```bash
# If you're on VPN, try disconnecting temporarily
# Then retry: brew install composer
```

**2. Corporate Network**
```bash
# If on corporate network, you might need proxy settings
# Ask your IT department for proxy configuration
```

**3. DNS Issues**
```bash
# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Change DNS to Google
sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4

# Test
ping ghcr.io
```

**4. Firewall**
```bash
# Check if firewall is blocking
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Temporarily disable (not recommended for production)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

## What's Working Now

✅ **Docker** - PostgreSQL and Redis are running
✅ **Node.js** - You have Node v24.7.0
✅ **Planning** - All documentation is ready

## Next Steps

### Immediate (Fix Network)

1. Try DNS change:
   ```bash
   sudo networksetup -setdnsservers Wi-Fi 8.8.8.8
   ping ghcr.io
   ```

2. Retry Composer:
   ```bash
   brew install composer
   ```

3. Continue with setup:
   ```bash
   ./quick-start.sh
   ```

### Alternative (Work Around)

1. Download Composer manually from another computer
2. Transfer to your Mac
3. Install locally
4. Continue setup

### Meanwhile (Productive)

1. Review all documentation
2. Study the architecture
3. Plan the implementation
4. Design UI mockups
5. Prepare for when network is fixed

## Status Check

Run these to see what's working:

```bash
# Docker services
docker-compose ps
# Should show postgres and redis as "Up"

# Node.js
node --version
# Should show v24.7.0

# Network
ping 8.8.8.8
ping google.com
ping ghcr.io
```

## Need Help?

The network issue is the blocker. Once resolved:
1. Install PHP & Composer
2. Run `./quick-start.sh` again
3. Continue with Day 1 checklist

Let me know what the network tests show and we'll fix it! 🔧
