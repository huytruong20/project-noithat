import { DoiVaiTro } from "@/components/admin/DoiVaiTro";
import { danhSachNguoiDung } from "@/lib/auth/nguoi-dung";
import { batBuocAdmin } from "@/lib/auth/phien";

export const dynamic = "force-dynamic";

export default async function QuanLyNguoiDung() {
  const toi = await batBuocAdmin();
  const danhSach = await danhSachNguoiDung();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl">Người dùng</h1>
      <p className="mt-1 text-sm text-muted">
        {danhSach.length} tài khoản. Chỉ cấp quyền quản trị cho người thật sự cần —
        quản trị viên đọc được toàn bộ địa chỉ và số điện thoại khách hàng.
      </p>

      <div className="mt-6 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-sand text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Họ tên
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Điện thoại
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Vai trò
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {danhSach.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{u.hoTen}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3 text-muted">{u.soDienThoai ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`border px-2 py-0.5 text-xs font-semibold ${
                      u.vaiTro === "admin"
                        ? "border-walnut text-walnut"
                        : "border-line text-muted"
                    }`}
                  >
                    {u.vaiTro === "admin" ? "Quản trị" : "Khách"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DoiVaiTro id={u.id} vaiTro={u.vaiTro} laChinhMinh={u.id === toi.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
