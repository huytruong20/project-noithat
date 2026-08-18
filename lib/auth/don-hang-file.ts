import { doc, ghi } from "./kho";
import type { DonMayChu, KhoDonHang } from "./don-hang-kieu";

/**
 * BẢN GHI RA FILE JSON của kho đơn hàng.
 * Dùng khi chưa đặt DATABASE_URL.
 */

const FILE = "don-hang.json";

const tatCa = () => doc<DonMayChu[]>(FILE, []);

export const khoDonHangFile: KhoDonHang = {
  tatCa,

  async luu(don) {
    const all = await tatCa();
    // Bấm đặt hai lần liên tiếp không được tạo hai đơn cùng mã
    if (all.some((d) => d.code === don.code)) return;
    await ghi(FILE, [don, ...all]);
  },

  async cuaNguoiDung(idNguoiDung) {
    return (await tatCa()).filter((d) => d.idNguoiDung === idNguoiDung);
  },

  async doiTrangThai(ma, trangThai) {
    const all = await tatCa();
    await ghi(FILE, all.map((d) => (d.code === ma ? { ...d, status: trangThai } : d)));
  },

  async thongKe() {
    const all = await tatCa();
    return {
      tongDon: all.length,
      choXacNhan: all.filter((d) => d.status === "cho-xac-nhan").length,
      dangGiao: all.filter((d) => d.status === "dang-giao").length,
      hoanTat: all.filter((d) => d.status === "hoan-tat").length,
      doanhThu: all
        .filter((d) => d.status !== "cho-xac-nhan")
        .reduce((tong, d) => tong + d.total, 0),
    };
  },
};
