'use strict';

const svc = require('../services/specialty.service');
const apiResponse = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getAll(req.query)); } catch (e) { next(e); }
};
const getById = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getById(req.params.id)); } catch (e) { next(e); }
};
const create = async (req, res, next) => {
  try { return apiResponse.created(res, await svc.create(req.body), 'Tạo chuyên khoa thành công'); } catch (e) { next(e); }
};
const update = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.update(req.params.id, req.body), 'Cập nhật thành công'); } catch (e) { next(e); }
};
const remove = async (req, res, next) => {
  try { await svc.remove(req.params.id); return apiResponse.success(res, null, 'Xóa chuyên khoa thành công'); } catch (e) { next(e); }
};

module.exports = { getAll, getById, create, update, remove };
