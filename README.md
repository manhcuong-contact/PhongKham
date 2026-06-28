# MediFlow - Hệ thống Đặt lịch khám sức khỏe Online

Đây là đồ án hệ thống quản lý và đặt lịch khám bệnh với Node.js, Express, SQL Server, và Sequelize.

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu môi trường
1. **Node.js** (Phiên bản v16 trở lên)
2. **SQL Server** (Đã bật *Mixed Mode Authentication* và kích hoạt user `sa`)
3. **Git**

### Bước 1: Tải source code và cài đặt thư viện
Mở Terminal / PowerShell và chạy các lệnh sau:
```bash
# Clone dự án về máy
git clone https://github.com/manhcuong-contact/PhongKham.git
cd PhongKham

# Cài đặt toàn bộ thư viện cần thiết
npm install
```

### Bước 2: Cấu hình biến môi trường
Mở thư mục dự án, tìm file `.env.example`, copy và đổi tên thành `.env` (hoặc tạo file `.env` mới) với nội dung mẫu sau:
```ini
PORT=3000
NODE_ENV=development

# Cấu hình SQL Server
DB_HOST=DESKTOP-1JQFEUE\SQLEXPRESS
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=123456
DB_NAME=DatLichKham

# JWT Secret Keys
JWT_SECRET=Thay_Bang_Chuoi_Bi_Mat_Cua_Ban
JWT_REFRESH_SECRET=Thay_Bang_Chuoi_Refresh_Bi_Mat_Cua_Ban
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Cấu hình Gửi Email (App Password Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=email_cua_ban@gmail.com
EMAIL_PASS=mat_khau_ung_dung_gmail_cua_ban
EMAIL_FROM="MediFlow" <email_cua_ban@gmail.com>

# Upload
UPLOAD_MAX_SIZE=5242880
```
> **Lưu ý:** Sửa `DB_HOST`, `DB_USER` và `DB_PASSWORD` cho khớp với SQL Server trên máy tính bạn đang chạy.

### Bước 3: Nạp dữ liệu mẫu (Seed Data)
Để tạo database và nạp dữ liệu mẫu vào SQL Server tự động (Danh sách bác sĩ, phòng khám, admin...), chạy lệnh sau:
```bash
npm run seed
```
*Tài khoản Admin mặc định sẽ được tạo là: `admin@mediflow.vn` / Mật khẩu: `Admin@123`*

### Bước 4: Chạy Server
Sau khi nạp xong dữ liệu, hãy chạy lệnh sau để khởi động Backend:
```bash
# Chạy trong môi trường phát triển (tự khởi động lại khi có thay đổi code)
npm run dev

# Hoặc chạy trong môi trường production
npm start
```
Nếu Terminal hiện:
`🚀 Server đang chạy tại http://localhost:3000`
`✅ Database synchronized thành công`
Là bạn đã cài đặt thành công!

---

## 💻 Trải nghiệm hệ thống (Frontend)
Sau khi server đã chạy, hãy mở trình duyệt web và truy cập vào:
- Trang chủ (bệnh nhân): **http://localhost:3000**
- Trang đăng nhập: **http://localhost:3000/login.html**
- Trang quản trị Admin: **http://localhost:3000/admin.html** (Đăng nhập bằng tài khoản admin trước)

## 📖 Xem Tài liệu API (Dành cho Postman)
Tài liệu hướng dẫn API để chấm điểm nằm trong thư mục `docs/`.
- Xem file Markdown: `docs/API_DOCUMENTATION.md`
- Hoặc mở ứng dụng **Postman** -> File -> Import -> Chọn file `docs/MediFlow_Postman_Collection.json`.
