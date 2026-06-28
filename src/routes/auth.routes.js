'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { registerRules, loginRules, changePasswordRules } = require('../validators/auth.validator');

// POST /api/v1/auth/register
router.post('/register', registerRules, validate, ctrl.register);

// POST /api/v1/auth/login
router.post('/login', loginRules, validate, ctrl.login);

// POST /api/v1/auth/refresh
router.post('/refresh', ctrl.refreshToken);

// POST /api/v1/auth/logout  [cần đăng nhập]
router.post('/logout', authenticate, ctrl.logout);

// GET  /api/v1/auth/me      [cần đăng nhập]
router.get('/me', authenticate, ctrl.getMe);

// PUT  /api/v1/auth/change-password
router.put('/change-password', authenticate, changePasswordRules, validate, ctrl.changePassword);

module.exports = router;
