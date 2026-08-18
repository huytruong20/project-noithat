/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ảnh sản phẩm thật có thể để ở /public/images hoặc trỏ về CDN.
    // Thêm host vào đây khi dùng CDN, ví dụ res.cloudinary.com.
    remotePatterns: [],
  },
};

export default nextConfig;
