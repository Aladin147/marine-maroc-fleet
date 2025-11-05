# Phase 1: Foundation - Implementation Tasks

## Task List

- [ ] 1. Environment Setup and Repository Configuration
  - Clone all required repositories and initialize development environment
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 1.1 Clone Fleetbase core repository
  - Clone from https://github.com/fleetbase/fleetbase.git
  - Initialize git submodules with `git submodule update --init --recursive`
  - Verify all submodules are properly initialized
  - _Requirements: 2.1, 2.2_

- [ ] 1.2 Clone FleetOps extension repository
  - Clone from https://github.com/fleetbase/fleetops.git
  - Verify repository structure matches expected layout
  - _Requirements: 2.1_

- [ ] 1.3 Clone Navigator mobile app repository
  - Clone from https://github.com/fleetbase/navigator-app.git
  - Verify repository structure matches expected layout
  - _Requirements: 2.1_

- [ ] 1.4 Start Docker services
  - Run `./scripts/docker-install.sh` in fleetbase directory
  - Wait for all services to start (database, cache, application, console, socket, queue, scheduler)
  - Verify all containers show "Up" status with `docker-compose ps`
  - _Requirements: 1.1, 7.1_

- [ ] 1.5 Verify service connectivity
  - Test MySQL connection on port 3306
  - Test Redis connection on port 6379
  - Test API health endpoint at http://localhost:8000/health
  - Test Console loads at http://localhost:4200
  - Test SocketCluster on port 38000
  - _Requirements: 1.3, 1.4, 7.2, 7.3, 7.4, 7.5_

- [ ] 1.6 Create environment configuration files
  - Copy `api/.env.example` to `api/.env`
  - Set `APP_NAME=Marine Maroc Fleet`
  - Set `DATABASE_URL=mysql://root@database/fleetbase`
  - Set `REDIS_URL=tcp://cache`
  - Generate application key with `php artisan key:generate`
  - _Requirements: 2.4, 6.5_

- [ ] 1.7 Run database migrations
  - Execute `docker-compose exec application php artisan migrate`
  - Verify all migrations complete without errors
  - Check database schema includes all required tables
  - _Requirements: 6.2, 6.3_

- [ ] 1.8 Create admin account
  - Use `php artisan fleetbase:create-user` command
  - Set name: "Admin Marine Maroc"
  - Set email: "admin@test.com"
  - Set password: "password123"
  - Set company: "Marine Maroc"
  - Verify account creation in database
  - Test login with created credentials
  - _Requirements: 1.5, 6.5_

- [ ] 2. Feature Removal and Code Cleanup
  - Remove unnecessary features and simplify codebase for MVP
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 2.1 Configure disabled features in backend
  - Edit `fleetbase/api/config/fleetbase.php`
  - Add disabled_extensions array: ['storefront', 'maintenance', 'analytics']
  - Add disabled_features array: ['service_rates', 'telematics', 'vendors']
  - Restart application container
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 2.2 Configure disabled features in frontend
  - Edit `fleetbase/console/config/environment.js`
  - Add `ENV.APP.disabledFeatures` array with removed features
  - Include: 'storefront', 'maintenance', 'analytics', 'service-rates', 'telematics', 'vendors'
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 2.3 Remove e-commerce/storefront features
  - Comment out storefront routes in console routing
  - Hide storefront menu items in navigation
  - Verify storefront pages are not accessible
  - _Requirements: 3.1_

- [ ] 2.4 Remove maintenance module
  - Comment out maintenance routes
  - Hide maintenance navigation items
  - Verify maintenance pages return 404 or redirect
  - _Requirements: 3.2_

- [ ] 2.5 Remove analytics module
  - Comment out analytics routes
  - Hide analytics/reports navigation
  - Verify analytics pages are not accessible
  - _Requirements: 3.3_

- [ ] 2.6 Remove telematics features
  - Comment out connectivity/telematics routes
  - Hide telematics, devices, sensors navigation
  - Verify telematics pages are not accessible
  - _Requirements: 3.4_

- [ ] 2.7 Remove service rates feature
  - Comment out service rates routes
  - Hide service rates navigation
  - Verify service rates pages are not accessible
  - _Requirements: 3.5_

- [ ] 3. Navigation Simplification
  - Simplify navigation to 5 core menu items in French
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 3.1 Create simplified navigation component
  - Edit `fleetbase/console/app/templates/components/main-navigation.hbs`
  - Remove all existing navigation items
  - Add 5 new navigation items: Chargements, Chauffeurs, Véhicules, Lieux, Carte
  - Use appropriate icons for each item
  - _Requirements: 4.1_

- [ ] 3.2 Configure Chargements (Orders) navigation
  - Link to `operations.orders` route
  - Use box/package icon
  - Label: "Chargements"
  - Verify navigation works
  - _Requirements: 4.2_

- [ ] 3.3 Configure Chauffeurs (Drivers) navigation
  - Link to `management.drivers` route
  - Use user icon
  - Label: "Chauffeurs"
  - Verify navigation works
  - _Requirements: 4.3_

- [ ] 3.4 Configure Véhicules (Vehicles) navigation
  - Link to `management.vehicles` route
  - Use truck icon
  - Label: "Véhicules"
  - Verify navigation works
  - _Requirements: 4.4_

- [ ] 3.5 Configure Lieux (Places) navigation
  - Link to `management.places` route
  - Use map-marker icon
  - Label: "Lieux"
  - Verify navigation works
  - _Requirements: 4.5_

- [ ] 3.6 Configure Carte (Map) navigation
  - Link to `operations.map` or live tracking route
  - Use map icon
  - Label: "Carte"
  - Verify navigation works
  - _Requirements: 4.6_

- [ ] 3.7 Remove all other navigation items
  - Verify no removed features appear in navigation
  - Check for hidden submenus or dropdowns
  - Test all navigation paths
  - _Requirements: 4.7_

- [ ] 4. Basic Branding Application
  - Apply Marine Maroc branding to console
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4.1 Prepare logo assets
  - Copy `assets/logo-footer.png` to `fleetbase/console/public/images/logo-header.png`
  - Copy same logo as `logo-login.png` and `logo-footer.png`
  - Create placeholder favicon.ico (32x32px) if not available
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 4.2 Update application configuration
  - Edit `fleetbase/console/config/environment.js`
  - Set `ENV.APP.name = 'Marine Maroc Fleet'`
  - Set `ENV.APP.title = 'Gestion de Flotte Marine Maroc'`
  - Set `ENV.APP.logo = '/images/logo-header.png'`
  - _Requirements: 5.4_

- [ ] 4.3 Update header template
  - Edit header component template
  - Replace Fleetbase logo with Marine Maroc logo
  - Update alt text to "Marine Maroc Fleet"
  - Verify logo displays correctly
  - _Requirements: 5.1_

- [ ] 4.4 Update login page template
  - Edit login page template
  - Replace Fleetbase logo with Marine Maroc logo
  - Update page title to "Marine Maroc Fleet"
  - Verify logo displays correctly
  - _Requirements: 5.2_

- [ ] 4.5 Update favicon
  - Copy favicon.ico to `fleetbase/console/public/favicon.ico`
  - Update HTML head to reference new favicon
  - Clear browser cache and verify new favicon shows
  - _Requirements: 5.3_

- [ ] 4.6 Remove Fleetbase branding
  - Search for "Powered by Fleetbase" text
  - Comment out or remove all Fleetbase branding references
  - Check footer, login page, and about sections
  - Verify no Fleetbase branding visible
  - _Requirements: 5.5_

- [ ] 4.7 Update application name throughout
  - Search for "Fleetbase" in templates
  - Replace with "Marine Maroc Fleet" where appropriate
  - Update page titles, meta tags, and text content
  - _Requirements: 5.4_

- [ ] 5. Testing and Validation
  - Comprehensive testing of Phase 1 deliverables
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 5.1 Test Console functionality
  - Load Console at http://localhost:4200
  - Verify all 5 navigation items are visible
  - Click each navigation item and verify page loads
  - Check for JavaScript errors in browser console
  - Verify Marine Maroc branding is visible
  - _Requirements: 10.1_

- [ ] 5.2 Test API functionality
  - Test health endpoint: `curl http://localhost:8000/health`
  - Test authentication endpoint with admin credentials
  - Verify API returns proper JSON responses
  - Check API logs for errors
  - _Requirements: 10.2_

- [ ] 5.3 Test database operations
  - Create a test driver record
  - Read the driver record
  - Update the driver record
  - Delete the driver record
  - Verify all CRUD operations work
  - _Requirements: 10.3_

- [ ] 5.4 Test mobile app builds
  - Navigate to navigator-app directory
  - Run `yarn install`
  - Test iOS build: `yarn ios` (if on macOS)
  - Test Android build: `yarn android` (if Android SDK installed)
  - Verify builds complete without errors
  - _Requirements: 10.4_

- [ ] 5.5 Test end-to-end connectivity
  - Login to Console
  - Create a test order/load
  - Assign to a test driver
  - Verify data persists in database
  - Check WebSocket connection for real-time updates
  - _Requirements: 10.5_

- [ ] 6. Documentation Updates
  - Update documentation to reflect Phase 1 changes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6.1 Update README.md
  - Document current setup process
  - Add Phase 1 completion status
  - Update quick start instructions
  - _Requirements: 9.1_

- [ ] 6.2 Document removed features
  - Create list of removed features
  - Explain why each was removed
  - Document how to re-enable if needed (for future)
  - _Requirements: 9.2_

- [ ] 6.3 Update environment variable documentation
  - Document all required .env variables
  - Explain purpose of each variable
  - Provide example values
  - _Requirements: 9.3_

- [ ] 6.4 Update directory structure documentation
  - Document current project structure
  - Explain purpose of each directory
  - Update architecture diagrams if needed
  - _Requirements: 9.4_

- [ ] 6.5 Document troubleshooting steps
  - Add common issues and solutions
  - Document Docker troubleshooting
  - Add port conflict resolution steps
  - Document database connection issues
  - _Requirements: 9.5_

- [ ] 7. Code Quality and Cleanup
  - Ensure code quality standards are met
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7.1 Review code conventions
  - Verify PHP code follows PSR-12
  - Check JavaScript follows Ember.js conventions
  - Ensure consistent indentation and formatting
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 7.2 Review configuration files
  - Verify YAML files are properly formatted
  - Check JSON files for syntax errors
  - Ensure .env files have proper structure
  - _Requirements: 8.4_

- [ ] 7.3 Review git commits
  - Ensure commit messages are clear and descriptive
  - Verify commits are logically organized
  - Check for sensitive data in commits
  - _Requirements: 8.5_

- [ ] 7.4 Clean up temporary files
  - Remove any test files or debug code
  - Delete unused assets
  - Clean up commented code (keep only necessary comments)
  - _Requirements: 8.1_

- [ ] 8. Final Phase 1 Review
  - Final review and sign-off for Phase 1
  - _Requirements: All_

- [ ] 8.1 Complete manual testing checklist
  - Run through all manual tests
  - Document any issues found
  - Fix critical issues before completion
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 8.2 Review all deliverables
  - Verify all tasks are complete
  - Check all acceptance criteria are met
  - Ensure documentation is up to date
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 8.3 Prepare Phase 1 demo
  - Create demo script
  - Prepare screenshots
  - Document key achievements
  - _Requirements: All_

- [ ] 8.4 Phase 1 sign-off
  - Present Phase 1 deliverables
  - Get approval to proceed to Phase 2
  - Document any feedback or change requests
  - _Requirements: All_
