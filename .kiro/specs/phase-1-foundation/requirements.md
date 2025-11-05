# Phase 1: Foundation - Requirements Document

## Introduction

Phase 1 establishes the foundation for the Marine Maroc fleet management system by setting up the development environment, cleaning up unnecessary features from Fleetbase, and applying basic branding. This phase ensures the team has a working development environment and a clean codebase to build upon.

## Glossary

- **System**: The Marine Maroc Fleet Management System
- **Fleetbase**: The open-source fleet management platform used as the foundation
- **Console**: The web-based admin dashboard (Ember.js application)
- **API**: The backend REST API (Laravel application)
- **Navigator App**: The driver mobile application (React Native)
- **Docker**: Containerization platform used for deployment
- **MVP**: Minimum Viable Product - the core features for initial release

## Requirements

### Requirement 1: Development Environment Setup

**User Story:** As a developer, I want a fully functional local development environment, so that I can develop and test features efficiently.

#### Acceptance Criteria

1. WHEN the developer runs the installation script, THE System SHALL start all required Docker services within 5 minutes
2. WHEN all services are started, THE System SHALL expose the Console on port 4200 and the API on port 8000
3. WHEN the developer accesses the Console, THE System SHALL display the login page without errors
4. WHEN the developer accesses the API health endpoint, THE System SHALL return a successful health check response
5. WHEN the developer creates an admin account, THE System SHALL persist the account in the database and allow login

### Requirement 2: Repository Configuration

**User Story:** As a developer, I want all required repositories cloned and configured, so that I have access to all necessary code.

#### Acceptance Criteria

1. WHEN the repositories are cloned, THE System SHALL include Fleetbase core, FleetOps extension, and Navigator app
2. WHEN Fleetbase is cloned, THE System SHALL initialize all git submodules successfully
3. WHEN the project structure is created, THE System SHALL organize repositories in a logical directory structure
4. WHEN environment files are created, THE System SHALL include all required configuration variables
5. WHEN dependencies are installed, THE System SHALL complete without errors for all three repositories

### Requirement 3: Unused Feature Removal

**User Story:** As a product owner, I want unnecessary features removed from the codebase, so that the system is simplified and focused on core fleet management.

#### Acceptance Criteria

1. WHEN the e-commerce features are removed, THE System SHALL not display any storefront-related menu items or routes
2. WHEN the maintenance module is disabled, THE System SHALL not show maintenance-related navigation or pages
3. WHEN the analytics module is disabled, THE System SHALL not display analytics dashboards or reports
4. WHEN the telematics features are removed, THE System SHALL not show device or sensor management interfaces
5. WHEN the service rates feature is disabled, THE System SHALL not display pricing or rate configuration options

### Requirement 4: Navigation Simplification

**User Story:** As a dispatcher, I want a simplified navigation menu, so that I can quickly access the core features I need.

#### Acceptance Criteria

1. WHEN the Console loads, THE System SHALL display only five main navigation items: Chargements, Chauffeurs, Véhicules, Lieux, and Carte
2. WHEN a user clicks on Chargements, THE System SHALL navigate to the orders/loads management page
3. WHEN a user clicks on Chauffeurs, THE System SHALL navigate to the drivers management page
4. WHEN a user clicks on Véhicules, THE System SHALL navigate to the vehicles management page
5. WHEN a user clicks on Lieux, THE System SHALL navigate to the places/locations management page
6. WHEN a user clicks on Carte, THE System SHALL display the live tracking map
7. WHEN the navigation is rendered, THE System SHALL not display removed features in any menu or submenu

### Requirement 5: Basic Branding Application

**User Story:** As a product owner, I want Marine Maroc branding applied to the system, so that it reflects the client's identity.

#### Acceptance Criteria

1. WHEN the Console loads, THE System SHALL display the Marine Maroc logo in the header
2. WHEN the login page loads, THE System SHALL display the Marine Maroc logo
3. WHEN the browser tab is viewed, THE System SHALL show a Marine Maroc favicon
4. WHEN the application name is displayed, THE System SHALL show "Marine Maroc Fleet" instead of "Fleetbase"
5. WHEN any Fleetbase branding is checked, THE System SHALL not display "Powered by Fleetbase" or similar text

### Requirement 6: Database Initialization

**User Story:** As a developer, I want the database properly initialized, so that the system can store and retrieve data correctly.

#### Acceptance Criteria

1. WHEN the database container starts, THE System SHALL create the fleetbase database automatically
2. WHEN migrations are run, THE System SHALL execute all database migrations without errors
3. WHEN the database schema is checked, THE System SHALL include all required tables for core features
4. WHEN the database is queried, THE System SHALL respond within 100 milliseconds for simple queries
5. WHEN an admin account is created, THE System SHALL store the user credentials securely with password hashing

### Requirement 7: Service Health Verification

**User Story:** As a developer, I want to verify all services are running correctly, so that I can confirm the environment is ready for development.

#### Acceptance Criteria

1. WHEN the developer checks service status, THE System SHALL show all Docker containers in "Up" state
2. WHEN the MySQL service is checked, THE System SHALL accept connections on port 3306
3. WHEN the Redis service is checked, THE System SHALL accept connections on port 6379
4. WHEN the SocketCluster service is checked, THE System SHALL accept WebSocket connections on port 38000
5. WHEN the queue worker is checked, THE System SHALL process jobs from the Redis queue
6. WHEN the scheduler is checked, THE System SHALL execute scheduled tasks according to the crontab

### Requirement 8: Code Quality Standards

**User Story:** As a developer, I want code quality standards established, so that the codebase remains maintainable.

#### Acceptance Criteria

1. WHEN code is committed, THE System SHALL follow existing Fleetbase code conventions
2. WHEN PHP code is written, THE System SHALL comply with PSR-12 coding standards
3. WHEN JavaScript code is written, THE System SHALL follow Ember.js and React Native best practices
4. WHEN configuration files are modified, THE System SHALL maintain proper YAML/JSON formatting
5. WHEN git commits are made, THE System SHALL include clear, descriptive commit messages

### Requirement 9: Documentation Updates

**User Story:** As a team member, I want documentation updated to reflect Phase 1 changes, so that everyone understands the current state of the system.

#### Acceptance Criteria

1. WHEN Phase 1 is complete, THE System SHALL have updated README with current setup instructions
2. WHEN features are removed, THE System SHALL document which features were removed and why
3. WHEN configuration changes are made, THE System SHALL update environment variable documentation
4. WHEN the project structure changes, THE System SHALL update the directory structure documentation
5. WHEN issues are encountered, THE System SHALL document troubleshooting steps in the setup guide

### Requirement 10: Testing and Validation

**User Story:** As a quality assurance engineer, I want Phase 1 deliverables tested, so that we can proceed to Phase 2 with confidence.

#### Acceptance Criteria

1. WHEN the Console is tested, THE System SHALL load all simplified navigation pages without errors
2. WHEN the API is tested, THE System SHALL respond to health check and authentication endpoints
3. WHEN the database is tested, THE System SHALL perform CRUD operations successfully
4. WHEN the mobile app is tested, THE System SHALL build successfully for both iOS and Android
5. WHEN all services are tested together, THE System SHALL demonstrate end-to-end connectivity
