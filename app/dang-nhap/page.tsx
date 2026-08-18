import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormXacThuc, O } from "@/components/auth/FormXacThuc";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { dangNhap } from "@/lib/auth/thao-tac";
import { nguoiDangDangNhap } from "@/lib/auth/phien";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để theo dõi đơn hàng và lưu thông tin giao nhận.",
  robots: { index: false, follow: false },
};

export default async function TrangDangNhap({
  searchParams,
}: {
  searchParams: Promise<{ tiep?: string }>;
}) {
  // Đang đăng nhập rồi mà mở lại trang này thì đưa thẳng vào tài khoản
  if (await nguoiDangDangNhap()) redirect("/tai-khoan");

  const { tiep } = await searchParams;
  const quayVe = tiep?.startsWith("/") && !tiep.startsWith("//") ? tiep : "/tai-khoan";

  return (
    <>
      <Breadcrumbs items={[{ label: "Đăng nhập" }]} />

      <section className="shell flex justify-center py-12 md:py-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl">Đăng nhập</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Theo dõi đơn đang giao, xem lại đơn cũ và không phải nhập lại địa chỉ ở
            những lần đặt sau.
          </p>

          <div className="mt-8 border border-line bg-white p-6">
            <FormXacThuc thaoTac={dangNhap} nutChu="Đăng nhập">
              <input type="hidden" name="tiep" value={quayVe} />
              <O ten="email" nhan="Email" loai="email" batBuoc tuDien="email" />
              <O
                ten="matKhau"
                nhan="Mật khẩu"
                loai="password"
                batBuoc
                tuDien="current-password"
              />
            </FormXacThuc>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="font-semibold text-walnut hover:underline">
              Đăng ký
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-muted">
            Chỉ muốn tra đơn vừa đặt?{" "}
            <Link href="/tra-cuu-don" className="font-semibold text-walnut hover:underline">
              Tra cứu bằng mã đơn
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
