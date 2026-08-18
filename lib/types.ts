export type ColorOption = {
  name: string;
  hex: string;
};

export type Spec = {
  label: string;
  value: string;
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  /** Màu nền dùng cho ảnh placeholder khi chưa có ảnh thật */
  tint: string;
};

export type RoomCollection = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  tint: string;
  /** Ảnh không gian thật, để trống sẽ dùng placeholder */
  image?: string;
  /** Danh mục thường xuất hiện trong không gian này */
  categories: string[];
};

/** Phong cách thiết kế — dùng làm bộ lọc ở trang danh mục */
export type StyleSlug =
  | "hien-dai"
  | "bac-au"
  | "toi-gian"
  | "indochine"
  | "cong-nghiep"
  | "co-dien";

export type QaItem = {
  question: string;
  answer: string;
  asker: string;
  daysAgo: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  rooms: string[];
  style: StyleSlug;
  price: number;
  /** Giá gốc trước giảm, dùng để hiện gạch ngang */
  oldPrice?: number;
  short: string;
  description: string;
  /** D x R x C tính bằng cm */
  dimensions: { long: number; wide: number; high: number };
  /** Trọng lượng tịnh, kg */
  weight: number;
  /** Tải trọng cho phép, kg. Bỏ trống với đồ không chịu lực (thảm, tranh, đèn) */
  loadCapacity?: number;
  materials: string[];
  colors: ColorOption[];
  warrantyMonths: number;
  shipping: string;
  leadTime: string;
  /** Phí lắp đặt. Bỏ trống sẽ hiểu là đã gồm trong giá bán */
  installNote?: string;
  /** Hướng dẫn bảo quản riêng. Bỏ trống sẽ tự suy ra từ chất liệu */
  careOverride?: string[];
  /** Hỏi đáp về sản phẩm. Bỏ trống sẽ dùng bộ câu hỏi chung theo danh mục */
  qa?: QaItem[];
  /** Sản phẩm thường mua kèm. Bỏ trống sẽ tự gợi ý theo không gian sử dụng */
  bundleWith?: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  sold: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  specs: Spec[];
  /** Số góc chụp giả lập trong thư viện ảnh */
  views: number;
  /** Ảnh đại diện. Để trống sẽ dùng placeholder dựng sẵn. VD: "/images/products/sofa-mila.jpg" */
  image?: string;
  /** Các góc chụp khác cho thư viện ảnh. Có ảnh thật thì `views` bị bỏ qua. */
  images?: string[];
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  location: string;
  area: string;
  year: number;
  budget: string;
  scope: string[];
  summary: string;
  story: string;
  quote: { text: string; author: string; role: string };
  productSlugs: string[];
  tint: string;
  /** Ảnh bìa dự án, để trống sẽ dùng placeholder */
  image?: string;
  /** Album ảnh dự án */
  images?: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  body: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  tint: string;
  /** Ảnh bìa bài viết, để trống sẽ dùng placeholder */
  image?: string;
};

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export type CartLine = {
  slug: string;
  quantity: number;
  color: string;
  /** Ghi chú riêng cho dòng hàng này, ví dụ yêu cầu về màu hoặc kích thước */
  note?: string;
};
