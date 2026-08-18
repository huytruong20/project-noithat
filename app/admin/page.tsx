import Link from "next/link";
import { tatCaDon, thongKe } from "@/lib/auth/don-hang-may-chu";
import { danhSachNguoiDung } from "@/lib/auth/nguoi-dung";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels } from "@/lib/orders";
import { products } from "@/lib/data/products";

/**
 * Trang này đọc file dữ liệu ở mỗi lần mở nên phải chạy động.
 * Thiếu dòng dưới, Next dựng sẵn trang lúc build và số liệu đứng yên mãi mãi.
 */
export const dynamic = "force-dynamic";

export default async function TongQuan() {
  const so = await thongKe();
  const donGanDay = (await tatCaDon()).slice(0, 8);
  const nguoiDung = await danhSachNguoiDung();

  const conHang = products.filter((p) => p.inStock).length;

  const the = [
    { nhan: "Đơn chờ xác nhận", giaTri: String(so.choXacNhan), nhac: so.choXacNhan > 0 },
    { nhan: "Đang giao", giaTri: String(so.dangGiao) },
    { nhan: "Đã hoàn tất", giaTri: String(so.hoanTat) },
    { nhan: "Doanh thu ghi nhận", giaTri: formatPrice(so.doanhThu) },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl">Tổng quan</h1>
      <p className="mt-1 text-sm text-muted">
        Số liệu tính trên các đơn đặt qua website.
      </p>

      {/* ------------------------- Bốn ô số liệu ------------------------- */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {the.map((t) => (
          <div
            key={t.nhan}
            className={`border bg-white p-5 ${
              t.nhac ? "border-walnut" : "border-line"
            }`}
          >
            <p className="text-xs text-muted">{t.nhan}</p>
            <p className="price mt-1.5 text-2xl">{t.giaTri}</p>
          </div>
        ))}
      </div>

      {/* --------------------------- Danh mục --------------------------- */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ODoc nhan="Sản phẩm đang bán" so={`${conHang} / ${products.length}`} />
        <ODoc nhan="Tài khoản khách" so={String(nguoiDung.filter((u) => u.vaiTro === "khach").length)} />
        <ODoc nhan="Tài khoản quản trị" so={String(nguoiDung.filter((u) => u.vaiTro === "admin").length)} />
      </div>

      {/* ------------------------- Đơn gần đây -------------------------- */}
      <div className="mt-10 flex items-baseline justify-between gap-4">
        <h2 className="text-xl">Đơn gần đây</h2>
        <Link href="/admin/don-hang" className="text-sm font-semibold text-walnut hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {donGanDay.length === 0 ? (
        <p className="mt-4 border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-muted">
          Chưa có đơn nào được đặt qua website.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-sand text-left">
              <tr>
                <Th>Mã đơn</Th>
                <Th>Khách</Th>
                <Th>Ngày đặt</Th>
                <Th>Trạng thái</Th>
                <Th canPhai>Tổng tiền</Th>
              </tr>
            </thead>
            <tbody>
              {donGanDay.map((don) => (
                <tr key={don.code} className="border-b border-line last:border-0">
                  <Td>
                    <span className="price">{don.code}</span>
                  </Td>
                  <Td>
                    <span className="block">{don.customer.name}</span>
                    <span className="block text-xs text-muted">{don.customer.phone}</span>
                  </Td>
                  <Td>{new Date(don.createdAt).toLocaleDateString("vi-VN")}</Td>
                  <Td>{orderStatusLabels[don.status]}</Td>
                  <Td canPhai>
                    <span className="price">{formatPrice(don.total)}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ODoc({ nhan, so }: { nhan: string; so: string }) {
  return (
    <div className="flex items-baseline justify-between border border-line bg-white px-5 py-3.5">
      <span className="text-xs text-muted">{nhan}</span>
      <span className="price text-base">{so}</span>
    </div>
  );
}

function Th({ children, canPhai }: { children: React.ReactNode; canPhai?: boolean }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${
        canPhai ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, canPhai }: { children: React.ReactNode; canPhai?: boolean }) {
  return <td className={`px-4 py-3 align-top ${canPhai ? "text-right" : ""}`}>{children}</td>;
}
