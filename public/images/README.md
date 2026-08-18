# Đưa ảnh thật lên website

Có hai cách, dùng cách nào cũng được và **trộn lẫn cũng được**:

| Cách | Khi nào dùng | Làm ở đâu |
| --- | --- | --- |
| **A. Chép file vào máy** | Có sẵn file ảnh trong máy | Thư mục này, xem hướng dẫn bên dưới |
| **B. Dán link ảnh** | Ảnh đang ở Cloudinary, Drive, hosting khác | [`lib/data/anh-ben-ngoai.ts`](../../lib/data/anh-ben-ngoai.ts) |

Cách B không cần chép file, chỉ dán URL vào là xong. Hướng dẫn lấy link đúng
chuẩn (kể cả cách xử lý link Google Drive) nằm ngay trong file đó.

---

## Cách A — chép file vào máy

Website tự nhận ảnh theo **tên file**. Bạn chỉ cần chép ảnh vào đúng thư mục và
đặt tên đúng — không phải sửa một dòng code nào.

## Làm 3 bước

**Bước 1 — Mở [DANH-SACH-ANH-CAN-CHUP.md](DANH-SACH-ANH-CAN-CHUP.md)**

File này liệt kê đầy đủ từng món đồ và tên file tương ứng, chia sẵn theo nhóm
(Sofa, Bàn ghế, Giường ngủ, Tủ & kệ…). Ô `[x]` là đã có ảnh, ô trống là còn thiếu.

**Bước 2 — Chép ảnh vào thư mục, đặt tên theo danh sách**

```
public/images/products/     ảnh sản phẩm
public/images/categories/   ảnh đại diện từng nhóm đồ
public/images/rooms/        ảnh không gian mẫu
public/images/projects/     ảnh dự án đã làm
public/images/blog/         ảnh bìa bài viết
```

**Bước 3 — Chạy `npm run dev`**

Script quét ảnh tự chạy trước khi khởi động. Xong là thấy ảnh trên web.

Muốn quét lại mà không khởi động lại server: `npm run anh`

## Quy tắc đặt tên

Lấy đúng **slug** của món đồ (có sẵn trong danh sách), thêm số thứ tự ảnh:

```
sofa-vang-mila-1.jpg    ảnh 1 — tổng thể
sofa-vang-mila-2.jpg    ảnh 2 — góc nghiêng
sofa-vang-mila-3.jpg    ảnh 3 — cận chất liệu
sofa-vang-mila-4.jpg    ảnh 4 — đặt trong không gian
```

Chỉ có một ảnh cũng được, đặt `sofa-vang-mila.jpg` là xong.

Bốn góc chụp trên là gợi ý theo đúng nhãn hiển thị dưới thư viện ảnh ở trang sản
phẩm. Chụp ít hơn 4 ảnh thì thư viện tự rút gọn theo số ảnh thật có.

## Kích thước nên dùng

| Loại ảnh | Tỉ lệ | Kích thước |
| --- | --- | --- |
| Sản phẩm | **1:1 (vuông)** | 1200 × 1200 px |
| Danh mục, không gian, dự án, bài viết | 3:2 (ngang) | 1600 × 1067 px |

Nhận `.jpg` `.png` `.webp` `.avif`. Nén dưới 300KB mỗi ảnh cho trang nhẹ.
Ảnh cắt theo kiểu `object-cover` nên để chủ thể nằm giữa khung.

## Thêm dần cũng được

Món nào chưa có ảnh vẫn dùng ảnh minh hoạ dựng sẵn, không bị vỡ layout. Bạn có
thể chụp và thêm từng nhóm một, không cần làm hết cùng lúc.

---

## Thứ tự ưu tiên khi website chọn ảnh

1. Ảnh khai báo tay trong `lib/data/products.ts` (trường `image` / `images`)
2. Link ảnh trong `lib/data/anh-ben-ngoai.ts` — **cách B**
3. File ảnh trong thư mục này — **cách A**
4. Không có gì thì vẽ ảnh minh hoạ dựng sẵn

Nghĩa là bạn có thể để phần lớn ảnh trên CDN, còn vài món chép file vào máy —
website tự chọn đúng nguồn cho từng món.
