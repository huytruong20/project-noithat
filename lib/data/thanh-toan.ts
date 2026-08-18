/**
 * PHƯƠNG THỨC THANH TOÁN
 *
 * Sửa số tài khoản, danh sách ngân hàng trả góp và hạn mức COD ở file này —
 * cả trang thanh toán lẫn trang chính sách đều đọc từ đây, không phải sửa hai nơi.
 */

/** Đơn từ mức này trở lên không cho chọn COD nữa. */
export const hanMucCOD = 30_000_000;

/** Đơn phải đạt mức này mới bật được trả góp. */
export const toiThieuTraGop = 3_000_000;

export type MaThanhToan = "cod" | "chuyen-khoan" | "the" | "tra-gop" | "vi-dien-tu";

/*
  Muốn ưu đãi riêng cho một hình thức thanh toán (ví dụ chuyển khoản giảm 1%)
  thì phải trừ thật vào tổng tiền ở app/thanh-toan/page.tsx rồi mới gắn badge.
  Gắn nhãn "Giảm 1%" mà tổng tiền không đổi là hứa suông với khách.
*/
export type PhuongThuc = {
  key: MaThanhToan;
  label: string;
  note: string;
  /** Nhãn nhỏ nằm bên phải tên, kiểu "Phổ biến nhất" */
  badge?: string;
  /** Phí phụ thu tính theo phần trăm giá trị đơn. 0 = không phụ thu. */
  phuThu: number;
};

export const phuongThucThanhToan: PhuongThuc[] = [
  {
    key: "cod",
    label: "Tiền mặt khi nhận hàng (COD)",
    note: "Kiểm tra hàng đầy đủ rồi mới trả tiền. Không đúng mô tả được từ chối nhận.",
    badge: "Phổ biến nhất",
    phuThu: 0,
  },
  {
    key: "chuyen-khoan",
    label: "Chuyển khoản ngân hàng",
    note: "Chuyển trước, có xác nhận trong 15 phút giờ hành chính.",
    phuThu: 0,
  },
  {
    key: "vi-dien-tu",
    label: "Ví điện tử",
    note: "Momo · ZaloPay · VNPay · ShopeePay. Quét mã QR ngay sau khi đặt.",
    phuThu: 0,
  },
  {
    key: "the",
    label: "Quẹt thẻ khi giao hàng",
    note: "Máy POS mang tới tận nơi. Nhận Visa, Mastercard, JCB và thẻ ATM nội địa.",
    phuThu: 0,
  },
  {
    key: "tra-gop",
    label: "Trả góp 0% qua thẻ tín dụng",
    note: "Kỳ hạn 3 – 12 tháng, không phí chuyển đổi. Ngân hàng duyệt trong ngày.",
    phuThu: 0,
  },
];

/** Tài khoản nhận chuyển khoản — đổi thành số thật trước khi mở bán. */
export const taiKhoanNganHang = {
  nganHang: "Vietcombank – Chi nhánh Gia Lai",
  soTaiKhoan: "0011 0026 8899",
  chuTaiKhoan: "CONG TY TNHH NOI THAT HT",
  /**
   * Ảnh QR VietQR. Để trống thì trang tự vẽ ô hướng dẫn thay cho ảnh, không vỡ
   * bố cục. Tạo mã thật tại vietqr.io rồi bỏ file vào public/images/.
   */
  anhQR: "",
};

/** Ví điện tử đang nhận thanh toán. */
export const viDienTu = [
  { ten: "Momo", mau: "#a50064" },
  { ten: "ZaloPay", mau: "#0068ff" },
  { ten: "VNPay", mau: "#005baa" },
  { ten: "ShopeePay", mau: "#ee4d2d" },
];

/** Thẻ quốc tế và nội địa chấp nhận trên máy POS. */
export const loaiThe = ["Visa", "Mastercard", "JCB", "ATM nội địa"];

/** Ngân hàng liên kết trả góp 0%. */
export const nganHangTraGop = [
  "Sacombank",
  "Techcombank",
  "VPBank",
  "TPBank",
  "VIB",
  "HSBC",
  "Shinhan",
  "Citibank",
];

/** Kỳ hạn trả góp cho khách chọn. */
export const kyHanTraGop = [3, 6, 9, 12];
