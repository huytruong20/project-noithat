/**
 * KIỂU DỮ LIỆU VÀ QUY ƯỚC DÙNG CHUNG CHO KHO TÀI KHOẢN
 *
 * Tách riêng khỏi nguoi-dung.ts để hai bản chạy (file JSON và Postgres) cùng
 * nhập từ đây mà không nhập vòng tròn lẫn nhau.
 */

export type VaiTro = "khach" | "admin";

export type NguoiDung = {
  id: string;
  email: string;
  hoTen: string;
  soDienThoai?: string;
  vaiTro: VaiTro;
  /** Chuỗi băm scrypt, không bao giờ là mật khẩu nguyên văn */
  matKhauBam: string;
  /** Chuỗi ISO */
  taoLuc: string;
};

/** Bản rút gọn để gửi ra giao diện — đã bỏ hẳn trường mật khẩu. */
export type NguoiDungCongKhai = Omit<NguoiDung, "matKhauBam">;

export type ThemNguoiDung = {
  email: string;
  matKhau: string;
  hoTen: string;
  soDienThoai?: string;
};

export type KetQuaThem =
  | { ok: true; nguoiDung: NguoiDung }
  | { ok: false; loi: string };

/**
 * Hợp đồng chung mà cả hai bản chạy phải làm đúng.
 *
 * Nhờ có nó, đổi từ file JSON sang Postgres chỉ là đổi một dòng gán ở
 * nguoi-dung.ts — TypeScript sẽ báo lỗi ngay nếu bản mới thiếu hàm nào.
 */
export type KhoNguoiDung = {
  tatCa(): Promise<NguoiDung[]>;
  timTheoId(id: string): Promise<NguoiDung | null>;
  timTheoEmail(email: string): Promise<NguoiDung | null>;
  them(input: ThemNguoiDung): Promise<KetQuaThem>;
  doiVaiTro(id: string, vaiTro: VaiTro): Promise<void>;
  capNhatHoSo(
    id: string,
    thongTin: { hoTen: string; soDienThoai?: string },
  ): Promise<void>;
};

/** Chuẩn hoá email để "An@Gmail.com " và "an@gmail.com" tính là một tài khoản. */
export const chuanEmail = (email: string) => email.trim().toLowerCase();

/**
 * Tài khoản quản trị đầu tiên, tạo tự động khi kho còn rỗng.
 *
 * ⚠️ ĐỔI MẬT KHẨU NGAY SAU LẦN ĐĂNG NHẬP ĐẦU TIÊN, hoặc đặt sẵn ADMIN_EMAIL
 * và ADMIN_MAT_KHAU trong .env.local trước khi chạy lần đầu.
 */
export const adminMacDinh = {
  email: process.env.ADMIN_EMAIL ?? "admin@noithatht.vn",
  matKhau: process.env.ADMIN_MAT_KHAU ?? "admin123456",
  hoTen: "Quản trị viên",
};
