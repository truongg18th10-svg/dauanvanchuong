# Bật đăng nhập & phân quyền (Firebase)

Trang cần được đưa lên hosting (Netlify, GitHub Pages, Firebase Hosting…). Firebase Auth không chạy khi mở file trực tiếp (file://).

## 1. Tạo dự án Firebase (gói Spark miễn phí đủ dùng)
1. Vào https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started → Email/Password → Enable**.
3. **Authentication → Settings → Authorized domains**: thêm tên miền trang web của bạn.
4. **Build → Firestore Database → Create database** (production mode).
5. **Firestore → Rules**: dán toàn bộ nội dung file `firestore.rules` → **Publish**.
6. **Project settings → Your apps → Web (</>)**: đăng ký ứng dụng, chép `apiKey`, `authDomain`, `projectId`, `appId` vào `firebase-config.js`.

## 2. Tạo tài khoản super admin (chính bạn)
1. **Authentication → Users → Add user**: nhập email + mật khẩu của bạn, chép **User UID**.
2. **Firestore → Start collection** `users` → Document ID = **User UID** vừa chép, các trường:
   - `email` (string) = email của bạn
   - `name` (string) = tên hiển thị
   - `role` (string) = `superadmin`
3. Mở trang web → **Đăng nhập** → bạn sẽ thấy bảng quản trị với tab **Thành viên**.

## 3. Cấp vai trò cho người khác
Người cộng tác bấm **Đăng nhập → Chưa có tài khoản? Đăng ký**. Họ vào ở mức "Chờ cấp quyền"; bạn mở **Bảng quản trị → Thành viên** và chọn vai trò.

| Vai trò | Quyền |
|---|---|
| Super Admin | Mọi quyền, cấp/đổi vai trò người khác |
| Admin | Duy nhất (cùng Super Admin) có quyền duyệt: đăng/sửa/xóa/duyệt nội dung, duyệt cảm nhận, xem danh sách thành viên |
| Giáo viên | Như Người viết nội dung: gửi nội dung (chờ admin duyệt), sửa bài của mình |
| Người viết nội dung | Gửi nội dung (chờ admin duyệt), sửa bài của mình |
| Học sinh (không tài khoản) | Đọc nội dung, gửi cảm nhận (chờ duyệt) |

## Ghi chú
- Khi chưa điền `firebase-config.js`, trang vẫn chạy như cũ và cảm nhận vẫn gửi qua Google Apps Script hiện có. Cảm nhận cũ trong Google Sheet **không** tự chuyển sang Firestore.
- Nội dung do staff thêm sẽ hiển thị trong thư viện theo khối lớp; nếu trùng tên bài có sẵn thì thay phần đọc của bài đó.
- Nên bật **App Check** (Firebase) để hạn chế người gửi cảm nhận rác.
