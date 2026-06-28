'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,           // true nếu dùng Azure SQL
        trustServerCertificate: true,
        enableArithAbort: true,
        requestTimeout: 30000
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development'
      ? (sql) => logger.debug(`SQL: ${sql}`)
      : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true  // Tên bảng giữ nguyên (không tự pluralize)
    }
  }
);

/**
 * Kiểm tra kết nối Database
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.success(`✅ Kết nối SQL Server thành công! Database: ${process.env.DB_NAME}`);
  } catch (error) {
    logger.error('❌ Không thể kết nối SQL Server:', error.message);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
