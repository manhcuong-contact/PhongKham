'use strict';

const { Appointment, Patient, Doctor, Clinic, Specialty, User } = require('../models');
const { Op, fn, col, literal, sequelize: seq } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Tổng quan thống kê
 */
const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date();
  const firstDay = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString().split('T')[0];

  const [
    totalPatients,
    totalDoctors,
    totalClinics,
    totalAppointments,
    todayAppointments,
    monthAppointments,
    pendingAppointments,
    completedAppointments,
    cancelledAppointments
  ] = await Promise.all([
    Patient.count(),
    Doctor.count({ where: { isActive: true } }),
    Clinic.count({ where: { isActive: true } }),
    Appointment.count(),
    Appointment.count({ where: { appointmentDate: today } }),
    Appointment.count({ where: { appointmentDate: { [Op.gte]: firstDay } } }),
    Appointment.count({ where: { status: 'pending' } }),
    Appointment.count({ where: { status: 'completed' } }),
    Appointment.count({ where: { status: 'cancelled' } })
  ]);

  return {
    totals: { patients: totalPatients, doctors: totalDoctors, clinics: totalClinics, appointments: totalAppointments },
    today: { appointments: todayAppointments },
    thisMonth: { appointments: monthAppointments },
    status: {
      pending: pendingAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments
    }
  };
};

/**
 * Lịch hẹn theo ngày trong tháng (cho biểu đồ)
 */
const getAppointmentsByMonth = async (year, month) => {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = new Date(year, month, 0).toISOString().split('T')[0]; // Ngày cuối tháng

  const rows = await Appointment.findAll({
    attributes: [
      'appointmentDate',
      [fn('COUNT', col('id')), 'count'],
      'status'
    ],
    where: { appointmentDate: { [Op.between]: [start, end] } },
    group: ['appointmentDate', 'status'],
    order: [['appointmentDate', 'ASC']],
    raw: true
  });
  return rows;
};

/**
 * Top bác sĩ có nhiều lịch nhất
 */
const getTopDoctors = async (limit = 5) => {
  return Doctor.findAll({
    include: [
      { model: Appointment, as: 'appointments', attributes: [] },
      { model: Specialty, as: 'specialty', attributes: ['name'] }
    ],
    attributes: {
      include: [[fn('COUNT', col('appointments.id')), 'appointmentCount']]
    },
    group: ['Doctor.id', 'specialty.id', 'specialty.name'],
    order: [[literal('appointmentCount'), 'DESC']],
    limit,
    subQuery: false
  });
};

/**
 * Lịch hẹn gần nhất (10 lịch hẹn mới nhất)
 */
const getRecentAppointments = async (limit = 10) => {
  return Appointment.findAll({
    limit,
    include: [
      { model: Patient, as: 'patient', attributes: ['fullName', 'phone'] },
      { model: Doctor, as: 'doctor', attributes: ['fullName', 'title'] },
      { model: Clinic, as: 'clinic', attributes: ['name'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Thống kê theo chuyên khoa
 */
const getStatsBySpecialty = async () => {
  return Specialty.findAll({
    include: [{
      model: Appointment, as: 'appointments', attributes: []
    }],
    attributes: {
      include: [[fn('COUNT', col('appointments.id')), 'appointmentCount']]
    },
    group: ['Specialty.id'],
    order: [[literal('appointmentCount'), 'DESC']],
    subQuery: false
  });
};

module.exports = { getDashboardStats, getAppointmentsByMonth, getTopDoctors, getRecentAppointments, getStatsBySpecialty };
