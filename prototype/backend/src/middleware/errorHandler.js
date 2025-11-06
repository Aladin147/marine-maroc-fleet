const logger = require('../utils/logger')

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  })

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== 'production'

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack })
  })
}

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn(`404 - ${req.method} ${req.url}`)
  res.status(404).json({ error: 'Route not found' })
}

module.exports = {
  errorHandler,
  notFoundHandler
}
