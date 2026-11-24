// Điền thông tin lấy từ Firebase Console → Project settings → Your apps (Web).
// (apiKey của Firebase không phải bí mật; việc bảo vệ dữ liệu nằm ở firestore.rules)
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAw4SnaB8ibwxLZp9Oi0lPUWYU3cQhmpgs',
  authDomain: 'dauanvanchuong.firebaseapp.com',
  projectId: 'dauanvanchuong',
  appId: '1:132815796710:web:3f526a05bb8db12de67e27'
};
// Khi đã điền cấu hình, cảm nhận của học sinh sẽ lưu vào Firestore thay vì Google Apps Script.
window.USE_FIREBASE_REFLECTIONS = !/^PASTE_/.test(window.FIREBASE_CONFIG.apiKey);