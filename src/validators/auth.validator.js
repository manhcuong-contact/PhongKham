'use strict';

const { body } = require('express-validator');

const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
  body('fullName').trim().isLength({ min: 2, max: 150 }).withMessage('Họ tên từ 2–150 ký tự'),
  body('phone').optional().matches(/^[0-9+\-\s]{9,15}$/).withMessage('Số điện thoại không hợp lệ'),
  body('dateOfBirth').optional().isDate().withMessage('Ngày sinh không hợp lệ'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ')
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới ít nhất 6 ký tự'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.newPassword) throw new Error('Xác nhận mật khẩu không khớp');
    return true;
  })
];

module.exports = { registerRules, loginRules, changePasswordRules };
