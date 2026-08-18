# Bật cơ sở dữ liệu

Website chạy được ở **hai chế độ**, tự chuyển đổi theo biến `DATABASE_URL`:

| | Chưa đặt `DATABASE_URL` | Đã đặt `DATABASE_URL` |
|---|---|---|
| Dữ liệu nằm ở | Thư mục `.data/` trên máy | PostgreSQL |
| Dùng khi nào | Chạy thử trên máy cá nhân | **Bắt buộc khi chạy thật** |
| Số tài khoản chịu được | Vài chục | Không giới hạn thực tế |

Hiện tại đang ở chế độ file. Làm 4 bước dưới đây là chuyển sang Postgres —
**không phải sửa một dòng mã nào.**

---

## Bước 1 — Tạo cơ sở dữ liệu

Vào **neon.tech**, đăng ký (miễn phí), bấm **Create project**.

Chọn vùng **Singapore** hoặc **Tokyo** — gần Việt Nam nên mỗi truy vấn nhanh
hơn khoảng 150–200 mili giây so với chọn vùng Mỹ. Web bán hàng gọi database
nhiều lần mỗi trang nên chênh lệch này thấy được bằng mắt.

Tạo xong, copy chuỗi **Connection string**, dạng:

```
postgresql://ten:matkhau@ep-abc-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

> Supabase, Railway, Aiven đều dùng được. Chỉ cần là PostgreSQL.

---

## Bước 2 — Dán vào `.env.local`

Ở thư mục gốc dự án:

```bash
cp .env.example .env.local
```

Mở `.env.local`, điền hai dòng:

```env
DATABASE_URL="postgresql://... (chuỗi vừa copy)"
AUTH_SECRET="..."
```

Sinh `AUTH_SECRET` bằng lệnh:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**`AUTH_SECRET` là khoá ký phiên đăng nhập.** Đặt một lần rồi giữ nguyên mãi —
đổi nó là toàn bộ khách đang đăng nhập bị văng ra. Chưa đặt thì khoá nằm trong
`.data/`, mà thư mục đó sẽ mất khi deploy.

Nên đổi luôn tài khoản quản trị trong lúc này:

```env
ADMIN_EMAIL="email-that-cua-ban@gmail.com"
ADMIN_MAT_KHAU="mat-khau-dai-va-kho-doan"
```

---

## Bước 3 — Tạo bảng

```bash
npm run db:day
```

Lệnh này đọc `prisma/schema.prisma` rồi tạo hai bảng `nguoi_dung` và
`don_hang` trên Neon.

Muốn nhìn dữ liệu bằng giao diện:

```bash
npm run db:xem
```

---

## Bước 4 — Chạy lại

```bash
npm run dev
```

Lần chạy đầu tiên, hệ thống tự tạo tài khoản quản trị từ `ADMIN_EMAIL` /
`ADMIN_MAT_KHAU`. Vào `/dang-nhap` rồi `/admin` để kiểm tra.

**Dữ liệu cũ trong `.data/` không tự chuyển sang.** Đang chạy thử nên chỉ có
tài khoản và đơn hàng thử nghiệm; cần giữ lại thì mở file JSON chép tay vào
qua `npm run db:xem`.

---

## Deploy lên Vercel

Vào **Settings → Environment Variables**, khai lại từng biến trong `.env.local`
(Vercel không đọc file này).

Trước khi deploy, **xoá hai thư mục**:

```
app/tai-anh
app/api/tai-anh
```

Đó là công cụ tải ảnh dùng lúc dựng. Mã đã chặn nó ở chế độ production, nhưng
xoá hẳn vẫn chắc hơn.

---

## Cấu trúc mã

Toàn bộ truy cập dữ liệu đi qua **hai cửa duy nhất**:

```
lib/auth/nguoi-dung.ts          ← tài khoản
lib/auth/don-hang-may-chu.ts    ← đơn hàng
```

Mỗi cửa có hai bản chạy bên dưới:

```
nguoi-dung-file.ts     don-hang-file.ts      ← ghi file JSON
nguoi-dung-db.ts       don-hang-db.ts        ← Postgres
nguoi-dung-kieu.ts     don-hang-kieu.ts      ← kiểu dữ liệu dùng chung
```

Chọn bản nào là do đúng một dòng trong mỗi cửa:

```ts
const kho = dungPostgres ? khoNguoiDungDb : khoNguoiDungFile;
```

Kiểu `KhoNguoiDung` và `KhoDonHang` buộc hai bản chạy phải có đủ các hàm giống
nhau — thiếu một hàm là TypeScript báo lỗi ngay lúc build, không đợi tới khi
khách gặp lỗi.

**Trang, form, giao diện quản trị không hề biết dữ liệu nằm ở đâu.** Sau này
muốn đổi sang MySQL hay MongoDB thì viết thêm một bản chạy nữa, các phần khác
giữ nguyên.

---

## Sản phẩm thì sao?

Sản phẩm hiện nằm trong `lib/data/products.ts`, **không** nằm trong database.
Để nguyên vậy có hai cái lợi: trang sản phẩm được dựng sẵn lúc build nên tải
rất nhanh và Google đọc được ngay.

Đổi giá hay thêm mẫu thì sửa file rồi deploy lại.

Muốn **sửa sản phẩm ngay trên trang admin**, phải chuyển sản phẩm vào database.
Đây là việc lớn hơn cả 4 bước trên vì phải làm thêm: bảng sản phẩm, form thêm/
sửa, tải ảnh lên dịch vụ lưu trữ, và tính lại cách dựng trang tĩnh. Khi nào cần
thì làm sau, không vướng gì tới phần vừa dựng.
