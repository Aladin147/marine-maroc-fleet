const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get latest position for all vehicles
exports.getVehiclePositions = async (req, res) => {
  try {
    const companyId = req.user.companyId

    // Get all drivers with their vehicles and latest tracking point
    const drivers = await prisma.driver.findMany({
      where: { companyId },
      include: {
        vehicles: true,
        trackingPoints: {
          orderBy: { recordedAt: 'desc' },
          take: 1
        },
        orders: {
          where: {
            status: { in: ['assigned', 'in_progress'] }
          },
          take: 1,
          include: {
            pickupLocation: true,
            deliveryLocation: true
          }
        }
      }
    })

    // Format response with latest position
    const positions = drivers
      .filter(d => d.trackingPoints.length > 0 && d.vehicles.length > 0)
      .map(driver => ({
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        driverStatus: driver.status,
        vehicle: driver.vehicles[0] ? {
          id: driver.vehicles[0].id,
          plateNumber: driver.vehicles[0].plateNumber,
          make: driver.vehicles[0].make,
          model: driver.vehicles[0].model
        } : null,
        latitude: driver.trackingPoints[0].latitude,
        longitude: driver.trackingPoints[0].longitude,
        speed: driver.trackingPoints[0].speed,
        heading: driver.trackingPoints[0].heading,
        recordedAt: driver.trackingPoints[0].recordedAt,
        activeOrder: driver.orders[0] || null
      }))

    res.json(positions)
  } catch (error) {
    console.error('Error fetching vehicle positions:', error)
    res.status(500).json({ error: 'Failed to fetch vehicle positions' })
  }
}

// Get tracking history for a specific driver
exports.getVehicleHistory = async (req, res) => {
  try {
    const { id } = req.params
    const companyId = req.user.companyId
    const { hours = 24 } = req.query

    // Verify driver belongs to company
    const driver = await prisma.driver.findFirst({
      where: { id: parseInt(id), companyId }
    })

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' })
    }

    // Get tracking points from last X hours
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const trackingPoints = await prisma.trackingPoint.findMany({
      where: {
        driverId: parseInt(id),
        recordedAt: { gte: since }
      },
      orderBy: { recordedAt: 'asc' }
    })

    res.json(trackingPoints)
  } catch (error) {
    console.error('Error fetching vehicle history:', error)
    res.status(500).json({ error: 'Failed to fetch vehicle history' })
  }
}

// Add tracking point (for mobile app)
exports.addTrackingPoint = async (req, res) => {
  try {
    const { latitude, longitude, speed, heading, accuracy } = req.body
    const driverId = req.user.id // Driver from JWT token

    const trackingPoint = await prisma.trackingPoint.create({
      data: {
        driverId,
        latitude,
        longitude,
        speed: speed || null,
        heading: heading || null,
        accuracy: accuracy || null,
        recordedAt: new Date()
      }
    })

    res.status(201).json(trackingPoint)
  } catch (error) {
    console.error('Error adding tracking point:', error)
    res.status(500).json({ error: 'Failed to add tracking point' })
  }
}

// Get tracking for active orders
exports.getActiveOrdersTracking = async (req, res) => {
  try {
    const companyId = req.user.companyId

    const activeOrders = await prisma.order.findMany({
      where: {
        companyId,
        status: { in: ['assigned', 'in_progress'] }
      },
      include: {
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            phone: true
          },
          include: {
            trackingPoints: {
              orderBy: { recordedAt: 'desc' },
              take: 1
            }
          }
        },
        pickupLocation: true,
        deliveryLocation: true
      }
    })

    const tracking = activeOrders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      driver: order.driver,
      vehicle: order.vehicle ? {
        id: order.vehicle.id,
        plateNumber: order.vehicle.plateNumber,
        currentPosition: order.vehicle.trackingPoints[0] || null
      } : null,
      pickup: order.pickupLocation,
      delivery: order.deliveryLocation
    }))

    res.json(tracking)
  } catch (error) {
    console.error('Error fetching active orders tracking:', error)
    res.status(500).json({ error: 'Failed to fetch tracking' })
  }
}
