'use strict';

const cron = require('node-cron');
const { Op } = require('sequelize');
const { Appointment, Patient, Doctor, Clinic, User } = require('../models');
const { sendReminderEmail } = require('../services/email.service');
const logger = require('../utils/logger');

/**
 * Chạy mỗi ngày lúc 8:00 sáng
 * Gửi email nhắc lịch cho các cuộc hẹn vào ngày hôm sau
 */
const startReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('⏰ [CRON] Bắt đầu gửi email nhắc lịch...');
    try {
      // Lấy ngày mai
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // Tìm các lịch hẹn ngày mai chưa gửi nhắc nhở
      const appointments = await Appointment.findAll({
        where: {
          appointmentDate: tomorrowStr,
          status: { [Op.in]: ['pending', 'confirmed'] },
          reminderSent: false
        },
        include: [
          {
            model: Patient,
            as: 'patient',
            include: [{ model: User, as: 'user', attributes: ['email'] }]
          },
          { model: Doctor, as: 'doctor', attributes: ['fullName', 'title', 'consultationFee'] },
          { model: Clinic, as: 'clinic', attributes: ['name', 'address', 'phone'] }
        ]
      });

      logger.info(`📋 Tìm thấy ${appointments.length} lịch hẹn cần nhắc nhở`);

      let sentCount = 0;
      for (const appt of appointments) {
        if (!appt.patient?.user?.email) continue;

        const success = await sendReminderEmail(
          appt,
          appt.patient,
          appt.doctor,
          appt.clinic
        );

        if (success) {
          await appt.update({ reminderSent: true });
          sentCount++;
        }
      }

      logger.success(`✅ [CRON] Đã gửi ${sentCount}/${appointments.length} email nhắc lịch`);
    } catch (error) {
      logger.error('❌ [CRON] Lỗi khi gửi email nhắc lịch:', error.message);
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  });

  logger.info('⏰ Cron job nhắc lịch: chạy mỗi ngày lúc 8:00 SA (GMT+7)');
};

module.exports = { startReminderJob };
