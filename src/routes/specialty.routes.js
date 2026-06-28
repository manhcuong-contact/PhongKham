'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/specialty.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Admin only
router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
