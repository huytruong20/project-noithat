import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * KẾT NỐI CƠ SỞ DỮ LIỆU
 *
 * Website chạy được ở CẢ HAI chế độ:
 *
 *   Chưa đặt DATABASE_URL → dữ liệu ghi ra file JSON trong .data/
 *                            (đủ dùng khi chạy thử trên máy cá nhân)
 *
 *   Đã đặt DATABASE_URL   → dữ liệu vào Postgres
 *                            (bắt buộc khi chạy thật)
 *
 * Chuyển chế độ chỉ bằng cách dán chuỗi kết nối vào .env.local rồi khởi động
 * lại — không phải sửa một dòng mã nào. Làm vậy để trang không bị chết trong
 * lúc chờ dựng cơ sở dữ liệu, và để lỡ Postgres có trục trặc thì vẫn còn đường
 * chạy tạm.
 *
 * ⚠️ Nền tảng serverless (Vercel, Netlify) KHÔNG cho ghi file. Deploy lên đó
 * mà chưa đặt DATABASE_URL thì tài khoản và đơn hàng sẽ mất sau mỗi lần deploy.
 */

const chuoiKetNoi = process.env.DATABASE_URL;

/**
 * Lúc phát triển, Next nạp lại mã sau mỗi lần sửa file. Nếu tạo PrismaClient
 * mới ở mỗi lần nạp thì sau vài chục lần sửa sẽ mở hết số kết nối cho phép và
 * cơ sở dữ liệu từ chối phục vụ. Cất client vào biến toàn cục để dùng lại.
 */
const toanCuc = globalThis as unknown as { prismaHT?: PrismaClient | null };

function taoClient() {
  if (!chuoiKetNoi) return null;

  try {
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: chuoiKetNoi }),
    });
  } catch (loi) {
    // Chuỗi kết nối sai định dạng. Báo ra để người dựng biết mà sửa, rồi quay
    // về chế độ file thay vì để cả trang không mở được.
    console.error(
      "[Nội thất HT] Không tạo được kết nối cơ sở dữ liệu, tạm dùng file .data/:",
      loi,
    );
    return null;
  }
}

export const prisma: PrismaClient | null =
  toanCuc.prismaHT !== undefined
    ? toanCuc.prismaHT
    : (toanCuc.prismaHT = taoClient());

/** true khi đang chạy trên Postgres, false khi đang ghi file JSON. */
export const dungPostgres = prisma !== null;
