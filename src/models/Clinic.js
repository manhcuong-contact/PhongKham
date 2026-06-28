'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Clinic = sequelize.define('Clinic', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Tên phòng khám không được để trống' }
    }
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Địa chỉ không được để trống' }
    }
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Quận/Huyện'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Hà Nội'
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: { msg: 'Email phòng khám không hợp lệ' } }
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    comment: 'Vĩ độ (dùng cho Haversine)'
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    comment: 'Kinh độ (dùng cho Haversine)'
  },
  openTime: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '07:00',
    comment: 'Giờ mở cửa (HH:MM)'
  },
  closeTime: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '17:00',
    comment: 'Giờ đóng cửa (HH:MM)'
  },
  workingDays: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Mon,Tue,Wed,Thu,Fri',
    comment: 'Các ngày làm việc'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Clinics',
  timestamps: true,
  indexes: [
    { fields: ['city'] },
    { fields: ['district'] },
    { fields: ['latitude', 'longitude'] }
  ]
});

module.exports = Clinic;
