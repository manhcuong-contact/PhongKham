'use strict';

const svc = require('../services/doctor.service');
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

const getBySpecialty = async (req, res, next) => {
  try {
    const data = await svc.getBySpecialty(req.params.specialtyId, req.query.clinicId);
    return apiResponse.success(res, data);
  } catch (e) { next(e); }
};

const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return apiResponse.badRequest(res, 'Thiếu tham số date (YYYY-MM-DD)');
    const slots = await svc.getAvailableSlots(req.params.id, date);
    return apiResponse.success(res, slots, 'Lấy khung giờ trống thành công');
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { return apiResponse.created(res, await svc.create(req.body), 'Thêm bác sĩ thành công'); } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.update(req.params.id, req.body), 'Cập nhật thành công'); } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try { await svc.remove(req.params.id); return apiResponse.success(res, null, 'Xóa bác sĩ thành công'); } catch (e) { next(e); }
};

module.exports = { getAll, getById, getBySpecialty, getAvailableSlots, create, update, remove };
