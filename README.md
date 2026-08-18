# Nội thất HT — Website nội thất

Website bán nội thất gia đình và văn phòng, dựng bằng **Next.js 16 (App Router) +
React 19 + Tailwind CSS 4 + TypeScript**.

## Chạy dự án

```bash
npm install      # chỉ cần chạy lần đầu
npm run dev      # mở http://localhost:3000
npm run build    # build bản production
npm start        # chạy bản đã build
```

## Cấu trúc thư mục

```
app/                       Toàn bộ trang (App Router)
  page.tsx                 Trang chủ — 8 khối cuộn theo thứ tự
  danh-muc/                Danh sách sản phẩm + trang từng danh mục
  san-pham/[slug]/         Chi tiết sản phẩm
  gio-hang/                Giỏ hàng
  thanh-toan/              Thanh toán + màn hình cảm ơn
  bo-suu-tap/              Bộ sưu tập theo không gian (phòng mẫu)
  du-an/                   Dự án thực tế / case study
  blog/                    Bài viết tư vấn
  ve-chung-toi/            Giới thiệu
  lien-he/                 Liên hệ + form tư vấn + FAQ
  chinh-sach/[slug]/       5 trang chính sách
  tra-cuu-don/             Tra cứu đơn hàng
  tim-kiem/                Kết quả tìm kiếm

components/                Thành phần giao diện dùng lại
lib/data/                  Dữ liệu sản phẩm, danh mục, dự án, blog, chính sách
lib/cart.tsx               Giỏ hàng (React Context + localStorage)
lib/orders.ts              Lưu / tra cứu đơn hàng
public/images/             Nơi bỏ ảnh thật — xem README trong thư mục đó
```

## Sửa nội dung ở đâu

| Muốn đổi                      | Sửa file                    |
| ----------------------------- | --------------------------- |
| Sản phẩm, giá, thông số        | `lib/data/products.ts`      |
| Danh mục & bộ sưu tập không gian | `lib/data/categories.ts`  |
| Dự án đã làm                   | `lib/data/projects.ts`      |
| Bài viết blog                  | `lib/data/posts.ts`         |
| Nội dung các trang chính sách  | `lib/data/policies.ts`      |
| Tên shop, hotline, địa chỉ, menu | `lib/site.ts`             |
| Màu sắc, font, nút bấm         | `app/globals.css`           |
| Phí vận chuyển theo khu vực    | `lib/cart.tsx` (`shippingFee`) |

**Ảnh:** tất cả ảnh hiện là placeholder vẽ bằng SVG. Xem
[`public/images/README.md`](public/images/README.md) để biết cách chép ảnh thật vào
và điền đường dẫn — không cần sửa giao diện.

## Hệ thống thiết kế

Sửa toàn bộ ở [`app/globals.css`](app/globals.css) — các trang chỉ dùng lại token,
không hardcode màu.

**Màu** — nền trung tính, chữ đen, đúng **một màu nhấn**:

| Vai trò | Token | Mã màu |
| --- | --- | --- |
| Nền chính | `bone` | `#faf7f2` |
| Nền phụ | `sand` | `#f2ece2` |
| Đường kẻ | `line` | `#e5ddd1` |
| Chữ chính | `ink` | `#1c1a17` |
| Chữ phụ | `muted` | `#6f6559` |
| **Màu nhấn** | `walnut` | `#8a5a3b` |
| Trạng thái giảm giá | `clay` | `#b4552f` |
| Trạng thái thành công | `sage` | `#5f6b53` |

`clay` và `sage` chỉ dùng để báo trạng thái, không dùng trang trí.

**Chữ** — body 16px / line-height 1.6:

- Chữ đọc: **Be Vietnam Pro** (thiết kế riêng cho tiếng Việt, dấu không chồng chữ)
- Tiêu đề: **Playfair Display**
- Giá tiền: class `.price` — luôn dùng font sans và chữ số đều bề ngang

**Ảnh** — hai tỉ lệ duy nhất:

| Loại | Tỉ lệ | Dùng ở |
| --- | --- | --- |
| Sản phẩm | **1:1 (vuông)** | thẻ sản phẩm, thư viện ảnh, hero |
| Không gian / dự án / blog | **3:2** | bộ sưu tập, lookbook, ảnh bìa bài viết |

Mỗi sản phẩm có **4 góc chụp chuẩn**, xếp đúng thứ tự này trong `product.images`:

1. Tổng thể · 2. Góc nghiêng · 3. **Cận chất liệu** · 4. **Trong không gian**

## SEO

Đã có sẵn: `sitemap.xml`, `robots.txt`, thẻ canonical, OpenGraph/Twitter card, và
dữ liệu có cấu trúc schema.org (`FurnitureStore`, `Product` kèm giá và đánh giá,
`Article`, `BreadcrumbList`).

**Trước khi lên production**, đổi tên miền trong [`lib/site.ts`](lib/site.ts)
(`siteUrl`) hoặc đặt biến môi trường:

```
NEXT_PUBLIC_SITE_URL=https://tenmiencuaban.vn
```

## Trạng thái hiện tại

Đây là bản **front-end hoàn chỉnh, chưa nối backend**. Cụ thể:

- Giỏ hàng lưu ở `localStorage`, không mất khi tải lại trang.
- Đơn hàng đặt qua checkout và "đặt hàng nhanh" cũng lưu ở `localStorage` để trang
  Tra cứu đơn có dữ liệu thật mà xem.
- Form liên hệ hiện thông báo thành công nhưng chưa gửi đi đâu.

### Khi nối backend cần sửa những chỗ này

1. `lib/orders.ts` — thay `saveOrder` / `findOrders` bằng lời gọi API.
2. `components/contact/ContactForm.tsx` — gửi form về API thay vì chỉ đổi state.
3. `lib/data/products.ts` — thay mảng tĩnh bằng dữ liệu từ CMS hoặc API.
4. Cổng thanh toán (VNPay / MoMo) — nối vào bước `placeOrder` trong
   `app/thanh-toan/page.tsx`.

Phần giao diện được viết tách khỏi nguồn dữ liệu nên bốn thay đổi trên không ảnh
hưởng tới các file component.
