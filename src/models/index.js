'use strict';

/**
 * models/index.js
 * Tổng hợp tất cả models và khai báo các quan hệ (Associations)
 */

const User        = require('./User');
const Patient     = require('./Patient');
const Doctor      = require('./Doctor');
const Specialty   = require('./Specialty');
const Clinic      = require('./Clinic');
const DoctorClinic = require('./DoctorClinic');
const Appointment = require('./Appointment');

// ─────────────────────────────────────────────────────────────
// ASSOCIATIONS
// ─────────────────────────────────────────────────────────────

// User ↔ Patient (1:1)
User.hasOne(Patient, { foreignKey: 'userId', as: 'patientProfile', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User ↔ Doctor (1:1)
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Specialty ↔ Doctor (1:N)
Specialty.hasMany(Doctor, { foreignKey: 'specialtyId', as: 'doctors' });
Doctor.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });

// Doctor ↔ Clinic (N:N) qua DoctorClinic
Doctor.belongsToMany(Clinic, {
  through: DoctorClinic,
  foreignKey: 'doctorId',
  otherKey: 'clinicId',
  as: 'clinics'
});
Clinic.belongsToMany(Doctor, {
  through: DoctorClinic,
  foreignKey: 'clinicId',
  otherKey: 'doctorId',
  as: 'doctors'
});

// Direct access DoctorClinic
Doctor.hasMany(DoctorClinic, { foreignKey: 'doctorId', as: 'doctorClinics' });
Clinic.hasMany(DoctorClinic, { foreignKey: 'clinicId', as: 'clinicDoctors' });
DoctorClinic.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
DoctorClinic.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

// Appointment → Patient (N:1)
// Dùng NO ACTION để tránh lỗi cascade paths trong SQL Server
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// Appointment → Doctor (N:1)
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// Appointment → Clinic (N:1)
Clinic.hasMany(Appointment, { foreignKey: 'clinicId', as: 'appointments', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Appointment.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// Appointment → Specialty (N:1)
Specialty.hasMany(Appointment, { foreignKey: 'specialtyId', as: 'appointments', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Appointment.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// ─────────────────────────────────────────────────────────────

module.exports = {
  User,
  Patient,
  Doctor,
  Specialty,
  Clinic,
  DoctorClinic,
  Appointment
};
