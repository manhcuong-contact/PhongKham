'use strict';

const transporter = require('../config/email');
const logger = require('../utils/logger');

/**
 * Gửi email xác nhận đặt lịch thành công
 */
const sendConfirmationEmail = async (appointment, patient, doctor, clinic) => {
  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
  <!DOCTYPE html>
  <html lang="vi">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f0f4f8; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #004ac6, #2563eb); padding: 32px 24px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
    .badge { display: inline-block; background: #6cf8bb; color: #00714d; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 12px; }
    .body { padding: 32px 24px; }
    .greeting { font-size: 16px; color: #374151; margin-bottom: 20px; }
    .card { background: #f8f9ff; border: 1px solid #dce9ff; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .card h3 { color: #004ac6; margin: 0 0 16px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5eeff; }
    .row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-size: 13px; }
    .value { color: #111827; font-size: 13px; font-weight: 600; text-align: right; max-width: 60%; }
    .highlight { font-size: 28px; font-weight: 700; color: #004ac6; text-align: center; padding: 16px; letter-spacing: 2px; background: #eff4ff; border-radius: 8px; margin: 16px 0; }
    .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #92400e; margin-top: 20px; }
    .footer { background: #f8f9ff; padding: 20px 24px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5eeff; }
    .btn { display: inline-block; background: #004ac6; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px auto; }
  </style>
  </head>
  <body>
  <div class="container">
    <div class="header">
      <h1>🏥 MediFlow</h1>
      <p>Hệ thống Đặt lịch khám sức khỏe Online</p>
      <span class="badge">✅ Đặt lịch thành công</span>
    </div>
    <div class="body">
      <p class="greeting">Xin chào <strong>${patient.fullName}</strong>,</p>
      <p style="color: #374151;">Lịch khám của bạn đã được <strong>xác nhận</strong> thành công. Dưới đây là thông tin chi tiết:</p>

      <div class="card">
        <h3>📋 Thông tin lịch hẹn</h3>
        <div class="row"><span class="label">📅 Ngày khám</span><span class="value">${dateStr}</span></div>
        <div class="row"><span class="label">🕐 Giờ khám</span><span class="value">${appointment.startTime}</span></div>
        <div class="row"><span class="label">👨‍⚕️ Bác sĩ</span><span class="value">${doctor.title || 'BS'}. ${doctor.fullName}</span></div>
        <div class="row"><span class="label">🏥 Phòng khám</span><span class="value">${clinic.name}</span></div>
        <div class="row"><span class="label">📍 Địa chỉ</span><span class="value">${clinic.address}</span></div>
        ${clinic.phone ? `<div class="row"><span class="label">📞 Hotline</span><span class="value">${clinic.phone}</span></div>` : ''}
        <div class="row"><span class="label">💰 Phí khám</span><span class="value">${Number(doctor.consultationFee || 0).toLocaleString('vi-VN')} VNĐ</span></div>
      </div>

      <div class="highlight">#AP${String(appointment.id).padStart(6, '0')}</div>
      <p style="text-align:center; color:#6b7280; font-size:13px;">Mã lịch hẹn của bạn — Vui lòng mang theo khi đến khám</p>

      <div class="note">
        ⚠️ <strong>Lưu ý quan trọng:</strong> Vui lòng đến trước giờ hẹn <strong>15–20 phút</strong> để làm thủ tục. 
        Nếu bạn cần thay đổi hoặc hủy lịch, vui lòng liên hệ trước ít nhất <strong>2 giờ</strong>.
      </div>
    </div>
    <div class="footer">
      <p>Email này được gửi tự động từ hệ thống MediFlow. Vui lòng không trả lời email này.</p>
      <p>© 2025 MediFlow — Hệ thống Đặt lịch khám sức khỏe Online</p>
    </div>
  </div>
  </body></html>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: patient.user ? patient.user.email : '',
      subject: `✅ [MediFlow] Xác nhận lịch khám ngày ${dateStr}`,
      html
    });
    logger.info(`📧 Email xác nhận đã gửi tới: ${patient.user?.email}`);
    return true;
  } catch (error) {
    logger.warn(`⚠️  Không thể gửi email xác nhận: ${error.message}`);
    return false;
  }
};

/**
 * Gửi email nhắc lịch khám (trước 1 ngày)
 */
const sendReminderEmail = async (appointment, patient, doctor, clinic) => {
  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
  <!DOCTYPE html>
  <html lang="vi">
  <head><meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f0f4f8; margin: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #006c49, #10b981); padding: 28px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 28px; }
    .timer { font-size: 36px; text-align: center; font-weight: 700; color: #006c49; padding: 16px; background: #f0fdf4; border-radius: 10px; margin: 16px 0; }
    .card { background: #f8f9ff; border: 1px solid #dce9ff; border-radius: 10px; padding: 16px; margin: 16px 0; }
    .row { padding: 8px 0; border-bottom: 1px solid #e5eeff; display: flex; justify-content: space-between; }
    .row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-size: 13px; }
    .value { color: #111827; font-size: 13px; font-weight: 600; }
    .footer { background: #f8f9ff; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px; }
  </style>
  </head>
  <body>
  <div class="container">
    <div class="header"><h1>⏰ Nhắc nhở lịch khám ngày mai</h1></div>
    <div class="body">
      <p>Xin chào <strong>${patient.fullName}</strong>,</p>
      <p>Đây là lời nhắc: bạn có lịch khám vào <strong>ngày mai</strong>.</p>
      <div class="timer">📅 ${dateStr} — 🕐 ${appointment.startTime}</div>
      <div class="card">
        <div class="row"><span class="label">👨‍⚕️ Bác sĩ</span><span class="value">${doctor.title || 'BS'}. ${doctor.fullName}</span></div>
        <div class="row"><span class="label">🏥 Phòng khám</span><span class="value">${clinic.name}</span></div>
        <div class="row"><span class="label">📍 Địa chỉ</span><span class="value">${clinic.address}</span></div>
        ${clinic.phone ? `<div class="row"><span class="label">📞 Hotline</span><span class="value">${clinic.phone}</span></div>` : ''}
      </div>
      <p style="color:#374151;">Vui lòng đến trước <strong>15–20 phút</strong> để làm thủ tục đăng ký.</p>
    </div>
    <div class="footer">© 2025 MediFlow — Hệ thống Đặt lịch khám sức khỏe Online</div>
  </div>
  </body></html>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: patient.user ? patient.user.email : '',
      subject: `⏰ [MediFlow] Nhắc nhở lịch khám vào ngày mai — ${dateStr}`,
      html
    });
    logger.info(`📧 Email nhắc lịch đã gửi tới: ${patient.user?.email}`);
    return true;
  } catch (error) {
    logger.warn(`⚠️  Không thể gửi email nhắc lịch: ${error.message}`);
    return false;
  }
};

module.exports = { sendConfirmationEmail, sendReminderEmail };
