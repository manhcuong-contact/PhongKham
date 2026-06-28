'use strict';

const svc = require('../services/patient.service');
const apiResponse = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const { total, page, limit, rows } = await svc.getAll(req.query);
    return apiResponse.paginated(res, rows, { total, page, limit });
  } catch (e) { next(e); }
};

const getById = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getById(req.params.id)); } catch (e) { next(e); }
};

const getMyProfile = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getMyProfile(req.user.id)); } catch (e) { next(e); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatarUrl = `/uploads/${req.file.filename}`;
    return apiResponse.success(res, await svc.updateProfile(req.user.id, data), 'Cập nhật hồ sơ thành công');
  } catch (e) { next(e); }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const { total, page, limit, rows } = await svc.getMyAppointments(req.user.id, req.query);
    return apiResponse.paginated(res, rows, { total, page, limit }, 'Lấy lịch sử khám thành công');
  } catch (e) { next(e); }
};

module.exports = { getAll, getById, getMyProfile, updateMyProfile, getMyAppointments };
