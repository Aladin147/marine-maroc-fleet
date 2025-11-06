const { z } = require('zod')

// Driver validation
const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  status: z.enum(['available', 'on_trip', 'offline', 'busy']).optional()
})

// Vehicle validation
const vehicleSchema = z.object({
  plateNumber: z.string().min(2, 'Plate number required').max(20),
  make: z.string().max(50).optional().or(z.literal('')),
  model: z.string().max(50).optional().or(z.literal('')),
  year: z.number().int().min(1990).max(2030).optional().nullable(),
  driverId: z.number().int().positive().optional().nullable()
})

// Order validation
const orderSchema = z.object({
  orderNumber: z.string().min(3, 'Order number required').max(50).optional(),
  pickupLocationId: z.number().int().positive('Pickup location required').optional().nullable(),
  deliveryLocationId: z.number().int().positive('Delivery location required').optional().nullable(),
  driverId: z.number().int().positive().optional().nullable(),
  vehicleId: z.number().int().positive().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable().or(z.literal('')),
  customerName: z.string().max(100).optional().or(z.literal('')),
  customerPhone: z.string().max(20).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['new', 'assigned', 'in_progress', 'completed', 'cancelled']).optional()
})

// Location validation
const locationSchema = z.object({
  name: z.string().min(2, 'Name required').max(100),
  address: z.string().max(200).optional().or(z.literal('')),
  type: z.enum(['warehouse', 'port', 'distribution_center', 'customer']).optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable()
})

// Message validation
const messageSchema = z.object({
  content: z.string().min(1, 'Message content required').max(1000),
  type: z.enum(['text', 'voice']).optional()
})

// POD validation
const podSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name required').max(100),
  recipientSignature: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal(''))
})

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }
      next(error)
    }
  }
}

module.exports = {
  driverSchema,
  vehicleSchema,
  orderSchema,
  locationSchema,
  messageSchema,
  podSchema,
  validate
}
