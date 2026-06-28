'use strict';

const { Appointment, Patient, Doctor, Clinic, Specialty, User } = require('../models');
const { sendConfirmationEmail } = require('./email.service');
const { Op } = require('sequelize');

const ALL_SLOTS = [
  '07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'
];

/**
 * Kiểm tra bác sĩ đã có lịch ở khung giờ đó chưa
 */
const checkConflict = async (doctorId, appointmentDate, startTime, excludeId = null) => {
  const where = {
    doctorId,
    appointmentDate,
    startTime,
    status: { [Op.notIn]: ['cancelled'] }
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const existing = await Appointment.findOne({ where });
  return existing;
};

/**
 * Gợi ý các khung giờ thay thế trong cùng ngày hoặc ngày hôm sau
 */
const suggestAlternativeSlots = async (doctorId, appointmentDate, count = 3) => {
  const booked = await Appointment.findAll({
    where: { doctorId, appointmentDate, status: { [Op.notIn]: ['cancelled'] } },
    attributes: ['startTime']
  });
  const bookedSlots = booked.map(a => a.startTime);
  const available = ALL_SLOTS.filter(s => !bookedSlots.includes(s));
  return available.slice(0, count).map(time => ({ date: appointmentDate, time }));
};

/**
 * Đặt lịch khám mới
 */
const create = async (userId, data) => {
  const { doctorId, clinicId, specialtyId, appointmentDate, startTime, reason, notes, isFirstVisit } = data;

  // 1. Tìm patient từ userId
  const patient = await Patient.findOne({ where: { userId } });
  if (!patient) throw Object.assign(new Error('Chưa có hồ sơ bệnh nhân. Vui lòng tạo hồ sơ trước.'), { statusCode: 400 });

  // 2. Kiểm tra bác sĩ tồn tại
  const doctor = await Doctor.findByPk(doctorId, {
    include: [{ model: User, as: 'user', attributes: ['email'] }]
  });
  if (!doctor || !doctor.isActive) throw Object.assign(new Error('Bác sĩ không tồn tại hoặc không hoạt động'), { statusCode: 404 });

  // 3. Kiểm tra phòng khám
  const clinic = await Clinic.findByPk(clinicId);
  if (!clinic || !clinic.isActive) throw Object.assign(new Error('Phòng khám không tồn tại'), { statusCode: 404 });

  // 4. Kiểm tra ngày hợp lệ (không được đặt ngày trong quá khứ)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(appointmentDate) < today) {
    throw Object.assign(new Error('Không thể đặt lịch cho ngày đã qua'), { statusCode: 400 });
  }

  // 5. Kiểm tra trùng lịch bác sĩ
  const conflict = await checkConflict(doctorId, appointmentDate, startTime);
  if (conflict) {
    const suggestions = await suggestAlternativeSlots(doctorId, appointmentDate);
    throw Object.assign(
      new Error('Bác sĩ đã có lịch hẹn vào khung giờ này'),
      { statusCode: 409, suggestions }
    );
  }

  // 6. Kiểm tra bệnh nhân đã có lịch hẹn trùng giờ chưa
  const patientConflict = await Appointment.findOne({
    where: {
      patientId: patient.id,
      appointmentDate,
      startTime,
      status: { [Op.notIn]: ['cancelled'] }
    }
  });
  if (patientConflict) {
    throw Object.assign(new Error('Bạn đã có lịch hẹn vào khung giờ này'), { statusCode: 409 });
  }

  // 7. Tạo lịch hẹn
  const endTime = (() => {
    const [h, m] = startTime.split(':').map(Number);
    const end = new Date(2000, 0, 1, h, m + 30);
    return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  })();

  const appointment = await Appointment.create({
    patientId: patient.id,
    doctorId,
    clinicId,
    specialtyId: specialtyId || doctor.specialtyId,
    appointmentDate,
    startTime,
    endTime,
    reason,
    notes,
    isFirstVisit: isFirstVisit !== undefined ? isFirstVisit : true,
    status: 'pending',
    fee: doctor.consultationFee
  });

  // 8. Gửi email xác nhận (async, không block response)
  const patientWithUser = await Patient.findByPk(patient.id, {
    include: [{ model: User, as: 'user', attributes: ['email'] }]
  });

  sendConfirmationEmail(appointment, patientWithUser, doctor, clinic)
    .then(() => appointment.update({ confirmationSent: true }))
    .catch(() => {});

  return getById(appointment.id);
};

/**
 * Lấy chi tiết lịch khám
 */
const getById = async (id) => {
  const a = await Appointment.findByPk(id, {
    include: [
      {
        model: Patient, as: 'patient',
        include: [{ model: User, as: 'user', attributes: ['email'] }]
      },
      { model: Doctor, as: 'doctor', attributes: ['id', 'fullName', 'title', 'phone', 'consultationFee', 'avatarUrl'] },
      { model: Clinic, as: 'clinic', attributes: ['id', 'name', 'address', 'phone'] },
      { model: Specialty, as: 'specialty', attributes: ['id', 'name'] }
    ]
  });
  if (!a) throw Object.assign(new Error('Lịch hẹn không tồn tại'), { statusCode: 404 });
  return a;
};

/**
 * Lấy danh sách lịch hẹn (cho admin/doctor)
 */
const getAll = async (query = {}) => {
  const { status, doctorId, clinicId, date, page = 1, limit = 20 } = query;
  const where = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = doctorId;
  if (clinicId) where.clinicId = clinicId;
  if (date) where.appointmentDate = date;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Appointment.findAndCountAll({
    where, limit: parseInt(limit), offset,
    include: [
      { model: Patient, as: 'patient', attributes: ['id', 'fullName', 'phone'] },
      { model: Doctor, as: 'doctor', attributes: ['id', 'fullName', 'title'] },
      { model: Clinic, as: 'clinic', attributes: ['id', 'name'] },
      { model: Specialty, as: 'specialty', attributes: ['id', 'name'] }
    ],
    order: [['appointmentDate', 'DESC'], ['startTime', 'ASC']]
  });
  return { total: count, page: parseInt(page), limit: parseInt(limit), rows };
};

/**
 * Cập nhật trạng thái lịch hẹn
 */
const updateStatus = async (id, status, extra = {}) => {
  const a = await Appointment.findByPk(id);
  if (!a) throw Object.assign(new Error('Lịch hẹn không tồn tại'), { statusCode: 404 });
  const updateData = { status, ...extra };
  return a.update(updateData);
};

/**
 * Hủy lịch hẹn
 */
const cancel = async (id, userId, cancelReason) => {
  const a = await getById(id);
  // Bệnh nhân chỉ hủy được lịch của mình
  const patient = await Patient.findOne({ where: { userId } });
  if (patient && a.patientId !== patient.id) {
    throw Object.assign(new Error('Không có quyền hủy lịch hẹn này'), { statusCode: 403 });
  }
  if (['completed', 'cancelled'].includes(a.status)) {
    throw Object.assign(new Error(`Không thể hủy lịch đã ở trạng thái "${a.status}"`), { statusCode: 400 });
  }
  return a.update({ status: 'cancelled', cancelReason });
};

module.exports = { create, getById, getAll, updateStatus, cancel, checkConflict, suggestAlternativeSlots };
