---
name: add-product-images
description: >-
  Tải hoặc copy ảnh thật vào đúng thư mục public/images và cập nhật trường
  image/images trong lib/data/*.ts theo slug. Dùng khi user gửi link ảnh,
  file ảnh, hoặc yêu cầu thay placeholder bằng ảnh thật.
---

# Ghép ảnh thật — không sai định vị

## Nguyên tắc bắt buộc

1. **Slug là khóa duy nhất** — tên file ảnh phải bắt đầu bằng `slug` trong file dữ liệu, không đoán tên.
2. **Đường dẫn trong code** luôn bắt đầu bằng `/images/...`, **không** có `public/`.
3. **Hai bước luôn đi cùng nhau**: (A) file nằm trong `public/images/...` → (B) cùng đường dẫn được ghi trong `lib/data`.
4. Chỉ sửa trường `image` / `images` của đúng bản ghi `slug`; không đổi component UI.

## Bảng thư mục theo loại nội dung

| Loại | Thư mục file | File dữ liệu | Trường |
|------|--------------|--------------|--------|
| Sản phẩm | `public/images/products/` | `lib/data/products.ts` | `image`, `images[]` |
| Không gian | `public/images/rooms/` | `lib/data/categories.ts` → `roomCollections` | `image` |
| Dự án | `public/images/projects/` | `lib/data/projects.ts` | `image`, `images[]` |
| Bài viết | `public/images/blog/` | `lib/data/posts.ts` | `image` |

## Quy tắc đặt tên file

```
/images/{products|rooms|projects|blog}/{slug}[-{suffix}].{jpg|jpeg|webp|png}
```

- `{slug}` = đúng `slug` trong dữ liệu (vd. `sofa-vang-mila`, `phong-khach`).
- Ảnh đại diện: `{slug}.jpg` hoặc `{slug}-1.jpg`.
- Thư viện / album: `{slug}-1.jpg`, `{slug}-2.jpg`, … (số tăng dần, cùng thứ tự trong `images[]`).
- Chỉ chữ thường, số, gạch ngang; **không** dấu, **không** khoảng trắng.

Ví dụ sản phẩm `sofa-vang-mila`:

| File trên disk | Trong `products.ts` |
|----------------|---------------------|
| `public/images/products/sofa-vang-mila-1.jpg` | `image: "/images/products/sofa-vang-mila-1.jpg"` |
| `public/images/products/sofa-vang-mila-2.jpg` | phần tử thứ 2 của `images` |

## Quy trình thực hiện (theo thứ tự)

### Bước 0 — Xác định slug

Đọc `slug` trong file dữ liệu tương ứng. **Không** tự đặt tên khác slug.

### Bước 1 — Tạo thư mục (nếu chưa có)

```
public/images/products/
public/images/rooms/
public/images/projects/
public/images/blog/
```

### Bước 2 — Lưu file ảnh

- Copy hoặc tải ảnh vào đúng thư mục theo bảng trên.
- Sau bước này, kiểm tra file tồn tại trên disk trước khi sửa TS.

### Bước 3 — Cập nhật dữ liệu

**Sản phẩm** (`lib/data/products.ts`):

```ts
image: "/images/products/{slug}-1.jpg",
images: [
  "/images/products/{slug}-1.jpg",
  "/images/products/{slug}-2.jpg",
],
```

- Có `images[]` thì component bỏ qua `views` (placeholder).
- Ảnh đại diện = phần tử đầu `images` hoặc trùng `image`.

**Không gian** — trong object `roomCollections`:

```ts
image: "/images/rooms/{slug}.jpg",
```

**Dự án** / **Bài viết** — tương tự với thư mục `projects/` hoặc `blog/`.

### Bước 4 — Kiểm tra (bắt buộc)

- [ ] File có tại `public` + đường dẫn đã ghi (vd. `public/images/products/sofa-vang-mila-1.jpg`).
- [ ] Chuỗi trong TS khớp: `/images/products/sofa-vang-mila-1.jpg` (không `public/`, không thiếu `/` đầu).
- [ ] `slug` trong tên file = `slug` trong object dữ liệu.
- [ ] Mọi phần tử `images[]` đều có file tương ứng.
- [ ] CDN: nếu dùng URL ngoài, host đã có trong `next.config.mjs` → `images.remotePatterns`.

### Bước 5 — Dev server

Gợi ý user chạy `npm run dev` và mở trang liên quan để xác nhận ảnh hiển thị.

## Lỗi thường gặp — không được phép

| Sai | Đúng |
|-----|------|
| Chỉ copy file, không sửa `lib/data` | Luôn cập nhật `image` / `images` |
| `public/images/...` trong TS | `/images/...` |
| Tên file không khớp slug | Lấy slug từ dữ liệu rồi đặt tên file |
| Ảnh hero / sản phẩm lẫn thư mục | Đúng cột trong bảng thư mục |
| Ghi `images` nhưng thiếu file `-2`, `-3` | Mỗi phần tử mảng phải có file |

## Nhiều ảnh một lượt

1. Liệt kê từng cặp `(slug, loại: product|room|project|post)`.
2. Với mỗi slug: lưu file → cập nhật một object trong đúng file data.
3. Cuối cùng chạy checklist Bước 4 cho toàn bộ slug.

## Tham chiếu

Chi tiết kích thước ảnh và CDN: `public/images/README.md`.
