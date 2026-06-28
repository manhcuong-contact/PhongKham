'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

const bookRules = [
  body('doctorId').isInt({ min: 1 }).withMessage('doctorId không hợp lệ'),
  body('clinicId').isInt({ min: 1 }).withMessage('clinicId không hợp lệ'),
  body('appointmentDate').isDate().withMessage('Ngày khám không hợp lệ (YYYY-MM-DD)'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Giờ khám không hợp lệ (HH:MM)')
];

// Patient: đặt lịch và xem lịch
router.post('/', authenticate, bookRules, validate, ctrl.create);
router.get('/my', authenticate, ctrl.getAll);       // Xem lịch của mình (cũng check qua patient service)

// Admin & Doctor: quản lý lịch hẹn
router.get('/', authenticate, authorize('admin', 'doctor'), ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.patch('/:id/status', authenticate, authorize('admin', 'doctor'), ctrl.updateStatus);
router.patch('/:id/cancel', authenticate, ctrl.cancel);

module.exports = router;
