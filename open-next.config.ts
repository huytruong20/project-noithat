import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cấu hình chuyển Next.js sang chạy trên Cloudflare Workers.
 * Để mặc định: không dùng bộ nhớ đệm tăng dần (ISR) nên chưa cần khai kho R2.
 */
export default defineCloudflareConfig();
