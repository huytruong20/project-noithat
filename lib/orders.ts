import type { CartLine } from "@/lib/types";

/**
 * Lưu đơn hàng ở localStorage để trang "Tra cứu đơn" có dữ liệu thật mà xem.
 * Khi nối backend, thay hai hàm saveOrder/findOrders bằng lời gọi API là đủ —
 * phần giao diện không cần sửa.
 */

const STORAGE_KEY = "noithatht.orders.v1";

export type OrderStatus =
  | "cho-xac-nhan"
  | "dang-chuan-bi"
  | "dang-giao"
  | "hoan-tat";

export const orderStatusLabels: Record<OrderStatus, string> = {
  "cho-xac-nhan": "Chờ xác nhận",
  "dang-chuan-bi": "Đang chuẩn bị hàng",
  "dang-giao": "Đang giao & lắp đặt",
  "hoan-tat": "Đã hoàn tất",
};

export const orderSteps: OrderStatus[] = [
  "cho-xac-nhan",
  "dang-chuan-bi",
  "dang-giao",
  "hoan-tat",
];

export type Order = {
  code: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    note?: string;
  };
  items: (CartLine & { name: string; price: number })[];
  subtotal: number;
  /** Số tiền giảm nhờ mã voucher */
  discount?: number;
  voucherCode?: string;
  shipping: number;
  total: number;
  payment: string;
  /** Đơn đặt nhanh qua điện thoại, chưa có địa chỉ đầy đủ */
  quick?: boolean;
};

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  try {
    const all = loadOrders();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...all]));
  } catch {
    // Không ghi được thì bỏ qua, đơn vẫn hiển thị ở trang cảm ơn
  }
}

/** Tra theo mã đơn hoặc số điện thoại đặt hàng */
export function findOrders(keyword: string): Order[] {
  const key = keyword.trim().toLowerCase().replace(/\s/g, "");
  if (!key) return [];
  return loadOrders().filter(
    (order) =>
      order.code.toLowerCase() === key ||
      order.customer.phone.replace(/\s/g, "") === key,
  );
}
