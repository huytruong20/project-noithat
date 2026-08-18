import type { Order, OrderStatus } from "@/lib/orders";

/**
 * KIỂU DÙNG CHUNG CHO KHO ĐƠN HÀNG
 * Tách riêng để hai bản chạy (file JSON và Postgres) không nhập vòng tròn nhau.
 */

/** Đơn ở máy chủ có thêm chủ sở hữu, để khách chỉ xem được đơn của mình. */
export type DonMayChu = Order & {
  /** id tài khoản đặt đơn. Không có nghĩa là khách đặt mà không đăng nhập. */
  idNguoiDung?: string;
};

export type SoLieu = {
  tongDon: number;
  choXacNhan: number;
  dangGiao: number;
  hoanTat: number;
  doanhThu: number;
};

/** Hợp đồng chung mà cả hai bản chạy phải làm đúng. */
export type KhoDonHang = {
  tatCa(): Promise<DonMayChu[]>;
  luu(don: DonMayChu): Promise<void>;
  cuaNguoiDung(idNguoiDung: string): Promise<DonMayChu[]>;
  doiTrangThai(ma: string, trangThai: OrderStatus): Promise<void>;
  thongKe(): Promise<SoLieu>;
};
