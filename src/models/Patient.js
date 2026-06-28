'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'Users', key: 'id' }
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Họ tên không được để trống' },
      len: { args: [2, 150], msg: 'Họ tên từ 2-150 ký tự' }
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      is: { args: /^[0-9+\-\s]{9,15}$/, msg: 'Số điện thoại không hợp lệ' }
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  insuranceNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Số thẻ bảo hiểm y tế'
  },
  bloodType: {
    type: DataTypes.ENUM('A', 'B', 'AB', 'O', 'Unknown'),
    allowNull: true,
    defaultValue: 'Unknown'
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Tiền sử dị ứng'
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Tiền sử bệnh án'
  }
}, {
  tableName: 'Patients',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['phone'] }
  ]
});

module.exports = Patient;
