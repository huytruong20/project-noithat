/**
 * Quét thư mục public/images và tự ghép ảnh vào đúng sản phẩm, danh mục,
 * không gian, dự án, bài viết — dựa trên TÊN FILE.
 *
 * Chạy: npm run anh
 * (đã gắn sẵn vào predev/prebuild nên chạy `npm run dev` là tự quét)
 *
 * Quy tắc đặt tên: lấy đúng slug của mục cần gắn ảnh.
 *   public/images/products/sofa-vang-mila.jpg      -> ảnh đại diện
 *   public/images/products/sofa-vang-mila-1.jpg    -> ảnh 1 trong thư viện
 *   public/images/products/sofa-vang-mila-2.jpg    -> ảnh 2 ...
 */

import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();
const IMG_DIR = join(ROOT, "public", "images");

/** Định dạng ảnh chấp nhận được */
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

const FOLDERS = {
  products: "products",
  categories: "categories",
  rooms: "rooms",
  projects: "projects",
  blog: "blog",
};

/**
 * Đọc một thư mục và gom file theo slug.
 * "sofa-mila.jpg" và "sofa-mila-2.jpg" đều thuộc slug "sofa-mila".
 */
function scan(folder) {
  const dir = join(IMG_DIR, folder);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return {};
  }

  const groups = {};
  for (const file of readdirSync(dir)) {
    const ext = extname(file).toLowerCase();
    if (!EXT.has(ext)) continue;

    const name = basename(file, ext);
    // Tách hậu tố -1, -2 ở cuối tên để biết ảnh thuộc slug nào
    const match = name.match(/^(.*?)-(\d+)$/);
    const slug = match ? match[1] : name;
    const order = match ? Number(match[2]) : 0;

    (groups[slug] ??= []).push({ order, path: `/images/${folder}/${file}` });
  }

  // Sắp xếp: ảnh không có số đứng trước, rồi tới -1, -2, -3...
  const result = {};
  for (const [slug, items] of Object.entries(groups)) {
    items.sort((a, b) => a.order - b.order);
    result[slug] = items.map((item) => item.path);
  }
  return result;
}

const data = {
  products: scan(FOLDERS.products),
  categories: scan(FOLDERS.categories),
  rooms: scan(FOLDERS.rooms),
  projects: scan(FOLDERS.projects),
  blog: scan(FOLDERS.blog),
};

/* ------------------------- Ghi file dữ liệu ------------------------- */

const header = `// FILE NÀY ĐƯỢC TẠO TỰ ĐỘNG — ĐỪNG SỬA TAY.
// Sinh bởi scripts/quet-anh.mjs, chạy lại bằng: npm run anh
//
// Muốn thêm ảnh: chép file vào public/images/<thư mục>/<slug>.jpg
// rồi chạy npm run dev (script tự chạy trước khi khởi động).

export type ImageMap = Record<string, string[]>;
`;

/** Tên biến xuất ra cho từng thư mục */
const exportNames = {
  products: "productImages",
  categories: "categoryImages",
  rooms: "roomImages",
  projects: "projectImages",
  blog: "blogImages",
};

const body = Object.entries(data)
  .map(
    ([key, value]) =>
      `export const ${exportNames[key]}: ImageMap = ${JSON.stringify(value, null, 2)};`,
  )
  .join("\n\n");

writeFileSync(
  join(ROOT, "lib", "data", "images.generated.ts"),
  `${header}\n${body}\n`,
  "utf8",
);

/* ------------------ Danh sách ảnh cần chụp cho từng món ------------------ */

const read = (p) => readFileSync(join(ROOT, p), "utf8");

/** Rút slug + tên từ file dữ liệu để biết cần chụp ảnh cho những món nào */
function extract(source, keys) {
  const [first, second] = keys;
  const re = new RegExp(
    `${first}:\\s*"([^"]+)",\\s*[\\r\\n]+\\s*${second}:\\s*"([^"]+)"`,
    "g",
  );
  return [...source.matchAll(re)].map((m) => ({ slug: m[1], name: m[2] }));
}

const productSrc = read("lib/data/products.ts");
const categorySrc = read("lib/data/categories.ts");
const projectSrc = read("lib/data/projects.ts");
const postSrc = read("lib/data/posts.ts");

// categories.ts chứa cả danh mục lẫn không gian — cắt theo mốc khai báo
const splitAt = categorySrc.indexOf("export const roomCollections");
const cats = extract(categorySrc.slice(0, splitAt), ["slug", "name"]);
const rooms = extract(categorySrc.slice(splitAt), ["slug", "name"]);
const projects = extract(projectSrc, ["slug", "title"]);
const posts = extract(postSrc, ["slug", "title"]);

// Sản phẩm cần thêm danh mục để gom nhóm cho dễ chụp
const productRe =
  /slug:\s*"([^"]+)",\s*[\r\n]+\s*name:\s*"([^"]+)",\s*[\r\n]+\s*category:\s*"([^"]+)"/g;
const products = [...productSrc.matchAll(productRe)].map((m) => ({
  slug: m[1],
  name: m[2],
  category: m[3],
}));

const catName = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
const has = (folder, slug) => (data[folder][slug]?.length ?? 0) > 0;
const mark = (folder, slug) => (has(folder, slug) ? "x" : " ");

const md = [];
md.push("# Danh sách ảnh cần chụp");
md.push("");
md.push(
  "Chép ảnh vào đúng thư mục, đặt tên đúng như cột **Tên file**, rồi chạy `npm run dev`.",
);
md.push("Website tự nhận, không cần sửa code.");
md.push("");
md.push("Ô `[x]` là đã có ảnh, ô trống là còn thiếu.");
md.push("");
md.push("---");
md.push("");
md.push("## 1. Sản phẩm — `public/images/products/`");
md.push("");
md.push(
  "Ảnh vuông 1:1. Mỗi sản phẩm nên có 4 ảnh theo đúng thứ tự: **tổng thể · góc nghiêng · cận chất liệu · đặt trong không gian**.",
);
md.push("Tên file thêm hậu tố `-1` `-2` `-3` `-4` theo đúng thứ tự đó.");
md.push("");

for (const cat of cats) {
  const items = products.filter((p) => p.category === cat.slug);
  if (items.length === 0) continue;
  md.push(`### ${cat.name}`);
  md.push("");
  md.push("| | Sản phẩm | Tên file |");
  md.push("| --- | --- | --- |");
  for (const item of items) {
    md.push(
      `| [${mark("products", item.slug)}] | ${item.name} | \`${item.slug}-1.jpg\` … \`${item.slug}-4.jpg\` |`,
    );
  }
  md.push("");
}

const simpleTable = (title, folder, rows, note) => {
  md.push(`## ${title}`);
  md.push("");
  if (note) {
    md.push(note);
    md.push("");
  }
  md.push("| | Mục | Tên file |");
  md.push("| --- | --- | --- |");
  for (const row of rows) {
    md.push(`| [${mark(folder, row.slug)}] | ${row.name} | \`${row.slug}.jpg\` |`);
  }
  md.push("");
};

simpleTable(
  "2. Ảnh danh mục — `public/images/categories/`",
  "categories",
  cats,
  "Ảnh đại diện cho từng nhóm đồ, hiện ở lưới danh mục trang chủ. Tỉ lệ 3:2.",
);

simpleTable(
  "3. Không gian mẫu — `public/images/rooms/`",
  "rooms",
  rooms,
  "Ảnh chụp cả căn phòng đã bày đồ. Tỉ lệ 3:2.",
);

simpleTable(
  "4. Dự án thực tế — `public/images/projects/`",
  "projects",
  projects,
  "Ảnh bìa dự án. Thêm album bằng hậu tố `-1` `-2` `-3`. Tỉ lệ 3:2.",
);

simpleTable(
  "5. Bài viết — `public/images/blog/`",
  "blog",
  posts,
  "Ảnh bìa bài viết. Tỉ lệ 3:2.",
);

md.push("---");
md.push("");
md.push("## Kích thước và định dạng");
md.push("");
md.push("| Loại ảnh | Tỉ lệ | Kích thước gợi ý |");
md.push("| --- | --- | --- |");
md.push("| Sản phẩm | **1:1 (vuông)** | 1200 × 1200 px |");
md.push("| Danh mục, không gian, dự án, bài viết | 3:2 (ngang) | 1600 × 1067 px |");
md.push("");
md.push(
  "Nhận `.jpg` `.png` `.webp` `.avif`. Nén mỗi ảnh xuống dưới 300KB để trang tải nhanh.",
);
md.push("Ảnh bị cắt theo kiểu `object-cover` nên để chủ thể nằm giữa khung.");
md.push("");

writeFileSync(
  join(IMG_DIR, "DANH-SACH-ANH-CAN-CHUP.md"),
  md.join("\n"),
  "utf8",
);

/* --------------------------- Báo cáo ra màn hình --------------------------- */

const count = (obj) => Object.keys(obj).length;
const files = (obj) => Object.values(obj).flat().length;

const lines = [
  `Sản phẩm    : ${count(data.products)} mục có ảnh (${files(data.products)} file)`,
  `Danh mục    : ${count(data.categories)} mục có ảnh (${files(data.categories)} file)`,
  `Không gian  : ${count(data.rooms)} mục có ảnh (${files(data.rooms)} file)`,
  `Dự án       : ${count(data.projects)} mục có ảnh (${files(data.projects)} file)`,
  `Bài viết    : ${count(data.blog)} mục có ảnh (${files(data.blog)} file)`,
];

const total = files(data.products) + files(data.categories) + files(data.rooms) +
  files(data.projects) + files(data.blog);

if (total === 0) {
  console.log(
    "[ảnh] Chưa có ảnh thật nào — website đang dùng ảnh minh hoạ dựng sẵn.\n" +
      "      Xem public/images/DANH-SACH-ANH-CAN-CHUP.md để biết cần đặt tên file thế nào.",
  );
} else {
  console.log("[ảnh] Đã ghép ảnh thật:");
  for (const line of lines) console.log("      " + line);
}
