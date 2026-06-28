'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const upload = require('../config/multer');

// Patient - tự quản lý hồ sơ
router.get('/me', authenticate, ctrl.getMyProfile);
router.put('/me', authenticate, upload.single('avatar'), ctrl.updateMyProfile);
router.get('/me/appointments', authenticate, ctrl.getMyAppointments);

// Admin - quản lý bệnh nhân
router.get('/', authenticate, authorize('admin', 'doctor'), ctrl.getAll);
router.get('/:id', authenticate, authorize('admin', 'doctor'), ctrl.getById);

module.exports = router;
