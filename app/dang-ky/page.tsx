import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormXacThuc, O } from "@/components/auth/FormXacThuc";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { dangKy } from "@/lib/auth/thao-tac";
import { nguoiDangDangNhap } from "@/lib/auth/phien";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản để theo dõi đơn hàng và bảo hành.",
  robots: { index: false, follow: false },
};

export default async function TrangDangKy() {
  if (await nguoiDangDangNhap()) redirect("/tai-khoan");

  return (
    <>
      <Breadcrumbs items={[{ label: "Đăng ký" }]} />

      <section className="shell flex justify-center py-12 md:py-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl">Tạo tài khoản</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Có tài khoản thì phiếu bảo hành 5 năm được lưu sẵn, mất giấy tờ vẫn tra
            được ngày mua và số máy.
          </p>

          <div className="mt-8 border border-line bg-white p-6">
            <FormXacThuc thaoTac={dangKy} nutChu="Đăng ký">
              <O ten="hoTen" nhan="Họ và tên" batBuoc tuDien="name" />
              <O ten="email" nhan="Email" loai="email" batBuoc tuDien="email" />
              <O
                ten="soDienThoai"
                nhan="Số điện thoại"
                loai="tel"
                tuDien="tel"
                goiY="Không bắt buộc, nhưng có thì chúng tôi gọi báo lịch giao được."
              />
              <O
                ten="matKhau"
                nhan="Mật khẩu"
                loai="password"
                batBuoc
                tuDien="new-password"
                goiY="Ít nhất 8 ký tự."
              />
              <O
                ten="nhapLai"
                nhan="Nhập lại mật khẩu"
                loai="password"
                batBuoc
                tuDien="new-password"
              />
            </FormXacThuc>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="font-semibold text-walnut hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
