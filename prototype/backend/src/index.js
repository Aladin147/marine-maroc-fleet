require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api/', apiLimiter);

// Routes
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const vehicleRoutes = require('./routes/vehicles');
const orderRoutes = require('./routes/orders');
const locationRoutes = require('./routes/locations');
const trackingRoutes = require('./routes/tracking');
const messageRoutes = require('./routes/messages');
const podRoutes = require('./routes/pod');

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/pod', podRoutes);

// Socket.IO connection handling
const logger = require('./utils/logger');

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`🔌 WebSocket ready`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  io.close();
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { io };
