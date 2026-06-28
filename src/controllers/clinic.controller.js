'use strict';

const svc = require('../services/clinic.service');
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

const getNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius, specialtyId } = req.query;
    if (!lat || !lng) return apiResponse.badRequest(res, 'Thiếu tọa độ lat/lng');
    const data = await svc.getNearby({ lat, lng, radius, specialtyId });
    return apiResponse.success(res, data, `Tìm thấy ${data.length} phòng khám gần nhất`);
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { return apiResponse.created(res, await svc.create(req.body), 'Tạo phòng khám thành công'); } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.update(req.params.id, req.body), 'Cập nhật thành công'); } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try { await svc.remove(req.params.id); return apiResponse.success(res, null, 'Xóa phòng khám thành công'); } catch (e) { next(e); }
};

module.exports = { getAll, getById, getNearby, create, update, remove };
