/**
 * Sends a consistent success response shape across all endpoints:
 * { success, message, data, meta }
 */
const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
