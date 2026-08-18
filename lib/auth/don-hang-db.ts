import type { Order, OrderStatus } from "@/lib/orders";
import { prisma } from "./db";
import type { DonMayChu, KhoDonHang } from "./don-hang-kieu";

/**
 * BẢN CHẠY TRÊN POSTGRES của kho đơn hàng.
 *
 * Đơn hàng được trải phẳng ra thành cột (tên khách, số điện thoại, tổng tiền…)
 * thay vì nhét cả cục JSON vào một ô. Nhờ vậy sau này lọc "đơn chưa xác nhận
 * trong tháng 8" hay cộng doanh thu theo tuần đều làm được bằng một câu truy
 * vấn, không phải tải hết đơn về rồi tính bằng JavaScript.
 *
 * Riêng danh sách món vẫn để dạng JSON vì mỗi đơn một khác và ta không cần
 * tìm kiếm bên trong nó.
 */

function db() {
  if (!prisma) throw new Error("Chưa có kết nối cơ sở dữ liệu");
  return prisma;
}

type DongDb = {
  ma: string;
  taoLuc: Date;
  trangThai: string;
  tenKhach: string;
  soDienThoai: string;
  email: string | null;
  diaChi: string | null;
  ghiChu: string | null;
  hangDat: unknown;
  tamTinh: number;
  giamGia: number | null;
  maGiamGia: string | null;
  vanChuyen: number;
  tongTien: number;
  thanhToan: string;
  datNhanh: boolean;
  nguoiDungId: string | null;
};

/** Từ dòng trong bảng về đúng hình dạng mà giao diện đang dùng. */
function doiKieu(d: DongDb): DonMayChu {
  return {
    code: d.ma,
    createdAt: d.taoLuc.toISOString(),
    status: d.trangThai as OrderStatus,
    customer: {
      name: d.tenKhach,
      phone: d.soDienThoai,
      email: d.email ?? undefined,
      address: d.diaChi ?? undefined,
      note: d.ghiChu ?? undefined,
    },
    items: (d.hangDat ?? []) as Order["items"],
    subtotal: d.tamTinh,
    discount: d.giamGia ?? undefined,
    voucherCode: d.maGiamGia ?? undefined,
    shipping: d.vanChuyen,
    total: d.tongTien,
    payment: d.thanhToan,
    quick: d.datNhanh || undefined,
    idNguoiDung: d.nguoiDungId ?? undefined,
  };
}

export const khoDonHangDb: KhoDonHang = {
  async tatCa() {
    const dong = await db().donHang.findMany({ orderBy: { taoLuc: "desc" } });
    return dong.map(doiKieu);
  },

  async luu(don) {
    /*
      upsert chứ không create: khách bấm "Đặt hàng" hai lần khi mạng chậm sẽ
      gửi lên hai lần cùng một mã đơn. create sẽ ném lỗi và làm hỏng màn hình
      cảm ơn, còn upsert thì lần thứ hai chỉ ghi đè lên chính nó.
    */
    await db().donHang.upsert({
      where: { ma: don.code },
      update: {},
      create: {
        ma: don.code,
        taoLuc: new Date(don.createdAt),
        trangThai: don.status,
        tenKhach: don.customer.name,
        soDienThoai: don.customer.phone,
        email: don.customer.email ?? null,
        diaChi: don.customer.address ?? null,
        ghiChu: don.customer.note ?? null,
        hangDat: don.items as never,
        tamTinh: don.subtotal,
        giamGia: don.discount ?? null,
        maGiamGia: don.voucherCode ?? null,
        vanChuyen: don.shipping,
        tongTien: don.total,
        thanhToan: don.payment,
        datNhanh: don.quick ?? false,
        nguoiDungId: don.idNguoiDung ?? null,
      },
    });
  },

  async cuaNguoiDung(idNguoiDung) {
    const dong = await db().donHang.findMany({
      where: { nguoiDungId: idNguoiDung },
      orderBy: { taoLuc: "desc" },
    });
    return dong.map(doiKieu);
  },

  async doiTrangThai(ma, trangThai) {
    await db().donHang.update({
      where: { ma },
      data: { trangThai },
    });
  },

  async thongKe() {
    /*
      Đếm bằng cơ sở dữ liệu thay vì tải hết đơn về rồi lọc: khi cửa hàng có
      vài chục nghìn đơn thì cách tải hết về sẽ làm trang quản trị treo.
      Bốn phép đếm chạy song song nên tổng thời gian bằng phép chậm nhất.
    */
    const [tongDon, choXacNhan, dangGiao, hoanTat, cong] = await Promise.all([
      db().donHang.count(),
      db().donHang.count({ where: { trangThai: "cho-xac-nhan" } }),
      db().donHang.count({ where: { trangThai: "dang-giao" } }),
      db().donHang.count({ where: { trangThai: "hoan-tat" } }),
      // Doanh thu chỉ tính đơn đã xác nhận — đơn còn chờ có thể bị huỷ
      db().donHang.aggregate({
        _sum: { tongTien: true },
        where: { trangThai: { not: "cho-xac-nhan" } },
      }),
    ]);

    return {
      tongDon,
      choXacNhan,
      dangGiao,
      hoanTat,
      doanhThu: cong._sum.tongTien ?? 0,
    };
  },
};
