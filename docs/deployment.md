# Marine Maroc Fleet Management - Deployment Guide

## Overview

This guide covers deploying the Marine Maroc fleet management system to production.

---

## Production Requirements

### Server Specifications

**Minimum (50 drivers):**
- 4 CPU cores
- 8GB RAM
- 100GB SSD storage
- Ubuntu 22.04 LTS
- 100 Mbps network

**Recommended (100+ drivers):**
- 8 CPU cores
- 16GB RAM
- 200GB SSD storage
- Ubuntu 22.04 LTS
- 1 Gbps network

### Hosting Options

**Option 1: DigitalOcean (Recommended)**
- Droplet: $48/month (4 vCPU, 8GB RAM)
- Managed MySQL: $15/month
- Spaces (S3): $5/month
- **Total: ~$70/month**

**Option 2: AWS**
- EC2 t3.large: $60/month
- RDS MySQL: $30/month
- S3: $5/month
- **Total: ~$95/month**

**Option 3: On-Premise**
- Physical server or VM
- Marine Maroc's infrastructure
- **Cost: Infrastructure only**

---

## Pre-Deployment Checklist

### Domain & DNS
- [ ] Domain registered: fleet.marinemaroc.com
- [ ] DNS A record pointing to server IP
- [ ] SSL certificate ready (Let's Encrypt)

### Accounts & Keys
- [ ] Google Maps API key (with billing enabled)
- [ ] Email service (SMTP or SendGrid)
- [ ] SMS service (Twilio - optional)
- [ ] S3 or storage bucket (for uploads)

### Branding Assets
- [ ] All logos prepared
- [ ] Favicon generated
- [ ] Mobile app icons ready
- [ ] Splash screen created

### Code Preparation
- [ ] Marine Maroc branding applied
- [ ] French translations complete
- [ ] Unused features removed
- [ ] Environment variables configured
- [ ] Database migrations tested

---

## Server Setup

### 1. Initial Server Configuration

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt-get update && apt-get upgrade -y

# Install required packages
apt-get install -y \
  git \
  curl \
  wget \
  unzip \
  software-properties-common \
  ca-certificates \
  gnupg \
  lsb-release

# Create deploy user
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2. Install Docker

```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

### 3. Configure Firewall

```bash
# Install UFW
sudo apt-get install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## Application Deployment

### 1. Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/marine-maroc-fleet
sudo chown deploy:deploy /opt/marine-maroc-fleet
cd /opt/marine-maroc-fleet

# Clone repositories
git clone https://github.com/fleetbase/fleetbase.git
cd fleetbase
git submodule update --init --recursive
```

### 2. Configure Environment

```bash
# Create production environment file
cp api/.env.example api/.env
nano api/.env
```

**Production Configuration:**
```bash
# Application
APP_NAME="Marine Maroc Fleet"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://fleet.marinemaroc.com
CONSOLE_HOST=https://fleet.marinemaroc.com

# Generate key
APP_KEY=base64:GENERATE_THIS_WITH_php_artisan_key:generate

# Database
DATABASE_URL=mysql://fleetbase:STRONG_PASSWORD@database/fleetbase

# Cache & Queue
REDIS_URL=tcp://cache:6379
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# Google Maps
GOOGLE_MAPS_API_KEY=your_production_key
GOOGLE_MAPS_LOCALE=fr

# OSRM Routing
OSRM_HOST=https://router.project-osrm.org

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@marinemaroc.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_NAME="Marine Maroc Fleet"
MAIL_FROM_ADDRESS=noreply@marinemaroc.com

# SMS (optional)
TWILIO_SID=your_sid
TWILIO_TOKEN=your_token
TWILIO_FROM=+212XXXXXXXXX

# Storage (S3 or local)
FILESYSTEM_DRIVER=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=marine-maroc-fleet

# Security
SESSION_DOMAIN=fleet.marinemaroc.com
SANCTUM_STATEFUL_DOMAINS=fleet.marinemaroc.com
```

### 3. Generate Application Key

```bash
# Generate key
docker compose run --rm application php artisan key:generate --show

# Copy the output and add to .env
# APP_KEY=base64:xxxxxxxxxxxxx
```

### 4. Create Docker Override

```bash
nano docker-compose.override.yml
```

**Production Override:**
```yaml
version: "3.8"

services:
  application:
    environment:
      APP_ENV: production
      APP_DEBUG: "false"
    restart: unless-stopped
    
  httpd:
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    
  console:
    restart: unless-stopped
    
  database:
    volumes:
      - ./data/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: STRONG_ROOT_PASSWORD
      MYSQL_DATABASE: fleetbase
      MYSQL_USER: fleetbase
      MYSQL_PASSWORD: STRONG_PASSWORD
    restart: unless-stopped
    
  cache:
    restart: unless-stopped
    
  queue:
    restart: unless-stopped
    
  scheduler:
    restart: unless-stopped
    
  socket:
    restart: unless-stopped
```

### 5. Start Services

```bash
# Build and start
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 6. Run Migrations

```bash
# Run database migrations
docker compose exec application php artisan migrate --force

# Create admin user
docker compose exec application php artisan fleetbase:create-user \
  --name="Admin Marine Maroc" \
  --email="admin@marinemaroc.com" \
  --password="SecurePassword123!" \
  --company="Marine Maroc"
```

---

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install -y certbot

# Stop services temporarily
cd /opt/marine-maroc-fleet/fleetbase
docker compose down

# Obtain certificate
sudo certbot certonly --standalone \
  -d fleet.marinemaroc.com \
  --email admin@marinemaroc.com \
  --agree-tos \
  --no-eff-email

# Certificates will be at:
# /etc/letsencrypt/live/fleet.marinemaroc.com/fullchain.pem
# /etc/letsencrypt/live/fleet.marinemaroc.com/privkey.pem

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/fleet.marinemaroc.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/fleet.marinemaroc.com/privkey.pem ssl/
sudo chown -R deploy:deploy ssl/

# Start services
docker compose up -d
```

### Configure NGINX for SSL

```bash
# Create NGINX config
nano docker/httpd/nginx.conf
```

**NGINX Configuration:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name fleet.marinemaroc.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name fleet.marinemaroc.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Console
    location / {
        proxy_pass http://console:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API
    location /api {
        proxy_pass http://application:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /socket {
        proxy_pass http://socket:38000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet --post-hook "cd /opt/marine-maroc-fleet/fleetbase && docker compose restart httpd"
```

---

## Backup Configuration

### 1. Database Backup Script

```bash
# Create backup directory
mkdir -p /opt/backups/marine-maroc-fleet

# Create backup script
nano /opt/backups/backup.sh
```

**Backup Script:**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/opt/backups/marine-maroc-fleet"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup
cd /opt/marine-maroc-fleet/fleetbase
docker compose exec -T database mysqldump -u root fleetbase | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup uploads (if using local storage)
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C api/storage/app public

# Delete old backups
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /opt/backups/backup.sh

# Test backup
/opt/backups/backup.sh
```

### 2. Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/backups/backup.sh >> /var/log/backup.log 2>&1
```

### 3. S3 Backup (Optional)

```bash
# Install AWS CLI
sudo apt-get install -y awscli

# Configure AWS
aws configure

# Update backup script to upload to S3
echo "aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://marine-maroc-backups/" >> /opt/backups/backup.sh
```

---

## Monitoring Setup

### 1. Health Check Endpoint

```bash
# Test health endpoint
curl https://fleet.marinemaroc.com/api/health

# Should return:
# {"status":"ok","timestamp":"2025-11-05T10:00:00Z"}
```

### 2. Uptime Monitoring

**Options:**
- UptimeRobot (free)
- Pingdom
- StatusCake

**Configure:**
- URL: https://fleet.marinemaroc.com/api/health
- Interval: 5 minutes
- Alert: Email/SMS on downtime

### 3. Log Monitoring

```bash
# View application logs
docker compose logs -f application

# View queue logs
docker compose logs -f queue

# View all logs
docker compose logs -f

# Save logs to file
docker compose logs > /var/log/marine-maroc-fleet.log
```

### 4. Resource Monitoring

```bash
# Install htop
sudo apt-get install -y htop

# Monitor resources
htop

# Docker stats
docker stats
```

---

## Mobile App Deployment

### 1. Update Configuration

```bash
cd navigator-app

# Update .env for production
nano .env
```

**Production Config:**
```bash
APP_NAME=Marine Maroc Fleet
APP_IDENTIFIER=ma.marinemaroc.fleet
FLEETBASE_HOST=https://fleet.marinemaroc.com
GOOGLE_MAPS_API_KEY=your_production_key
```

### 2. Build Android APK

```bash
# Clean build
cd android
./gradlew clean
cd ..

# Build release APK
cd android
./gradlew assembleRelease
cd ..

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### 3. Build iOS App

```bash
# Open in Xcode
open ios/NavigatorApp.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device" as target
# 2. Product → Archive
# 3. Distribute App → Ad Hoc (for testing)
# 4. Or submit to App Store
```

### 4. Distribute to Drivers

**Option A: Direct APK (Android)**
- Upload APK to Google Drive
- Share link with drivers
- Drivers install manually

**Option B: TestFlight (iOS)**
- Upload to App Store Connect
- Add drivers as testers
- Drivers install via TestFlight

**Option C: App Stores (Later)**
- Submit to Google Play Store
- Submit to Apple App Store
- Requires developer accounts

---

## Post-Deployment Tasks

### 1. Verify Deployment

```bash
# Check all services running
docker compose ps

# Test console
curl -I https://fleet.marinemaroc.com

# Test API
curl https://fleet.marinemaroc.com/api/health

# Test WebSocket
# Use browser console:
# new WebSocket('wss://fleet.marinemaroc.com/socket')
```

### 2. Create Test Data

```bash
# Create test driver
docker compose exec application php artisan tinker

# In tinker:
$driver = \Fleetbase\FleetOps\Models\Driver::create([
    'name' => 'Test Driver',
    'phone' => '+212600000000',
    'email' => 'driver@test.com',
    'company_uuid' => 'your-company-uuid'
]);

# Create test vehicle
$vehicle = \Fleetbase\FleetOps\Models\Vehicle::create([
    'plate_number' => 'A-12345',
    'make' => 'Mercedes',
    'model' => 'Actros',
    'year' => 2020,
    'company_uuid' => 'your-company-uuid'
]);
```

### 3. Configure Notifications

**Email Test:**
```bash
docker compose exec application php artisan tinker

# Send test email
Mail::raw('Test email from Marine Maroc Fleet', function($message) {
    $message->to('admin@marinemaroc.com')
            ->subject('Test Email');
});
```

**SMS Test (if configured):**
```bash
# Test Twilio
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  --data-urlencode "Body=Test from Marine Maroc Fleet" \
  --data-urlencode "From=+212XXXXXXXXX" \
  --data-urlencode "To=+212XXXXXXXXX" \
  -u YOUR_SID:YOUR_TOKEN
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Check service status
- Review error logs
- Monitor disk space

**Weekly:**
- Review backup logs
- Check SSL certificate expiry
- Update system packages

**Monthly:**
- Review performance metrics
- Optimize database
- Update Docker images

### Update Application

```bash
cd /opt/marine-maroc-fleet/fleetbase

# Pull latest changes
git pull origin main

# Rebuild containers
docker compose up -d --build

# Run migrations
docker compose exec application php artisan migrate --force

# Clear cache
docker compose exec application php artisan cache:clear
docker compose exec application php artisan config:clear
```

### Database Optimization

```bash
# Optimize tables
docker compose exec database mysql -u root fleetbase -e "OPTIMIZE TABLE orders, tracking_statuses, drivers, vehicles;"

# Analyze tables
docker compose exec database mysql -u root fleetbase -e "ANALYZE TABLE orders, tracking_statuses, drivers, vehicles;"
```

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory
free -h

# Restart services
docker compose restart
```

### Database Connection Issues

```bash
# Check database is running
docker compose ps database

# Check database logs
docker compose logs database

# Test connection
docker compose exec application php artisan tinker
# DB::connection()->getPdo();
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew

# Restart NGINX
docker compose restart httpd
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Optimize database
docker compose exec application php artisan optimize

# Clear cache
docker compose exec application php artisan cache:clear

# Restart queue workers
docker compose restart queue
```

---

## Rollback Procedure

### If Deployment Fails

```bash
# Stop services
docker compose down

# Restore database backup
gunzip < /opt/backups/marine-maroc-fleet/db_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose exec -T database mysql -u root fleetbase

# Revert code
git reset --hard HEAD~1

# Restart services
docker compose up -d
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Strong passwords used
- [ ] Database not exposed publicly
- [ ] Redis not exposed publicly
- [ ] Regular backups configured
- [ ] Monitoring set up
- [ ] Logs reviewed regularly
- [ ] System updates automated
- [ ] SSH key authentication only

---

## Support & Maintenance

**Emergency Contact:**
- Technical Issues: [Your contact]
- Business Issues: [Your contact]

**Response Times:**
- Critical (system down): 1 hour
- High (major feature broken): 4 hours
- Medium (minor issue): 24 hours
- Low (enhancement): 1 week

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Active
