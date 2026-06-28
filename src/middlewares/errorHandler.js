'use strict';

const logger = require('../utils/logger');

/**
 * Middleware xử lý 404 - Route không tồn tại
 */
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy route: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Middleware xử lý lỗi toàn cục (Global Error Handler)
 * Phải có đúng 4 tham số (err, req, res, next) để Express nhận diện
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Đã có lỗi xảy ra';

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    message = 'Dữ liệu không hợp lệ';
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(statusCode).json({ success: false, message, errors });
  }

  // Sequelize Unique Constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Dữ liệu đã tồn tại trong hệ thống';
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(statusCode).json({ success: false, message, errors });
  }

  // Sequelize Foreign Key Constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Dữ liệu tham chiếu không hợp lệ';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn, vui lòng đăng nhập lại';
  }

  // Log lỗi nghiêm trọng
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${err.stack || message}`);
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { notFound, errorHandler };
