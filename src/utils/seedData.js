'use strict';

/**
 * seedData.js
 * Đọc dữ liệu từ các file CSV và import vào SQL Server
 * Chạy: npm run seed
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');

const { sequelize, testConnection } = require('../config/database');
const {
  User, Patient, Doctor, Specialty, Clinic, DoctorClinic, Appointment
} = require('../models');
const logger = require('./logger');

const CSV_DIR = path.join(__dirname, '../../data/csv');

// ─── Helper: Đọc file CSV ────────────────────────────────────────────────────
const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(CSV_DIR, filename);

    if (!fs.existsSync(filePath)) {
      logger.warn(`⚠️  Không tìm thấy file: ${filename} — bỏ qua`);
      return resolve([]);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// ─── Seed Functions ──────────────────────────────────────────────────────────

const seedSpecialties = async () => {
  const rows = await readCSV('specialties.csv');
  if (!rows.length) {
    // Default specialties nếu không có CSV
    const defaults = [
      { name: 'Nội tổng quát', code: 'NTQ' },
      { name: 'Tim mạch', code: 'TM' },
      { name: 'Nhi khoa', code: 'NK' },
      { name: 'Tai Mũi Họng', code: 'TMH' },
      { name: 'Da liễu', code: 'DL' },
      { name: 'Mắt', code: 'MAT' },
      { name: 'Thần kinh', code: 'TK' },
      { name: 'Ung bướu', code: 'UB' },
      { name: 'Cơ xương khớp', code: 'CXK' },
      { name: 'Phụ sản', code: 'PS' }
    ];
    for (const s of defaults) {
      await Specialty.findOrCreate({ where: { code: s.code }, defaults: s });
    }
    logger.info(`✅ Seed ${defaults.length} chuyên khoa mặc định`);
    return;
  }

  for (const row of rows) {
    await Specialty.findOrCreate({
      where: { name: row.name },
      defaults: {
        name: row.name,
        code: row.code || null,
        description: row.description || null
      }
    });
  }
  logger.info(`✅ Seed ${rows.length} chuyên khoa từ CSV`);
};

const seedClinics = async () => {
  const rows = await readCSV('clinics.csv');
  if (!rows.length) { logger.warn('⚠️  Không có dữ liệu clinics.csv'); return; }

  for (const row of rows) {
    await Clinic.findOrCreate({
      where: { name: row.name, address: row.address },
      defaults: {
        name: row.name,
        address: row.address,
        district: row.district || null,
        city: row.city || 'Hà Nội',
        phone: row.phone || null,
        email: row.email || null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        openTime: row.openTime || '07:00',
        closeTime: row.closeTime || '17:00',
        description: row.description || null
      }
    });
  }
  logger.info(`✅ Seed ${rows.length} phòng khám từ CSV`);
};

const seedDoctors = async () => {
  const rows = await readCSV('doctors.csv');
  if (!rows.length) { logger.warn('⚠️  Không có dữ liệu doctors.csv'); return; }

  const specialties = await Specialty.findAll();
  const specialtyMap = {};
  specialties.forEach((s) => { specialtyMap[s.name] = s.id; });

  const clinics = await Clinic.findAll();
  const clinicMap = {};
  clinics.forEach((c) => { clinicMap[c.name] = c.id; });

  for (const row of rows) {
    try {
      const hashedPw = await bcrypt.hash('doctor123', 10);

      // Tạo User
      const [user] = await User.findOrCreate({
        where: { email: row.email || `doctor_${Date.now()}@mediflow.vn` },
        defaults: {
          email: row.email || `doctor_${Date.now()}@mediflow.vn`,
          password: hashedPw,
          role: 'doctor'
        }
      });

      // Tìm specialtyId
      const specialtyId = row.specialty
        ? (specialtyMap[row.specialty] || null)
        : null;

      // Tạo Doctor profile
      const [doctor] = await Doctor.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          specialtyId,
          fullName: row.fullName || row.name,
          phone: row.phone || null,
          title: row.title || 'BS',
          experience: parseInt(row.experience) || 0,
          bio: row.bio || null,
          consultationFee: parseInt(row.consultationFee) || 200000
        }
      });

      // Gán phòng khám nếu có
      if (row.clinic && clinicMap[row.clinic]) {
        await DoctorClinic.findOrCreate({
          where: { doctorId: doctor.id, clinicId: clinicMap[row.clinic] },
          defaults: {
            doctorId: doctor.id,
            clinicId: clinicMap[row.clinic],
            isPrimary: true,
            roomNumber: row.room || null
          }
        });
      }
    } catch (err) {
      logger.warn(`Lỗi khi seed doctor ${row.fullName || row.name}: ${err.message}`);
    }
  }
  logger.info(`✅ Seed ${rows.length} bác sĩ từ CSV`);
};

const seedPatients = async () => {
  const rows = await readCSV('patients.csv');
  if (!rows.length) { logger.warn('⚠️  Không có dữ liệu patients.csv'); return; }

  for (const row of rows) {
    try {
      const hashedPw = await bcrypt.hash('patient123', 10);
      const [user] = await User.findOrCreate({
        where: { email: row.email },
        defaults: { email: row.email, password: hashedPw, role: 'patient' }
      });

      await Patient.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          fullName: row.fullName || row.name,
          phone: row.phone || null,
          dateOfBirth: row.dateOfBirth || null,
          gender: row.gender || null,
          address: row.address || null,
          insuranceNumber: row.insuranceNumber || null
        }
      });
    } catch (err) {
      logger.warn(`Lỗi khi seed patient ${row.fullName}: ${err.message}`);
    }
  }
  logger.info(`✅ Seed ${rows.length} bệnh nhân từ CSV`);
};

const seedAdmin = async () => {
  const hashedPw = await bcrypt.hash('Admin@123', 10);
  await User.findOrCreate({
    where: { email: 'admin@mediflow.vn' },
    defaults: {
      email: 'admin@mediflow.vn',
      password: hashedPw,
      role: 'admin'
    }
  });
  logger.info('✅ Tài khoản Admin mặc định: admin@mediflow.vn / Admin@123');
};

// ─── Main ────────────────────────────────────────────────────────────────────
const runSeed = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: false }); // Không alter lại, bảng đã có sẵn
    logger.info('🌱 Bắt đầu import dữ liệu từ CSV...');

    await seedSpecialties();
    await seedClinics();
    await seedDoctors();
    await seedPatients();
    await seedAdmin();

    logger.success('🎉 Import dữ liệu hoàn tất!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  }
};

runSeed();
