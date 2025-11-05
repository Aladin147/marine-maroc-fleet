# Phase 2: Backend Customization - Requirements Document

## Introduction

Phase 2 focuses on backend customization including French localization, simplified order workflows, external service configuration, and API optimization. This phase ensures the backend is properly configured for Marine Maroc's specific needs.

## Glossary

- **System**: The Marine Maroc Fleet Management System
- **Localization**: The process of adapting the system to French language and Moroccan locale
- **Workflow**: The sequence of states an order/load goes through from creation to completion
- **OSRM**: Open Source Routing Machine - routing service for calculating routes
- **SMTP**: Simple Mail Transfer Protocol - email sending protocol
- **API**: Application Programming Interface - the backend REST API

## Requirements

### Requirement 1: French Localization

**User Story:** As a dispatcher, I want the entire system in French, so that I can use it in my native language.

#### Acceptance Criteria

1. WHEN the Console loads, THE System SHALL display all UI text in French
2. WHEN the API returns error messages, THE System SHALL provide French error messages
3. WHEN emails are sent, THE System SHALL use French email templates
4. WHEN dates are displayed, THE System SHALL use French date format (DD/MM/YYYY)
5. WHEN numbers are displayed, THE System SHALL use French number format (space as thousand separator)

### Requirement 2: Translation Completeness

**User Story:** As a user, I want all text translated to French, so that I don't encounter English text unexpectedly.

#### Acceptance Criteria

1. WHEN navigating the Console, THE System SHALL not display any English text in the UI
2. WHEN viewing order statuses, THE System SHALL display French status names
3. WHEN reading button labels, THE System SHALL show French button text
4. WHEN viewing form labels, THE System SHALL display French field names
5. WHEN encountering validation errors, THE System SHALL show French error messages

### Requirement 3: Simplified Order Workflow

**User Story:** As a dispatcher, I want a simple 4-stage workflow for orders, so that I can easily track load progress.

#### Acceptance Criteria

1. WHEN an order is created, THE System SHALL set the initial status to "Nouveau" (New)
2. WHEN an order is assigned to a driver, THE System SHALL change status to "Assigné" (Assigned)
3. WHEN a driver starts a trip, THE System SHALL change status to "En Route" (In Progress)
4. WHEN a delivery is completed, THE System SHALL change status to "Livré" (Delivered)
5. WHEN viewing the workflow, THE System SHALL only show these 4 stages without additional complexity

### Requirement 4: Workflow Configuration

**User Story:** As a system administrator, I want the workflow pre-configured, so that dispatchers don't need to configure it themselves.

#### Acceptance Criteria

1. WHEN the System is initialized, THE System SHALL create a default workflow with 4 stages
2. WHEN a new order is created, THE System SHALL automatically use the default workflow
3. WHEN the workflow is viewed, THE System SHALL show stage names in French
4. WHEN a stage transition occurs, THE System SHALL validate the transition is allowed
5. WHEN the workflow builder is accessed, THE System SHALL hide or disable it for MVP

### Requirement 5: Google Maps Integration

**User Story:** As a dispatcher, I want to see locations on a map, so that I can visualize pickup and delivery points.

#### Acceptance Criteria

1. WHEN the map loads, THE System SHALL display a Google Maps interface
2. WHEN a location is added, THE System SHALL geocode the address using Google Maps API
3. WHEN viewing an order, THE System SHALL display pickup and delivery locations on the map
4. WHEN the map is in French locale, THE System SHALL display map labels in French
5. WHEN the API key is invalid, THE System SHALL display a clear error message

### Requirement 6: OSRM Routing Configuration

**User Story:** As a dispatcher, I want route calculations between locations, so that I can estimate travel time and distance.

#### Acceptance Criteria

1. WHEN calculating a route, THE System SHALL use OSRM routing service
2. WHEN a route is calculated, THE System SHALL return distance in kilometers
3. WHEN a route is calculated, THE System SHALL return estimated duration in minutes
4. WHEN OSRM is unavailable, THE System SHALL fall back to straight-line distance calculation
5. WHEN the route is displayed, THE System SHALL show the route path on the map

### Requirement 7: Email Service Configuration

**User Story:** As a system administrator, I want email notifications configured, so that users receive important updates.

#### Acceptance Criteria

1. WHEN an order is assigned, THE System SHALL send an email notification to the driver
2. WHEN an email is sent, THE System SHALL use the configured SMTP server
3. WHEN an email fails to send, THE System SHALL log the error and retry
4. WHEN viewing email templates, THE System SHALL show French content
5. WHEN the sender address is displayed, THE System SHALL show "noreply@marinemaroc.com"

### Requirement 8: API Performance Optimization

**User Story:** As a developer, I want the API to respond quickly, so that the user experience is smooth.

#### Acceptance Criteria

1. WHEN the API receives a request, THE System SHALL respond within 500 milliseconds for 95% of requests
2. WHEN querying the database, THE System SHALL use indexed columns for better performance
3. WHEN returning large datasets, THE System SHALL implement pagination
4. WHEN caching is enabled, THE System SHALL cache frequently accessed data in Redis
5. WHEN the cache is stale, THE System SHALL invalidate and refresh cached data

### Requirement 9: Database Query Optimization

**User Story:** As a developer, I want database queries optimized, so that the system scales efficiently.

#### Acceptance Criteria

1. WHEN loading orders, THE System SHALL use eager loading to prevent N+1 query problems
2. WHEN searching records, THE System SHALL use database indexes
3. WHEN counting records, THE System SHALL use efficient count queries
4. WHEN joining tables, THE System SHALL minimize the number of joins
5. WHEN the query is slow, THE System SHALL log slow queries for analysis

### Requirement 10: Environment Configuration

**User Story:** As a system administrator, I want all external services configured, so that the system functions correctly.

#### Acceptance Criteria

1. WHEN the System starts, THE System SHALL load all environment variables from .env file
2. WHEN a required variable is missing, THE System SHALL display a clear error message
3. WHEN the configuration is updated, THE System SHALL apply changes after restart
4. WHEN viewing the configuration, THE System SHALL not expose sensitive values in logs
5. WHEN the environment is production, THE System SHALL disable debug mode

### Requirement 11: API Documentation

**User Story:** As a developer, I want API endpoints documented, so that I can integrate with the system.

#### Acceptance Criteria

1. WHEN accessing API documentation, THE System SHALL provide a list of all endpoints
2. WHEN viewing an endpoint, THE System SHALL show request parameters and response format
3. WHEN testing an endpoint, THE System SHALL provide example requests and responses
4. WHEN authentication is required, THE System SHALL document the authentication method
5. WHEN errors occur, THE System SHALL document possible error codes and messages

### Requirement 12: Error Logging

**User Story:** As a developer, I want errors logged properly, so that I can troubleshoot issues.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL log the error with timestamp and stack trace
2. WHEN a critical error occurs, THE System SHALL log at ERROR level
3. WHEN a warning occurs, THE System SHALL log at WARNING level
4. WHEN debugging, THE System SHALL log at DEBUG level (development only)
5. WHEN logs are rotated, THE System SHALL keep logs for 14 days

### Requirement 13: Queue Configuration

**User Story:** As a system administrator, I want background jobs configured, so that long-running tasks don't block requests.

#### Acceptance Criteria

1. WHEN an email needs to be sent, THE System SHALL queue the job for background processing
2. WHEN a notification needs to be sent, THE System SHALL queue the job
3. WHEN the queue worker is running, THE System SHALL process jobs from the queue
4. WHEN a job fails, THE System SHALL retry up to 3 times
5. WHEN a job fails permanently, THE System SHALL log the failure

### Requirement 14: WebSocket Configuration

**User Story:** As a dispatcher, I want real-time updates, so that I see changes immediately without refreshing.

#### Acceptance Criteria

1. WHEN a driver's location updates, THE System SHALL broadcast the update via WebSocket
2. WHEN an order status changes, THE System SHALL broadcast the change via WebSocket
3. WHEN the Console is open, THE System SHALL maintain a WebSocket connection
4. WHEN the connection drops, THE System SHALL automatically reconnect
5. WHEN a broadcast is sent, THE System SHALL only send to authorized users

### Requirement 15: Testing and Validation

**User Story:** As a quality assurance engineer, I want Phase 2 deliverables tested, so that we can proceed to Phase 3 with confidence.

#### Acceptance Criteria

1. WHEN French translations are tested, THE System SHALL display all text in French
2. WHEN the workflow is tested, THE System SHALL transition through all 4 stages correctly
3. WHEN external services are tested, THE System SHALL connect successfully
4. WHEN the API is tested, THE System SHALL respond within performance targets
5. WHEN end-to-end testing is performed, THE System SHALL complete all core workflows
