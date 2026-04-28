const { logger } = require("../config/logger");

const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(error.message, error.stack);
  }

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
};

module.exports = { notFound, errorHandler };
