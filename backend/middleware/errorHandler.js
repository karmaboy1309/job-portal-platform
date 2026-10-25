/**
 * Centralized error handling middlewares for Express.
 */

// 404 Not Found middleware for unmatched routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.originalUrl} - endpoint not found`
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
