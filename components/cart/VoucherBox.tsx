"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { vouchers } from "@/lib/vouchers";

/** Ô nhập mã giảm giá, dùng chung cho giỏ hàng và trang thanh toán */
export function VoucherBox({ compact = false }: { compact?: boolean }) {
  const { voucher, voucherDiscount, applyVoucher, removeVoucher, subtotal } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = applyVoucher(code);
    if (result.ok) {
      setCode("");
      setError(null);
    } else {
      setError(result.error ?? "Mã không dùng được.");
    }
  }

  if (voucher) {
    return (
      <div className="border border-sage/40 bg-sage/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="bg-sage px-1.5 py-0.5 text-[10px] text-white">
                {voucher.code}
              </span>
              {voucher.label}
            </p>
            <p className="mt-1 text-xs text-muted">{voucher.description}</p>
            {voucher.freeShipping ? (
              <p className="mt-1.5 text-sm font-semibold text-sage">
                Đã miễn phí vận chuyển
              </p>
            ) : (
              <p className="mt-1.5 text-sm font-semibold text-sage">
                Đã giảm {formatPrice(voucherDiscount)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={removeVoucher}
            className="shrink-0 text-xs text-muted underline hover:text-clay"
          >
            Bỏ mã
          </button>
        </div>
      </div>
    );
  }

  const usable = vouchers.filter(
    (item) => item.promoted && subtotal >= item.minSubtotal,
  );

  return (
    <div>
      {/*
        Cố tình KHÔNG dùng thẻ <form> ở đây: ô này nằm bên trong form đặt hàng
        của trang thanh toán, mà HTML không cho phép form lồng form.
        Phím Enter được xử lý thủ công để vẫn áp được mã bằng bàn phím.
      */}
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          className="field flex-1 uppercase"
          placeholder="Nhập mã giảm giá"
          aria-label="Mã giảm giá"
        />
        <button type="button" onClick={submit} className="btn btn-outline shrink-0 px-4">
          Áp dụng
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-clay">{error}</p>}

      {!compact && usable.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted">Mã bạn đang dùng được:</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {usable.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => applyVoucher(item.code)}
                className="border border-dashed border-walnut/50 px-2.5 py-1 text-xs text-walnut transition-colors hover:bg-walnut/5"
                title={item.description}
              >
                {item.code} · {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
