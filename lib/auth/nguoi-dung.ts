import { dungPostgres } from "./db";
import { doiChieu } from "./mat-khau";
import { khoNguoiDungDb } from "./nguoi-dung-db";
import { khoNguoiDungFile } from "./nguoi-dung-file";
import type { NguoiDung, NguoiDungCongKhai, VaiTro } from "./nguoi-dung-kieu";
import { chuanEmail } from "./nguoi-dung-kieu";

export type { NguoiDung, NguoiDungCongKhai, VaiTro };
export { chuanEmail };

/**
 * TÀI KHOẢN NGƯỜI DÙNG
 *
 * File này là cửa duy nhất mà phần còn lại của web đi qua. Bên dưới nó có hai
 * bản chạy — ghi file JSON và Postgres — nhưng chỗ gọi không cần biết đang
 * dùng bản nào.
 *
 * Đúng một dòng dưới đây quyết định tất cả: có DATABASE_URL thì đi Postgres,
 * không thì ghi file. Cả trang không có chỗ nào khác phải sửa khi chuyển.
 */
const kho = dungPostgres ? khoNguoiDungDb : khoNguoiDungFile;

/** Bỏ trường mật khẩu trước khi đưa dữ liệu ra ngoài lớp xác thực. */
export function cheDauMatKhau(u: NguoiDung): NguoiDungCongKhai {
  const { matKhauBam: _bo, ...conLai } = u;
  return conLai;
}

export async function danhSachNguoiDung(): Promise<NguoiDungCongKhai[]> {
  return (await kho.tatCa()).map(cheDauMatKhau);
}

export async function timTheoId(id: string) {
  return kho.timTheoId(id);
}

export async function timTheoEmail(email: string) {
  return kho.timTheoEmail(email);
}

/** Tạo tài khoản mới. Trả lỗi bằng chuỗi tiếng Việt để hiện thẳng lên form. */
export async function taoNguoiDung(input: {
  email: string;
  matKhau: string;
  hoTen: string;
  soDienThoai?: string;
}) {
  return kho.them(input);
}

/** Kiểm tra email + mật khẩu khi đăng nhập. */
export async function kiemTraDangNhap(email: string, matKhau: string) {
  const nguoiDung = await kho.timTheoEmail(email);
  if (!nguoiDung) return null;
  return (await doiChieu(matKhau, nguoiDung.matKhauBam)) ? nguoiDung : null;
}

/** Đổi vai trò một tài khoản. Dùng ở trang quản trị. */
export async function doiVaiTro(id: string, vaiTro: VaiTro) {
  return kho.doiVaiTro(id, vaiTro);
}

/** Cập nhật thông tin cá nhân. Không đụng tới email và vai trò. */
export async function capNhatHoSo(
  id: string,
  thongTin: { hoTen: string; soDienThoai?: string },
) {
  return kho.capNhatHoSo(id, thongTin);
}
