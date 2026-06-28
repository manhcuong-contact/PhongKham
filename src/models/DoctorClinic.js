'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DoctorClinic = sequelize.define('DoctorClinic', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Phòng khám chính của bác sĩ'
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Số phòng khám'
  },
  workDays: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Ngày làm việc tại phòng khám này (Mon,Tue...)'
  }
}, {
  tableName: 'DoctorClinics',
  timestamps: true,
  indexes: [
    { fields: ['doctorId', 'clinicId'], unique: true }
  ]
});

module.exports = DoctorClinic;
