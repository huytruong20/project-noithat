import { randomUUID } from "node:crypto";
import { doc, ghi } from "./kho";
import { bam } from "./mat-khau";
import type { KhoNguoiDung, NguoiDung } from "./nguoi-dung-kieu";
import { adminMacDinh, chuanEmail } from "./nguoi-dung-kieu";

/**
 * BẢN GHI RA FILE JSON của kho tài khoản.
 *
 * Dùng khi chưa đặt DATABASE_URL. Đọc cả danh sách lên rồi lọc bằng JavaScript
 * nên chỉ hợp lúc chạy thử trên máy cá nhân với vài chục tài khoản.
 */

const FILE = "nguoi-dung.json";

async function tatCa(): Promise<NguoiDung[]> {
  const danhSach = await doc<NguoiDung[]>(FILE, []);
  if (danhSach.length > 0) return danhSach;

  // Kho rỗng — dựng tài khoản quản trị đầu tiên
  const admin: NguoiDung = {
    id: randomUUID(),
    email: chuanEmail(adminMacDinh.email),
    hoTen: adminMacDinh.hoTen,
    vaiTro: "admin",
    matKhauBam: await bam(adminMacDinh.matKhau),
    taoLuc: new Date().toISOString(),
  };
  await ghi(FILE, [admin]);
  return [admin];
}

export const khoNguoiDungFile: KhoNguoiDung = {
  tatCa,

  async timTheoId(id) {
    return (await tatCa()).find((u) => u.id === id) ?? null;
  },

  async timTheoEmail(email) {
    const can = chuanEmail(email);
    return (await tatCa()).find((u) => u.email === can) ?? null;
  },

  async them(input) {
    const all = await tatCa();
    const email = chuanEmail(input.email);

    if (all.some((u) => u.email === email)) {
      return { ok: false, loi: "Email này đã có tài khoản. Bạn đăng nhập luôn nhé." };
    }

    const nguoiDung: NguoiDung = {
      id: randomUUID(),
      email,
      hoTen: input.hoTen.trim(),
      soDienThoai: input.soDienThoai?.trim() || undefined,
      // Người tự đăng ký luôn là khách. Quyền admin chỉ cấp được từ trang /admin.
      vaiTro: "khach",
      matKhauBam: await bam(input.matKhau),
      taoLuc: new Date().toISOString(),
    };

    await ghi(FILE, [...all, nguoiDung]);
    return { ok: true, nguoiDung };
  },

  async doiVaiTro(id, vaiTro) {
    const all = await tatCa();
    await ghi(FILE, all.map((u) => (u.id === id ? { ...u, vaiTro } : u)));
  },

  async capNhatHoSo(id, thongTin) {
    const all = await tatCa();
    await ghi(
      FILE,
      all.map((u) =>
        u.id === id
          ? {
              ...u,
              hoTen: thongTin.hoTen.trim(),
              soDienThoai: thongTin.soDienThoai?.trim() || undefined,
            }
          : u,
      ),
    );
  },
};
