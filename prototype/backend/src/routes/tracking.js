const express = require('express')
const router = express.Router()
const trackingController = require('../controllers/trackingController')
const authMiddleware = require('../middleware/auth')

// All routes require authentication
router.use(authMiddleware)

// Get latest positions for all vehicles
router.get('/vehicles/positions', trackingController.getVehiclePositions)

// Get tracking history for a specific vehicle
router.get('/vehicles/:id/history', trackingController.getVehicleHistory)

// Add tracking point (for mobile app)
router.post('/points', trackingController.addTrackingPoint)

// Get tracking for active orders
router.get('/orders/active', trackingController.getActiveOrdersTracking)

module.exports = router
