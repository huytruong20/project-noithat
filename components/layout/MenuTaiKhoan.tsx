"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Phien = { hoTen: string; vaiTro: "khach" | "admin" } | null;

/**
 * Nút tài khoản trên header.
 *
 * Hỏi máy chủ xem ai đang đăng nhập ngay khi trang hiện ra. Trong lúc chờ thì
 * giữ chỗ bằng một ô xám cùng kích thước — nếu để trống rồi mới chèn nút vào,
 * cả hàng header sẽ nhảy ngang một nhịp và người dùng bấm trượt nút bên cạnh.
 */
export function MenuTaiKhoan({ gonGang }: { gonGang?: boolean }) {
  const [phien, setPhien] = useState<Phien | undefined>(undefined);
  const duongDan = usePathname();

  useEffect(() => {
    let conHieuLuc = true;

    fetch("/api/phien")
      .then((r) => r.json())
      .then((d: Phien) => conHieuLuc && setPhien(d))
      // Mất mạng thì coi như khách vãng lai, không hiện lỗi trên header
      .catch(() => conHieuLuc && setPhien(null));

    return () => {
      conHieuLuc = false;
    };
    // Đăng nhập/đăng xuất đều đổi đường dẫn nên hỏi lại theo duongDan là đủ
  }, [duongDan]);

  if (phien === undefined) {
    return <span className="dang-tai inline-block h-5 w-16 align-middle" aria-hidden />;
  }

  if (!phien) {
    return (
      <Link
        href="/dang-nhap"
        className="flex items-center gap-1.5 text-sm transition-colors hover:text-walnut"
      >
        <NguoiIcon />
        <span className={gonGang ? "" : "hidden lg:inline"}>Đăng nhập</span>
      </Link>
    );
  }

  const ten = phien.hoTen.trim().split(/\s+/).pop() ?? phien.hoTen;

  return (
    <Link
      href={phien.vaiTro === "admin" ? "/admin" : "/tai-khoan"}
      className="flex items-center gap-1.5 text-sm transition-colors hover:text-walnut"
      title={phien.vaiTro === "admin" ? "Trang quản trị" : "Tài khoản của tôi"}
    >
      <NguoiIcon />
      <span className={gonGang ? "" : "hidden lg:inline"}>
        {ten}
        {phien.vaiTro === "admin" && (
          <span className="ml-1.5 border border-walnut/40 px-1 py-0.5 text-[0.625rem] font-semibold text-walnut">
            QT
          </span>
        )}
      </span>
    </Link>
  );
}

function NguoiIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" />
    </svg>
  );
}
