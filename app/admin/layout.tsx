import type { Metadata } from "next";
import Link from "next/link";
import { batBuocAdmin } from "@/lib/auth/phien";
import { dangXuat } from "@/lib/auth/thao-tac";

export const metadata: Metadata = {
  title: "Quản trị",
  // Không cho công cụ tìm kiếm lập chỉ mục khu quản trị
  robots: { index: false, follow: false },
};

/**
 * Khu quản trị.
 *
 * Chốt chặn quyền nằm ở đây, trong layout, nên MỌI trang con đều được kiểm tra
 * mà không phải nhớ thêm dòng nào. Nếu chỉ chặn ở từng trang thì chỉ cần quên
 * một trang là lộ toàn bộ dữ liệu qua đúng trang đó.
 *
 * Đây là kiểm tra chạy ở máy chủ. Ẩn nút "Quản trị" trên giao diện không phải
 * là bảo mật — ai cũng gõ thẳng /admin vào thanh địa chỉ được.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await batBuocAdmin();

  const muc = [
    { href: "/admin", nhan: "Tổng quan" },
    { href: "/admin/don-hang", nhan: "Đơn hàng" },
    { href: "/admin/nguoi-dung", nhan: "Người dùng" },
  ];

  return (
    <div className="border-b border-line bg-bone">
      <div className="border-b border-line bg-ink text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-display text-lg">Quản trị</span>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {muc.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {m.nhan}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/60 sm:inline">{admin.email}</span>
            <Link href="/" className="text-white/70 hover:text-white">
              Về trang bán hàng
            </Link>
            <form action={dangXuat}>
              <button
                type="submit"
                className="border border-white/30 px-3 py-1.5 text-xs transition-colors hover:bg-white hover:text-ink"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="shell py-10 pb-16">{children}</div>
    </div>
  );
}
