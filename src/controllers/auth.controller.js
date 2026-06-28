'use strict';

const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return apiResponse.created(res, data, 'Đăng ký thành công');
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return apiResponse.success(res, data, 'Đăng nhập thành công');
  } catch (e) { next(e); }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return apiResponse.badRequest(res, 'Thiếu refresh token');
    const data = await authService.refreshAccessToken(refreshToken);
    return apiResponse.success(res, data, 'Làm mới token thành công');
  } catch (e) { next(e); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    return apiResponse.success(res, null, 'Đăng xuất thành công');
  } catch (e) { next(e); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return apiResponse.success(res, null, 'Đổi mật khẩu thành công');
  } catch (e) { next(e); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return apiResponse.success(res, user, 'Lấy thông tin thành công');
  } catch (e) { next(e); }
};

module.exports = { register, login, refreshToken, logout, changePassword, getMe };
