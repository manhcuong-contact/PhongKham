'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Patients', key: 'id' }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Doctors', key: 'id' }
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Clinics', key: 'id' }
  },
  specialtyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Specialties', key: 'id' }
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Ngày khám không được để trống' },
      isDate: { msg: 'Ngày khám không hợp lệ' }
    }
  },
  startTime: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: 'Giờ bắt đầu (HH:MM)',
    validate: {
      is: { args: /^([01]\d|2[0-3]):([0-5]\d)$/, msg: 'Định dạng giờ không hợp lệ (HH:MM)' }
    }
  },
  endTime: {
    type: DataTypes.STRING(5),
    allowNull: true,
    comment: 'Giờ kết thúc (HH:MM)'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
    allowNull: false,
    defaultValue: 'pending',
    comment: 'pending=chờ xác nhận, confirmed=đã xác nhận, completed=đã khám, cancelled=đã hủy, no_show=vắng mặt'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lý do khám'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú thêm của bệnh nhân'
  },
  doctorNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú của bác sĩ sau khi khám'
  },
  cancelReason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Đã gửi email nhắc nhở chưa'
  },
  confirmationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Đã gửi email xác nhận chưa'
  },
  isFirstVisit: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Lần khám đầu tiên hay tái khám'
  },
  fee: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: true,
    comment: 'Phí khám thực tế'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  }
}, {
  tableName: 'Appointments',
  timestamps: true,
  indexes: [
    { fields: ['patientId'] },
    { fields: ['doctorId'] },
    { fields: ['clinicId'] },
    { fields: ['appointmentDate'] },
    { fields: ['status'] },
    // Index composite để check trùng lịch
    { fields: ['doctorId', 'appointmentDate', 'startTime'] }
  ]
});

module.exports = Appointment;
