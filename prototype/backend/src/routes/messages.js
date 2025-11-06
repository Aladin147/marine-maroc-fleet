const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')
const authMiddleware = require('../middleware/auth')

// All routes require authentication
router.use(authMiddleware)

// Get messages for an order
router.get('/orders/:orderId', messageController.getOrderMessages)

// Send a message
router.post('/orders/:orderId', messageController.sendMessage)

// Mark message as read
router.put('/:id/read', messageController.markAsRead)

module.exports = router
