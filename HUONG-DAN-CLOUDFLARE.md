# Đưa web lên Cloudflare

## Trước hết: Pages hay Workers?

Cloudflare có hai chỗ chạy web và tên gọi dễ nhầm:

| | Cách cũ (`next-on-pages`) | **Cách đang dùng (`@opennextjs/cloudflare`)** |
|---|---|---|
| Chạy trên | Cloudflare Pages | Cloudflare Workers + Static Assets |
| Yêu cầu mã nguồn | Mọi route phải khai `runtime = "edge"` | Không phải sửa route nào |
| Trạng thái | Cloudflare không còn khuyến nghị | Cách chính thức hiện nay |

Trong bảng điều khiển Cloudflare, cả hai nằm chung mục **Workers & Pages**, nên
nói "đưa lên Pages" hay "đưa lên Workers" thì vẫn là vào cùng một chỗ đó.

Dự án này đã cấu hình sẵn theo cách thứ hai — xem `wrangler.jsonc` và
`open-next.config.ts`.

---

## Kết quả kiểm tra thật

Tôi đã chạy một Worker thử trên đúng runtime của Cloudflare để xem những API mà
phần đăng nhập của web đang dùng có hoạt động không:

| API | Kết quả |
|---|---|
| `scrypt` — băm mật khẩu | ✅ chạy được, ra đủ 64 byte |
| `createHmac` — ký phiên đăng nhập | ✅ |
| `timingSafeEqual` — so sánh chống dò | ✅ |
| `randomUUID` — sinh id tài khoản | ✅ |
| `node:fs` — ghi file kho `.data/` | ❌ `fs.mkdir is not implemented` |

**Kết luận: toàn bộ phần bảo mật chạy được trên Cloudflare. Chỉ kho file là không.**

Vì vậy **bắt buộc phải có `DATABASE_URL`** khi chạy trên Cloudflare. Không có thì
đăng nhập, đăng ký và lưu đơn đều hỏng. Mã đã được sửa để báo đúng câu nguyên
nhân thay vì ném ra lỗi khó hiểu của hệ thống.

---

## Những gì đã sửa để chạy được

**1. Adapter Prisma tự đổi theo nơi chạy.** Cloudflare không có kết nối TCP kiểu
Node nên gói `pg` không dùng được ở đó. `lib/auth/db.ts` giờ tự nhận biết:

```
Chạy trên máy / Vercel  →  @prisma/adapter-pg    (TCP)
Chạy trên Cloudflare    →  @prisma/adapter-neon  (WebSocket)
```

Hai adapter được nạp bằng `await import` chứ không nhập ở đầu file, để lúc đóng
gói cho Cloudflare thì `pg` không bị nhét vào bundle.

**2. Xoá trang tải ảnh.** `app/tai-anh` và `app/api/tai-anh` dùng
`child_process` để chạy lệnh quét ảnh — Cloudflare không có tính năng chạy tiến
trình con. Đây cũng là thứ vốn phải xoá trước khi chạy thật.

**3. Báo lỗi rõ khi không ghi được file.** `lib/auth/kho.ts` nhận biết môi
trường Cloudflare và ném ra câu tiếng Việt chỉ đúng cách sửa.

---

## Các bước đưa lên

### 1. Chuẩn bị cơ sở dữ liệu

Làm theo `HUONG-DAN-DATABASE.md` trước. Trên Cloudflare thì **Neon là lựa chọn
hợp nhất** vì adapter WebSocket được viết riêng cho Neon.

### 2. Chạy thử trên máy

```bash
npm run cf:build     # đóng gói theo chuẩn Cloudflare
npm run cf:thu       # chạy thử bằng đúng runtime Workers
```

> **Nếu `cf:build` báo `EPERM: operation not permitted, symlink`:**
> Windows không cho tạo symlink khi chưa bật Developer Mode.
> Vào **Settings → Privacy & security → For developers → Developer Mode → Bật**,
> rồi chạy lại. Lỗi này chỉ xảy ra trên Windows; máy chủ build của Cloudflare
> chạy Linux nên không gặp.

### 3. Đăng nhập Cloudflare

```bash
npx wrangler login
```

Trình duyệt mở ra, bấm **Allow**.

### 4. Khai biến môi trường

Mỗi biến khai một lần, dán giá trị khi được hỏi:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put AUTH_SECRET
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_MAT_KHAU
```

Dùng `secret` chứ không phải `vars`: giá trị được mã hoá và không hiện lại trong
bảng điều khiển. `DATABASE_URL` chứa mật khẩu cơ sở dữ liệu nên không được để ở
dạng đọc được.

### 5. Đẩy lên

```bash
npm run cf:day
```

Xong sẽ hiện địa chỉ dạng `https://noithat-ht.<tài-khoản>.workers.dev`.

### 6. Gắn tên miền riêng

Trong bảng điều khiển Cloudflare: **Workers & Pages → noithat-ht → Settings →
Domains & Routes → Add → Custom domain**.

Tên miền phải đã được trỏ nameserver về Cloudflare.

Gắn xong nhớ khai thêm:

```bash
npx wrangler secret put NEXT_PUBLIC_SITE_URL   # https://tenmien.com
```

Thiếu biến này thì sitemap và thẻ chia sẻ mạng xã hội vẫn ghi tên miền cũ.

---

## Cách deploy tự động từ GitHub

Muốn mỗi lần `git push` là web tự cập nhật:

1. **Workers & Pages → Create → Workers → Import a repository**
2. Chọn kho `huytruong20/project-noithat`
3. Khai:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx wrangler deploy`
4. Thêm các biến môi trường ở mục **Variables and Secrets**, đánh dấu **Encrypt**
   cho `DATABASE_URL` và `AUTH_SECRET`

---

## Chưa kiểm được gì

Bước đóng gói `opennextjs-cloudflare build` **chưa chạy trọn vẹn trên máy này**
vì Windows chặn tạo symlink và máy không có quyền quản trị để bật Developer Mode.

Đã kiểm được:
- Build Next.js: ✅ 69 trang, không lỗi
- TypeScript: ✅ sạch
- Các API bảo mật trên runtime Cloudflare: ✅ chạy đúng (thử trực tiếp)

Chưa kiểm được:
- Bước gom file và nén thành Worker
- Truy vấn Prisma qua adapter Neon trên Workers thật

Hai việc này chỉ xác nhận được khi chạy `npm run cf:build` sau khi bật Developer
Mode, hoặc để máy chủ Linux của Cloudflare tự build. Gặp lỗi thì gửi tôi nguyên
văn thông báo.

---

## Nếu muốn nhàn hơn

Vercel là nơi làm ra Next.js nên không cần adapter, không cần đổi Prisma, không
cần `wrangler.jsonc`: nối GitHub, khai bốn biến môi trường, xong.

Cloudflare bù lại rẻ hơn khi lượng truy cập lớn và có sẵn CDN toàn cầu. Chọn nơi
nào cũng được — mã nguồn hiện chạy được cả hai.
