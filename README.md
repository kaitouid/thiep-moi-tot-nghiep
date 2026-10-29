# Thiệp mời tốt nghiệp — Nguyen

Website thiệp mời tốt nghiệp có hiệu ứng mũ tốt nghiệp 3D bằng Three.js, phong cách giấy ấm áp và màu xanh lá dịu. Toàn bộ nội dung hiển thị được viết bằng tiếng Việt. Không cần máy chủ, tài khoản khách mời hay cơ sở dữ liệu.

## 1. Chạy trên máy cá nhân

Cần Node.js 20.19+ hoặc 22.12+.

```bash
npm install
npm run dev
```

Mở địa chỉ localhost mà Vite hiển thị trong terminal.

## 2. Chỉnh thông tin buổi lễ

Mở `src/main.js` và chỉnh đối tượng `EVENT` ở đầu tệp:

- `graduateName`: tên người tốt nghiệp.
- `date`: ngày hiển thị trên thiệp.
- `time`: giờ hiển thị.
- `dateTime`: ngày giờ dùng cho đồng hồ đếm ngược, theo định dạng ISO có múi giờ Việt Nam `+07:00`.
- `venue`, `address`, `mapsUrl`: địa điểm và đường dẫn bản đồ.
- `rsvpEmail`: email nhận xác nhận. Nếu để trống, nút xác nhận sẽ hướng dẫn khách liên hệ trực tiếp; website không giả vờ lưu câu trả lời.

Thông tin đang điền theo nội dung bạn gửi: Nguyễn Minh Anh, 08:30 sáng Thứ Bảy 12/12/2026, Hội trường lớn, Đại học FPT TP.HCM (Khu Công nghệ cao, Thủ Đức). Vui lòng kiểm tra lại địa điểm chính xác trước khi chia sẻ.

## 3. Tạo liên kết riêng cho từng khách

Sau khi xuất bản, thêm tên khách vào tham số `to`:

- `https://TEN-TAI-KHOAN.github.io/TEN-KHO/` (thiệp chung)
- `https://TEN-TAI-KHOAN.github.io/TEN-KHO/?to=Minh`
- `https://TEN-TAI-KHO.github.io/TEN-KHO/?to=Lan`
- `https://TEN-TAI-KHO.github.io/TEN-KHO/?to=Th%E1%BA%A7y%20An`

Tên khách chỉ nằm trong liên kết và được hiển thị trên trình duyệt. Website không lưu danh sách khách hay theo dõi ai đã mở thiệp. Người nhận có thể nhìn thấy tên trong URL nếu họ chuyển tiếp liên kết.

## 4. Đưa website lên GitHub Pages miễn phí

1. Tạo một repository mới trên GitHub, ví dụ `thiep-moi-tot-nghiep`.
2. Đưa toàn bộ tệp trong thư mục này lên repository, gồm `package.json`, `index.html`, `vite.config.js`, `src/` và `.github/`.
3. Trên GitHub, mở **Settings → Pages**.
4. Ở phần **Build and deployment**, chọn **GitHub Actions** làm nguồn triển khai.
5. Đẩy mã lên nhánh `main`. Workflow sẽ tự cài thư viện, build và triển khai website.
6. Khi GitHub Actions hoàn tất, đường dẫn website sẽ xuất hiện ở **Settings → Pages**.

### Cách đẩy mã bằng Git trên Mac

Mở Terminal trong thư mục dự án và chạy (thay URL bằng repository của bạn):

```bash
git init
git add .
git commit -m "Tạo thiệp mời tốt nghiệp tiếng Việt"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN/thiep-moi-tot-nghiep.git
git push -u origin main
```

Nếu thư mục đã là Git repository hoặc đã có remote, không chạy lại `git init`/`git remote add`; chỉ commit và push theo cấu hình hiện có.

## 5. Xác nhận tham dự và quyền riêng tư

- Không có cơ sở dữ liệu hoặc backend.
- Khi `rsvpEmail` được điền, nút xác nhận sẽ mở ứng dụng email của khách với nội dung soạn sẵn; khách cần tự gửi email.
- Nếu `rsvpEmail` để trống, nút chỉ hiện thông báo hướng dẫn liên hệ trực tiếp.
- Không có danh sách theo dõi khách đã xác nhận hay đã xem thiệp.
- Hiệu ứng mũ tốt nghiệp và các hạt sáng được tạo bằng Three.js, không cần tải mô hình 3D riêng.
