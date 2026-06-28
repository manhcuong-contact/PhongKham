'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/doctor.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const upload = require('../config/multer');

// Public
router.get('/', ctrl.getAll);                                     // ?specialtyId=1&clinicId=2&search=...
router.get('/specialty/:specialtyId', ctrl.getBySpecialty);       // Chọn bác sĩ theo chuyên khoa
router.get('/:id', ctrl.getById);
router.get('/:id/slots', ctrl.getAvailableSlots);                 // ?date=2025-01-15

// Admin only
router.post('/', authenticate, authorize('admin'), upload.single('avatar'), ctrl.create);
router.put('/:id', authenticate, authorize('admin', 'doctor'), upload.single('avatar'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
