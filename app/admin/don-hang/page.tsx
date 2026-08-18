import { tatCaDon } from "@/lib/auth/don-hang-may-chu";
import { DoiTrangThai } from "@/components/admin/DoiTrangThai";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function QuanLyDonHang() {
  const donHang = await tatCaDon();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl">Đơn hàng</h1>
      <p className="mt-1 text-sm text-muted">
        {donHang.length} đơn. Đổi trạng thái ở cột cuối, khách tra cứu thấy ngay.
      </p>

      {donHang.length === 0 ? (
        <p className="mt-6 border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-muted">
          Chưa có đơn nào. Đặt thử một đơn ở trang bán hàng để xem chỗ này hoạt động.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {donHang.map((don) => (
            <article key={don.code} className="border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="price text-base">{don.code}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(don.createdAt).toLocaleString("vi-VN")}
                    {don.idNguoiDung ? " · khách có tài khoản" : " · đặt không đăng nhập"}
                  </p>
                </div>
                <p className="price text-lg">{formatPrice(don.total)}</p>
              </div>

              <div className="mt-4 grid gap-4 border-t border-line pt-4 md:grid-cols-3">
                <div className="min-w-0">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Người nhận
                  </p>
                  <p className="text-sm">{don.customer.name}</p>
                  <p className="text-sm text-muted">{don.customer.phone}</p>
                  {don.customer.address && (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {don.customer.address}
                    </p>
                  )}
                  {don.customer.note && (
                    <p className="mt-1.5 border-l-2 border-line pl-2 text-xs italic leading-relaxed text-muted">
                      {don.customer.note}
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Hàng đặt
                  </p>
                  <ul className="space-y-1 text-sm">
                    {don.items.map((mon, i) => (
                      <li key={`${mon.slug}-${i}`} className="flex gap-2">
                        <span className="min-w-0 flex-1">{mon.name}</span>
                        <span className="shrink-0 text-muted">×{mon.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted">
                    Vận chuyển {formatPrice(don.shipping)}
                    {don.discount ? ` · giảm ${formatPrice(don.discount)}` : ""}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Thanh toán
                  </p>
                  <p className="text-sm leading-relaxed">{don.payment}</p>

                  <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                    Trạng thái
                  </p>
                  <DoiTrangThai ma={don.code} hienTai={don.status} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
