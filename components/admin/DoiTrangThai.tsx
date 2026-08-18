"use client";

import { useTransition } from "react";
import { doiTrangThaiDon } from "@/lib/auth/thao-tac";
import { orderStatusLabels, orderSteps, type OrderStatus } from "@/lib/orders";

/**
 * Ô chọn trạng thái đơn ở trang quản trị.
 *
 * useTransition để giao diện không đơ trong lúc máy chủ ghi file: ô select mờ
 * đi và khoá lại, xong thì Next tự tải lại dữ liệu trang.
 */
export function DoiTrangThai({
  ma,
  hienTai,
}: {
  ma: string;
  hienTai: OrderStatus;
}) {
  const [dangChay, batDau] = useTransition();

  return (
    <select
      className="field text-sm disabled:opacity-50"
      value={hienTai}
      disabled={dangChay}
      onChange={(e) => {
        const moi = e.target.value as OrderStatus;
        batDau(() => {
          void doiTrangThaiDon(ma, moi);
        });
      }}
      aria-label={`Trạng thái đơn ${ma}`}
    >
      {orderSteps.map((buoc) => (
        <option key={buoc} value={buoc}>
          {orderStatusLabels[buoc]}
        </option>
      ))}
    </select>
  );
}
