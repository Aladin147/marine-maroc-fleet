# Phase 4: Deployment - Design Document

## Overview

This document outlines the technical design for Phase 4 of the Marine Maroc fleet management system. Phase 4 focuses on production deployment, including server setup, domain configuration, SSL certificates, backup automation, monitoring, and final performance optimization.

## Architecture

### Production Infrastructure

```
Production Environment
├── Server (Ubuntu 22.04)
│   ├── Docker Compose
│   │   ├── Application (Laravel API)
│   │   ├── Console (Ember.js static files)
│   │   ├── Database (MySQL 8.0)
│   │   ├── Cache (Redis 4.0)
│   │   ├── Queue Worker
│   │   ├── Scheduler
│   │   └── Socket (SocketCluster)
│   ├── NGINX (Reverse Proxy)
│   └── Firewall (UFW)
├── Domain (fleet.marinemaroc.com)
│   └── SSL Certificate (Let's Encrypt)
├── Backups
│   ├── Database (Daily, 30-day retention)
│   └── Files (Photos, uploads)
└── Monitoring
    ├── Uptime Monitoring
    ├── Performance Monitoring
    └── Error Logging
```

## Components and Interfaces

### 1. Server Provisioning

**Recommended Hosting:**
- **DigitalOcean Droplet** (Cost-effective, reliable)
- **Specifications:** 4 vCPU, 8GB RAM, 100GB SSD
- **Cost:** ~$48/month
- **Location:** Frankfurt or Amsterdam (closest to Morocco)

**Alternative: AWS EC2**
- **Instance Type:** t3.large
- **Cost:** ~$60/month
- **Location:** eu-west-1 (Ireland)

**Server Setup Script:**
```bash
#!/bin/bash
# server-setup.sh

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

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Create deploy user
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
usermod -aG sudo deploy

# Configure firewall
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

echo "Server setup complete!"
```

### 2. Docker Deployment

**Production docker-compose.override.yml:**
```yaml
version: "3.8"

services:
  application:
    environment:
      APP_ENV: production
      APP_DEBUG: "false"
      APP_URL: https://fleet.marinemaroc.com
      CONSOLE_HOST: https://fleet.marinemaroc.com
    restart: unless-stopped
    
  httpd:
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    
  console:
    restart: unless-stopped
    
  database:
    volumes:
      - ./data/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: fleetbase
      MYSQL_USER: fleetbase
      MYSQL_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password
    
  cache:
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    
  queue:
    restart: unless-stopped
    
  scheduler:
    restart: unless-stopped
    
  socket:
    restart: unless-stopped
```

**Deployment Script:**
```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Build and start containers
docker compose build --no-cache
docker compose up -d

# Run migrations
docker compose exec -T application php artisan migrate --force

# Clear caches
docker compose exec -T application php artisan cache:clear
docker compose exec -T application php artisan config:clear
docker compose exec -T application php artisan route:clear

# Restart queue workers
docker compose restart queue

echo "Deployment complete!"
```

### 3. SSL Certificate Setup

**Let's Encrypt with Certbot:**
```bash
#!/bin/bash
# setup-ssl.sh

# Install Certbot
apt-get install -y certbot

# Stop services temporarily
cd /opt/marine-maroc-fleet/fleetbase
docker compose down

# Obtain certificate
certbot certonly --standalone \
  -d fleet.marinemaroc.com \
  --email admin@marinemaroc.com \
  --agree-tos \
  --no-eff-email

# Copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/fleet.marinemaroc.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/fleet.marinemaroc.com/privkey.pem ssl/
chown -R deploy:deploy ssl/

# Start services
docker compose up -d

echo "SSL certificate installed!"
```

**NGINX Configuration with SSL:**
```nginx
# nginx.conf

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
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Console (Ember.js)
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
        
        # Increase timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket
    location /socket {
        proxy_pass http://socket:38000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://application:8000/health;
        access_log off;
    }
}
```

**Auto-Renewal Cron Job:**
```bash
# Add to crontab
0 0 * * * certbot renew --quiet --post-hook "cd /opt/marine-maroc-fleet/fleetbase && docker compose restart httpd"
```

### 4. Backup System

**Backup Script:**
```bash
#!/bin/bash
# backup.sh

# Configuration
BACKUP_DIR="/opt/backups/marine-maroc-fleet"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
PROJECT_DIR="/opt/marine-maroc-fleet/fleetbase"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
echo "Backing up database..."
cd "$PROJECT_DIR"
docker compose exec -T database mysqldump -u root fleetbase | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Files backup (uploads, photos)
echo "Backing up files..."
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" -C "$PROJECT_DIR/api/storage/app" public

# Environment backup
echo "Backing up configuration..."
cp "$PROJECT_DIR/api/.env" "$BACKUP_DIR/env_$DATE"

# Delete old backups
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "env_*" -mtime +$RETENTION_DAYS -delete

# Upload to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 cp "$BACKUP_DIR/db_$DATE.sql.gz" "s3://$AWS_S3_BUCKET/backups/"
    aws s3 cp "$BACKUP_DIR/files_$DATE.tar.gz" "s3://$AWS_S3_BUCKET/backups/"
fi

echo "Backup completed: $DATE"
```

**Backup Cron Job:**
```bash
# Add to crontab
0 2 * * * /opt/backups/backup.sh >> /var/log/backup.log 2>&1
```

**Restore Script:**
```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    exit 1
fi

echo "Restoring from $BACKUP_FILE..."

cd /opt/marine-maroc-fleet/fleetbase

# Restore database
gunzip < "$BACKUP_FILE" | docker compose exec -T database mysql -u root fleetbase

echo "Restore complete!"
```

### 5. Monitoring Setup

**Health Check Endpoint:**
```php
// routes/api.php
Route::get('/health', function () {
    $checks = [
        'database' => false,
        'redis' => false,
        'queue' => false,
    ];
    
    try {
        DB::connection()->getPdo();
        $checks['database'] = true;
    } catch (\Exception $e) {
        // Database down
    }
    
    try {
        Redis::ping();
        $checks['redis'] = true;
    } catch (\Exception $e) {
        // Redis down
    }
    
    $checks['queue'] = Queue::size() < 1000; // Queue not backed up
    
    $healthy = $checks['database'] && $checks['redis'] && $checks['queue'];
    
    return response()->json([
        'status' => $healthy ? 'ok' : 'degraded',
        'timestamp' => now()->toIso8601String(),
        'checks' => $checks,
    ], $healthy ? 200 : 503);
});
```

**Uptime Monitoring (UptimeRobot):**
- Monitor: https://fleet.marinemaroc.com/api/health
- Interval: 5 minutes
- Alert: Email/SMS on downtime
- Free tier: 50 monitors

**Log Monitoring Script:**
```bash
#!/bin/bash
# monitor-logs.sh

# Check for errors in last hour
ERRORS=$(docker compose logs --since 1h application | grep -i "error" | wc -l)

if [ $ERRORS -gt 10 ]; then
    echo "High error count: $ERRORS errors in last hour" | mail -s "Marine Maroc Fleet Alert" admin@marinemaroc.com
fi
```

### 6. Performance Optimization

**Database Optimization:**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status_driver ON orders(status, driver_id);

CREATE INDEX idx_tracking_driver_id ON tracking_statuses(driver_id);
CREATE INDEX idx_tracking_created_at ON tracking_statuses(created_at);
CREATE INDEX idx_tracking_driver_created ON tracking_statuses(driver_id, created_at);

-- Optimize tables
OPTIMIZE TABLE orders;
OPTIMIZE TABLE tracking_statuses;
OPTIMIZE TABLE drivers;
OPTIMIZE TABLE vehicles;

-- Analyze tables
ANALYZE TABLE orders;
ANALYZE TABLE tracking_statuses;
ANALYZE TABLE drivers;
ANALYZE TABLE vehicles;
```

**Redis Configuration:**
```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

**PHP-FPM Optimization:**
```ini
; php-fpm.conf
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500
```

### 7. Security Hardening

**Firewall Rules:**
```bash
# UFW configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH (consider changing port)
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

**SSH Hardening:**
```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change from default 22
```

**Rate Limiting:**
```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1',  // 60 requests per minute
        // ...
    ],
];
```

### 8. Disaster Recovery Plan

**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 24 hours

**Recovery Steps:**
1. Provision new server (1 hour)
2. Install Docker and dependencies (30 minutes)
3. Restore from backup (1 hour)
4. Configure DNS (30 minutes)
5. Test and verify (1 hour)

**Disaster Recovery Checklist:**
```markdown
- [ ] Provision new server
- [ ] Install Docker
- [ ] Clone repository
- [ ] Restore database backup
- [ ] Restore file backup
- [ ] Configure environment variables
- [ ] Start Docker services
- [ ] Update DNS records
- [ ] Install SSL certificate
- [ ] Test all functionality
- [ ] Notify users of new IP (if needed)
```

## Testing Strategy

### Load Testing

**Using Apache Bench:**
```bash
# Test API endpoint
ab -n 1000 -c 50 https://fleet.marinemaroc.com/api/orders

# Test with authentication
ab -n 1000 -c 50 -H "Authorization: Bearer TOKEN" https://fleet.marinemaroc.com/api/orders
```

**Using k6:**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 50 },  // Ramp up to 50 users
        { duration: '5m', target: 50 },  // Stay at 50 users
        { duration: '2m', target: 0 },   // Ramp down
    ],
};

export default function () {
    let response = http.get('https://fleet.marinemaroc.com/api/health');
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(1);
}
```

### Security Testing

**SSL Labs Test:**
```bash
# Test SSL configuration
curl https://www.ssllabs.com/ssltest/analyze.html?d=fleet.marinemaroc.com
```

**OWASP ZAP Scan:**
```bash
# Run security scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://fleet.marinemaroc.com
```

## Deployment Checklist

```markdown
### Pre-Deployment
- [ ] All Phase 3 features tested and approved
- [ ] Production environment variables configured
- [ ] SSL certificate obtained
- [ ] Backup system tested
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] Security scan completed

### Deployment
- [ ] Server provisioned
- [ ] Docker installed
- [ ] Application deployed
- [ ] Database migrated
- [ ] SSL configured
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring active

### Post-Deployment
- [ ] Health check passing
- [ ] All services running
- [ ] SSL certificate valid
- [ ] Backups running
- [ ] Monitoring alerts working
- [ ] Performance targets met
- [ ] Documentation updated

### User Acceptance
- [ ] Marine Maroc can access system
- [ ] Admin account created
- [ ] Training scheduled
- [ ] Support process documented
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for Implementation
