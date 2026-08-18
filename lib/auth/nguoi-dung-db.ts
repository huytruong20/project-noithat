import { bam } from "./mat-khau";
import { prisma } from "./db";
import type { KhoNguoiDung, NguoiDung, VaiTro } from "./nguoi-dung-kieu";
import { adminMacDinh, chuanEmail } from "./nguoi-dung-kieu";

/**
 * BẢN CHẠY TRÊN POSTGRES của kho tài khoản.
 *
 * Khác bản ghi file ở chỗ mỗi thao tác là một câu truy vấn tới đúng dòng cần
 * lấy, thay vì đọc cả danh sách lên rồi lọc bằng JavaScript. Có mười nghìn
 * khách thì tìm theo email vẫn nhanh như khi có mười khách.
 */

/** Prisma trả về DateTime, phần còn lại của web dùng chuỗi ISO. */
type DongDb = {
  id: string;
  email: string;
  hoTen: string;
  soDienThoai: string | null;
  vaiTro: string;
  matKhauBam: string;
  taoLuc: Date;
};

function doiKieu(dong: DongDb): NguoiDung {
  return {
    id: dong.id,
    email: dong.email,
    hoTen: dong.hoTen,
    soDienThoai: dong.soDienThoai ?? undefined,
    vaiTro: dong.vaiTro as VaiTro,
    matKhauBam: dong.matKhauBam,
    taoLuc: dong.taoLuc.toISOString(),
  };
}

/** Prisma chỉ là null khi chưa đặt DATABASE_URL, mà khi đó ta đã dùng bản file. */
function db() {
  if (!prisma) throw new Error("Chưa có kết nối cơ sở dữ liệu");
  return prisma;
}

/**
 * Dựng tài khoản quản trị đầu tiên khi bảng còn rỗng — không có nó thì không
 * ai vào được /admin để cấp quyền cho người khác.
 *
 * Chạy tối đa một lần mỗi lần khởi động chứ không kiểm tra ở mọi truy vấn:
 * đếm cả bảng trước mỗi lần đăng nhập là lãng phí.
 */
let daKiemTraHat = false;

async function gieoAdmin() {
  if (daKiemTraHat) return;
  daKiemTraHat = true;

  const soTaiKhoan = await db().nguoiDung.count();
  if (soTaiKhoan > 0) return;

  await db().nguoiDung.create({
    data: {
      email: chuanEmail(adminMacDinh.email),
      hoTen: adminMacDinh.hoTen,
      vaiTro: "admin",
      matKhauBam: await bam(adminMacDinh.matKhau),
    },
  });
}

export const khoNguoiDungDb: KhoNguoiDung = {
  async tatCa() {
    await gieoAdmin();
    const dong = await db().nguoiDung.findMany({ orderBy: { taoLuc: "asc" } });
    return dong.map(doiKieu);
  },

  async timTheoId(id) {
    await gieoAdmin();
    const dong = await db().nguoiDung.findUnique({ where: { id } });
    return dong ? doiKieu(dong) : null;
  },

  async timTheoEmail(email) {
    await gieoAdmin();
    const dong = await db().nguoiDung.findUnique({
      where: { email: chuanEmail(email) },
    });
    return dong ? doiKieu(dong) : null;
  },

  async them(input) {
    await gieoAdmin();

    try {
      const dong = await db().nguoiDung.create({
        data: {
          email: chuanEmail(input.email),
          hoTen: input.hoTen.trim(),
          soDienThoai: input.soDienThoai?.trim() || null,
          // Người tự đăng ký luôn là khách. Quyền admin chỉ cấp từ trang /admin.
          vaiTro: "khach",
          matKhauBam: await bam(input.matKhau),
        },
      });
      return { ok: true, nguoiDung: doiKieu(dong) };
    } catch (loi) {
      /*
        P2002 = vi phạm ràng buộc duy nhất, tức email đã có người dùng.
        Bắt ở đây thay vì kiểm tra trước bằng một câu SELECT: hai người bấm
        đăng ký cùng một email trong cùng một khoảnh khắc thì cách kiểm tra
        trước vẫn lọt, còn ràng buộc của cơ sở dữ liệu thì không bao giờ lọt.
      */
      if (
        typeof loi === "object" &&
        loi !== null &&
        (loi as { code?: string }).code === "P2002"
      ) {
        return { ok: false, loi: "Email này đã có tài khoản. Bạn đăng nhập luôn nhé." };
      }
      throw loi;
    }
  },

  async doiVaiTro(id, vaiTro) {
    await db().nguoiDung.update({ where: { id }, data: { vaiTro } });
  },

  async capNhatHoSo(id, thongTin) {
    await db().nguoiDung.update({
      where: { id },
      data: {
        hoTen: thongTin.hoTen.trim(),
        soDienThoai: thongTin.soDienThoai?.trim() || null,
      },
    });
  },
};
