import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

/**
 * KẾT NỐI CƠ SỞ DỮ LIỆU
 *
 * Website chạy được ở CẢ HAI chế độ:
 *
 *   Chưa đặt DATABASE_URL → dữ liệu ghi ra file JSON trong .data/
 *                            (chỉ dùng được khi chạy trên máy cá nhân)
 *
 *   Đã đặt DATABASE_URL   → dữ liệu vào Postgres của Neon
 *                            (bắt buộc khi chạy thật)
 *
 * ⚠️ Vercel, Netlify và Cloudflare đều KHÔNG cho ghi file. Deploy lên đó mà
 * chưa đặt DATABASE_URL thì phần đăng nhập và đơn hàng sẽ hỏng.
 *
 * ⚠️ ĐANG DÙNG NEON. Trình điều khiển của Neon nối qua WebSocket chứ không mở
 * cổng TCP như thư viện Postgres thông thường, nên nó CHỈ nói chuyện được với
 * cơ sở dữ liệu Neon. Muốn đổi sang Supabase, Railway hay máy chủ Postgres tự
 * dựng thì phải thay `@prisma/adapter-neon` bằng `@prisma/adapter-pg` — nhưng
 * khi đó không deploy lên Cloudflare được nữa (xem phần dưới).
 *
 * VÌ SAO KHÔNG DÙNG `pg` CHO MÁY NHÀ VÀ NEON CHO CLOUDFLARE:
 * Đã thử và không đóng gói được. Dù `pg` chỉ được nạp bằng `await import` và
 * không bao giờ chạy trên Cloudflare, bộ dò phụ thuộc của Next vẫn kéo nó vào
 * gói mang lên, rồi esbuild gãy ở dòng `require("pg-cloudflare")` bên trong
 * `pg/lib/stream.js`. Dùng chung một trình điều khiển cho cả hai nơi là cách
 * duy nhất tránh được, và cũng giúp môi trường chạy thử giống môi trường thật.
 */

const chuoiKetNoi = process.env.DATABASE_URL;

/** true khi đang chạy trên Postgres, false khi đang ghi file JSON. */
export const dungPostgres = Boolean(chuoiKetNoi);

/**
 * Đang chạy trên Cloudflare Workers hay máy chủ Node bình thường?
 * Cloudflare tự khai userAgent này cho mọi Worker — đây là cách nhận biết
 * chính thức mà Cloudflare khuyến nghị.
 */
const laCloudflare =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

/**
 * Giữ một client duy nhất.
 *
 * Lúc phát triển, Next nạp lại mã sau mỗi lần sửa file; tạo client mới mỗi lần
 * sẽ mở hết số kết nối cho phép và cơ sở dữ liệu từ chối phục vụ.
 */
const toanCuc = globalThis as unknown as {
  prismaHT?: Promise<PrismaClient> | null;
};

async function taoClient(): Promise<PrismaClient> {
  /*
    Trên Cloudflare, WebSocket là API có sẵn của nền tảng nên không phải làm gì.
    Trên Node thì trình điều khiển Neon cần được chỉ chỗ lấy WebSocket. Gói `ws`
    nạp bằng `await import` và chỉ ở nhánh này, nên bản đóng gói cho Cloudflare
    không đụng tới nó.
  */
  if (!laCloudflare && !neonConfig.webSocketConstructor) {
    const ws = await import("ws");
    neonConfig.webSocketConstructor = ws.default;
  }

  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: chuoiKetNoi }),
  }) as unknown as PrismaClient;
}

/**
 * Lấy client để chạy truy vấn.
 * Chỉ gọi khi dungPostgres === true; gọi lúc chưa cấu hình sẽ ném lỗi rõ ràng.
 */
export function layPrisma(): Promise<PrismaClient> {
  if (!chuoiKetNoi) {
    throw new Error(
      "Chưa đặt DATABASE_URL — không có cơ sở dữ liệu để truy vấn. " +
        "Xem HUONG-DAN-DATABASE.md.",
    );
  }

  return (toanCuc.prismaHT ??= taoClient());
}
