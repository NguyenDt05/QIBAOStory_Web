# QIBAO — Web Đọc Truyện Trực Tuyến

> Bài tập lớn môn Lập Trình Web — PTIT  
> Nhóm **BTL-LTW-QIBAO** · Full-stack Web Application

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & chạy](#cài-đặt--chạy)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Endpoints](#api-endpoints)
- [Biến môi trường](#biến-môi-trường)

---

## Tổng quan

QIBAO là nền tảng đọc truyện trực tuyến Full-Stack gồm:

- **Frontend (02-fe):** React 19 + Vite 7, giao tiếp với backend thông qua Axios
- **Backend (03-be):** Node.js + Express, kết nối MySQL qua `mysql2`
- **Cơ sở dữ liệu:** MySQL — database `qibao_db`

---

## Tính năng

### 👤 Người dùng

| Tính năng | Mô tả |
|---|---|
| Trang chủ | Truyện hot, truyện mới, hoàn thành, vừa cập nhật |
| Danh sách truyện | Lọc theo thể loại, trạng thái, phân trang |
| Chi tiết truyện | Ảnh nền động, thông tin, ngày cập nhật, danh sách chương, bình luận |
| Đọc chương | Điều hướng chương trước/sau, menu chương ngay trong trang đọc |
| Tìm kiếm | Tìm theo tên truyện, tác giả |
| Lọc thể loại | Xem truyện theo từng thể loại |
| Tủ sách | Lưu / xoá truyện yêu thích (lưu localStorage, đồng bộ server) |
| Lịch sử đọc | Theo dõi tiến độ đọc từng truyện |
| Hồ sơ cá nhân | Xem / sửa thông tin, đổi mật khẩu, đổi avatar |
| Bình luận | Đăng bình luận, xem bình luận (yêu cầu đăng nhập) |

### 🔐 Xác thực

| Tính năng | Mô tả |
|---|---|
| Đăng ký | Tạo tài khoản mới, upload avatar |
| Đăng nhập | JWT token, lưu vào localStorage |
| Phân quyền | `user` / `admin`, route được bảo vệ bằng middleware |

### 🛠️ Quản trị (Admin)

| Tính năng | Mô tả |
|---|---|
| Dashboard | Thống kê tổng: truyện, chương, người dùng, bình luận |
| Quản lý truyện | Thêm / sửa / xoá / ẩn-hiện, upload ảnh bìa |
| Quản lý chương | Thêm / sửa / xoá / ẩn-hiện từng chương |
| Quản lý thể loại | CRUD thể loại |
| Quản lý người dùng | Xem, khoá / mở khoá, đổi quyền |
| Quản lý bình luận | Xem, xoá bình luận |

---

## Công nghệ sử dụng

### Frontend (`02-fe`)

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Routing | React Router v7 |
| HTTP client | Axios (với interceptor tự động đính kèm JWT) |
| UI | Bootstrap 5 + Bootstrap Icons |
| State | React Context API (`AuthContext`, `ReaderContext`) |
| Styling | Vanilla CSS (per-page prefix class) |

### Backend (`03-be`)

| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2/promise, connection pool) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| File upload | Multer (ảnh bìa, avatar) |
| Env | dotenv |

---

## Cài đặt & chạy

### Yêu cầu

- Node.js ≥ 18
- MySQL đang chạy, đã tạo database `qibao_db`

### 1. Backend

```bash
cd 03-be
npm install
```

Tạo file `.env` (xem phần [Biến môi trường](#biến-môi-trường)), rồi:

```bash
node app.js
```

Backend chạy tại `http://localhost:8080`

### 2. Frontend

```bash
cd 02-fe
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`

---

## Cấu trúc dự án

```
BTL-LTWeb-Story_Web/
├── 01-Tailieu/            # Tài liệu đặc tả yêu cầu
├── 02-fe/                 # React Frontend
│   └── src/
│       ├── api/           # Tầng gọi API (axiosConfig + các *Service.js)
│       ├── components/    # UI components dùng chung (Navbar, Avatar, StoryCover...)
│       ├── constants/     # Hằng số (storyStatus, roles...)
│       ├── context/       # AuthContext, ReaderContext
│       ├── layout/        # UserLayout, AdminLayout
│       ├── pages/         # Trang người dùng và admin
│       │   ├── auth/      # Login, Register
│       │   ├── user/      # Home, StoryList, StoryDetail, ReadChapter, Profile...
│       │   └── admin/     # Dashboard, ManageStories, ManageChapters...
│       ├── styles/        # CSS global + per-page
│       └── utils/
│           └── helpers.js # getImageUrl, formatDate, formatDateTime, getRelativeTime...
│
├── 03-be/                 # Node/Express Backend
│   ├── config/db.js       # MySQL connection pool (dateStrings, timezone +07:00)
│   ├── controllers/       # Business logic (story, chapter, user, auth, comment...)
│   ├── middleware/        # auth.js (JWT verify), upload.js (Multer), errorHandler.js
│   ├── models/            # ORM thủ công (Story, Chapter, User, Category, Comment...)
│   ├── routes/            # Định nghĩa API routes
│   ├── services/          # Service layer (StoryService — xử lý xóa file ảnh cũ...)
│   ├── public/
│   │   ├── covers/        # Ảnh bìa truyện (serve tại /uploads/covers)
│   │   └── avatars/       # Ảnh avatar (serve tại /avatars)
│   └── app.js             # Entry point Express
│
└── Postman_Collections/   # Bộ API test (Qibao_Story_Web_APIs.json)
```

---

## API Endpoints

Base URL: `http://localhost:8080/api`

### Auth
| Method | Path | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản mới |
| POST | `/auth/login` | Đăng nhập, trả về JWT |

### Truyện (Stories)
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/stories` | — | Danh sách truyện công khai |
| GET | `/stories/:id/detail` | — | Chi tiết truyện + danh sách chương |
| GET | `/stories/admin/all` | Admin | Tất cả truyện (kể cả ẩn) |
| GET | `/stories/:id` | Admin | Chi tiết truyện cho Admin |
| POST | `/stories` | Admin | Tạo truyện mới (multipart/form-data) |
| PUT | `/stories/:id` | Admin | Cập nhật truyện |
| DELETE | `/stories/:id` | Admin | Xóa truyện |
| PATCH | `/stories/:id/toggle` | Admin | Ẩn / hiện truyện |

### Chương (Chapters)
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/stories/:id/chapters` | — | Danh sách chương |
| GET | `/stories/:id/chapters/:cid` | — | Chi tiết chương |
| POST | `/stories/:id/chapters` | Admin | Thêm chương mới |
| PUT | `/stories/:id/chapters/:cid` | Admin | Sửa chương |
| DELETE | `/stories/:id/chapters/:cid` | Admin | Xóa chương |
| PATCH | `/stories/:id/chapters/:cid/toggle` | Admin | Ẩn / hiện chương |

### Người dùng, Thể loại, Bình luận, Thống kê
> Xem chi tiết trong `Postman_Collections/Qibao_Story_Web_APIs.json`

---

## Biến môi trường

Tạo file `03-be/.env`:

```env
PORT=8080

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qibao_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Frontend origin (CORS)
CLIENT_URL=http://localhost:5173
```
