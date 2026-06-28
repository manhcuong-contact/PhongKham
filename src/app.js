'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { sequelize, testConnection } = require('./config/database');
require('./models'); // Đăng ký tất cả models và associations
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// ─── Import Routes ────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const patientRoutes     = require('./routes/patient.routes');
const doctorRoutes      = require('./routes/doctor.routes');
const clinicRoutes      = require('./routes/clinic.routes');
const specialtyRoutes   = require('./routes/specialty.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes       = require('./routes/admin.routes');

// ─── Import Jobs ─────────────────────────────────────────────────────────────
const { startReminderJob } = require('./jobs/reminderJob');

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security & Utility Middlewares ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Tắt CSP để load được Tailwind CDN và Google Fonts
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files (Upload) ────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediFlow API đang hoạt động ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API = '/api/v1';
app.use(`${API}/auth`,         authRoutes);
app.use(`${API}/patients`,     patientRoutes);
app.use(`${API}/doctors`,      doctorRoutes);
app.use(`${API}/clinics`,      clinicRoutes);
app.use(`${API}/specialties`,  specialtyRoutes);
app.use(`${API}/appointments`, appointmentRoutes);
app.use(`${API}/admin`,        adminRoutes);

// ─── 404 & Error Handler ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Test DB connection
    await testConnection();

    // Sync models - dùng alter:false vì schema đã ổn định
    // Chỉ tạo bảng mới nếu chưa tồn tại
    await sequelize.sync({ alter: false });
    logger.info('✅ Database synchronized thành công');

    // Start cron jobs
    startReminderJob();
    logger.info('⏰ Cron jobs đã được khởi động');

    app.listen(PORT, () => {
      logger.info(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      logger.info(`📋 API Docs: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
