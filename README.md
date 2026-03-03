# QIBAO — Web Đọc Truyện Trực Tuyến

Bài tập lớn môn Lập Trình Web — PTIT  
Frontend được xây dựng bằng **React + Vite**, dùng **React Router v6**, **Bootstrap 5** và dữ liệu mock (chưa kết nối backend).

---

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & chạy](#cài-đặt--chạy)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Luồng dữ liệu](#luồng-dữ-liệu)
- [Ghi chú](#ghi-chú)

---

## Tính năng

### Người dùng
- Trang chủ: banner truyện nổi bật, tác phẩm đề cử, mới hoàn thành, mới cập nhật
- Danh sách truyện: lọc theo trạng thái (tất cả / đang ra / đã hoàn), phân trang
- Chi tiết truyện: ảnh nền động theo bìa truyện, thông tin, danh sách chương, bình luận
- Đọc chương: điều hướng chương trước/sau, menu danh sách chương
- Tìm kiếm truyện theo từ khoá
- Lọc theo thể loại
- Tủ sách cá nhân (lưu truyện yêu thích)
- Lịch sử đọc (5 chương gần nhất)
- Hồ sơ cá nhân: thông tin, đổi mật khẩu, tủ truyện, lịch sử

### Quản trị (Admin)
- Dashboard thống kê
- Quản lý truyện: thêm, sửa, xoá, ẩn/hiện
- Quản lý chương: thêm, sửa, xoá
- Quản lý thể loại
- Quản lý người dùng
- Quản lý bình luận

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| UI | Bootstrap 5 + Bootstrap Icons |
| State | React Context API |
| Dữ liệu | Mock data (constants/mockData.js) |
| Lưu trữ local | localStorage (tủ sách, lịch sử đọc) |

---

## Cài đặt & chạy

```bash
cd 02-fe/qibao-react
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## Cấu trúc thư mục

```
02-fe/qibao-react/
├── public/
│   └── covers/               # Ảnh bìa truyện (serve tĩnh)
│
└── src/
    ├── main.jsx               # Entry point, bọc BrowserRouter + Providers
    ├── App.jsx                # ErrorBoundary + ScrollToTop + AppRoutes
    ├── routes.jsx             # Định nghĩa toàn bộ route
    │
    ├── api/                   # Tầng giao tiếp dữ liệu (hiện dùng mock)
    │   ├── http.js            # Hàm delay() giả lập latency mạng
    │   ├── storyService.js    # CRUD truyện
    │   ├── chapterService.js  # CRUD chương
    │   ├── categoryService.js # CRUD thể loại
    │   ├── commentService.js  # CRUD bình luận
    │   ├── userService.js     # CRUD người dùng
    │   ├── authService.js     # Đăng nhập / đăng ký
    │   └── statsService.js    # Thống kê dashboard
    │
    ├── constants/
    │   ├── mockData.js        # Toàn bộ dữ liệu mẫu (truyện, chương, bình luận...)
    │   ├── categories.js      # Danh sách thể loại + màu sắc
    │   ├── storyStatus.js     # Mapping trạng thái truyện (dangra/hoanthanh/tamngung)
    │   └── roles.js           # Định nghĩa quyền (user/admin)
    │
    ├── context/
    │   ├── AuthContext.jsx    # Quản lý trạng thái đăng nhập (currentUser)
    │   └── ReaderContext.jsx  # Tủ sách + lịch sử đọc (lưu localStorage)
    │
    ├── layout/
    │   ├── UserLayout.jsx     # Layout người dùng: Navbar + Outlet + Footer
    │   └── AdminLayout.jsx    # Layout admin: Navbar + Sidebar + Outlet
    │
    ├── components/
    │   ├── common/            # Components dùng chung cho cả user và admin
    │   │   ├── Navbar.jsx/css         # Thanh điều hướng trên (sticky)
    │   │   ├── StoryCard.jsx/css      # Card truyện ngang, skeleton, related card, pagination
    │   │   ├── StoryTag.jsx/css       # Badge thể loại
    │   │   ├── GenreSelect.jsx        # Dropdown chọn thể loại có tìm kiếm
    │   │   └── ConfirmDeleteModal.jsx # Modal xác nhận xoá
    │   │
    │   ├── admin/             # Components riêng cho trang admin
    │   │   ├── AdminSidebar.jsx  # Sidebar điều hướng admin
    │   │   ├── Header.jsx/css    # Header admin
    │   │   ├── Sidebar.jsx       # Sidebar phụ
    │   │   └── Content.jsx       # Wrapper nội dung admin
    │   │
    │   └── nguoi-dung/        # Components riêng cho trang người dùng
    │       ├── ThanhNavNguoiDung.jsx/css  # Thanh nav phụ người dùng
    │       └── Footer.jsx                # Footer
    │
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx      # Trang đăng nhập
    │   │   └── Register.jsx   # Trang đăng ký
    │   │
    │   ├── user/              # Các trang dành cho người đọc
    │   │   ├── Home.jsx                   # Trang chủ
    │   │   ├── StoryList.jsx/css          # Danh sách truyện + phân trang + lọc tab
    │   │   ├── StoryDetail.jsx/css        # Chi tiết truyện (hero ảnh bìa, tab)
    │   │   ├── ReadChapter.jsx/css        # Trang đọc chương
    │   │   ├── SearchPage.jsx             # Tìm kiếm
    │   │   ├── CategoryPage.jsx           # Danh sách thể loại
    │   │   ├── Profile.jsx/css            # Trang hồ sơ (bọc ProfileSidebar + outlet)
    │   │   │
    │   │   ├── story-detail/              # Sub-components của trang chi tiết truyện
    │   │   │   ├── IntroTab.jsx           # Tab giới thiệu & truyện liên quan
    │   │   │   ├── ChapterListTab.jsx     # Tab danh sách chương
    │   │   │   └── CommentTab.jsx/css     # Tab bình luận
    │   │   │
    │   │   └── profile/                   # Sub-pages của hồ sơ cá nhân
    │   │       ├── ProfileSidebar.jsx     # Sidebar menu hồ sơ
    │   │       ├── PersonalInfo.jsx       # Thông tin cá nhân
    │   │       ├── ChangePassword.jsx     # Đổi mật khẩu
    │   │       ├── Library.jsx            # Tủ truyện
    │   │       └── ReadingHistory.jsx     # Lịch sử đọc
    │   │
    │   └── admin/             # Các trang quản trị
    │       ├── Dashboard.jsx              # Thống kê tổng quan
    │       ├── story/
    │       │   ├── ManageStories.jsx      # Danh sách + tìm kiếm + lọc truyện
    │       │   ├── AddStory.jsx           # Thêm truyện mới
    │       │   ├── EditStory.jsx          # Sửa thông tin truyện
    │       │   └── StoryDetailAdmin.jsx   # Xem chi tiết truyện (admin view)
    │       ├── chapter/
    │       │   ├── AddChapter.jsx         # Thêm chương
    │       │   └── EditChapter.jsx        # Sửa chương
    │       ├── category/
    │       │   └── ManageCategories.jsx   # Quản lý thể loại
    │       ├── user/
    │       │   └── ManageUsers.jsx        # Quản lý người dùng
    │       └── comment/
    │           └── ManageComments.jsx     # Quản lý bình luận
    │
    ├── styles/
    │   ├── index.css          # Reset CSS, base styles
    │   ├── App.css            # Global styles, override Bootstrap
    │   └── theme.css          # CSS variables: màu sắc, spacing (dark theme)
    │
    └── utils/
        └── helpers.js         # Hàm tiện ích (getCoverGradientIndex...)
```

---

## Luồng dữ liệu

```
pages/ → api/*Service.js → constants/mockData.js
                ↑
        (sau này thay bằng fetch/axios gọi BE thật)
```

- **AuthContext**: lưu `currentUser` trong memory, dùng để kiểm tra role (admin/user), hiển thị nút "Chỉnh sửa truyện"
- **ReaderContext**: lưu `library` (tủ sách) và `readingHistory` vào `localStorage`, persist qua các lần reload
- Mọi service đều dùng `delay()` từ `http.js` để giả lập độ trễ mạng ~300ms

---

## Ghi chú

- Dữ liệu hiện tại 100% là mock, không có backend thật
- Để thêm truyện mới vào mock: chỉnh `STORIES_MOCK` trong `src/constants/mockData.js`
- Ảnh bìa để vào `public/covers/` rồi set `cover: '/covers/ten-file.jpg'` trong mockData
- Route `/stories/:storyid/chapters/first` và `/stories/:storyid/chapters/last` được xử lý trong `chapterService.js`
