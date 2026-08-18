/**
 * ẢNH LẤY TỪ ĐƯỜNG DẪN BÊN NGOÀI (CDN, hosting ảnh, website khác).
 *
 * Dán URL vào đây là xong — không cần chép file vào máy, không cần sửa chỗ nào khác.
 * Khoá là **slug** của món đồ, lấy trong public/images/DANH-SACH-ANH-CAN-CHUP.md
 *
 * Thứ tự ưu tiên khi website chọn ảnh:
 *   1. Ảnh khai báo tay trong products.ts (trường image / images)
 *   2. Ảnh trong file này
 *   3. Ảnh chép vào public/images/ (quét tự động theo tên file)
 *   4. Không có gì thì vẽ ảnh minh hoạ
 *
 * ⚠️ Link Google Drive dán thẳng KHÔNG hiện được ảnh — xem hướng dẫn ở cuối file.
 */

import type { ImageMap } from "@/lib/data/images.generated";

/* ---------------------------- SẢN PHẨM ---------------------------- */
/**
 * Mỗi sản phẩm nên có 4 ảnh theo đúng thứ tự:
 * tổng thể · góc nghiêng · cận chất liệu · đặt trong không gian
 * Có ít hơn 4 cũng được, thư viện ảnh tự rút gọn theo số ảnh thật.
 */
export const anhSanPham: ImageMap = {
  // Bỏ dấu // ở đầu dòng và thay bằng link của bạn:
  // "sofa-vang-mila": [
  //   "https://res.cloudinary.com/ten-cua-ban/image/upload/sofa-mila-1.jpg",
  //   "https://res.cloudinary.com/ten-cua-ban/image/upload/sofa-mila-2.jpg",
  //   "https://res.cloudinary.com/ten-cua-ban/image/upload/sofa-mila-3.jpg",
  //   "https://res.cloudinary.com/ten-cua-ban/image/upload/sofa-mila-4.jpg",
  // ],
  // "giuong-boc-nem-sora": ["https://.../giuong-sora.jpg"],
};

/* ------------------------- ẢNH DANH MỤC --------------------------- */
/** 8 nhóm đồ: sofa · ban-ghe · giuong · tu-ke · ban-an · trang-tri · van-phong · den-chieu-sang */
export const anhDanhMuc: ImageMap = {
  // "sofa": ["https://.../nhom-sofa.jpg"],
};

/* ------------------------ ẢNH KHÔNG GIAN -------------------------- */
/** 5 không gian: phong-khach · phong-ngu · phong-bep-an · phong-lam-viec · can-ho-nho */
export const anhKhongGian: ImageMap = {
  // "phong-khach": ["https://.../phong-khach.jpg"],
};

/* --------------------------- ẢNH DỰ ÁN ---------------------------- */
/** Ảnh đầu tiên là ảnh bìa, các ảnh sau vào album trong trang dự án */
export const anhDuAn: ImageMap = {
  // "can-ho-vinhomes-ocean-park-72m2": [
  //   "https://.../du-an-bia.jpg",
  //   "https://.../du-an-1.jpg",
  // ],
};

/* -------------------------- ẢNH BÀI VIẾT -------------------------- */
export const anhBaiViet: ImageMap = {
  // "do-dac-truoc-khi-mua-sofa": ["https://.../bia-bai-viet.jpg"],
};

/* ==========================================================================
 * HƯỚNG DẪN LẤY LINK ẢNH ĐÚNG CHUẨN
 * --------------------------------------------------------------------------
 * Link phải trỏ THẲNG tới file ảnh, mở trong tab mới thấy đúng tấm ảnh và
 * đuôi thường là .jpg / .png / .webp. Link trỏ tới trang xem ảnh thì không dùng được.
 *
 * ✅ ĐÚNG:  https://res.cloudinary.com/abc/image/upload/v1/sofa.jpg
 * ✅ ĐÚNG:  https://i.imgur.com/abc123.jpg
 * ❌ SAI:   https://drive.google.com/file/d/1AbC.../view
 *
 * --- Google Drive ---
 * Link chia sẻ mặc định là trang xem, không phải file ảnh. Cách đổi:
 *   1. Chuột phải ảnh → Chia sẻ → đổi thành "Bất kỳ ai có đường liên kết"
 *   2. Copy link, lấy phần ID nằm giữa /d/ và /view
 *      https://drive.google.com/file/d/【1AbCdEfGhIjK】/view
 *   3. Ghép thành:  https://lh3.googleusercontent.com/d/1AbCdEfGhIjK
 *
 * Lưu ý: Google Drive giới hạn lượt tải và có thể chặn khi nhiều người xem
 * cùng lúc. Chỉ nên dùng để xem thử. Chạy web bán hàng thật nên chuyển sang
 * Cloudinary (miễn phí 25GB) hoặc dịch vụ lưu ảnh tương tự.
 *
 * --- Dung lượng ảnh ---
 * Ảnh từ CDN không được website nén lại, tải nguyên bản. Ảnh máy ảnh thường
 * nặng 5–10MB sẽ làm trang rất chậm. Nén xuống dưới 300KB trước khi tải lên,
 * hoặc dùng Cloudinary có sẵn tham số tự nén, ví dụ thêm f_auto,q_auto:
 *   https://res.cloudinary.com/abc/image/upload/f_auto,q_auto,w_1200/sofa.jpg
 * ========================================================================== */

/* ==========================================================================
 * ẢNH CÒN WATERMARK CỦA ĐƠN VỊ KHÁC
 * --------------------------------------------------------------------------
 * Những ảnh này dùng tạm được ở trang danh sách, nhưng KHÔNG nên đưa lên khối
 * ảnh lớn đầu trang chủ — đó là chỗ khách nhìn đầu tiên, để lộ tên shop khác
 * ở đúng vị trí đó là bất lợi nhất.
 *
 * Thay được ảnh sạch rồi thì XOÁ slug tương ứng khỏi danh sách này, ảnh sẽ tự
 * được phép xuất hiện lại ở hero.
 * ========================================================================== */
export const anhCoWatermark: string[] = [
  "ghe-banh-hana", // JHOME FURNITURE — logo vàng góc phải
  "ke-tivi-thap-arda", // LÊ GIA INTERIOR DESIGN — góc phải
  "den-cay-doc-sach-arco", // AN TUONG — chữ vàng góc trái
  "ban-nang-ha-dien-altus", // GOVI — góc phải và giữa ảnh
  "bo-goi-tua-linen-mocha", // PASION — góc trái
  "ban-tra-hex-xep-tang", // FURNILAND — góc phải
  "ban-an-ceramic-mono", // logo nhỏ góc phải trên
];
