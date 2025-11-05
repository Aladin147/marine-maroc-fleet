# Marine Maroc Fleet Management - Branding Guide

## Overview

This document outlines the branding customization process for Marine Maroc's fleet management system, transforming the generic Fleetbase platform into a fully branded Marine Maroc experience.

---

## Brand Identity

### Company Information
- **Name:** Marine Maroc S.A.
- **Industry:** Heavy equipment transport & logistics
- **Location:** Morocco
- **Primary Language:** French
- **Secondary Language:** Arabic (Phase 2)

### Brand Colors

**Primary Colors:**
- Marine Blue: `#0047AB` (primary brand color)
- Ocean Teal: `#00CED1` (accent color)
- White: `#FFFFFF` (backgrounds, text)

**Secondary Colors:**
- Dark Gray: `#2D3748` (text, borders)
- Light Gray: `#F7FAFC` (backgrounds)
- Success Green: `#48BB78` (completed status)
- Warning Orange: `#ED8936` (in-progress status)
- Error Red: `#F56565` (alerts, errors)

### Typography
- **Primary Font:** Inter (system default)
- **Headings:** Bold, 600 weight
- **Body:** Regular, 400 weight
- **Code/Numbers:** Monospace

---

## Logo Assets

### Current Assets
- Location: `assets/logo-footer.png`
- Format: PNG with transparent background
- Source: Downloaded from internet

### Required Logo Variations

**Console (Web Dashboard):**
- [ ] `logo-header.png` - 180x50px (header navigation)
- [ ] `logo-login.png` - 300x100px (login page)
- [ ] `logo-footer.png` - 150x40px (footer) ✅
- [ ] `favicon.ico` - 32x32px (browser tab)
- [ ] `favicon-16x16.png` - 16x16px
- [ ] `favicon-32x32.png` - 32x32px

**Mobile App:**
- [ ] `app-icon.png` - 1024x1024px (iOS/Android)
- [ ] `app-icon-rounded.png` - 1024x1024px (Android adaptive)
- [ ] `splash-screen.png` - 2048x2048px (launch screen)
- [ ] `logo-white.png` - 300x100px (dark backgrounds)

**Email Templates:**
- [ ] `email-header.png` - 600x150px

### Logo Usage Guidelines

**Do:**
- ✅ Use on white or light backgrounds
- ✅ Maintain aspect ratio
- ✅ Keep clear space around logo (minimum 20px)
- ✅ Use PNG format with transparency

**Don't:**
- ❌ Stretch or distort logo
- ❌ Change logo colors
- ❌ Add effects (shadows, gradients)
- ❌ Place on busy backgrounds

---

## Console Branding

### File Locations

**Logo Files:**
```
fleetbase/console/public/images/
├── logo-header.png          # Header logo
├── logo-login.png           # Login page logo
├── logo-footer.png          # Footer logo
└── favicon.ico              # Browser favicon
```

**Favicon Files:**
```
fleetbase/console/public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
└── apple-touch-icon.png
```

**Style Customization:**
```
fleetbase/console/app/styles/
└── custom.css               # Custom CSS overrides
```

### Configuration Changes

**Environment Config:**
```javascript
// fleetbase/console/config/environment.js

ENV.APP = {
  name: 'Marine Maroc Fleet',
  title: 'Gestion de Flotte Marine Maroc',
  description: 'Système de gestion de flotte pour Marine Maroc',
  locale: 'fr-fr',
  defaultLocale: 'fr-fr'
};
```

**Fleetbase Config:**
```json
// fleetbase/console/fleetbase.config.json
{
  "app": {
    "name": "Marine Maroc Fleet",
    "locale": "fr-fr"
  },
  "branding": {
    "logo": "/images/logo-header.png",
    "icon": "/favicon.ico"
  }
}
```

### CSS Customization

**Custom Styles:**
```css
/* fleetbase/console/app/styles/custom.css */

/* Primary brand color */
:root {
  --primary-color: #0047AB;
  --primary-hover: #003580;
  --accent-color: #00CED1;
  --accent-hover: #00B8BA;
}

/* Header branding */
.console-header {
  background-color: var(--primary-color);
}

/* Button styles */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

/* Link colors */
a {
  color: var(--primary-color);
}

a:hover {
  color: var(--primary-hover);
}

/* Map markers */
.vehicle-marker {
  background-color: var(--primary-color);
}

/* Status badges */
.status-badge.completed {
  background-color: #48BB78;
}

.status-badge.in-progress {
  background-color: #ED8936;
}

.status-badge.assigned {
  background-color: var(--accent-color);
}
```

### Remove Fleetbase Branding

**Footer:**
```javascript
// fleetbase/console/app/templates/application.hbs
// Remove or comment out:
// <div class="powered-by">Powered by Fleetbase</div>
```

**Login Page:**
```javascript
// fleetbase/console/app/templates/login.hbs
// Replace Fleetbase logo with Marine Maroc logo
<img src="/images/logo-login.png" alt="Marine Maroc Fleet" />
```

---

## Mobile App Branding

### File Locations

**App Icons:**
```
navigator-app/assets/
├── app-icon.png             # 1024x1024px
├── splash-screen.png        # 2048x2048px
└── logo-white.png           # For dark backgrounds
```

**Android:**
```
navigator-app/android/app/src/main/res/
├── mipmap-hdpi/            # 72x72px
├── mipmap-mdpi/            # 48x48px
├── mipmap-xhdpi/           # 96x96px
├── mipmap-xxhdpi/          # 144x144px
└── mipmap-xxxhdpi/         # 192x192px
```

**iOS:**
```
navigator-app/ios/NavigatorApp/Images.xcassets/
└── AppIcon.appiconset/     # Various sizes
```

### Configuration Changes

**Environment Config:**
```bash
# navigator-app/.env

APP_NAME=Marine Maroc Fleet
APP_IDENTIFIER=ma.marinemaroc.fleet
FLEETBASE_HOST=https://fleet.marinemaroc.com
```

**Android:**
```xml
<!-- navigator-app/android/app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">Marine Maroc Fleet</string>
</resources>
```

**iOS:**
```xml
<!-- navigator-app/ios/NavigatorApp/Info.plist -->
<key>CFBundleDisplayName</key>
<string>Marine Maroc Fleet</string>
<key>CFBundleName</key>
<string>Marine Maroc Fleet</string>
```

### Color Scheme

**React Native Theme:**
```javascript
// navigator-app/src/utils/theme.js

export const colors = {
  primary: '#0047AB',      // Marine Blue
  primaryDark: '#003580',
  accent: '#00CED1',       // Ocean Teal
  accentDark: '#00B8BA',
  
  background: '#FFFFFF',
  surface: '#F7FAFC',
  
  text: '#2D3748',
  textLight: '#718096',
  
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  
  border: '#E2E8F0',
};
```

### Splash Screen

**Generate Splash Screen:**
```bash
cd navigator-app
npx react-native generate-bootsplash ./assets/splash-screen.png \
  --background=#0047AB \
  --logo-width=200 \
  --flavor=main
```

---

## Backend Branding

### Environment Variables

```bash
# fleetbase/api/.env

APP_NAME="Marine Maroc Fleet"
APP_URL=https://fleet.marinemaroc.com
CONSOLE_HOST=https://fleet.marinemaroc.com

# Email branding
MAIL_FROM_NAME="Marine Maroc Fleet"
MAIL_FROM_ADDRESS=noreply@marinemaroc.com

# SMS branding (if using Twilio)
SMS_FROM_NAME="Marine Maroc"
```

### Email Templates

**Location:**
```
fleetbase/api/resources/views/emails/
├── header.blade.php         # Email header with logo
├── footer.blade.php         # Email footer
└── order-assigned.blade.php # Order notification
```

**Header Template:**
```html
<!-- resources/views/emails/header.blade.php -->
<table style="width: 100%; background: #0047AB;">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <img src="{{ asset('images/logo-white.png') }}" 
           alt="Marine Maroc Fleet" 
           style="height: 50px;" />
    </td>
  </tr>
</table>
```

---

## Translations

### French Translations

**Console:**
```yaml
# fleetbase/console/translations/fr-fr.yaml

common:
  app-name: "Marine Maroc Fleet"
  welcome: "Bienvenue"
  
fleet-ops:
  orders: "Chargements"
  drivers: "Chauffeurs"
  vehicles: "Véhicules"
  places: "Lieux"
  map: "Carte"
  
  order-status:
    new: "Nouveau"
    assigned: "Assigné"
    in-progress: "En Route"
    completed: "Livré"
```

**Mobile App:**
```json
// navigator-app/translations/fr.json
{
  "app": {
    "name": "Marine Maroc Fleet",
    "welcome": "Bienvenue"
  },
  "orders": {
    "title": "Mes Chargements",
    "start_trip": "Démarrer",
    "complete": "Terminer",
    "proof_of_delivery": "Preuve de Livraison"
  },
  "tracking": {
    "enabled": "Suivi activé",
    "disabled": "Suivi désactivé"
  }
}
```

---

## Domain & SSL

### Domain Configuration

**Primary Domain:**
- Console: `fleet.marinemaroc.com`
- API: `fleet.marinemaroc.com/api` (or `api.fleet.marinemaroc.com`)

**DNS Records:**
```
A     fleet.marinemaroc.com        → [Server IP]
CNAME api.fleet.marinemaroc.com    → fleet.marinemaroc.com
```

### SSL Certificate

**Let's Encrypt (Recommended):**
```bash
# Using Certbot
certbot certonly --standalone \
  -d fleet.marinemaroc.com \
  -d api.fleet.marinemaroc.com
```

**NGINX Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name fleet.marinemaroc.com;
    
    ssl_certificate /etc/letsencrypt/live/fleet.marinemaroc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fleet.marinemaroc.com/privkey.pem;
    
    # ... rest of config
}
```

---

## Branding Checklist

### Pre-Launch Checklist

**Assets:**
- [ ] All logo variations created
- [ ] Favicon generated
- [ ] Mobile app icons generated
- [ ] Splash screen created
- [ ] Email header image created

**Console:**
- [ ] Logo replaced in header
- [ ] Logo replaced on login page
- [ ] Favicon updated
- [ ] Custom CSS applied
- [ ] "Powered by Fleetbase" removed
- [ ] French translations verified

**Mobile App:**
- [ ] App icon replaced
- [ ] Splash screen updated
- [ ] App name changed
- [ ] Bundle identifier updated
- [ ] French translations verified
- [ ] Theme colors applied

**Backend:**
- [ ] APP_NAME updated
- [ ] Email templates branded
- [ ] SMS sender name updated
- [ ] Domain configured
- [ ] SSL certificate installed

**Testing:**
- [ ] Console loads with Marine Maroc branding
- [ ] Mobile app shows Marine Maroc icon
- [ ] Emails display Marine Maroc logo
- [ ] No Fleetbase branding visible
- [ ] All French translations working

---

## Brand Guidelines

### Voice & Tone

**Professional & Reliable:**
- Use formal French ("vous" not "tu")
- Clear, concise language
- Technical but accessible

**Example Messages:**
```
✅ Good: "Votre chargement a été assigné au chauffeur Mohamed."
❌ Bad: "Hey! T'as un nouveau chargement!"

✅ Good: "Erreur de connexion. Veuillez réessayer."
❌ Bad: "Oops! Quelque chose s'est cassé!"
```

### Terminology

**Consistent Terms:**
- Load/Shipment → "Chargement"
- Driver → "Chauffeur"
- Vehicle → "Véhicule"
- Location → "Lieu"
- Delivery → "Livraison"
- Pickup → "Enlèvement"
- Proof of Delivery → "Preuve de Livraison"

---

## Future Branding (Phase 2)

### Arabic Support
- RTL (right-to-left) layout
- Arabic translations
- Arabic fonts
- Localized date/time formats

### White-Label Automation
- Automated branding script
- Client-specific themes
- Multi-tenant branding
- Brand asset management

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Active
