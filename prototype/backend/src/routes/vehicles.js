const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', vehicleController.index);
router.get('/:id', vehicleController.show);
router.post('/', vehicleController.create);
router.patch('/:id', vehicleController.update);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

module.exports = router;
