import { config as napBienMoiTruong } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * Cấu hình cho các lệnh dòng lệnh của Prisma (npm run db:day, db:xem).
 *
 * Từ Prisma 7, chuỗi kết nối không viết trong schema.prisma nữa mà đưa vào đây.
 * Web khi chạy thì đọc cùng biến DATABASE_URL ở lib/auth/db.ts.
 */

/*
  Next.js đọc .env.local, còn dotenv mặc định chỉ đọc .env — phải chỉ rõ cả hai,
  không thì gõ lệnh sẽ báo thiếu chuỗi kết nối dù web vẫn chạy bình thường.
  Đặt .env.local trước để nó thắng khi hai file cùng khai một biến.
*/
napBienMoiTruong({ path: [".env.local", ".env"], quiet: true });

const chuoiKetNoi = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",

  /*
    Chỉ khai datasource khi thật sự có chuỗi kết nối. Khai kèm giá trị rỗng thì
    những lệnh KHÔNG cần tới cơ sở dữ liệu (prisma generate, migrate diff) cũng
    bị chặn — mà đó lại là các lệnh cần chạy được trước khi có database.
  */
  ...(chuoiKetNoi ? { datasource: { url: chuoiKetNoi } } : {}),
});
