const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all locations
exports.index = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      where: {
        companyId: req.companyId,
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to get locations' });
  }
};

// Get single location
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await prisma.location.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
};

// Create location
exports.create = async (req, res) => {
  try {
    const { name, address, latitude, longitude, type } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        type,
        companyId: req.companyId
      }
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

// Update location
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, type } = req.body;

    const existing = await prisma.location.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null;
    if (type !== undefined) updateData.type = type;

    const location = await prisma.location.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(location);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// Delete location (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.location.findFirst({
      where: {
        id: parseInt(id),
        companyId: req.companyId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Location not found' });
    }

    await prisma.location.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
