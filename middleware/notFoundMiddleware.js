const AppError = require('../utils/AppError');

/**
 * Catches any request that doesn't match a defined route and
 * forwards a 404 AppError to the global error handler.
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = notFound;
