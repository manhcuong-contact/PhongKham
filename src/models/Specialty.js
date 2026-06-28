'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialty = sequelize.define('Specialty', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Tên chuyên khoa không được để trống' }
    }
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'Mã chuyên khoa (vd: CK01, TM, NK...)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  iconUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Specialties',
  timestamps: true
});

module.exports = Specialty;
