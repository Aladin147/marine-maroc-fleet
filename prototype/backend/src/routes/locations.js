const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', locationController.index);
router.get('/:id', locationController.show);
router.post('/', locationController.create);
router.patch('/:id', locationController.update);
router.put('/:id', locationController.update);
router.delete('/:id', locationController.delete);

module.exports = router;
