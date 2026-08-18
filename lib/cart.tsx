"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { getProduct } from "@/lib/data/products";
import { checkVoucher, discountOf, findVoucher, type Voucher } from "@/lib/vouchers";

const STORAGE_KEY = "noithatht.cart.v1";
const VOUCHER_KEY = "noithatht.voucher.v1";

export type DetailedLine = CartLine & {
  product: Product;
  lineTotal: number;
};

type CartValue = {
  /** false cho tới khi đọc xong localStorage — tránh lệch giữa server và client */
  ready: boolean;
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  savings: number;
  add: (slug: string, quantity: number, color: string) => void;
  setQuantity: (slug: string, color: string, quantity: number) => void;
  /** Ghi chú riêng cho một dòng hàng, ví dụ yêu cầu về màu hoặc kích thước */
  setNote: (slug: string, color: string, note: string) => void;
  remove: (slug: string, color: string) => void;
  clear: () => void;
  /** Mã giảm giá đang áp dụng, null nếu chưa nhập mã nào */
  voucher: Voucher | null;
  /** Số tiền được giảm nhờ voucher */
  voucherDiscount: number;
  applyVoucher: (code: string) => { ok: boolean; error?: string };
  removeVoucher: () => void;
  /** Sản phẩm vừa thêm, dùng cho thông báo trượt ở góc màn hình */
  flash: { slug: string; color: string; quantity: number } | null;
  dismissFlash: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function sameLine(line: CartLine, slug: string, color: string) {
  return line.slug === slug && line.color === color;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState<CartValue["flash"]>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        // Bỏ qua dòng trỏ tới sản phẩm đã gỡ khỏi danh mục
        setRaw(parsed.filter((line) => Boolean(getProduct(line.slug))));
      }
      const storedVoucher = window.localStorage.getItem(VOUCHER_KEY);
      if (storedVoucher && findVoucher(storedVoucher)) setVoucherCode(storedVoucher);
    } catch {
      // localStorage bị chặn hoặc dữ liệu hỏng — bắt đầu với giỏ trống
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
      if (voucherCode) window.localStorage.setItem(VOUCHER_KEY, voucherCode);
      else window.localStorage.removeItem(VOUCHER_KEY);
    } catch {
      // Chế độ ẩn danh có thể chặn ghi — giỏ hàng vẫn chạy trong phiên này
    }
  }, [raw, voucherCode, ready]);

  // Tự ẩn thông báo sau 4 giây
  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 4000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const add = useCallback((slug: string, quantity: number, color: string) => {
    setRaw((prev) => {
      const existing = prev.find((line) => sameLine(line, slug, color));
      if (existing) {
        return prev.map((line) =>
          sameLine(line, slug, color)
            ? { ...line, quantity: Math.min(line.quantity + quantity, 99) }
            : line,
        );
      }
      return [...prev, { slug, color, quantity }];
    });
    setFlash({ slug, color, quantity });
  }, []);

  const setQuantity = useCallback(
    (slug: string, color: string, quantity: number) => {
      setRaw((prev) =>
        quantity <= 0
          ? prev.filter((line) => !sameLine(line, slug, color))
          : prev.map((line) =>
              sameLine(line, slug, color)
                ? { ...line, quantity: Math.min(quantity, 99) }
                : line,
            ),
      );
    },
    [],
  );

  const setNote = useCallback((slug: string, color: string, note: string) => {
    setRaw((prev) =>
      prev.map((line) =>
        sameLine(line, slug, color) ? { ...line, note: note.slice(0, 300) } : line,
      ),
    );
  }, []);

  const remove = useCallback((slug: string, color: string) => {
    setRaw((prev) => prev.filter((line) => !sameLine(line, slug, color)));
  }, []);

  const clear = useCallback(() => {
    setRaw([]);
    setVoucherCode(null);
  }, []);

  const lines = useMemo<DetailedLine[]>(() => {
    return raw.flatMap((line) => {
      const product = getProduct(line.slug);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });
  }, [raw]);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const savings = lines.reduce(
      (sum, line) =>
        sum +
        (line.product.oldPrice
          ? (line.product.oldPrice - line.product.price) * line.quantity
          : 0),
      0,
    );

    const voucher = voucherCode ? (findVoucher(voucherCode) ?? null) : null;
    // Giỏ hàng thay đổi có thể làm đơn tụt xuống dưới mức tối thiểu của mã
    const voucherDiscount = discountOf(voucher, subtotal);

    return {
      ready,
      lines,
      count,
      subtotal,
      savings,
      add,
      setQuantity,
      setNote,
      remove,
      clear,
      voucher,
      voucherDiscount,
      applyVoucher: (code: string) => {
        const result = checkVoucher(code, subtotal);
        if (!result.ok) return { ok: false, error: result.error };
        setVoucherCode(result.voucher.code);
        return { ok: true };
      },
      removeVoucher: () => setVoucherCode(null),
      flash,
      dismissFlash: () => setFlash(null),
    };
  }, [lines, ready, add, setQuantity, setNote, remove, clear, flash, voucherCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải được dùng bên trong <CartProvider>");
  return context;
}

/* --------------------------- Phí vận chuyển --------------------------- */

export type ShippingZone = "noi-thanh" | "ngoai-thanh" | "tinh-khac";

export const shippingZones: { value: ShippingZone; label: string; note: string }[] = [
  {
    value: "noi-thanh",
    label: "Nội thành Gia Lai / TP.HCM",
    note: "Miễn phí giao & lắp đặt",
  },
  {
    value: "ngoai-thanh",
    label: "Ngoại thành Gia Lai / TP.HCM",
    note: "Miễn phí cho đơn từ 10 triệu",
  },
  {
    value: "tinh-khac",
    label: "Tỉnh thành khác",
    note: "Miễn phí cho đơn từ 20 triệu",
  },
];

export function shippingFee(zone: ShippingZone, subtotal: number) {
  if (zone === "noi-thanh") return 0;
  if (zone === "ngoai-thanh") return subtotal >= 10_000_000 ? 0 : 300_000;
  return subtotal >= 20_000_000 ? 0 : 500_000;
}
