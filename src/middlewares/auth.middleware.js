'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const apiResponse = require('../utils/apiResponse');

/**
 * Middleware xác thực JWT Token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiResponse.unauthorized(res, 'Vui lòng đăng nhập để tiếp tục');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role', 'isActive']
    });

    if (!user) return apiResponse.unauthorized(res, 'Tài khoản không tồn tại');
    if (!user.isActive) return apiResponse.forbidden(res, 'Tài khoản đã bị vô hiệu hóa');

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return apiResponse.unauthorized(res, 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }
    return apiResponse.unauthorized(res, 'Token không hợp lệ');
  }
};

/**
 * Middleware phân quyền theo role
 * @param {...string} roles - Danh sách roles được phép
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return apiResponse.unauthorized(res);
    if (!roles.includes(req.user.role)) {
      return apiResponse.forbidden(res, `Chức năng này chỉ dành cho: ${roles.join(', ')}`);
    }
    next();
  };
};

/**
 * Middleware tùy chọn xác thực (không bắt buộc login)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'role', 'isActive']
      });
      if (user && user.isActive) req.user = user;
    }
  } catch (_) { /* bỏ qua lỗi */ }
  next();
};

module.exports = { authenticate, authorize, optionalAuth };
