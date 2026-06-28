'use strict';

const svc = require('../services/admin.service');
const apiResponse = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getDashboardStats(), 'Lấy thống kê thành công'); } catch (e) { next(e); }
};

const getAppointmentsByMonth = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    return apiResponse.success(res, await svc.getAppointmentsByMonth(year, month));
  } catch (e) { next(e); }
};

const getTopDoctors = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getTopDoctors(parseInt(req.query.limit) || 5)); } catch (e) { next(e); }
};

const getRecentAppointments = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getRecentAppointments(parseInt(req.query.limit) || 10)); } catch (e) { next(e); }
};

const getStatsBySpecialty = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getStatsBySpecialty()); } catch (e) { next(e); }
};

module.exports = { getDashboard, getAppointmentsByMonth, getTopDoctors, getRecentAppointments, getStatsBySpecialty };
