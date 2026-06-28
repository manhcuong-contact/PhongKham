'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
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
  specialtyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Specialties', key: 'id' }
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Họ tên bác sĩ không được để trống' }
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  title: {
    type: DataTypes.ENUM('BS', 'ThS.BS', 'TS.BS', 'PGS.TS', 'GS.TS'),
    allowNull: true,
    defaultValue: 'BS',
    comment: 'Học hàm/học vị'
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Số năm kinh nghiệm'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả ngắn về bác sĩ'
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Quá trình học tập & bằng cấp'
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  consultationFee: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: true,
    defaultValue: 0,
    comment: 'Phí khám (VNĐ)'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0.0,
    validate: { min: 0, max: 5 }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  workSchedule: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON string lịch làm việc trong tuần'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Doctors',
  timestamps: true,
  indexes: [
    { fields: ['specialtyId'] },
    { fields: ['userId'] }
  ]
});

module.exports = Doctor;
