/**
 * Wraps an async route handler and forwards any thrown/rejected error
 * to Express's error-handling middleware via next(err).
 * This removes the need for try/catch blocks in every controller.
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
