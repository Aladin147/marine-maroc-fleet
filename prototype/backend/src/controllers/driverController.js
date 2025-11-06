const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { getPagination, formatPaginatedResponse } = require('../utils/pagination');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get all drivers (filtered by company)
exports.index = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      where: {
        companyId: req.companyId,
        deletedAt: null
      },
      include: {
        vehicles: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ error: 'Failed to get drivers' });
  }
};

// Get single driver
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      },
      include: {
        vehicles: true,
        orders: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ error: 'Failed to get driver' });
  }
};

// Create driver
exports.create = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ 
        error: 'Name and phone are required' 
      });
    }

    // Check if phone already exists in this company
    const existing = await prisma.driver.findFirst({
      where: {
        companyId: req.companyId,
        phone,
        deletedAt: null
      }
    });

    if (existing) {
      return res.status(400).json({ 
        error: 'Driver with this phone already exists' 
      });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create driver
    const driver = await prisma.driver.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        companyId: req.companyId,
        status: 'offline'
      },
      include: {
        vehicles: true
      }
    });

    // Remove password from response
    const { password: _, ...driverWithoutPassword } = driver;

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('driver:created', driverWithoutPassword);
    }

    res.status(201).json(driverWithoutPassword);
  } catch (error) {
    logger.error('Create driver error:', error);
    res.status(500).json({ error: 'Failed to create driver' });
  }
};

// Update driver
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, password, status } = req.body;

    // Check if driver exists and belongs to company
    const existing = await prisma.driver.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (status) updateData.status = status;
    
    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update driver
    const driver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        vehicles: true
      }
    });

    // Remove password from response
    const { password: _, ...driverWithoutPassword } = driver;

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('driver:updated', driverWithoutPassword);
    }

    res.json(driverWithoutPassword);
  } catch (error) {
    logger.error('Update driver error:', error);
    res.status(500).json({ error: 'Failed to update driver' });
  }
};

// Delete driver (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if driver exists and belongs to company
    const existing = await prisma.driver.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Soft delete
    await prisma.driver.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};

// Get driver's current location
exports.location = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        currentLocation: true,
        status: true
      }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver location error:', error);
    res.status(500).json({ error: 'Failed to get driver location' });
  }
};


// Get available drivers (not on trip)
exports.available = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      where: {
        companyId: req.companyId,
        deletedAt: null,
        status: { in: ['available', 'offline'] }
      },
      include: {
        vehicles: {
          select: {
            id: true,
            plateNumber: true,
            make: true,
            model: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(drivers);
  } catch (error) {
    logger.error('Get available drivers error:', error);
    res.status(500).json({ error: 'Failed to get available drivers' });
  }
};
