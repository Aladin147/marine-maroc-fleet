const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all vehicles
exports.index = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        companyId: req.companyId,
        deletedAt: null
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            status: true
          }
        }
      },
      orderBy: {
        plateNumber: 'asc'
      }
    });

    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to get vehicles' });
  }
};

// Get single vehicle
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      },
      include: {
        driver: true,
        orders: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Failed to get vehicle' });
  }
};

// Create vehicle
exports.create = async (req, res) => {
  try {
    const { plateNumber, make, model, year, driverId } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ error: 'Plate number is required' });
    }

    // Check if plate number already exists
    const existing = await prisma.vehicle.findFirst({
      where: {
        companyId: req.companyId,
        plateNumber,
        deletedAt: null
      }
    });

    if (existing) {
      return res.status(400).json({ 
        error: 'Vehicle with this plate number already exists' 
      });
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        make,
        model,
        year: year ? parseInt(year) : null,
        driverId: driverId ? parseInt(driverId) : null,
        companyId: req.companyId
      },
      include: {
        driver: true
      }
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('vehicle:created', vehicle);
    }

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
};

// Update vehicle
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, make, model, year, driverId } = req.body;

    // Check if vehicle exists
    const existing = await prisma.vehicle.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // If assigning a new driver, unassign them from other vehicles first
    if (driverId !== undefined && driverId) {
      await prisma.vehicle.updateMany({
        where: {
          driverId: parseInt(driverId),
          companyId: req.companyId,
          NOT: { id: parseInt(id) }
        },
        data: {
          driverId: null
        }
      });
    }

    // Prepare update data
    const updateData = {};
    if (plateNumber) updateData.plateNumber = plateNumber;
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = year ? parseInt(year) : null;
    if (driverId !== undefined) updateData.driverId = driverId ? parseInt(driverId) : null;

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        driver: true
      }
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('vehicle:updated', vehicle);
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

// Delete vehicle (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.vehicle.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};
