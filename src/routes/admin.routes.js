'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Tất cả routes admin đều cần xác thực + role admin
router.use(authenticate, authorize('admin'));

router.get('/dashboard', ctrl.getDashboard);                       // Tổng quan thống kê
router.get('/appointments/monthly', ctrl.getAppointmentsByMonth); // Biểu đồ theo tháng ?year=2025&month=6
router.get('/appointments/recent', ctrl.getRecentAppointments);   // 10 lịch mới nhất
router.get('/doctors/top', ctrl.getTopDoctors);                   // Top bác sĩ
router.get('/specialties/stats', ctrl.getStatsBySpecialty);       // Thống kê chuyên khoa

module.exports = router;
