/** @type {import('next').NextConfig} */
const nextConfig = {
  // OpenNext tự bật chế độ này khi đóng gói cho Cloudflare; khai sẵn ở đây để
  // chạy `next build` tay cũng ra cùng một kết quả.
  output: "standalone",

  images: {
    // Ảnh sản phẩm thật có thể để ở /public/images hoặc trỏ về CDN.
    // Thêm host vào đây khi dùng CDN, ví dụ res.cloudinary.com.
    remotePatterns: [],
  },
};

export default nextConfig;
