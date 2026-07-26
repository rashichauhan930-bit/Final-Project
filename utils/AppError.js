/**
 * Custom Error class used across the app for predictable, operational errors
 * (e.g. validation failures, not-found resources, auth failures).
 * Distinguishing `isOperational` errors from programming bugs lets the
 * global error handler decide how much detail is safe to expose.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
