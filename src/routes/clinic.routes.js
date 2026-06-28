'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clinic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const upload = require('../config/multer');

// Public
router.get('/', ctrl.getAll);
router.get('/nearby', ctrl.getNearby);   // ?lat=21.02&lng=105.85&radius=10&specialtyId=1
router.get('/:id', ctrl.getById);

// Admin only
router.post('/', authenticate, authorize('admin'), upload.single('image'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
