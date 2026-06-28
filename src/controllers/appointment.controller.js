'use strict';

const svc = require('../services/appointment.service');
const apiResponse = require('../utils/apiResponse');

const create = async (req, res, next) => {
  try {
    const data = await svc.create(req.user.id, req.body);
    return apiResponse.created(res, data, 'Đặt lịch thành công! Email xác nhận đã được gửi.');
  } catch (e) {
    // Trả về gợi ý khung giờ nếu trùng lịch
    if (e.statusCode === 409 && e.suggestions) {
      return apiResponse.conflict(res, e.message, { suggestions: e.suggestions });
    }
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { total, page, limit, rows } = await svc.getAll(req.query);
    return apiResponse.paginated(res, rows, { total, page, limit });
  } catch (e) { next(e); }
};

const getById = async (req, res, next) => {
  try { return apiResponse.success(res, await svc.getById(req.params.id)); } catch (e) { next(e); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes, cancelReason } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'no_show'];
    if (!allowed.includes(status)) return apiResponse.badRequest(res, `Trạng thái không hợp lệ. Chọn: ${allowed.join(', ')}`);
    const data = await svc.updateStatus(req.params.id, status, { doctorNotes, cancelReason });
    return apiResponse.success(res, data, 'Cập nhật trạng thái thành công');
  } catch (e) { next(e); }
};

const cancel = async (req, res, next) => {
  try {
    const { cancelReason } = req.body;
    const data = await svc.cancel(req.params.id, req.user.id, cancelReason);
    return apiResponse.success(res, data, 'Hủy lịch hẹn thành công');
  } catch (e) { next(e); }
};

module.exports = { create, getAll, getById, updateStatus, cancel };
