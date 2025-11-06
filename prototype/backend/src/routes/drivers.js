const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/auth');
const { driverSchema, validate } = require('../validation/schemas');

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', driverController.index);
router.get('/available', driverController.available); // Must come before /:id
router.get('/:id', driverController.show);
router.get('/:id/location', driverController.location);
router.post('/', validate(driverSchema), driverController.create);
router.patch('/:id', validate(driverSchema.partial()), driverController.update);
router.put('/:id', validate(driverSchema.partial()), driverController.update);
router.delete('/:id', driverController.delete);

module.exports = router;
