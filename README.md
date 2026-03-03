# QIBAO — Web Đọc Truyện Trực Tuyến

Bài tập lớn môn Lập Trình Web — PTIT  
Frontend được xây dựng bằng **React 19 + Vite 7**, dùng **React Router v7**, **Bootstrap 5** và dữ liệu mock (chưa kết nối backend).

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
| Framework | React 19 |
| Build tool | Vite 7 |
| Routing | React Router v7 |
| UI | Bootstrap 5 + Bootstrap Icons |
| State | React Context API |
| Dữ liệu | Mock data (constants/mockData.js) |
| Lưu trữ local | localStorage (tủ sách, lịch sử đọc) |

---

## Cài đặt & chạy

```bash
cd 02-fe
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## Cấu trúc thư mục

```
02-fe/
├── public/
│   └── covers/               # Ảnh bìa truyện (serve tĩnh)
├── package.json
├── vite.config.js
├── index.html
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
    │   ├── mockData.js        # Nguồn dữ liệu duy nhất (STORIES_MOCK, USERS_MOCK...)
    │   ├── categories.js      # Danh sách thể loại + màu sắc
    │   ├── storyStatus.js     # Mapping trạng thái truyện
    │   └── roles.js           # Định nghĩa quyền (user/admin)
    │
    ├── context/
    │   ├── AuthContext.jsx    # Quản lý trạng thái đăng nhập (currentUser)
    │   └── ReaderContext.jsx  # Tủ sách + lịch sử đọc (lưu localStorage)
    │
    ├── layout/
    │   ├── UserLayout.jsx     # Layout người dùng: Navbar + Outlet + Footer
    │   └── AdminLayout.jsx    # Layout admin: Navbar + AdminSidebar + Outlet
    │
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx/css         # Thanh điều hướng (sticky, dùng chung admin+user)
    │   │   ├── Avatar.jsx             # Component avatar dùng chung toàn app
    │   │   ├── StoryCover.jsx         # Component ảnh bìa truyện dùng chung toàn app
    │   │   ├── StoryCard.jsx/css      # Card truyện ngang, skeleton, related card
    │   │   ├── StoryTag.jsx/css       # Badge thể loại
    │   │   ├── GenreSelect.jsx        # Dropdown chọn thể loại có tìm kiếm
    │   │   └── ConfirmDeleteModal.jsx # Modal xác nhận xoá
    │   │
    │   └── admin/
    │       └── AdminSidebar.jsx       # Sidebar điều hướng admin
    │
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── user/
    │   │   ├── Home.jsx
    │   │   ├── StoryList.jsx/css
    │   │   ├── StoryDetail.jsx/css
    │   │   ├── ReadChapter.jsx/css
    │   │   ├── SearchPage.jsx
    │   │   ├── CategoryPage.jsx
    │   │   ├── Profile.jsx/css
    │   │   ├── story-detail/
    │   │   │   ├── IntroTab.jsx
    │   │   │   ├── ChapterListTab.jsx
    │   │   │   └── CommentTab.jsx/css
    │   │   └── profile/
    │   │       ├── ProfileSidebar.jsx
    │   │       ├── PersonalInfo.jsx
    │   │       ├── ChangePassword.jsx
    │   │       ├── Library.jsx
    │   │       └── ReadingHistory.jsx
    │   │
    │   └── admin/
    │       ├── Dashboard.jsx
    │       ├── story/  (ManageStories, AddStory, EditStory, StoryDetailAdmin)
    │       ├── chapter/ (AddChapter, EditChapter)
    │       ├── category/ (ManageCategories)
    │       ├── user/ (ManageUsers)
    │       └── comment/ (ManageComments)
    │
    ├── styles/
    │   ├── index.css          # Reset CSS, base styles
    │   ├── App.css            # Global styles, override Bootstrap
    │   └── theme.css          # CSS variables: màu sắc, dark theme
    │
    └── utils/
        └── helpers.js         # Hàm tiện ích (getAvatarColor, getCoverGradientIndex)
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
