/**
 * Tên miền thật của website — dùng cho sitemap, canonical và thẻ chia sẻ mạng xã hội.
 * Đổi thành tên miền của bạn trước khi lên production, hoặc đặt biến môi trường
 * NEXT_PUBLIC_SITE_URL khi deploy.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://noithatht.vn";

export const site = {
  name: "Nội thất HT",
  tagline: "Đóng đồ gỗ theo số đo nhà bạn",
  hotline: "0931 619 177",
  hotlineHref: "tel:0931619177",
  email: "lienhe@noithatht.vn",
  workingHours: "8:00 – 20:00, tất cả các ngày trong tuần",
  showrooms: [
    {
      city: "Gia Lai",
      address: "Tổ 1, Thành An, An Khê, tỉnh Gia Lai",
      phone: "0931 619 177",
      hours: "8:00 – 20:00 hằng ngày",
    },
    {
      city: "TP. Hồ Chí Minh",
      address: "Tân Bình, TP.HCM",
      phone: "028 6060 6060",
      hours: "8:00 – 20:00 hằng ngày",
    },
  ],
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Zalo", href: "https://zalo.me" },
  ],
  /** Tiêu đề khối cam kết ở trang chủ */
  commitmentHeading: "Bốn điều chúng tôi ghi thành văn bản, không nói miệng.",

  /** Bốn cam kết, hiện ở khối nền đen trang chủ (đánh số 01 – 04) */
  commitments: [
    {
      title: "Bảo hành 5 năm, sửa vặt cả đời",
      detail:
        "Gỗ tự nhiên và da thật: 5 năm. Chất liệu khác: 2 năm. Hết hạn rồi vẫn gọi được thợ tới siết ốc, chỉnh cánh — chúng tôi không tính công.",
    },
    {
      title: "Lắp xong dọn sạch mới về",
      detail:
        "Nội thành Gia Lai và TP.HCM: không tính tiền giao, không tính tiền lắp. Thợ trải bạt trước khi làm, hút bụi và mang hết thùng xốp đi khi xong.",
    },
    {
      title: "Đo lại thấy sai, trả đủ tiền",
      detail:
        "Kích thước, loại gỗ, tải trọng đều ghi trên trang sản phẩm. Bạn cầm thước đo lại, lệch so với công bố thì chúng tôi hoàn 100%, không trừ khoản nào.",
    },
    {
      title: "Gửi mặt bằng, 24 giờ có bản vẽ",
      detail:
        "Chụp phòng hoặc gửi bản vẽ căn hộ, chúng tôi dựng phối cảnh và báo giá trong một ngày làm việc. Xem xong không mua cũng không sao.",
    },
  ],
};

export const mainNav = [
  { label: "Sản phẩm", href: "/danh-muc" },
  { label: "Bộ sưu tập", href: "/bo-suu-tap" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Liên hệ", href: "/lien-he" },
];
