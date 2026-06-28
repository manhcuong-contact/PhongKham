'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Patient } = require('../models');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
  return { accessToken, refreshToken };
};

const register = async ({ email, password, fullName, phone, dateOfBirth, gender, address }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw Object.assign(new Error('Email đã được sử dụng'), { statusCode: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: 'patient' });
  await Patient.create({ userId: user.id, fullName, phone, dateOfBirth, gender, address });

  const { accessToken, refreshToken } = generateTokens(user);
  await user.update({ refreshToken, lastLogin: new Date() });

  return {
    user: { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { statusCode: 401 });
  if (!user.isActive) throw Object.assign(new Error('Tài khoản đã bị vô hiệu hóa'), { statusCode: 403 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { statusCode: 401 });

  const { accessToken, refreshToken } = generateTokens(user);
  await user.update({ refreshToken, lastLogin: new Date() });

  // Lấy profile theo role
  let profile = null;
  if (user.role === 'patient') {
    profile = await Patient.findOne({ where: { userId: user.id } });
  }

  return {
    user: { id: user.id, email: user.email, role: user.role },
    profile,
    accessToken,
    refreshToken
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findOne({ where: { id: decoded.id, refreshToken } });
  if (!user) throw Object.assign(new Error('Refresh token không hợp lệ'), { statusCode: 401 });

  const { accessToken, refreshToken: newRefresh } = generateTokens(user);
  await user.update({ refreshToken: newRefresh });
  return { accessToken, refreshToken: newRefresh };
};

const logout = async (userId) => {
  await User.update({ refreshToken: null }, { where: { id: userId } });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw Object.assign(new Error('Mật khẩu hiện tại không đúng'), { statusCode: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed, refreshToken: null });
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'role', 'isActive', 'lastLogin', 'createdAt'],
    include: [
      { model: Patient, as: 'patientProfile' }
    ]
  });
  return user;
};

module.exports = { register, login, refreshAccessToken, logout, changePassword, getMe };
