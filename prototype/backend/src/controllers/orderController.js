const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generate order number
const generateOrderNumber = async (companyId) => {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { companyId }
  });
  return `ORD-${year}-${String(count + 1).padStart(4, '0')}`;
};

// Get all orders
exports.index = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      companyId: req.companyId,
      deletedAt: null
    };

    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        pickupLocation: true,
        deliveryLocation: true,
        driver: {
          select: { id: true, name: true, phone: true, status: true }
        },
        vehicle: {
          select: { id: true, plateNumber: true, make: true, model: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// Get single order
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      },
      include: {
        pickupLocation: true,
        deliveryLocation: true,
        driver: true,
        vehicle: true,
        proofOfDelivery: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

// Create order
exports.create = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { 
      pickupLocationId, 
      deliveryLocationId, 
      scheduledAt, 
      notes,
      metadata 
    } = req.body;

    if (!pickupLocationId || !deliveryLocationId) {
      return res.status(400).json({ 
        error: 'Pickup and delivery locations are required' 
      });
    }

    // Generate order number
    const orderNumber = await generateOrderNumber(req.companyId);

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        pickupLocationId: parseInt(pickupLocationId),
        deliveryLocationId: parseInt(deliveryLocationId),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        metadata,
        companyId: req.companyId,
        status: 'new'
      },
      include: {
        pickupLocation: true,
        deliveryLocation: true
      }
    });

    // Emit socket event for real-time update
    if (io) {
      io.emit('order:created', order);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Update order
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.get('io');
    const { 
      pickupLocationId, 
      deliveryLocationId,
      driverId,
      vehicleId,
      scheduledAt, 
      notes,
      metadata,
      status,
      customerName,
      customerPhone
    } = req.body;

    const existing = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData = {};
    if (pickupLocationId !== undefined) updateData.pickupLocationId = pickupLocationId ? parseInt(pickupLocationId) : null;
    if (deliveryLocationId !== undefined) updateData.deliveryLocationId = deliveryLocationId ? parseInt(deliveryLocationId) : null;
    if (driverId !== undefined) updateData.driverId = driverId ? parseInt(driverId) : null;
    if (vehicleId !== undefined) updateData.vehicleId = vehicleId ? parseInt(vehicleId) : null;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (notes !== undefined) updateData.notes = notes;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (status) {
      updateData.status = status;
      
      // Update timestamps based on status
      if (status === 'in_progress' && !existing.startedAt) {
        updateData.startedAt = new Date();
      }
      if (status === 'completed' && !existing.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    // Update driver status if assigning/unassigning
    if (driverId !== undefined) {
      // If assigning a driver
      if (driverId && driverId !== existing.driverId) {
        await prisma.driver.update({
          where: { id: parseInt(driverId) },
          data: { status: 'on_trip' }
        });
      }
      // If unassigning previous driver
      if (existing.driverId && driverId !== existing.driverId) {
        await prisma.driver.update({
          where: { id: existing.driverId },
          data: { status: 'available' }
        });
      }
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        pickupLocation: true,
        deliveryLocation: true,
        driver: true,
        vehicle: true
      }
    });

    // Emit socket event for real-time update
    if (io) {
      io.emit('order:updated', order);
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete order (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Assign order to driver
exports.assign = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, vehicleId } = req.body;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        driverId: parseInt(driverId),
        vehicleId: vehicleId ? parseInt(vehicleId) : null,
        status: 'assigned'
      },
      include: {
        driver: true,
        vehicle: true,
        pickupLocation: true,
        deliveryLocation: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Assign order error:', error);
    res.status(500).json({ error: 'Failed to assign order' });
  }
};

// Start order
exports.start = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'in_progress',
        startedAt: new Date()
      },
      include: {
        driver: true,
        vehicle: true,
        pickupLocation: true,
        deliveryLocation: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Start order error:', error);
    res.status(500).json({ error: 'Failed to start order' });
  }
};

// Complete order
exports.complete = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        completedAt: new Date()
      },
      include: {
        driver: true,
        vehicle: true,
        pickupLocation: true,
        deliveryLocation: true,
        proofOfDelivery: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};
