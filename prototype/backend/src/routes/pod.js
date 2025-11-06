const express = require('express')
const router = express.Router()
const podController = require('../controllers/podController')
const authMiddleware = require('../middleware/auth')

// All routes require authentication
router.use(authMiddleware)

// Get POD for an order
router.get('/orders/:orderId', podController.getOrderPOD)

// Create or update POD
router.post('/orders/:orderId', podController.savePOD)

module.exports = router
