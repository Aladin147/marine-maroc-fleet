# Phase 3: Frontend & Mobile - Requirements Document

## Introduction

Phase 3 focuses on frontend console UI simplification, mobile app branding, complete French translations, and comprehensive end-to-end testing. This phase ensures the user-facing applications are polished, branded, and fully functional.

## Glossary

- **System**: The Marine Maroc Fleet Management System
- **Console**: The web-based admin dashboard (Ember.js application)
- **Navigator App**: The driver mobile application (React Native)
- **UI**: User Interface - the visual elements users interact with
- **UX**: User Experience - how users interact with and perceive the system
- **POD**: Proof of Delivery - photos and signatures captured upon delivery
- **GPS**: Global Positioning System - location tracking technology

## Requirements

### Requirement 1: Console Dashboard Simplification

**User Story:** As a dispatcher, I want a simplified dashboard, so that I can quickly see the most important information.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE System SHALL display active orders count, available drivers count, and vehicles in use count
2. WHEN viewing the dashboard, THE System SHALL show a map with active deliveries
3. WHEN the dashboard is displayed, THE System SHALL not show complex analytics or charts
4. WHEN the dashboard loads, THE System SHALL complete rendering within 2 seconds
5. WHEN the dashboard is refreshed, THE System SHALL update data without full page reload

### Requirement 2: Order Management Interface

**User Story:** As a dispatcher, I want a simple order management interface, so that I can create and manage loads efficiently.

#### Acceptance Criteria

1. WHEN viewing orders, THE System SHALL display them in a Kanban board with 4 columns (Nouveau, Assigné, En Route, Livré)
2. WHEN creating an order, THE System SHALL require only essential fields (pickup, delivery, customer, items)
3. WHEN assigning an order, THE System SHALL show available drivers with their current status
4. WHEN dragging an order, THE System SHALL allow moving between workflow stages
5. WHEN viewing order details, THE System SHALL show all information on a single page without tabs

### Requirement 3: Driver Management Interface

**User Story:** As a dispatcher, I want a simple driver management interface, so that I can manage driver information easily.

#### Acceptance Criteria

1. WHEN viewing drivers, THE System SHALL display them in a table with name, phone, status, and current location
2. WHEN adding a driver, THE System SHALL require only essential fields (name, phone, license number)
3. WHEN viewing a driver, THE System SHALL show their current location on a map
4. WHEN searching drivers, THE System SHALL filter results as the user types
5. WHEN a driver's status changes, THE System SHALL update the display in real-time

### Requirement 4: Vehicle Management Interface

**User Story:** As a dispatcher, I want a simple vehicle management interface, so that I can track fleet information.

#### Acceptance Criteria

1. WHEN viewing vehicles, THE System SHALL display them in a table with plate number, make, model, and assigned driver
2. WHEN adding a vehicle, THE System SHALL require only essential fields (plate number, make, model)
3. WHEN viewing a vehicle, THE System SHALL show its current location if a driver is assigned
4. WHEN searching vehicles, THE System SHALL filter results as the user types
5. WHEN a vehicle is assigned to a driver, THE System SHALL update the display immediately

### Requirement 5: Live Tracking Map

**User Story:** As a dispatcher, I want a live tracking map, so that I can see all vehicles in real-time.

#### Acceptance Criteria

1. WHEN the map loads, THE System SHALL display all active vehicles with their current locations
2. WHEN a vehicle moves, THE System SHALL update its position on the map within 30 seconds
3. WHEN clicking a vehicle marker, THE System SHALL show driver name, vehicle info, and current order
4. WHEN viewing the map, THE System SHALL show pickup and delivery locations for active orders
5. WHEN the map is zoomed, THE System SHALL cluster nearby markers for better visibility

### Requirement 6: Console Theme Customization

**User Story:** As a product owner, I want Marine Maroc colors applied throughout the console, so that it matches the brand identity.

#### Acceptance Criteria

1. WHEN the console loads, THE System SHALL use Marine Blue (#0047AB) as the primary color
2. WHEN buttons are displayed, THE System SHALL use Marine Maroc brand colors
3. WHEN status badges are shown, THE System SHALL use appropriate colors (green for completed, orange for in-progress)
4. WHEN the header is displayed, THE System SHALL use Marine Blue background
5. WHEN links are shown, THE System SHALL use Marine Maroc accent color (#00CED1)

### Requirement 7: Mobile App Branding

**User Story:** As a driver, I want the app to show Marine Maroc branding, so that I know I'm using the official company app.

#### Acceptance Criteria

1. WHEN the app launches, THE System SHALL display Marine Maroc splash screen
2. WHEN viewing the app icon, THE System SHALL show Marine Maroc logo
3. WHEN the app is running, THE System SHALL display Marine Maroc logo in the header
4. WHEN viewing the app name, THE System SHALL show "Marine Maroc Fleet"
5. WHEN the app uses colors, THE System SHALL use Marine Maroc brand colors

### Requirement 8: Mobile App Configuration

**User Story:** As a system administrator, I want the mobile app configured to connect to the API, so that drivers can use it.

#### Acceptance Criteria

1. WHEN the app starts, THE System SHALL connect to the configured API endpoint
2. WHEN the API endpoint is invalid, THE System SHALL display a clear error message
3. WHEN the app is configured, THE System SHALL use the correct bundle identifier (ma.marinemaroc.fleet)
4. WHEN viewing app settings, THE System SHALL show the API endpoint URL
5. WHEN the configuration is updated, THE System SHALL apply changes after app restart

### Requirement 9: Mobile App Screen Simplification

**User Story:** As a driver, I want a simple app with only essential screens, so that I can focus on my deliveries.

#### Acceptance Criteria

1. WHEN the app loads, THE System SHALL show only 4 main screens: Dashboard, Orders, Delivery, and Chat
2. WHEN viewing the dashboard, THE System SHALL show assigned orders and current status
3. WHEN viewing orders, THE System SHALL list all assigned orders with pickup and delivery info
4. WHEN completing a delivery, THE System SHALL show photo capture, signature, and notes
5. WHEN the app is navigated, THE System SHALL not show fuel reports, issues, or fleet overview screens

### Requirement 10: Order Management in Mobile App

**User Story:** As a driver, I want to manage my assigned orders, so that I can complete deliveries efficiently.

#### Acceptance Criteria

1. WHEN viewing orders, THE System SHALL display all orders assigned to the logged-in driver
2. WHEN starting a trip, THE System SHALL change order status to "En Route" and start GPS tracking
3. WHEN arriving at delivery, THE System SHALL prompt for proof of delivery
4. WHEN completing delivery, THE System SHALL change order status to "Livré"
5. WHEN viewing order details, THE System SHALL show pickup address, delivery address, customer info, and items

### Requirement 11: GPS Tracking in Mobile App

**User Story:** As a driver, I want GPS tracking to work in the background, so that dispatch can see my location without keeping the app open.

#### Acceptance Criteria

1. WHEN a trip is started, THE System SHALL begin background GPS tracking
2. WHEN the app is in background, THE System SHALL continue tracking location
3. WHEN the device is offline, THE System SHALL store locations locally and sync when online
4. WHEN battery optimization is enabled, THE System SHALL request permission to run in background
5. WHEN tracking is active, THE System SHALL send location updates every 30 seconds

### Requirement 12: Proof of Delivery Capture

**User Story:** As a driver, I want to capture proof of delivery, so that I can confirm successful deliveries.

#### Acceptance Criteria

1. WHEN completing a delivery, THE System SHALL allow capturing multiple photos
2. WHEN capturing photos, THE System SHALL use the device camera
3. WHEN capturing signature, THE System SHALL provide a signature pad
4. WHEN adding notes, THE System SHALL provide a text input field
5. WHEN submitting POD, THE System SHALL upload photos, signature, and notes to the server

### Requirement 13: Chat Functionality

**User Story:** As a driver, I want to chat with dispatch, so that I can communicate about deliveries.

#### Acceptance Criteria

1. WHEN opening chat, THE System SHALL display conversation with dispatch
2. WHEN sending a message, THE System SHALL deliver it to dispatch in real-time
3. WHEN receiving a message, THE System SHALL show a notification
4. WHEN viewing chat, THE System SHALL show message history
5. WHEN the device is offline, THE System SHALL queue messages and send when online

### Requirement 14: Push Notifications

**User Story:** As a driver, I want to receive notifications for new orders, so that I know when I have work assigned.

#### Acceptance Criteria

1. WHEN an order is assigned, THE System SHALL send a push notification to the driver's device
2. WHEN a notification is received, THE System SHALL display it even if the app is closed
3. WHEN tapping a notification, THE System SHALL open the app to the relevant order
4. WHEN notifications are disabled, THE System SHALL prompt the user to enable them
5. WHEN the app is in foreground, THE System SHALL show in-app notification instead of push

### Requirement 15: French Translations in Console

**User Story:** As a dispatcher, I want all console text in French, so that I can use the system comfortably.

#### Acceptance Criteria

1. WHEN viewing any console page, THE System SHALL display all text in French
2. WHEN viewing form labels, THE System SHALL show French field names
3. WHEN viewing buttons, THE System SHALL show French button text
4. WHEN viewing error messages, THE System SHALL display French error text
5. WHEN viewing tooltips, THE System SHALL show French tooltip text

### Requirement 16: French Translations in Mobile App

**User Story:** As a driver, I want the mobile app in French, so that I can understand all instructions.

#### Acceptance Criteria

1. WHEN the app loads, THE System SHALL display all text in French
2. WHEN viewing screen titles, THE System SHALL show French titles
3. WHEN viewing buttons, THE System SHALL show French button text
4. WHEN viewing error messages, THE System SHALL display French error text
5. WHEN viewing notifications, THE System SHALL show French notification text

### Requirement 17: Offline Functionality

**User Story:** As a driver, I want the app to work offline, so that I can continue working without internet connection.

#### Acceptance Criteria

1. WHEN the device is offline, THE System SHALL allow viewing assigned orders
2. WHEN offline, THE System SHALL allow capturing proof of delivery
3. WHEN offline, THE System SHALL store GPS locations locally
4. WHEN connection is restored, THE System SHALL sync all offline data automatically
5. WHEN syncing, THE System SHALL show sync progress to the user

### Requirement 18: Mobile App Performance

**User Story:** As a driver, I want the app to be fast and responsive, so that I can work efficiently.

#### Acceptance Criteria

1. WHEN the app launches, THE System SHALL display the main screen within 3 seconds
2. WHEN navigating between screens, THE System SHALL transition within 500 milliseconds
3. WHEN loading orders, THE System SHALL display them within 2 seconds
4. WHEN capturing photos, THE System SHALL save them within 1 second
5. WHEN the app is running, THE System SHALL use less than 15% battery per 8-hour shift

### Requirement 19: End-to-End Testing

**User Story:** As a quality assurance engineer, I want comprehensive end-to-end tests, so that I can verify all features work together.

#### Acceptance Criteria

1. WHEN testing order creation, THE System SHALL allow creating an order in the console and viewing it in the mobile app
2. WHEN testing order assignment, THE System SHALL assign an order to a driver and send a notification
3. WHEN testing trip tracking, THE System SHALL show driver location updates in real-time on the console map
4. WHEN testing delivery completion, THE System SHALL capture POD in mobile app and display it in console
5. WHEN testing chat, THE System SHALL allow bidirectional communication between console and mobile app

### Requirement 20: Cross-Browser Compatibility

**User Story:** As a dispatcher, I want the console to work in different browsers, so that I can use my preferred browser.

#### Acceptance Criteria

1. WHEN using Chrome, THE System SHALL display and function correctly
2. WHEN using Firefox, THE System SHALL display and function correctly
3. WHEN using Safari, THE System SHALL display and function correctly
4. WHEN using Edge, THE System SHALL display and function correctly
5. WHEN using an unsupported browser, THE System SHALL display a warning message

### Requirement 21: Responsive Design

**User Story:** As a dispatcher, I want the console to work on different screen sizes, so that I can use it on various devices.

#### Acceptance Criteria

1. WHEN viewing on desktop (1920x1080), THE System SHALL display all features optimally
2. WHEN viewing on laptop (1366x768), THE System SHALL display all features without horizontal scrolling
3. WHEN viewing on tablet (768x1024), THE System SHALL adapt layout for touch interaction
4. WHEN viewing on mobile (375x667), THE System SHALL show a simplified mobile-friendly layout
5. WHEN resizing the browser, THE System SHALL adjust layout responsively

### Requirement 22: Accessibility

**User Story:** As a user with accessibility needs, I want the system to be accessible, so that I can use it effectively.

#### Acceptance Criteria

1. WHEN using keyboard navigation, THE System SHALL allow accessing all features without a mouse
2. WHEN using screen readers, THE System SHALL provide appropriate ARIA labels
3. WHEN viewing with high contrast, THE System SHALL maintain readability
4. WHEN zooming to 200%, THE System SHALL remain functional and readable
5. WHEN using tab navigation, THE System SHALL follow a logical tab order

### Requirement 23: Error Handling in UI

**User Story:** As a user, I want clear error messages, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN a form validation fails, THE System SHALL highlight the invalid fields and show specific error messages
2. WHEN an API request fails, THE System SHALL display a user-friendly error message
3. WHEN the network is unavailable, THE System SHALL show an offline indicator
4. WHEN an unexpected error occurs, THE System SHALL display a generic error message and log details
5. WHEN an error is displayed, THE System SHALL provide actionable next steps when possible

### Requirement 24: Loading States

**User Story:** As a user, I want to see loading indicators, so that I know the system is processing my request.

#### Acceptance Criteria

1. WHEN data is loading, THE System SHALL display a loading spinner or progress indicator
2. WHEN a form is submitting, THE System SHALL disable the submit button and show loading state
3. WHEN the map is loading, THE System SHALL show a loading overlay
4. WHEN images are loading, THE System SHALL show placeholder images
5. WHEN loading takes longer than 3 seconds, THE System SHALL show a progress message

### Requirement 25: Testing and Validation

**User Story:** As a quality assurance engineer, I want Phase 3 deliverables tested, so that we can proceed to Phase 4 with confidence.

#### Acceptance Criteria

1. WHEN the console is tested, THE System SHALL pass all UI functionality tests
2. WHEN the mobile app is tested, THE System SHALL pass all feature tests on iOS and Android
3. WHEN translations are tested, THE System SHALL display all text in French
4. WHEN end-to-end tests are run, THE System SHALL complete all user workflows successfully
5. WHEN performance is tested, THE System SHALL meet all performance targets
