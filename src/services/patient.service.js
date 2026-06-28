'use strict';

const { Patient, User, Appointment, Doctor, Clinic, Specialty } = require('../models');
const { Op } = require('sequelize');

const getAll = async (query = {}) => {
  const { search, page = 1, limit = 20 } = query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Patient.findAndCountAll({
    where, limit: parseInt(limit), offset,
    include: [{ model: User, as: 'user', attributes: ['email', 'isActive', 'lastLogin'] }],
    order: [['createdAt', 'DESC']]
  });
  return { total: count, page: parseInt(page), limit: parseInt(limit), rows };
};

const getById = async (id) => {
  const p = await Patient.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['email', 'isActive'] }]
  });
  if (!p) throw Object.assign(new Error('Bệnh nhân không tồn tại'), { statusCode: 404 });
  return p;
};

const getMyProfile = async (userId) => {
  const p = await Patient.findOne({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['email', 'role', 'lastLogin'] }]
  });
  if (!p) throw Object.assign(new Error('Chưa có hồ sơ bệnh nhân'), { statusCode: 404 });
  return p;
};

const updateProfile = async (userId, data) => {
  const p = await Patient.findOne({ where: { userId } });
  if (!p) throw Object.assign(new Error('Không tìm thấy hồ sơ'), { statusCode: 404 });
  return p.update(data);
};

const getMyAppointments = async (userId, query = {}) => {
  const p = await Patient.findOne({ where: { userId } });
  if (!p) return { total: 0, rows: [] };
  const { status, page = 1, limit = 10 } = query;
  const where = { patientId: p.id };
  if (status) where.status = status;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Appointment.findAndCountAll({
    where, limit: parseInt(limit), offset,
    include: [
      { model: Doctor, as: 'doctor', attributes: ['id', 'fullName', 'title', 'avatarUrl'] },
      { model: Clinic, as: 'clinic', attributes: ['id', 'name', 'address', 'phone'] },
      { model: Specialty, as: 'specialty', attributes: ['id', 'name'] }
    ],
    order: [['appointmentDate', 'DESC'], ['startTime', 'DESC']]
  });
  return { total: count, page: parseInt(page), limit: parseInt(limit), rows };
};

module.exports = { getAll, getById, getMyProfile, updateProfile, getMyAppointments };
