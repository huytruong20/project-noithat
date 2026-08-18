/**
 * Tên miền thật của website — dùng cho sitemap, canonical và thẻ chia sẻ mạng xã hội.
 * Đổi thành tên miền của bạn trước khi lên production, hoặc đặt biến môi trường
 * NEXT_PUBLIC_SITE_URL khi deploy.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://noithatht.vn";

export const site = {
  name: "Nội thất HT",
  tagline: "Nội thất gỗ cho nhà ở và văn phòng",
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
  commitmentHeading: "Chính sách rõ ràng – Bảo vệ quyền lợi khách hàng tuyệt đối.",

  /** Bốn cam kết, hiện ở khối nền đen trang chủ (đánh số 01 – 04) */
  commitments: [
    {
      title: "Bảo hành tới 5 năm – Bảo trì trọn đời",
      detail:
        "5 năm cho Gỗ tự nhiên & Da thật. 2 năm cho các chất liệu khác. Hỗ trợ chăm sóc sản phẩm không giới hạn thời gian.",
    },
    {
      title: "Lắp đặt tận nhà – Rác ra khỏi cửa",
      detail:
        "Freeship & miễn phí lắp đặt nội thành Gia Lai / TP.HCM. Kỹ thuật viên tự động hút bụi và thu dọn toàn bộ vỏ hộp, rác thải trước khi rời đi.",
    },
    {
      title: "Sai thông số – Hoàn tiền 100%",
      detail:
        "Minh bạch từ chất liệu, kích thước đến tải trọng. Bồi hoàn trọn vẹn giá trị nếu sản phẩm không đúng chuẩn công bố.",
    },
    {
      title: "Báo giá & Phối cảnh miễn phí trong 24h",
      detail:
        "Gửi mặt bằng, nhận giải pháp không gian tức thì. Không phí ẩn, không áp lực mua hàng.",
    },
  ],
};

export const mainNav = [
  { label: "Sản phẩm", href: "/danh-muc" },
  { label: "Bộ sưu tập", href: "/bo-suu-tap" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Liên hệ", href: "/lien-he" },
];
