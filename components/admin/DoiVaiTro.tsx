"use client";

import { useTransition } from "react";
import { doiVaiTro } from "@/lib/auth/thao-tac";
import type { VaiTro } from "@/lib/auth/nguoi-dung";

/**
 * Nút nâng/hạ quyền một tài khoản.
 *
 * Hỏi lại trước khi cấp quyền quản trị vì bấm nhầm là người đó đọc được toàn
 * bộ đơn hàng, số điện thoại và địa chỉ của mọi khách.
 */
export function DoiVaiTro({
  id,
  vaiTro,
  laChinhMinh,
}: {
  id: string;
  vaiTro: VaiTro;
  /** Không cho tự hạ quyền của chính mình */
  laChinhMinh: boolean;
}) {
  const [dangChay, batDau] = useTransition();

  if (laChinhMinh) {
    return <span className="text-xs text-muted">Tài khoản của bạn</span>;
  }

  const lenAdmin = vaiTro === "khach";

  return (
    <button
      type="button"
      disabled={dangChay}
      onClick={() => {
        if (lenAdmin && !confirm("Cấp quyền quản trị cho tài khoản này? Họ sẽ xem được toàn bộ đơn hàng và thông tin khách.")) {
          return;
        }
        batDau(() => {
          void doiVaiTro(id, lenAdmin ? "admin" : "khach");
        });
      }}
      className="border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-walnut hover:text-walnut disabled:opacity-50"
    >
      {dangChay ? "Đang lưu…" : lenAdmin ? "Cấp quyền quản trị" : "Hạ về khách"}
    </button>
  );
}
