'use strict';

const { Clinic, Doctor, Specialty, DoctorClinic } = require('../models');
const { getNearestClinics } = require('../utils/haversine');
const { Op } = require('sequelize');

const getAll = async (query = {}) => {
  const { search, city, district, page = 1, limit = 20 } = query;
  const where = { isActive: true };
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (city) where.city = { [Op.like]: `%${city}%` };
  if (district) where.district = { [Op.like]: `%${district}%` };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Clinic.findAndCountAll({
    where, limit: parseInt(limit), offset, order: [['name', 'ASC']]
  });
  return { total: count, page: parseInt(page), limit: parseInt(limit), rows };
};

const getById = async (id) => {
  const c = await Clinic.findByPk(id, {
    include: [{
      model: Doctor, as: 'doctors', where: { isActive: true }, required: false,
      attributes: ['id', 'fullName', 'title', 'experience', 'consultationFee', 'rating', 'avatarUrl'],
      include: [{ model: Specialty, as: 'specialty', attributes: ['id', 'name'] }]
    }]
  });
  if (!c) throw Object.assign(new Error('Phòng khám không tồn tại'), { statusCode: 404 });
  return c;
};

/**
 * Tìm phòng khám gần nhất bằng công thức Haversine
 */
const getNearby = async ({ lat, lng, radius = 50, specialtyId }) => {
  const where = { isActive: true };
  if (specialtyId) {
    // Chỉ lấy phòng khám có bác sĩ thuộc chuyên khoa này
    const doctorClinicIds = await DoctorClinic.findAll({
      include: [{ model: Doctor, as: 'doctor', where: { specialtyId, isActive: true }, required: true }],
      attributes: ['clinicId']
    });
    const clinicIds = [...new Set(doctorClinicIds.map(d => d.clinicId))];
    where.id = { [Op.in]: clinicIds };
  }
  const clinics = await Clinic.findAll({ where });
  return getNearestClinics(clinics, parseFloat(lat), parseFloat(lng), parseFloat(radius));
};

const create = async (data) => Clinic.create(data);

const update = async (id, data) => {
  const c = await Clinic.findByPk(id);
  if (!c) throw Object.assign(new Error('Phòng khám không tồn tại'), { statusCode: 404 });
  return c.update(data);
};

const remove = async (id) => {
  const c = await Clinic.findByPk(id);
  if (!c) throw Object.assign(new Error('Phòng khám không tồn tại'), { statusCode: 404 });
  await c.update({ isActive: false });
};

module.exports = { getAll, getById, getNearby, create, update, remove };
