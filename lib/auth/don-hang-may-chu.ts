import type { OrderStatus } from "@/lib/orders";
import { dungPostgres } from "./db";
import { khoDonHangDb } from "./don-hang-db";
import { khoDonHangFile } from "./don-hang-file";
import type { DonMayChu, SoLieu } from "./don-hang-kieu";

export type { DonMayChu, SoLieu };

/**
 * ĐƠN HÀNG LƯU Ở MÁY CHỦ
 *
 * localStorage chỉ nằm trong trình duyệt của chính người đặt, nên nhân viên
 * không thể nhìn thấy đơn của khách. Đơn vì vậy được ghi thêm một bản ở máy
 * chủ để trang /admin có dữ liệu thật mà xử lý.
 *
 * Có DATABASE_URL thì đi Postgres, không thì ghi file JSON — chỗ gọi không
 * cần biết đang dùng bản nào.
 */
const kho = dungPostgres ? khoDonHangDb : khoDonHangFile;

export async function tatCaDon(): Promise<DonMayChu[]> {
  return kho.tatCa();
}

export async function luuDon(don: DonMayChu) {
  return kho.luu(don);
}

/** Đơn của một tài khoản, mới nhất lên trước. */
export async function donCuaNguoiDung(idNguoiDung: string) {
  return kho.cuaNguoiDung(idNguoiDung);
}

export async function doiTrangThai(ma: string, trangThai: OrderStatus) {
  return kho.doiTrangThai(ma, trangThai);
}

/** Vài con số tóm tắt cho bảng điều khiển quản trị. */
export async function thongKe(): Promise<SoLieu> {
  return kho.thongKe();
}
