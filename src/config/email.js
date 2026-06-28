'use strict';

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

transporter.verify((error) => {
  if (error) {
    logger.warn('⚠️  Email transporter chưa sẵn sàng (kiểm tra EMAIL_USER/PASS trong .env)');
  } else {
    logger.info('✅ Email transporter sẵn sàng');
  }
});

module.exports = transporter;
