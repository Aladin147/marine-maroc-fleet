# Phase 2: Backend Customization - Implementation Tasks

## Task List

- [ ] 1. Multi-Language Support Setup
  - Configure Laravel localization for French and Arabic
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 1.1 Create translation file structure
  - Create `resources/lang/fr/` directory with messages.php, validation.php, orders.php
  - Create `resources/lang/ar/` directory with messages.php, validation.php, orders.php
  - Set up UTF-8 encoding for Arabic characters
  - _Requirements: 1.1, 1.2, 15.1_

- [ ] 1.2 Translate order statuses
  - Add French translations: Nouveau, Assigné, En Route, Livré
  - Add Arabic translations: جديد, مُعيّن, في الطريق, تم التسليم
  - Create status translation helper function
  - _Requirements: 2.3, 15.2_

- [ ] 1.3 Translate validation messages
  - Translate all Laravel validation messages to French
  - Translate all Laravel validation messages to Arabic
  - Test validation errors in both languages
  - _Requirements: 2.5, 2.6_

- [ ] 1.4 Translate API error messages
  - Create error message translations for common API errors
  - Implement language detection middleware
  - Return errors in appropriate language based on Accept-Language header
  - _Requirements: 1.2, 1.3, 2.7_

- [ ] 1.5 Configure database for Arabic support
  - Ensure database uses UTF-8 encoding (utf8mb4)
  - Test storing and retrieving Arabic text
  - Verify Arabic characters display correctly
  - _Requirements: 15.1, 16.7_

- [ ] 1.6 Implement language detection middleware
  - Create SetLocale middleware
  - Detect language from Accept-Language header
  - Set app locale to 'fr' for console, 'ar' for mobile app
  - _Requirements: 1.7, 2.7_

- [ ] 1.7 Create API endpoints with language support
  - Update order endpoints to return translated status labels
  - Update error responses to use translated messages
  - Test API with both French and Arabic requests
  - _Requirements: 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 2. Simplified Workflow Configuration
  - Implement 4-stage workflow system
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2.1 Create workflow database schema
  - Create order_workflows table migration
  - Add status column to orders table (ENUM: new, assigned, in_progress, delivered)
  - Add status_updated_at timestamp column
  - Create indexes for status queries
  - _Requirements: 4.1, 4.2_

- [ ] 2.2 Create workflow seeder
  - Seed default Marine Maroc workflow with 4 stages
  - Set stage colors (gray, teal, orange, green)
  - Mark as default workflow
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 2.3 Implement workflow service
  - Create OrderWorkflowService class
  - Define allowed transitions (new→assigned→in_progress→delivered)
  - Implement transitionTo() method with validation
  - Throw exception for invalid transitions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.4_

- [ ] 2.4 Create workflow events
  - Create OrderStatusChanged event
  - Trigger event on status transition
  - Set up event listeners for notifications
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 2.5 Disable workflow builder UI
  - Hide workflow builder routes in API
  - Return default workflow for all new orders
  - Prevent workflow customization via API
  - _Requirements: 4.5_

- [ ] 2.6 Test workflow transitions
  - Test valid transitions (new→assigned, assigned→in_progress, etc.)
  - Test invalid transitions (new→delivered should fail)
  - Test workflow events fire correctly
  - _Requirements: 16.2_

- [ ] 3. Google Maps Integration
  - Configure and test Google Maps API
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3.1 Configure Google Maps API
  - Add GOOGLE_MAPS_API_KEY to .env
  - Add GOOGLE_MAPS_LOCALE=fr to .env
  - Configure in config/services.php
  - _Requirements: 5.1, 5.4_

- [ ] 3.2 Create geocoding service
  - Create GeocodingService class
  - Implement geocode() method using Google Maps Geocoding API
  - Handle API errors gracefully
  - Return lat/lng coordinates
  - _Requirements: 5.2, 5.5_

- [ ] 3.3 Integrate geocoding with places
  - Auto-geocode addresses when creating places
  - Store coordinates in database
  - Update existing places with coordinates
  - _Requirements: 5.2_

- [ ] 3.4 Test Google Maps integration
  - Test geocoding Moroccan addresses
  - Test with French locale
  - Verify coordinates are accurate
  - Test error handling for invalid addresses
  - _Requirements: 5.3, 5.5, 16.3_

- [ ] 4. OSRM Routing Configuration
  - Configure and test OSRM routing service
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 4.1 Configure OSRM service
  - Add OSRM_HOST to .env (default: https://router.project-osrm.org)
  - Configure in config/services.php
  - _Requirements: 6.1_

- [ ] 4.2 Create routing service
  - Create RoutingService class
  - Implement calculateRoute() method using OSRM API
  - Return distance (km), duration (minutes), and route geometry
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 4.3 Implement fallback distance calculation
  - Implement Haversine formula for straight-line distance
  - Use as fallback when OSRM is unavailable
  - Calculate estimated duration based on average speed
  - _Requirements: 6.4_

- [ ] 4.4 Integrate routing with orders
  - Calculate route when order is created
  - Store distance and duration in database
  - Display route on map in console
  - _Requirements: 6.5_

- [ ] 4.5 Test OSRM integration
  - Test routing between Moroccan cities
  - Test fallback when OSRM is down
  - Verify distance and duration calculations
  - _Requirements: 16.3_

- [ ] 5. Email Service Configuration
  - Configure SMTP and create email templates
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5.1 Configure SMTP settings
  - Add MAIL_* variables to .env
  - Configure mail driver in config/mail.php
  - Set from address and name
  - _Requirements: 7.2_

- [ ] 5.2 Create French email templates
  - Create order-assigned email template in French
  - Create order-completed email template in French
  - Use Marine Maroc branding in templates
  - _Requirements: 7.1, 7.4_

- [ ] 5.3 Create notification jobs
  - Create SendOrderAssignedNotification job
  - Queue job when order is assigned
  - Implement retry logic (3 attempts)
  - _Requirements: 7.1, 7.3_

- [ ] 5.4 Test email delivery
  - Test sending emails via SMTP
  - Verify French content displays correctly
  - Test email queue processing
  - Test retry logic on failure
  - _Requirements: 7.2, 7.3, 7.5, 16.3_

- [ ] 6. API Performance Optimization
  - Optimize API response times and database queries
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6.1 Implement Redis caching
  - Create CacheService class
  - Cache driver locations (5 minute TTL)
  - Cache active orders (2 minute TTL)
  - Cache frequently accessed data
  - _Requirements: 8.4_

- [ ] 6.2 Add database indexes
  - Add index on orders.status
  - Add index on orders.driver_id
  - Add composite index on (status, driver_id)
  - Add index on tracking_statuses.driver_id
  - Add composite index on tracking_statuses (driver_id, created_at)
  - _Requirements: 9.2_

- [ ] 6.3 Implement eager loading
  - Use with() for order relationships (driver, vehicle, places)
  - Prevent N+1 query problems
  - Test query count reduction
  - _Requirements: 9.1_

- [ ] 6.4 Implement API response caching
  - Create CacheResponse middleware
  - Cache GET requests for 1 minute
  - Invalidate cache on data changes
  - _Requirements: 8.4_

- [ ] 6.5 Optimize slow queries
  - Enable slow query logging
  - Identify and optimize slow queries
  - Use EXPLAIN to analyze query performance
  - _Requirements: 9.5_

- [ ] 6.6 Test API performance
  - Measure API response times
  - Verify 95th percentile < 500ms
  - Test with realistic data volume
  - _Requirements: 8.1, 16.4_

- [ ] 7. Queue Configuration
  - Configure background job processing
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 7.1 Configure Redis queue
  - Set QUEUE_CONNECTION=redis in .env
  - Configure queue in config/queue.php
  - _Requirements: 13.1, 13.2_

- [ ] 7.2 Create queue jobs
  - Email notification jobs (already created in task 5.3)
  - Push notification jobs
  - Location processing jobs
  - _Requirements: 13.1, 13.2_

- [ ] 7.3 Configure job retry logic
  - Set max attempts to 3
  - Implement exponential backoff
  - Log failed jobs
  - _Requirements: 13.4, 13.5_

- [ ] 7.4 Test queue processing
  - Test queue worker processes jobs
  - Test job retry on failure
  - Test failed job logging
  - _Requirements: 13.3, 13.4, 13.5_

- [ ] 8. WebSocket Configuration
  - Configure real-time updates via WebSocket
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 8.1 Configure SocketCluster connection
  - Verify SocketCluster service is running
  - Configure WebSocket URL in API
  - Test WebSocket connection
  - _Requirements: 14.3_

- [ ] 8.2 Implement location broadcast
  - Broadcast driver location updates via WebSocket
  - Use channel: tracking.{driver_id}
  - Only send to authorized users
  - _Requirements: 14.1, 14.5_

- [ ] 8.3 Implement order status broadcast
  - Broadcast order status changes via WebSocket
  - Use channel: order.{order_id}
  - Update console in real-time
  - _Requirements: 14.2, 14.5_

- [ ] 8.4 Implement auto-reconnect
  - Handle WebSocket disconnections
  - Automatically reconnect on connection loss
  - Resume subscriptions after reconnect
  - _Requirements: 14.4_

- [ ] 8.5 Test WebSocket functionality
  - Test location updates appear in real-time
  - Test order status updates appear in real-time
  - Test reconnection logic
  - _Requirements: 14.1, 14.2, 14.4_

- [ ] 9. Environment Configuration
  - Configure production environment variables
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 9.1 Create production .env file
  - Copy .env.example to .env
  - Set APP_ENV=production
  - Set APP_DEBUG=false
  - Generate APP_KEY
  - _Requirements: 10.1, 10.5_

- [ ] 9.2 Configure all required variables
  - Database credentials
  - Redis connection
  - Google Maps API key
  - OSRM host
  - Email settings
  - _Requirements: 10.1_

- [ ] 9.3 Validate environment configuration
  - Check all required variables are set
  - Test each external service connection
  - Verify no sensitive data in logs
  - _Requirements: 10.2, 10.4_

- [ ] 9.4 Test configuration reload
  - Update configuration
  - Restart services
  - Verify changes applied
  - _Requirements: 10.3_

- [ ] 10. Error Logging
  - Configure comprehensive error logging
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 10.1 Configure log channels
  - Set LOG_CHANNEL=daily in .env
  - Configure log rotation (14 days)
  - Set appropriate log levels
  - _Requirements: 12.5_

- [ ] 10.2 Implement error logging
  - Log errors with timestamp and stack trace
  - Use ERROR level for critical errors
  - Use WARNING level for warnings
  - Use DEBUG level for development only
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 10.3 Test error logging
  - Trigger various error types
  - Verify errors are logged correctly
  - Check log rotation works
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 11. API Documentation
  - Document all API endpoints
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 11.1 Document authentication
  - Document JWT token authentication
  - Provide example requests with tokens
  - Document token expiry and refresh
  - _Requirements: 11.4_

- [ ] 11.2 Document order endpoints
  - Document GET /api/orders (list orders)
  - Document POST /api/orders (create order)
  - Document PATCH /api/orders/{id} (update order)
  - Include request/response examples
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 11.3 Document error responses
  - Document error codes (400, 401, 404, 422, 500)
  - Provide example error responses
  - Document error message format
  - _Requirements: 11.5_

- [ ] 11.4 Create API documentation file
  - Create docs/api.md with all endpoints
  - Include authentication instructions
  - Add code examples in multiple languages
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 12. Testing and Validation
  - Comprehensive testing of Phase 2 deliverables
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 12.1 Test French translations
  - Load console with French locale
  - Verify all text displays in French
  - Test order status translations
  - Test validation error messages
  - _Requirements: 16.1_

- [ ] 12.2 Test Arabic translations
  - Send API requests with Accept-Language: ar
  - Verify responses contain Arabic text
  - Test Arabic characters store and retrieve correctly
  - _Requirements: 16.2, 16.7_

- [ ] 12.3 Test workflow transitions
  - Test all valid transitions
  - Test invalid transitions are rejected
  - Verify events fire correctly
  - _Requirements: 16.2_

- [ ] 12.4 Test external services
  - Test Google Maps geocoding
  - Test OSRM routing
  - Test email sending
  - Test WebSocket connections
  - _Requirements: 16.3_

- [ ] 12.5 Test API performance
  - Run load tests with realistic data
  - Measure response times
  - Verify 95th percentile < 500ms
  - Check cache hit rates
  - _Requirements: 16.4_

- [ ] 12.6 End-to-end workflow testing
  - Create order → Assign to driver → Start trip → Complete delivery
  - Verify all steps work correctly
  - Test with both French and Arabic
  - _Requirements: 16.5_

- [ ] 13. Documentation Updates
  - Update documentation to reflect Phase 2 changes
  - _Requirements: All_

- [ ] 13.1 Update API documentation
  - Document new language support
  - Document workflow endpoints
  - Update example requests/responses
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 13.2 Update environment variable documentation
  - Document all new .env variables
  - Provide example values
  - Explain purpose of each variable
  - _Requirements: 10.1_

- [ ] 13.3 Document external service configuration
  - Document Google Maps setup
  - Document OSRM configuration
  - Document email service setup
  - _Requirements: 5.1, 6.1, 7.1_

- [ ] 14. Phase 2 Review and Sign-off
  - Final review and approval for Phase 2
  - _Requirements: All_

- [ ] 14.1 Complete manual testing checklist
  - Test all French translations
  - Test all Arabic translations
  - Test workflow transitions
  - Test external services
  - Test API performance
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 14.2 Review all deliverables
  - Verify all requirements met
  - Check all acceptance criteria satisfied
  - Ensure documentation is complete
  - _Requirements: All_

- [ ] 14.3 Prepare Phase 2 demo
  - Demo French console
  - Demo Arabic API responses
  - Demo workflow transitions
  - Demo external services
  - _Requirements: All_

- [ ] 14.4 Phase 2 sign-off
  - Present Phase 2 deliverables
  - Get approval to proceed to Phase 3
  - Document any feedback
  - _Requirements: All_
