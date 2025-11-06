const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', orderController.index);
router.get('/:id', orderController.show);
router.post('/', orderController.create);
router.patch('/:id', orderController.update);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

// Additional routes
router.post('/:id/assign', orderController.assign);
router.post('/:id/start', orderController.start);
router.post('/:id/complete', orderController.complete);

module.exports = router;
