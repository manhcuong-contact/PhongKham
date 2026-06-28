'use strict';

const { Doctor, Specialty, Clinic, DoctorClinic, User, Appointment } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getAll = async (query = {}) => {
  const { specialtyId, clinicId, search, page = 1, limit = 20 } = query;
  const where = { isActive: true };
  if (specialtyId) where.specialtyId = specialtyId;
  if (search) where.fullName = { [Op.like]: `%${search}%` };

  const include = [
    { model: Specialty, as: 'specialty', attributes: ['id', 'name'] },
    { model: Clinic, as: 'clinics', through: { attributes: ['isPrimary', 'roomNumber'] }, required: false }
  ];

  if (clinicId) {
    include[1].where = { id: clinicId };
    include[1].required = true;
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Doctor.findAndCountAll({
    where, include, limit: parseInt(limit), offset,
    order: [['rating', 'DESC'], ['experience', 'DESC']],
    distinct: true
  });
  return { total: count, page: parseInt(page), limit: parseInt(limit), rows };
};

const getById = async (id) => {
  const d = await Doctor.findByPk(id, {
    include: [
      { model: Specialty, as: 'specialty' },
      { model: Clinic, as: 'clinics', through: { attributes: ['isPrimary', 'roomNumber', 'workDays'] } },
      { model: User, as: 'user', attributes: ['email'] }
    ]
  });
  if (!d) throw Object.assign(new Error('Bác sĩ không tồn tại'), { statusCode: 404 });
  return d;
};

const getBySpecialty = async (specialtyId, clinicId) => {
  const where = { specialtyId, isActive: true };
  const include = [
    { model: Specialty, as: 'specialty', attributes: ['id', 'name'] },
    { model: Clinic, as: 'clinics', required: false, through: { attributes: ['roomNumber'] } }
  ];
  if (clinicId) {
    include[1].where = { id: clinicId };
    include[1].required = true;
  }
  return Doctor.findAll({ where, include, order: [['rating', 'DESC']] });
};

const create = async (data) => {
  const { email, password, specialtyId, clinicId, roomNumber, ...doctorData } = data;
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash(password || 'doctor123', 10);
  const user = await User.create({ email, password: hashed, role: 'doctor' });
  const doctor = await Doctor.create({ ...doctorData, userId: user.id, specialtyId });
  if (clinicId) {
    await DoctorClinic.create({ doctorId: doctor.id, clinicId, isPrimary: true, roomNumber });
  }
  return getById(doctor.id);
};

const update = async (id, data) => {
  const d = await Doctor.findByPk(id);
  if (!d) throw Object.assign(new Error('Bác sĩ không tồn tại'), { statusCode: 404 });
  await d.update(data);
  return getById(id);
};

const remove = async (id) => {
  const d = await Doctor.findByPk(id);
  if (!d) throw Object.assign(new Error('Bác sĩ không tồn tại'), { statusCode: 404 });
  await d.update({ isActive: false });
};

/**
 * Lấy lịch làm việc còn trống của bác sĩ theo ngày
 */
const getAvailableSlots = async (doctorId, date) => {
  const ALL_SLOTS = [
    '07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'
  ];
  const booked = await Appointment.findAll({
    where: { doctorId, appointmentDate: date, status: { [Op.notIn]: ['cancelled'] } },
    attributes: ['startTime']
  });
  const bookedSlots = booked.map(a => a.startTime);
  return ALL_SLOTS.map(slot => ({ time: slot, available: !bookedSlots.includes(slot) }));
};

module.exports = { getAll, getById, getBySpecialty, create, update, remove, getAvailableSlots };
