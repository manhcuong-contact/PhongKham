# Tài Liệu API MediFlow 🩺

API Base URL: `http://localhost:3000/api/v1`

## 1. Authentication (Xác Thực)

### Đăng ký Bệnh nhân
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
      "email": "user@example.com",
      "password": "password123",
      "fullName": "Nguyễn Văn A",
      "phone": "0901234567"
  }
  ```

### Đăng nhập
- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
      "email": "admin@mediflow.vn",
      "password": "Admin@123"
  }
  ```
- **Response:**
  ```json
  {
      "success": true,
      "data": {
          "user": { "id": 1, "email": "...", "role": "admin" },
          "accessToken": "eyJhbG...",
          "refreshToken": "eyJhbG..."
      }
  }
  ```

---

## 2. Tìm kiếm Phòng Khám (Clinics)

### Lấy danh sách phòng khám gần nhất (Haversine Formula)
- **Endpoint:** `GET /clinics/nearby`
- **Query Parameters:**
  - `lat` (bắt buộc): Vĩ độ (VD: 21.0285)
  - `lng` (bắt buộc): Kinh độ (VD: 105.8542)
  - `radius` (tuỳ chọn): Bán kính tìm kiếm tính bằng km (Mặc định: 50)
  - `specialtyId` (tuỳ chọn): Chỉ tìm phòng khám có bác sĩ thuộc chuyên khoa này.
- **Tính năng:** Trả về danh sách các phòng khám kèm theo trường `distance_km`.

---

## 3. Bác Sĩ (Doctors)

### Xem khung giờ làm việc còn trống
- **Endpoint:** `GET /doctors/:id/slots`
- **Query Parameters:**
  - `date`: Ngày cần xem (Định dạng: `YYYY-MM-DD`)
- **Response:**
  ```json
  [
      { "time": "08:00", "available": true },
      { "time": "08:30", "available": false }
  ]
  ```

---

## 4. Lịch Khám (Appointments)

### Đặt lịch khám (Patient)
- **Endpoint:** `POST /appointments`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Body:**
  ```json
  {
      "doctorId": 1,
      "clinicId": 1,
      "appointmentDate": "2026-10-15",
      "startTime": "09:00",
      "reason": "Khám tổng quát"
  }
  ```
- **Xử lý đặc biệt (Conflict & Suggestions):** Nếu bác sĩ đã có lịch trùng giờ, API sẽ trả về lỗi `409 Conflict` kèm theo mảng `suggestions` chứa 3 khung giờ thay thế gần nhất.
- **Background Job:** Khi đặt thành công, Node.js sẽ tự động dùng Nodemailer gửi email xác nhận cho bệnh nhân.

### Cập nhật trạng thái (Admin/Doctor)
- **Endpoint:** `PATCH /appointments/:id/status`
- **Body:**
  ```json
  {
      "status": "completed",
      "doctorNotes": "Bệnh nhân đã khỏe mạnh"
  }
  ```

---

## 5. Admin Dashboard

### Lấy thông số tổng quan
- **Endpoint:** `GET /admin/dashboard`
- **Response:**
  Trả về thống kê số lượng User, Bác sĩ, Phòng khám, và chi tiết trạng thái các lịch khám (pending, completed, cancelled) để vẽ biểu đồ.

---

> **Lưu ý về CronJob:** Hệ thống có 1 CronJob (dùng `node-cron`) chạy ngầm lúc 08:00 AM mỗi ngày để dò tìm các lịch khám có `appointmentDate` là "Ngày mai" và tự động gửi **Email Nhắc Lịch**.
