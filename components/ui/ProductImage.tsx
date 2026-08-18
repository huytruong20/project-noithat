import type { Product } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import {
  productImages,
  categoryImages,
  roomImages,
  projectImages,
  blogImages,
} from "@/lib/data/images.generated";
import {
  anhSanPham,
  anhDanhMuc,
  anhKhongGian,
  anhDuAn,
  anhBaiViet,
} from "@/lib/data/anh-ben-ngoai";

/**
 * Gộp ảnh từ URL bên ngoài với ảnh chép vào public/images.
 * Ảnh khai báo bằng URL được ưu tiên trước.
 */
function anhCua(slug: string, ngoai: Record<string, string[]>, trongMay: Record<string, string[]>) {
  return ngoai[slug] ?? trongMay[slug] ?? [];
}

/**
 * Ảnh sản phẩm dựng bằng SVG. Khi có ảnh chụp thật, chỉ cần điền `product.image`
 * trong lib/data/products.ts là component tự chuyển sang dùng ảnh đó.
 */

const silhouettes: Record<string, React.ReactNode> = {
  sofa: (
    <g>
      <path d="M30 92h140v18H30z" />
      <path d="M38 92V64a10 10 0 0110-10h104a10 10 0 0110 10v28" />
      <path d="M38 74h124" />
      <path d="M62 74V54M100 74V54M138 74V54" />
      <path d="M44 110v10M156 110v10" />
    </g>
  ),
  "ban-ghe": (
    <g>
      <path d="M70 100h60V64a12 12 0 00-12-12H82a12 12 0 00-12 12z" />
      <path d="M70 84h60" />
      <path d="M76 100l-6 24M124 100l6 24" />
      <path d="M78 112h44" />
    </g>
  ),
  giuong: (
    <g>
      <path d="M28 96h144v14H28z" />
      <path d="M34 96V60a8 8 0 018-8h12a8 8 0 018 8v36" />
      <path d="M62 78h110v18H62z" />
      <path d="M166 78V64" />
      <path d="M34 110v12M172 110v12" />
    </g>
  ),
  "tu-ke": (
    <g>
      <path d="M52 32h96v88H52z" />
      <path d="M100 32v88" />
      <path d="M52 62h96M52 92h96" />
      <path d="M88 46h8M104 46h8" />
    </g>
  ),
  "ban-an": (
    <g>
      <path d="M26 62h148v8H26z" />
      <path d="M44 70v46M156 70v46" />
      <path d="M44 96h112" />
      <path d="M70 70v-8M130 70v-8" />
    </g>
  ),
  "trang-tri": (
    <g>
      <path d="M84 52h32l-6 16c10 6 16 16 16 28 0 14-12 24-26 24s-26-10-26-24c0-12 6-22 16-28z" />
      <path d="M100 52V34" />
      <path d="M100 34c-8-6-16-6-20-2 6 8 14 8 20 2zM100 34c8-6 16-6 20-2-6 8-14 8-20 2z" />
    </g>
  ),
  "van-phong": (
    <g>
      <path d="M32 74h136v7H32z" />
      <path d="M48 81v40M152 81v40" />
      <path d="M72 74V50h56v24z" />
      <path d="M84 62h32" />
      <path d="M40 121h20M140 121h20" />
    </g>
  ),
  "den-chieu-sang": (
    <g>
      <path d="M72 40h56l16 34H56z" />
      <path d="M100 74v42" />
      <path d="M74 122h52" />
      <path d="M100 116c-8 0-14 3-16 6h32c-2-3-8-6-16-6z" />
    </g>
  ),
};

function tintFor(categorySlug: string) {
  return categories.find((c) => c.slug === categorySlug)?.tint ?? "#c9b7a2";
}

/**
 * Một danh mục có thể chứa nhiều dáng đồ khác nhau — ví dụ "Bàn ghế" gồm cả ghế
 * lẫn bàn trà và đôn. Đoán theo tên sản phẩm trước, không khớp mới lấy hình
 * mặc định của danh mục.
 */
const nameHints: { pattern: RegExp; shape: string }[] = [
  { pattern: /sofa giường|sofa/i, shape: "sofa" },
  { pattern: /^bàn trà|bàn trà|bàn ăn|bàn làm việc|bàn nâng hạ/i, shape: "ban-an" },
  { pattern: /giường|tab đầu giường/i, shape: "giuong" },
  { pattern: /tủ|kệ/i, shape: "tu-ke" },
  { pattern: /đèn/i, shape: "den-chieu-sang" },
  { pattern: /ghế|đôn/i, shape: "ban-ghe" },
  { pattern: /bình|gương|tranh|thảm/i, shape: "trang-tri" },
];

function shapeFor(product: Product) {
  const hit = nameHints.find((entry) => entry.pattern.test(product.name));
  return silhouettes[hit?.shape ?? product.category] ?? silhouettes.sofa;
}

export function ProductImage({
  product,
  view = 0,
  className = "",
  priority = false,
}: {
  product: Product;
  view?: number;
  className?: string;
  priority?: boolean;
}) {
  /*
    Thứ tự ưu tiên khi chọn ảnh:
    1. Ảnh khai báo tay trong products.ts (images / image)
    2. Ảnh tự quét được từ public/images/products theo tên file trùng slug
    3. Không có gì thì vẽ ảnh minh hoạ bên dưới
  */
  const sanCo = anhCua(product.slug, anhSanPham, productImages);
  const real =
    product.images?.[view] ??
    (view === 0 ? product.image : undefined) ??
    sanCo[view];

  if (real) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={real}
        alt={product.name}
        className={`h-full w-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  const tint = tintFor(product.category);
  const shape = shapeFor(product);
  const id = `${product.slug}-${view}`;
  const kind = viewKinds[view % viewKinds.length];
  // Đổi hướng nền và độ lớn theo từng góc để thư viện ảnh không lặp lại
  const angle = 20 + view * 35;
  const scale = kind === "goc-nghieng" ? 1.12 : 1;

  return (
    <svg
      viewBox="0 0 200 250"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${product.name} — ${viewLabels[view % viewLabels.length]}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${id}`} gradientTransform={`rotate(${angle})`}>
          <stop offset="0%" stopColor={tint} stopOpacity="0.5" />
          <stop offset="55%" stopColor={tint} stopOpacity="0.24" />
          <stop offset="100%" stopColor="#faf7f2" stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="30%" cy="14%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Mảng màu nhạt tô vào thân đồ vật cho hình có khối, không chỉ là nét */}
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.38" />
        </linearGradient>
        {/* Bóng đổ mềm dưới chân, thay cho hình bầu dục phẳng */}
        <radialGradient id={`shadow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1c1a17" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#1c1a17" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1c1a17" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="200" height="250" fill="#f6f1e9" />
      <rect width="200" height="250" fill={`url(#bg-${id})`} />
      <rect width="200" height="250" fill={`url(#glow-${id})`} />

      {kind === "chat-lieu" ? (
        <MaterialSwatch product={product} tint={tint} />
      ) : (
        <>
          {/* Góc "trong không gian": thêm gợi ý tường, cửa sổ và mặt sàn */}
          {kind === "khong-gian" && (
            <g stroke="#1c1a17" strokeOpacity="0.14" strokeWidth="1.6" fill="none">
              <rect x="24" y="46" width="56" height="66" rx="2" />
              <path d="M52 46v66M24 79h56" />
              <path d="M0 172h200" />
              <path d="M150 172v-34h26v34" />
            </g>
          )}

          {/* Bóng đổ mềm, loang dần ra hai bên */}
          <ellipse
            cx={100}
            cy={188}
            rx={70 * scale}
            ry={13}
            fill={`url(#shadow-${id})`}
          />

          <g transform={`translate(100 125) scale(${scale}) translate(-100 -70)`}>
            {/* Lớp 1: tô khối cho hình có chiều sâu */}
            <g fill={`url(#fill-${id})`} stroke="none">
              {shape}
            </g>
            {/* Lớp 2: nét viền vẽ đè lên trên */}
            <g
              fill="none"
              stroke="#1c1a17"
              strokeOpacity="0.42"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {shape}
            </g>
          </g>
        </>
      )}
    </svg>
  );
}

/* ---------------------- Góc chụp trong thư viện ảnh ---------------------- */

/**
 * Bốn góc chụp chuẩn cho mọi sản phẩm. Khi chụp ảnh thật, xếp file theo đúng
 * thứ tự này trong `product.images` là nhãn dưới ảnh sẽ khớp.
 */
export const viewKinds = ["tong-the", "goc-nghieng", "chat-lieu", "khong-gian"] as const;

export const viewLabels = [
  "Tổng thể",
  "Góc nghiêng",
  "Cận chất liệu",
  "Trong không gian",
];

/**
 * Sản phẩm này đã có ảnh chụp thật chưa?
 * Dùng để chọn sản phẩm cho khối ảnh trang chủ — chỗ đó không nên lẫn
 * ảnh minh hoạ vào giữa các ảnh thật vì nhìn sẽ như thiếu ảnh.
 */
export function coAnhThat(product: Product) {
  if (product.image || product.images?.length) return true;
  return anhCua(product.slug, anhSanPham, productImages).length > 0;
}

/** Số ảnh hiện trong thư viện: ưu tiên ảnh thật, không có thì dùng ảnh minh hoạ */
export function galleryLength(product: Product) {
  if (product.images?.length) return product.images.length;
  const sanCo = anhCua(product.slug, anhSanPham, productImages).length;
  return sanCo > 0 ? sanCo : product.views;
}

/* --------------------- Ảnh cận chất liệu (placeholder) -------------------- */

/** Vẽ mặt cắt chất liệu tương ứng: vân gỗ, sợi vải, da, kim loại hay đá */
function MaterialSwatch({ product, tint }: { product: Product; tint: string }) {
  const text = product.materials.join(" ").toLowerCase();
  const stroke = { stroke: "#1c1a17", strokeOpacity: 0.28, fill: "none" as const };

  let texture: React.ReactNode;

  if (/vải|nỉ|nhung|linen|len|lưới/.test(text)) {
    // Sợi vải dệt ngang dọc
    texture = (
      <g {...stroke} strokeWidth="1.4">
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={`h${i}`} d={`M40 ${72 + i * 11}h120`} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={`v${i}`} d={`M${40 + i * 12} 72v110`} strokeOpacity="0.14" />
        ))}
      </g>
    );
  } else if (/\bda\b|microfiber/.test(text)) {
    // Vân da hạt
    texture = (
      <g fill="#1c1a17" fillOpacity="0.12">
        {Array.from({ length: 40 }).map((_, i) => (
          <ellipse
            key={i}
            cx={46 + (i % 8) * 15 + ((i % 3) - 1) * 3}
            cy={78 + Math.floor(i / 8) * 21 + ((i % 2) - 0.5) * 5}
            rx={5.5}
            ry={4}
          />
        ))}
      </g>
    );
  } else if (/ceramic|đá|kính|gốm/.test(text)) {
    // Vân đá
    texture = (
      <g {...stroke} strokeWidth="1.5">
        <path d="M40 108c22 14 36-8 58 4s34-6 62 8" />
        <path d="M40 138c26 10 32-12 56-2s40-2 64 10" strokeOpacity="0.18" />
        <path d="M40 166c18 8 40-6 60 2s38-4 60 6" strokeOpacity="0.14" />
      </g>
    );
  } else if (/thép|nhôm|đồng|gang|sắt/.test(text)) {
    // Kim loại xước mờ
    texture = (
      <g {...stroke} strokeWidth="1">
        {Array.from({ length: 22 }).map((_, i) => (
          <path key={i} d={`M42 ${76 + i * 5}h116`} strokeOpacity={i % 3 ? 0.1 : 0.22} />
        ))}
      </g>
    );
  } else {
    // Mặc định: vân gỗ
    texture = (
      <g {...stroke} strokeWidth="1.6">
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M40 ${82 + i * 16}c30 ${i % 2 ? -8 : 8} 60 ${i % 2 ? 8 : -8} 120 0`}
            strokeOpacity={i % 2 ? 0.16 : 0.3}
          />
        ))}
        <ellipse cx="118" cy="130" rx="13" ry="8" strokeOpacity="0.3" />
        <ellipse cx="118" cy="130" rx="6" ry="3.5" strokeOpacity="0.24" />
      </g>
    );
  }

  return (
    <g>
      {/* Khung mẫu vật liệu, bo nhẹ như một tấm swatch đặt trên nền */}
      <rect x="40" y="70" width="120" height="114" fill={tint} fillOpacity="0.35" />
      <rect
        x="40"
        y="70"
        width="120"
        height="114"
        fill="none"
        stroke="#1c1a17"
        strokeOpacity="0.18"
      />
      {texture}
      <text
        x="100"
        y="204"
        textAnchor="middle"
        fontSize="9"
        fill="#1c1a17"
        fillOpacity="0.45"
        fontFamily="sans-serif"
        letterSpacing="1.4"
      >
        CẬN CHẤT LIỆU
      </text>
    </g>
  );
}

/**
 * Ảnh đại diện cho một danh mục — dùng đúng hình khối của nhóm đồ đó
 * để tám ô danh mục không trông giống hệt nhau.
 */
export function CategoryImage({
  categorySlug,
  seed = 0,
  label,
  src,
  className = "",
}: {
  categorySlug: string;
  seed?: number;
  label?: string;
  src?: string;
  className?: string;
}) {
  // Ảnh khai báo tay → ảnh từ URL bên ngoài → ảnh chép vào public/images
  src ??= anhCua(categorySlug, anhDanhMuc, categoryImages)[0];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={label ?? ""}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const tint = tintFor(categorySlug);
  const shape = silhouettes[categorySlug] ?? silhouettes.sofa;
  const id = `cat-${categorySlug}-${seed}`;

  return (
    <svg
      viewBox="0 0 200 140"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label ?? categorySlug}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`cg-${id}`} gradientTransform={`rotate(${25 + seed * 20})`}>
          <stop offset="0%" stopColor={tint} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#faf7f2" stopOpacity="0.92" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="#f4efe6" />
      <rect width="200" height="140" fill={`url(#cg-${id})`} />
      <ellipse cx="100" cy="124" rx="52" ry="6" fill="#1c1a17" opacity="0.08" />
      <g
        fill="none"
        stroke="#1c1a17"
        strokeOpacity="0.45"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shape}
      </g>
    </svg>
  );
}

/**
 * Khối ảnh cho không gian, dự án và bài viết.
 * Truyền `src` là ảnh thật thì dùng ảnh, không thì vẽ placeholder theo tông màu.
 */
export function SceneImage({
  tint,
  seed = 0,
  label,
  src,
  kind,
  slug,
  index = 0,
  className = "",
}: {
  tint: string;
  seed?: number;
  label?: string;
  src?: string;
  /** Loại nội dung, để tự tìm ảnh đã quét trong public/images */
  kind?: "rooms" | "projects" | "blog";
  /** Slug của không gian / dự án / bài viết */
  slug?: string;
  /** Ảnh thứ mấy trong album (dùng cho dự án) */
  index?: number;
  className?: string;
}) {
  // Ảnh khai báo tay → ảnh từ URL bên ngoài → ảnh chép vào public/images
  if (!src && kind && slug) {
    const ngoai = { rooms: anhKhongGian, projects: anhDuAn, blog: anhBaiViet };
    const trongMay = { rooms: roomImages, projects: projectImages, blog: blogImages };
    src = anhCua(slug, ngoai[kind], trongMay[kind])[index];
  }

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={label ?? ""}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const id = `scene-${tint.replace("#", "")}-${seed}`;
  const angle = 15 + seed * 27;
  return (
    <svg
      viewBox="0 0 200 140"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label ?? "Ảnh không gian"}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} gradientTransform={`rotate(${angle})`}>
          <stop offset="0%" stopColor={tint} stopOpacity="0.75" />
          <stop offset="60%" stopColor={tint} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#faf7f2" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="#f2ece2" />
      <rect width="200" height="140" fill={`url(#${id})`} />
      {/* Gợi ý khung cửa sổ và mặt sàn cho cảm giác không gian */}
      <g stroke="#1c1a17" strokeOpacity="0.16" strokeWidth="1.6" fill="none">
        <rect x={26 + seed * 4} y="20" width="52" height="60" rx="2" />
        <path d={`M${52 + seed * 4} 20v60M${26 + seed * 4} 50h52`} />
        <path d="M0 104h200" />
      </g>
      <ellipse cx={130} cy={112} rx={46} ry={7} fill="#1c1a17" opacity="0.08" />
      <g
        fill="none"
        stroke="#1c1a17"
        strokeOpacity="0.32"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {sceneCompositions[seed % sceneCompositions.length]}
      </g>
    </svg>
  );
}

/** Vài cách bày đồ khác nhau để các ảnh không gian không trùng nhau */
const sceneCompositions: React.ReactNode[] = [
  // Sofa và bàn trà
  <g key="0">
    <path d="M96 108h68V88a8 8 0 00-8-8h-52a8 8 0 00-8 8z" />
    <path d="M96 94h68" />
    <path d="M104 108v6M156 108v6" />
    <path d="M62 100h26M66 100v8M84 100v8" />
  </g>,
  // Giường và tab đầu giường
  <g key="1">
    <path d="M92 108h76V92H92z" />
    <path d="M92 92V74h14v18" />
    <path d="M168 108v6M92 108v6" />
    <path d="M172 108h18V92h-18z" />
  </g>,
  // Bàn ăn và ghế
  <g key="2">
    <path d="M88 88h84v5H88z" />
    <path d="M98 93v18M162 93v18" />
    <path d="M112 88V74M148 88V74" />
    <path d="M60 96h20v14M60 96V80" />
  </g>,
  // Bàn làm việc và ghế xoay
  <g key="3">
    <path d="M96 86h72v5H96z" />
    <path d="M102 91v20M162 91v20" />
    <path d="M118 86V70h28v16" />
    <path d="M60 92h22M70 92v16M60 108h20" />
  </g>,
  // Kệ và đèn cây
  <g key="4">
    <path d="M100 62h58v46h-58z" />
    <path d="M100 84h58M129 62v46" />
    <path d="M176 108V72M168 72h16l-6-12h-4z" />
  </g>,
];
