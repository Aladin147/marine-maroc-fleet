const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId, companyId) => {
  return jwt.sign(
    { userId, companyId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, companyId, role } = req.body;

    // Validate input
    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ 
        error: 'Name, email, password, and companyId are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        companyId: parseInt(companyId),
        email 
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId: parseInt(companyId),
        role: role || 'dispatcher'
      },
      include: {
        company: true
      }
    });

    // Generate token
    const token = generateToken(user.id, user.companyId);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { email },
      include: { company: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.companyId);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Driver login (for mobile app)
exports.driverLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    // Find driver
    const driver = await prisma.driver.findFirst({
      where: { phone },
      include: { company: true }
    });

    if (!driver || !driver.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, driver.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { driverId: driver.id, companyId: driver.companyId, type: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Longer expiry for mobile
    );

    // Return driver without password
    const { password: _, ...driverWithoutPassword } = driver;

    res.json({
      driver: driverWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
