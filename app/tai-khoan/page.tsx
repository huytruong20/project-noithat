import type { Metadata } from "next";
import Link from "next/link";
import { FormXacThuc, O } from "@/components/auth/FormXacThuc";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { donCuaNguoiDung } from "@/lib/auth/don-hang-may-chu";
import { batBuocDangNhap } from "@/lib/auth/phien";
import { dangXuat, suaHoSo } from "@/lib/auth/thao-tac";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Tài khoản",
  robots: { index: false, follow: false },
};

export default async function TrangTaiKhoan() {
  const nguoiDung = await batBuocDangNhap();
  const donHang = await donCuaNguoiDung(nguoiDung.id);

  return (
    <>
      <Breadcrumbs items={[{ label: "Tài khoản" }]} />

      <section className="shell py-10 pb-20 md:py-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl">Chào {nguoiDung.hoTen}</h1>
            <p className="mt-1 text-sm text-muted">{nguoiDung.email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {nguoiDung.vaiTro === "admin" && (
              <Link href="/admin" className="btn btn-accent">
                Trang quản trị
              </Link>
            )}
            <form action={dangXuat}>
              <button type="submit" className="btn btn-outline">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* ---------------------- Thông tin cá nhân ---------------------- */}
          <div className="min-w-0">
            <h2 className="text-xl">Thông tin của bạn</h2>
            <div className="mt-4 border border-line bg-white p-6">
              <FormXacThuc thaoTac={suaHoSo} nutChu="Lưu thay đổi">
                <O ten="hoTen" nhan="Họ và tên" batBuoc macDinh={nguoiDung.hoTen} />
                <O
                  ten="soDienThoai"
                  nhan="Số điện thoại"
                  loai="tel"
                  macDinh={nguoiDung.soDienThoai}
                />
                <p className="text-xs leading-relaxed text-muted">
                  Email dùng để đăng nhập nên không đổi được ở đây. Cần đổi email thì
                  gọi hotline giúp bạn nhé.
                </p>
              </FormXacThuc>
            </div>
          </div>

          {/* -------------------------- Đơn hàng --------------------------- */}
          <div className="min-w-0">
            <h2 className="text-xl">Đơn hàng của bạn</h2>

            {donHang.length === 0 ? (
              <div className="mt-4 border border-dashed border-line bg-white px-6 py-12 text-center">
                <p className="font-display text-lg">Chưa có đơn nào</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Đơn đặt trước khi có tài khoản không tự gắn vào đây được — tra bằng
                  mã đơn ở trang tra cứu nhé.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/danh-muc" className="btn btn-primary">
                    Xem sản phẩm
                  </Link>
                  <Link href="/tra-cuu-don" className="btn btn-outline">
                    Tra cứu đơn cũ
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {donHang.map((don) => (
                  <li key={don.code} className="border border-line bg-white p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="price text-base">{don.code}</p>
                      <span className="border border-line px-2 py-0.5 text-xs text-muted">
                        {orderStatusLabels[don.status]}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      Đặt ngày{" "}
                      {new Date(don.createdAt).toLocaleDateString("vi-VN")} ·{" "}
                      {don.items.length} món · {don.payment}
                    </p>

                    <ul className="mt-3 space-y-1 text-sm">
                      {don.items.map((mon, i) => (
                        <li key={`${mon.slug}-${i}`} className="flex gap-2 text-muted">
                          <span className="min-w-0 flex-1 truncate">{mon.name}</span>
                          <span className="shrink-0">×{mon.quantity}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="price mt-3 border-t border-line pt-3 text-right text-lg">
                      {formatPrice(don.total)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
