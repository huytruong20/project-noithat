import type { Product, StyleSlug } from "@/lib/types";

/* ============================================================================
 * CÁCH THÊM MỘT SẢN PHẨM
 * ----------------------------------------------------------------------------
 * Copy khối dưới đây, dán vào mảng `products` bên dưới, rồi sửa giá trị.
 * Nhớ dấu phẩy `,` sau dấu `})` để ngăn cách với sản phẩm kế tiếp.
 *
 *   p({
 *     slug: "ten-khong-dau-khong-khoang-trang",  // BẮT BUỘC duy nhất, thành URL /san-pham/<slug>
 *     name: "Tên hiển thị của sản phẩm",
 *     category: "sofa",            // phải khớp slug trong lib/data/categories.ts
 *     rooms: ["phong-khach"],      // 1 hoặc nhiều không gian, xem roomCollections
 *     price: 9900000,              // VND, viết số trần không dấu chấm
 *     oldPrice: 12000000,          // BỎ DÒNG NÀY nếu không giảm giá (tự tính % giảm)
 *     isNew: true,                 // bỏ dòng này nếu không phải hàng mới
 *     isBestSeller: true,          // bỏ dòng này nếu không phải hàng bán chạy
 *     short: "Một câu ngắn hiện trên thẻ sản phẩm.",
 *     description: "Đoạn dài mô tả chi tiết, hiện ở trang sản phẩm.",
 *     dimensions: { long: 200, wide: 90, high: 80 },   // Dài × Rộng × Cao, đơn vị cm
 *     materials: ["Khung gỗ sồi", "Mút D40"],          // liệt kê từng chất liệu
 *     colors: [                                        // tên màu + mã hex hiển thị chấm tròn
 *       { name: "Xám khói", hex: "#8c8b86" },
 *       { name: "Be cát", hex: "#c9b7a2" },
 *     ],
 *     rating: 4.7,                 // 0–5, hiện sao đánh giá
 *     reviewCount: 80,             // số lượt đánh giá
 *     sold: 400,                   // đã bán bao nhiêu, dùng để xếp "Phổ biến nhất"
 *     specs: [                     // bảng thông số kỹ thuật, thêm bớt dòng tuỳ ý
 *       { label: "Số chỗ ngồi", value: "3 người" },
 *       { label: "Tải trọng", value: "350 kg" },
 *     ],
 *     image: "/images/products/ten-anh.jpg",   // BỎ nếu chưa có ảnh (dùng placeholder)
 *     images: ["/images/products/a1.jpg", "/images/products/a2.jpg"],  // thư viện ảnh
 *   }),
 *
 * CÁC TRƯỜNG CÓ THỂ BỎ QUA — tự lấy giá trị mặc định trong `base` bên dưới:
 *   warrantyMonths  mặc định 24 tháng
 *   inStock         mặc định true (còn hàng)
 *   shipping        mặc định miễn phí giao lắp nội thành
 *   leadTime        mặc định "Giao trong 3–5 ngày"
 *   views           mặc định 4 góc ảnh placeholder
 * Muốn khác mặc định thì thêm dòng đó vào, ví dụ `warrantyMonths: 60,`.
 *
 * LƯU Ý: dấu phẩy cuối mỗi dòng là bắt buộc. Nếu trang trắng sau khi sửa,
 * gần như luôn là do thiếu dấu phẩy hoặc thiếu ngoặc.
 * ========================================================================== */

/** Giá trị mặc định dùng chung, ghi đè khi sản phẩm khác biệt */
const base = {
  views: 4,
  inStock: true,
  warrantyMonths: 24,
  shipping: "Miễn phí giao & lắp đặt nội thành Gia Lai – TP.HCM",
  leadTime: "Giao trong 3–5 ngày",
};

/**
 * Phong cách, trọng lượng và tải trọng — gom một chỗ cho dễ cập nhật hàng loạt.
 * Khoá là `slug` của sản phẩm; thêm sản phẩm mới nhớ thêm một dòng ở đây,
 * nếu quên thì mặc định là phong cách hiện đại, 20kg, không ghi tải trọng.
 */
const extras: Record<
  string,
  { style: StyleSlug; weight: number; load?: number }
> = {
  "sofa-vang-mila": { style: "hien-dai", weight: 62, load: 350 },
  "sofa-goc-orin": { style: "hien-dai", weight: 95, load: 400 },
  "sofa-giuong-koda": { style: "toi-gian", weight: 58, load: 300 },
  "ghe-banh-hana": { style: "bac-au", weight: 14, load: 130 },
  "ghe-thu-gian-oslo": { style: "bac-au", weight: 28, load: 150 },
  "ban-tra-tron-lumi": { style: "bac-au", weight: 16, load: 40 },
  "ban-tra-hex-xep-tang": { style: "hien-dai", weight: 12, load: 30 },
  "giuong-boc-nem-sora": { style: "hien-dai", weight: 68, load: 400 },
  "giuong-go-soi-taiga": { style: "bac-au", weight: 75, load: 450 },
  "giuong-hoc-keo-nomi": { style: "toi-gian", weight: 82, load: 400 },
  "ke-tivi-thap-arda": { style: "bac-au", weight: 32, load: 60 },
  "tu-giay-thong-hoi-caro": { style: "toi-gian", weight: 22, load: 25 },
  "ban-an-go-nguyen-tam-rustic": { style: "indochine", weight: 68, load: 120 },
  "ban-an-ceramic-mono": { style: "hien-dai", weight: 52, load: 100 },
  "bo-ban-an-4-ghe-tini": { style: "bac-au", weight: 46, load: 80 },
  "ban-an-gap-mo-flexi": { style: "toi-gian", weight: 34, load: 70 },
  "tham-det-tay-sahara": { style: "indochine", weight: 9 },
  "guong-tron-vien-go-halo": { style: "bac-au", weight: 6 },
  "ban-nang-ha-dien-altus": { style: "hien-dai", weight: 42, load: 80 },
  "den-tha-ban-an-cone": { style: "cong-nghiep", weight: 3.2 },
  "den-cay-doc-sach-arco": { style: "hien-dai", weight: 9 },
  "den-ban-cam-ung-lumo": { style: "toi-gian", weight: 1.4 },

  // --- 15 sản phẩm bổ sung ---
  "sofa-bang-mini-yuki": { style: "bac-au", weight: 32, load: 200 },
  "sofa-module-piko": { style: "toi-gian", weight: 76, load: 360 },
  "ghe-an-go-soi-nami": { style: "bac-au", weight: 9, load: 120 },
  "ban-tra-mat-kinh-vela": { style: "hien-dai", weight: 22, load: 35 },
  "tu-quan-ao-3-canh-milo": { style: "toi-gian", weight: 105, load: 30 },
  "ke-trang-tri-dung-fern": { style: "cong-nghiep", weight: 19, load: 20 },
  "ban-an-tron-xoay-lotus": { style: "indochine", weight: 58, load: 90 },
  "ke-de-cay-3-tang-verde": { style: "bac-au", weight: 6, load: 15 },
  "bo-goi-tua-linen-mocha": { style: "toi-gian", weight: 2.4 },
  "ghe-xoay-boc-ni-tavi": { style: "hien-dai", weight: 14, load: 120 },
  "den-tuong-doc-sach-arte": { style: "toi-gian", weight: 1.8 },
};

type Draft = Partial<Product> &
  Pick<
    Product,
    | "slug"
    | "name"
    | "category"
    | "rooms"
    | "price"
    | "short"
    | "description"
    | "dimensions"
    | "materials"
    | "colors"
    | "rating"
    | "reviewCount"
    | "sold"
    | "specs"
  >;

const p = (d: Draft): Product => {
  const extra = extras[d.slug] ?? { style: "hien-dai" as StyleSlug, weight: 20 };
  return {
    ...base,
    style: extra.style,
    weight: extra.weight,
    loadCapacity: extra.load,
    ...d,
  } as Product;
};

export const products: Product[] = [
  /* ---------------------------------- SOFA --------------------------------- */
  p({
    slug: "sofa-vang-mila",
    name: "Sofa văng Mila 2m2",
    category: "sofa",
    rooms: ["phong-khach", "can-ho-nho"],
    price: 14900000,
    oldPrice: 17500000,
    isBestSeller: true,
    short: "Ba chỗ ngồi, khung sồi sấy, vỏ bọc lột ra giặt máy.",
    description:
      "Ba năm liền Mila là mẫu bán nhiều nhất ở đây. Gỗ sồi làm khung đã sấy xuống 12% ẩm, để qua mùa nồm không cong không nứt. Chỗ ngồi dùng mút D40 dày 12cm nên ngồi mấy năm vẫn còn nảy; phần tựa lưng để mút D25 mềm hơn cho êm. Vỏ bọc có khoá kéo giấu dưới mép, lột ra ném vào máy giặt chế độ nhẹ là xong.",
    dimensions: { long: 220, wide: 90, high: 82 },
    materials: ["Khung gỗ sồi sấy", "Mút D40 đàn hồi cao", "Vải bố chống bám bụi"],
    colors: [
      { name: "Xám khói", hex: "#8c8b86" },
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xanh rêu", hex: "#5f6b53" },
    ],
    rating: 4.8,
    reviewCount: 214,
    sold: 1830,
    specs: [
      { label: "Số chỗ ngồi", value: "3 người" },
      { label: "Chiều cao mặt ngồi", value: "44 cm" },
      { label: "Tải trọng", value: "350 kg" },
      { label: "Vỏ bọc", value: "Tháo rời, giặt máy được" },
    ],
  }),
  p({
    slug: "sofa-goc-orin",
    name: "Sofa góc chữ L Orin",
    category: "sofa",
    rooms: ["phong-khach"],
    price: 24500000,
    short: "Góc lắp được cả hai bên, kèm đôn chân rời.",
    description:
      "Orin hợp phòng khách từ 20m² trở lên. Phần góc lắp bên trái hay bên phải đều được nên bạn khỏi phải đo xem cửa nằm phía nào trước khi đặt. Cái đôn rời kéo ra là thêm một chỗ ngồi lúc nhà đông người, đẩy vào sát thì thành mặt nằm dài 1m8 để duỗi chân xem phim.",
    dimensions: { long: 285, wide: 165, high: 84 },
    materials: ["Khung gỗ thông sấy", "Mút D40", "Vải nhung tăm chống nước"],
    colors: [
      { name: "Ghi sáng", hex: "#b3aea6" },
      { name: "Nâu tây", hex: "#7b5a44" },
      { name: "Xanh navy", hex: "#3c4a5c" },
    ],
    rating: 4.7,
    reviewCount: 96,
    sold: 540,
    leadTime: "Đặt sản xuất 10–14 ngày",
    specs: [
      { label: "Số chỗ ngồi", value: "4–5 người" },
      { label: "Lắp góc", value: "Đảo trái/phải tại nhà" },
      { label: "Đôn chân", value: "Rời, 100 × 65 cm" },
      { label: "Chống nước", value: "Vải phủ nano, lau sạch nước đổ" },
    ],
  }),
  p({
    slug: "sofa-giuong-koda",
    name: "Sofa giường Koda",
    category: "sofa",
    rooms: ["phong-khach", "can-ho-nho"],
    price: 12900000,
    isNew: true,
    short: "Một tay kéo thành giường 1m4, dưới đệm có hộc chứa chăn.",
    description:
      "Nhà một phòng ngủ mà thỉnh thoảng có khách ngủ lại thì Koda giải quyết gọn. Bộ ray trượt bằng thép sơn tĩnh điện, kéo một tay là mặt ngồi duỗi phẳng thành 1m4 × 1m9, mất chừng năm giây. Dưới mặt ngồi có hộc sâu 18cm, nhét vừa một bộ chăn gối mùa đông.",
    dimensions: { long: 190, wide: 95, high: 80 },
    materials: ["Khung thép sơn tĩnh điện", "Mút D35", "Vải linen pha"],
    colors: [
      { name: "Xám tro", hex: "#7d7c78" },
      { name: "Kem sữa", hex: "#ddd2c1" },
    ],
    rating: 4.6,
    reviewCount: 78,
    sold: 410,
    specs: [
      { label: "Kích thước khi mở", value: "190 × 140 cm" },
      { label: "Hộc chứa đồ", value: "Có, sâu 18 cm" },
      { label: "Cơ cấu", value: "Kéo trượt một thao tác" },
    ],
  }),

  p({
    slug: "sofa-bang-mini-yuki",
    name: "Sofa băng mini Yuki 1m4",
    category: "sofa",
    rooms: ["phong-khach", "can-ho-nho"],
    price: 6900000,
    short: "Chỉ rộng 1m4 mà mặt ngồi vẫn sâu 52cm.",
    description:
      "Phòng trọ hay studio kê sofa thường vào là hết lối đi. Yuki rộng đúng 1m4 nhưng mặt ngồi giữ nguyên 52cm chiều sâu, ngồi không bị hụt mông như mấy mẫu thu nhỏ. Bốn chân gỗ vặn ra được, lúc chuyển nhà tháo chân là lọt thang máy chung cư cũ.",
    dimensions: { long: 140, wide: 78, high: 76 },
    materials: ["Khung gỗ cao su sấy", "Mút D35", "Vải bố dệt dày"],
    colors: [
      { name: "Ghi sáng", hex: "#b3aea6" },
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xanh rêu", hex: "#5f6b53" },
    ],
    rating: 4.5,
    reviewCount: 63,
    sold: 480,
    leadTime: "Giao trong 2–3 ngày",
    specs: [
      { label: "Số chỗ ngồi", value: "2 người" },
      { label: "Chiều sâu mặt ngồi", value: "52 cm" },
      { label: "Chân ghế", value: "Tháo rời, tiện vận chuyển" },
    ],
  }),
  p({
    slug: "sofa-module-piko",
    inStock: false,
    name: "Sofa module Piko",
    category: "sofa",
    rooms: ["phong-khach"],
    price: 21500000,
    isNew: true,
    short: "Ba khối rời, xếp kiểu nào cũng được, mua thêm khối sau vẫn khớp.",
    description:
      "Piko là ba khối riêng, nối với nhau bằng ngàm thép giấu dưới đệm. Xếp thành hàng là sofa băng 2m4, bẻ vuông là sofa góc, tách hẳn ra là ba ghế đơn kê ba nơi. Chuyển nhà đổi bố cục không phải mua bộ mới. Chuẩn ngàm này chúng tôi giữ lâu dài nên vài năm nữa mua thêm khối lẻ vẫn lắp vừa.",
    dimensions: { long: 240, wide: 88, high: 74 },
    materials: ["Khung gỗ thông sấy", "Mút D40", "Vải nano chống thấm"],
    colors: [
      { name: "Xám khói", hex: "#8c8b86" },
      { name: "Kem sữa", hex: "#ddd2c1" },
      { name: "Nâu đất", hex: "#7b5a44" },
    ],
    rating: 4.7,
    reviewCount: 34,
    sold: 190,
    leadTime: "Đặt sản xuất 10–14 ngày",
    specs: [
      { label: "Số khối", value: "3 khối rời, mỗi khối 80 cm" },
      { label: "Cách ghép", value: "Thẳng hàng, chữ L, hoặc tách rời" },
      { label: "Chống thấm", value: "Vải phủ nano, lau sạch nước đổ" },
      { label: "Mở rộng", value: "Mua thêm khối lẻ vẫn khớp ngàm" },
    ],
  }),

  /* -------------------------------- BÀN GHẾ -------------------------------- */
  p({
    slug: "ghe-banh-hana",
    name: "Ghế bành Hana",
    category: "ban-ghe",
    rooms: ["phong-khach", "phong-ngu"],
    price: 5600000,
    isBestSeller: true,
    short: "Lưng ngả 105°, ngồi đọc sách lâu không mỏi cổ.",
    description:
      "Lưng ghế cong ôm theo sống lưng, ngả đúng 105° — góc này tính để ngồi đọc lâu mà cổ không phải gồng. Mặt ngồi rộng 52cm nên khoanh chân lên ngồi vẫn thoải mái. Khách hay kê Hana vào góc phòng ngủ cạnh cửa sổ làm chỗ đọc buổi sáng.",
    dimensions: { long: 72, wide: 78, high: 88 },
    materials: ["Khung gỗ sồi", "Mút D40", "Vải nỉ mềm"],
    colors: [
      { name: "Xanh rêu", hex: "#5f6b53" },
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Nâu đất", hex: "#7b5a44" },
      { name: "Xám khói", hex: "#8c8b86" },
    ],
    rating: 4.8,
    reviewCount: 187,
    sold: 1240,
    specs: [
      { label: "Góc tựa lưng", value: "105°" },
      { label: "Chiều rộng mặt ngồi", value: "52 cm" },
      { label: "Trọng lượng", value: "14 kg" },
    ],
  }),
  p({
    slug: "ghe-thu-gian-oslo",
    name: "Ghế thư giãn Oslo + đôn",
    category: "ban-ghe",
    rooms: ["phong-khach", "phong-lam-viec"],
    price: 8900000,
    short: "Ngả ba nấc bằng lẫy tay, không dùng điện.",
    description:
      "Gạt lẫy bên hông là ngả được ba nấc, từ 100° ngồi thẳng tới 135° nằm nghỉ. Cố ý làm bằng cơ khí chứ không gắn motor: không có mạch điện thì không có gì để hỏng, mất điện vẫn dùng bình thường. Đôn gác chân bọc cùng loại da, lúc không gác thì kéo ra làm ghế đôn cho khách ngồi.",
    dimensions: { long: 76, wide: 90, high: 100 },
    materials: ["Khung gỗ óc chó", "Mút D40", "Da công nghiệp Microfiber"],
    colors: [
      { name: "Nâu cognac", hex: "#8a5a3b" },
      { name: "Đen than", hex: "#2c2a27" },
    ],
    rating: 4.7,
    reviewCount: 64,
    sold: 320,
    specs: [
      { label: "Góc ngả", value: "3 nấc: 100° / 118° / 135°" },
      { label: "Đôn gác chân", value: "Rời, 55 × 42 cm" },
      { label: "Cơ cấu", value: "Cơ khí, không dùng điện" },
    ],
  }),
  p({
    slug: "ban-tra-tron-lumi",
    name: "Bàn trà tròn Lumi",
    category: "ban-ghe",
    rooms: ["phong-khach"],
    price: 3900000,
    short: "Mặt sồi tròn 80cm, không góc nhọn, xước tự chà lại được.",
    description:
      "Bàn tròn không có góc nhọn nên nhà có trẻ đang tập đi thì yên tâm hơn hẳn, mà đi vòng quanh trong phòng khách hẹp cũng dễ. Mặt gỗ sồi phủ dầu lau Osmo chứ không sơn bóng — bị xước thì lấy giấy nhám mịn chà nhẹ rồi lau lại một lớp dầu là liền, không phải gọi thợ.",
    dimensions: { long: 80, wide: 80, high: 42 },
    materials: ["Gỗ sồi tự nhiên", "Phủ dầu lau Osmo", "Chân thép sơn tĩnh điện"],
    colors: [
      { name: "Gỗ sồi tự nhiên", hex: "#c4a882" },
      { name: "Óc chó đậm", hex: "#6d4529" },
    ],
    rating: 4.7,
    reviewCount: 143,
    sold: 880,
    specs: [
      { label: "Đường kính", value: "80 cm" },
      { label: "Hoàn thiện", value: "Dầu lau gốc thực vật" },
      { label: "Lắp đặt", value: "Bắt chân, 10 phút" },
    ],
  }),
  p({
    slug: "ban-tra-hex-xep-tang",
    name: "Bộ 2 bàn trà xếp tầng Hex",
    category: "ban-ghe",
    rooms: ["phong-khach", "can-ho-nho"],
    price: 4500000,
    isNew: true,
    short: "Hai cái lồng vào nhau, kéo ra khi cần thêm mặt bàn.",
    description:
      "Ngày thường bàn nhỏ trượt gọn dưới bàn lớn chiếm đúng một chỗ. Có khách thì kéo ra thành hai mặt bàn đặt được nhiều ly. Mặt bàn cắt hình lục giác cho đỡ đơn điệu, chân thép chỉ 2cm nên nhìn nhẹ, không đè nặng góc phòng.",
    dimensions: { long: 90, wide: 55, high: 45 },
    materials: ["MDF phủ veneer sồi", "Chân thép sơn tĩnh điện"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Đen mờ", hex: "#2c2a27" },
    ],
    rating: 4.6,
    reviewCount: 37,
    sold: 190,
    specs: [
      { label: "Bàn lớn", value: "90 × 55 × 45 cm" },
      { label: "Bàn nhỏ", value: "60 × 40 × 38 cm" },
      { label: "Xếp lồng", value: "Có" },
    ],
  }),

  p({
    slug: "ghe-an-go-soi-nami",
    inStock: false,
    name: "Ghế ăn gỗ sồi Nami (bộ 2 chiếc)",
    category: "ban-ghe",
    rooms: ["phong-bep-an", "can-ho-nho"],
    price: 2900000,
    oldPrice: 3400000,
    short: "Hai chiếc sồi nguyên khối, xếp chồng lên nhau khi cất.",
    description:
      "Lưng ghế uốn cong theo sống lưng, mặt ngồi khoét lõm nhẹ nên ngồi hết bữa cơm dài vẫn không mỏi. Hai chiếc chồng lên nhau được, ngày thường cất một chiếc vào góc cho rộng nhà. Gỗ sồi phủ dầu lau, xước thì chà giấy nhám mịn rồi lau dầu lại.",
    dimensions: { long: 45, wide: 52, high: 80 },
    materials: ["Gỗ sồi nguyên khối", "Dầu lau gốc thực vật"],
    colors: [
      { name: "Sồi tự nhiên", hex: "#c4a882" },
      { name: "Óc chó đậm", hex: "#6d4529" },
    ],
    rating: 4.6,
    reviewCount: 91,
    sold: 720,
    leadTime: "Giao trong 2–3 ngày",
    specs: [
      { label: "Số lượng", value: "2 chiếc" },
      { label: "Chiều cao mặt ngồi", value: "45 cm" },
      { label: "Xếp chồng", value: "Có, tối đa 4 chiếc" },
    ],
  }),
  p({
    slug: "ban-tra-mat-kinh-vela",
    name: "Bàn trà mặt kính Vela",
    category: "ban-ghe",
    rooms: ["phong-khach"],
    price: 4200000,
    short: "Mặt kính cường lực 10mm, phòng hẹp nhìn đỡ bí.",
    description:
      "Kính trong cho nhìn xuyên xuống thấy màu sàn, nên kê giữa phòng khách nhỏ không tạo cảm giác chắn ngang như mặt gỗ đặc. Kính cường lực dày 10mm, cạnh mài vát, va chạm sinh hoạt hằng ngày không sao. Tầng dưới lót gỗ để tạp chí với điều khiển cho khỏi bày trên mặt.",
    dimensions: { long: 110, wide: 60, high: 42 },
    materials: ["Kính cường lực 10mm", "Khung gỗ sồi", "Chân thép sơn tĩnh điện"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Đen mờ", hex: "#2c2a27" },
    ],
    rating: 4.4,
    reviewCount: 47,
    sold: 310,
    specs: [
      { label: "Mặt bàn", value: "Kính cường lực 10 mm, cạnh vát" },
      { label: "Ngăn dưới", value: "Kệ gỗ để tạp chí" },
      { label: "Lưu ý", value: "Lau bằng nước lau kính, tránh vật cứng cạo" },
    ],
  }),

  /* --------------------------------- GIƯỜNG -------------------------------- */
  p({
    slug: "giuong-boc-nem-sora",
    name: "Giường bọc nệm Sora 1m8",
    category: "giuong",
    rooms: ["phong-ngu"],
    price: 16800000,
    oldPrice: 19500000,
    isBestSeller: true,
    short: "Đầu giường bọc nệm cao 110cm, tựa lưng khỏi cần chồng gối.",
    description:
      "Đầu giường bọc mút dày 8cm, cao tới 110cm nên ngồi tựa đọc sách hay xem điện thoại là dựa thẳng vào, không phải chồng ba bốn cái gối lên. Giát nan gỗ cong có độ nhún, chịu 400kg. Nan hở nên hơi ẩm thoát được, nệm không bị hầm mốc mặt dưới.",
    dimensions: { long: 200, wide: 180, high: 110 },
    materials: ["Khung gỗ thông sấy", "Mút D30 bọc đầu giường", "Vải nỉ chống bám bụi"],
    colors: [
      { name: "Xám khói", hex: "#8c8b86" },
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xanh rêu", hex: "#5f6b53" },
    ],
    rating: 4.8,
    reviewCount: 168,
    sold: 890,
    specs: [
      { label: "Kích thước nệm phù hợp", value: "180 × 200 cm" },
      { label: "Giát giường", value: "Nan gỗ cong, 14 thanh" },
      { label: "Tải trọng", value: "400 kg" },
      { label: "Khoảng sáng gầm", value: "22 cm" },
    ],
  }),
  p({
    slug: "giuong-go-soi-taiga",
    name: "Giường gỗ sồi Taiga 1m6",
    category: "giuong",
    rooms: ["phong-ngu"],
    price: 13500000,
    short: "Sồi nguyên khối, bốn góc ghép mộng, không một cây đinh.",
    description:
      "Bốn góc giường ghép mộng âm dương theo lối thợ mộc cũ. Kiểu ghép này chắc hơn bắt vít và càng nằm lâu càng khít lại, không có chuyện lỏng ốc kêu cót két sau vài năm. Gỗ sồi trắng nhập khẩu vân thẳng đều, phủ dầu lau nên sờ vào còn thấy thớ gỗ chứ không trơn như phủ bóng.",
    dimensions: { long: 200, wide: 160, high: 95 },
    materials: ["Gỗ sồi trắng nguyên khối", "Dầu lau gốc thực vật"],
    colors: [
      { name: "Sồi tự nhiên", hex: "#c4a882" },
      { name: "Óc chó đậm", hex: "#6d4529" },
    ],
    rating: 4.9,
    reviewCount: 92,
    sold: 430,
    warrantyMonths: 60,
    leadTime: "Đặt sản xuất 10–14 ngày",
    specs: [
      { label: "Kích thước nệm phù hợp", value: "160 × 200 cm" },
      { label: "Kiểu ghép", value: "Mộng âm dương, không đinh" },
      { label: "Bảo hành", value: "5 năm" },
    ],
  }),
  p({
    slug: "giuong-hoc-keo-nomi",
    inStock: false,
    name: "Giường hộc kéo Nomi 1m6",
    category: "giuong",
    rooms: ["phong-ngu", "can-ho-nho"],
    price: 15200000,
    isNew: true,
    short: "Bốn hộc dưới gầm, thêm 320 lít chỗ cất mà không tốn thêm mét vuông.",
    description:
      "Bốn hộc chia đều hai bên, chạy ray bi giảm chấn nên kéo êm và không sập. Cộng lại 320 lít — đủ nhét chăn mùa đông, hai cái vali và mấy thùng đồ ít đụng tới. Căn hộ không có kho thì đây là chỗ chứa dễ kiếm nhất, vì gầm giường vốn đã bỏ không.",
    dimensions: { long: 200, wide: 160, high: 100 },
    materials: ["MDF chống ẩm lõi xanh", "Veneer sồi", "Ray bi giảm chấn"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.7,
    reviewCount: 51,
    sold: 260,
    leadTime: "Đặt sản xuất 7–10 ngày",
    specs: [
      { label: "Số hộc kéo", value: "4 hộc" },
      { label: "Dung tích chứa", value: "≈ 320 lít" },
      { label: "Ray kéo", value: "Ray bi giảm chấn, tải 25 kg/hộc" },
    ],
  }),


  /* -------------------------------- TỦ & KỆ -------------------------------- */
  p({
    slug: "ke-tivi-thap-arda",
    name: "Kệ tivi thấp Arda 1m8",
    category: "tu-ke",
    rooms: ["phong-khach"],
    price: 6700000,
    isBestSeller: true,
    short: "Cao 42cm, dưới tầm mắt khi ngồi sofa, có khay giấu dây.",
    description:
      "Kệ chỉ cao 42cm nên tivi đặt lên vừa tầm mắt người ngồi sofa, xem cả buổi không phải ngước. Mặt sau khoét hai lỗ luồn dây, bên trong có khay đi dây để dồn hết dây nguồn với dây mạng vào một chỗ, nhìn từ ngoài không thấy mớ dây.",
    dimensions: { long: 180, wide: 40, high: 42 },
    materials: ["MDF chống ẩm", "Veneer sồi", "Chân gỗ sồi khối"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Óc chó đậm", hex: "#6d4529" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.8,
    reviewCount: 203,
    sold: 1310,
    specs: [
      { label: "Phù hợp tivi", value: "Tới 75 inch" },
      { label: "Ngăn chứa", value: "2 cánh mở + 1 ngăn hở giữa" },
      { label: "Đi dây", value: "2 lỗ luồn dây + khay dây" },
    ],
  }),
  p({
    slug: "tu-giay-thong-hoi-caro",
    name: "Tủ giày thông hơi Caro",
    category: "tu-ke",
    rooms: ["can-ho-nho", "phong-khach"],
    price: 3600000,
    short: "Cánh nan hở cho giày khô, chứa 18 đôi mà chỉ sâu 26cm.",
    description:
      "Cánh làm dạng nan hở nên giày đi về còn ẩm vẫn khô được, không ủ mùi trong tủ kín. Sâu đúng 26cm, kê sát tường lối vào thì người xách đồ đi qua vẫn lọt. Ba khoang chia sẵn, xếp đứng được 18 đôi cỡ nam.",
    dimensions: { long: 90, wide: 26, high: 110 },
    materials: ["MDF chống ẩm", "Melamine", "Cánh nan gỗ"],
    colors: [
      { name: "Trắng sữa", hex: "#e8e2d6" },
      { name: "Sồi sáng", hex: "#c4a882" },
    ],
    rating: 4.5,
    reviewCount: 134,
    sold: 910,
    leadTime: "Giao trong 2–3 ngày",
    specs: [
      { label: "Sức chứa", value: "≈ 18 đôi" },
      { label: "Chiều sâu", value: "26 cm" },
      { label: "Thông hơi", value: "Cánh nan hở" },
    ],
  }),

  p({
    slug: "tu-quan-ao-3-canh-milo",
    name: "Tủ quần áo 3 cánh mở Milo",
    category: "tu-ke",
    rooms: ["phong-ngu"],
    price: 15600000,
    oldPrice: 17900000,
    short: "Mở một lần thấy hết đồ, không như cánh lùa chỉ mở được nửa.",
    description:
      "Tủ cánh lùa lúc nào cũng che mất một nửa, sáng vội tìm cái áo phải đẩy qua đẩy lại. Ba cánh mở của Milo bật ra là thấy toàn bộ tủ cùng lúc. Bản lề giảm chấn nên đóng êm, không đập thình thịch lúc người nhà còn ngủ. Lưu ý chừa 60cm trống trước tủ để mở hết cánh.",
    dimensions: { long: 165, wide: 58, high: 210 },
    materials: ["MDF chống ẩm lõi xanh", "Melamine vân gỗ", "Bản lề giảm chấn"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
      { name: "Ghi xi măng", hex: "#9b978f" },
    ],
    rating: 4.6,
    reviewCount: 84,
    sold: 430,
    leadTime: "Đặt sản xuất 7–10 ngày",
    specs: [
      { label: "Số cánh", value: "3 cánh mở" },
      { label: "Bố trí trong", value: "1 khoang treo dài, 1 khoang treo ngắn, 6 ngăn gấp" },
      { label: "Khoảng trống cần chừa", value: "60 cm trước tủ để mở cánh" },
      { label: "Chống lật", value: "Kèm thanh bắt tường, kỹ thuật viên lắp sẵn" },
    ],
  }),
  p({
    slug: "ke-trang-tri-dung-fern",
    name: "Kệ trang trí đứng Fern",
    category: "tu-ke",
    rooms: ["phong-khach", "phong-lam-viec", "can-ho-nho"],
    price: 3800000,
    short: "Khung thép mảnh 5 tầng, chỉ ăn 35cm chiều sâu.",
    description:
      "Khung ống thép 2cm để trần, mặt kệ lát gỗ — kiểu công nghiệp nhẹ, không nặng như tủ kín bít bùng. Sâu 35cm nên nhét được vào hành lang hẹp hay mảng tường trống giữa hai cửa phòng. Năm tầng chia đủ cho sách, vài chậu cây nhỏ và mấy món bày.",
    dimensions: { long: 80, wide: 35, high: 180 },
    materials: ["Khung thép sơn tĩnh điện", "Mặt kệ MDF phủ veneer"],
    colors: [
      { name: "Đen mờ", hex: "#2c2a27" },
      { name: "Sồi sáng", hex: "#c4a882" },
    ],
    rating: 4.5,
    reviewCount: 68,
    sold: 520,
    leadTime: "Giao trong 2–3 ngày",
    specs: [
      { label: "Số tầng", value: "5 tầng" },
      { label: "Tải trọng mỗi tầng", value: "20 kg" },
      { label: "Chiều sâu", value: "35 cm" },
      { label: "Chống lật", value: "Kèm dây neo tường" },
    ],
  }),

  /* --------------------------------- BÀN ĂN -------------------------------- */
  p({
    slug: "ban-an-go-nguyen-tam-rustic",
    name: "Bàn ăn gỗ nguyên tấm Rustic 1m6",
    category: "ban-an",
    rooms: ["phong-bep-an"],
    price: 15900000,
    short: "Cắt từ một tấm gỗ liền, giữ nguyên cạnh tự nhiên.",
    description:
      "Mặt bàn là một tấm me tây liền, không ghép thanh, giữ lại đường cạnh cong tự nhiên của thân cây nên không tấm nào giống tấm nào. Gỗ đã xử lý mối và sấy kỹ trước khi đóng. Phủ ba lớp dầu chống thấm, đổ nước canh hay dầu ăn lên lau ngay là không ăn vào thớ.",
    dimensions: { long: 160, wide: 85, high: 75 },
    materials: ["Gỗ me tây nguyên tấm", "Dầu lau chống thấm", "Chân sắt chữ A"],
    colors: [
      { name: "Vân gỗ tự nhiên", hex: "#b08a5c" },
      { name: "Óc chó đậm", hex: "#6d4529" },
    ],
    rating: 4.9,
    reviewCount: 73,
    sold: 340,
    warrantyMonths: 36,
    leadTime: "Đặt sản xuất 14–21 ngày",
    specs: [
      { label: "Số chỗ ngồi", value: "6 người" },
      { label: "Độ dày mặt bàn", value: "5 cm" },
      { label: "Cạnh bàn", value: "Live edge — giữ cạnh tự nhiên" },
      { label: "Lưu ý", value: "Vân gỗ mỗi tấm một khác" },
    ],
  }),
  p({
    slug: "ban-an-ceramic-mono",
    name: "Bàn ăn mặt đá ceramic Mono 1m8",
    category: "ban-an",
    rooms: ["phong-bep-an"],
    price: 12800000,
    isBestSeller: true,
    short: "Mặt đá chịu 300°C, bê nồi lẩu đặt thẳng lên không sao.",
    description:
      "Đá ceramic nung nhiệt cao nên đặt nồi lẩu đang sôi lên mặt bàn không để lại vòng ố. Nước mắm, cà phê, nghệ đổ ra lau khăn ẩm là sạch, không ngấm. Nhà nào hay ăn món nước, hay bày nồi lên giữa bàn thì mặt này đỡ lo hơn mặt gỗ nhiều.",
    dimensions: { long: 180, wide: 90, high: 75 },
    materials: ["Đá ceramic 12mm", "Khung thép sơn tĩnh điện"],
    colors: [
      { name: "Trắng vân mây", hex: "#e5e0d8" },
      { name: "Ghi xi măng", hex: "#9b978f" },
      { name: "Đen vân đá", hex: "#3a3835" },
    ],
    rating: 4.8,
    reviewCount: 156,
    sold: 780,
    specs: [
      { label: "Số chỗ ngồi", value: "6–8 người" },
      { label: "Chịu nhiệt", value: "Tới 300°C" },
      { label: "Chống thấm", value: "Không thấm màu thực phẩm" },
      { label: "Chống xước", value: "Độ cứng Mohs 7" },
    ],
  }),
  p({
    slug: "bo-ban-an-4-ghe-tini",
    name: "Bộ bàn ăn 4 ghế Tini",
    category: "ban-an",
    rooms: ["phong-bep-an", "can-ho-nho"],
    price: 8900000,
    oldPrice: 10500000,
    short: "Bàn 1m2 kèm sẵn 4 ghế, khỏi đi tìm ghế hợp bộ.",
    description:
      "Mua một lần là đủ bộ, không phải lọ mọ tìm ghế cho hợp màu bàn. Ghế lưng cong ôm sống lưng, mặt ngồi lõm nhẹ nên ngồi ăn lâu vẫn dễ chịu. Bàn 1m2 vừa cho nhà bốn người, kê lọt bếp căn hộ hai phòng ngủ.",
    dimensions: { long: 120, wide: 75, high: 75 },
    materials: ["Gỗ cao su sấy", "Sơn PU mờ"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.6,
    reviewCount: 189,
    sold: 1180,
    specs: [
      { label: "Trọn bộ", value: "1 bàn + 4 ghế" },
      { label: "Số chỗ ngồi", value: "4 người" },
      { label: "Kích thước ghế", value: "45 × 50 × 82 cm" },
    ],
  }),
  p({
    slug: "ban-an-gap-mo-flexi",
    name: "Bàn ăn gấp mở Flexi",
    category: "ban-an",
    rooms: ["can-ho-nho", "phong-bep-an"],
    price: 5400000,
    isNew: true,
    short: "Ngày thường 90cm, có khách mở ra 150cm.",
    description:
      "Gấp lại còn 90cm, kê sát tường ngồi 2–4 người cho gọn nhà. Cuối tuần đông người thì lật cánh phụ ra thành 150cm, ngồi được 6. Bản lề bướm bằng thép chịu lực, một tay lật cũng được, không cần hai người khiêng.",
    dimensions: { long: 150, wide: 80, high: 75 },
    materials: ["MDF chống ẩm", "Veneer sồi", "Bản lề bướm thép"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.5,
    reviewCount: 62,
    sold: 350,
    specs: [
      { label: "Khi gấp", value: "90 × 80 cm — 2–4 người" },
      { label: "Khi mở", value: "150 × 80 cm — 6 người" },
      { label: "Thao tác", value: "Gấp mở một tay" },
    ],
  }),

  p({
    slug: "ban-an-tron-xoay-lotus",
    name: "Bàn ăn tròn mặt xoay Lotus 1m2",
    category: "ban-an",
    rooms: ["phong-bep-an"],
    price: 13900000,
    isBestSeller: true,
    short: "Mâm xoay 60cm giữa bàn, không ai phải với tay gắp.",
    description:
      "Mâm xoay đường kính 60cm đặt giữa, chạy trên vòng bi thép nên đẩy nhẹ một cái là quay hết vòng. Mâm cơm Việt bày nhiều món dùng chung, có mâm xoay thì người ngồi xa không phải nhoài người hay nhờ chuyền đĩa. Bàn tròn không góc nhọn, trẻ chạy quanh đỡ va.",
    dimensions: { long: 120, wide: 120, high: 75 },
    materials: ["Gỗ cao su sấy", "Mâm xoay kính cường lực", "Vòng bi thép"],
    colors: [
      { name: "Nâu trà", hex: "#8a6a4b" },
      { name: "Óc chó đậm", hex: "#6d4529" },
    ],
    rating: 4.8,
    reviewCount: 112,
    sold: 640,
    specs: [
      { label: "Số chỗ ngồi", value: "6 người" },
      { label: "Đường kính mâm xoay", value: "60 cm" },
      { label: "Cơ cấu xoay", value: "Vòng bi thép, tháo rời vệ sinh được" },
      { label: "Lưu ý", value: "Chưa bao gồm ghế" },
    ],
  }),

  /* -------------------------------- TRANG TRÍ ------------------------------- */
  p({
    slug: "tham-det-tay-sahara",
    inStock: false,
    name: "Thảm dệt tay Sahara 1m6 × 2m3",
    category: "trang-tri",
    rooms: ["phong-khach", "phong-ngu"],
    price: 4200000,
    short: "Dệt tay, len pha cotton dày 12mm, đế chống trượt khâu liền.",
    description:
      "Dệt bằng tay nên hai tấm không bao giờ giống hệt, nhìn kỹ thấy nhịp sợi hơi lệch — đó là dấu của hàng dệt thủ công, không phải lỗi. Sợi len pha cotton mềm chân, dày 12mm đủ ấm mùa lạnh mà không hầm mùa nóng. Đế chống trượt khâu liền vào thảm chứ không dán, giặt không bong.",
    dimensions: { long: 230, wide: 160, high: 1.2 },
    materials: ["Len pha cotton", "Đế chống trượt"],
    colors: [
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xám khói", hex: "#8c8b86" },
      { name: "Nâu đất", hex: "#7b5a44" },
    ],
    rating: 4.7,
    reviewCount: 118,
    sold: 640,
    warrantyMonths: 12,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Độ dày", value: "12 mm" },
      { label: "Vệ sinh", value: "Hút bụi thường xuyên, giặt khô" },
      { label: "Đế", value: "Chống trượt, khâu liền" },
    ],
  }),
  p({
    slug: "guong-tron-vien-go-halo",
    name: "Gương tròn viền gỗ Halo 80cm",
    category: "trang-tri",
    rooms: ["phong-khach", "phong-ngu"],
    price: 2100000,
    short: "Gương tròn 80cm viền sồi, treo đối diện cửa sổ cho phòng sáng hơn.",
    description:
      "Treo đối diện cửa sổ thì gương hắt nắng vào sâu trong phòng — mẹo cũ nhưng với căn hộ thiếu sáng thì thấy khác biệt ngay. Kính dày 5mm, viền phủ lớp chống mốc nên treo trong phòng tắm cũng được, không bị đốm đen mép sau vài tháng.",
    dimensions: { long: 80, wide: 3, high: 80 },
    materials: ["Kính gương 5mm", "Viền gỗ sồi"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Đen mờ", hex: "#2c2a27" },
    ],
    rating: 4.6,
    reviewCount: 97,
    sold: 720,
    warrantyMonths: 12,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Đường kính", value: "80 cm" },
      { label: "Kèm theo", value: "Bộ ốc treo tường" },
      { label: "Chống mốc", value: "Có, dùng được nơi ẩm" },
    ],
  }),

  p({
    slug: "ke-de-cay-3-tang-verde",
    name: "Kệ để cây 3 tầng Verde",
    category: "trang-tri",
    rooms: ["phong-khach", "can-ho-nho"],
    price: 1450000,
    short: "Ba tầng lệch nhau cho cây nào cũng ăn nắng, có khay hứng nước.",
    description:
      "Ba tầng đặt so le chứ không thẳng hàng, nên chậu tầng dưới không bị tầng trên che mất nắng. Mỗi tầng có khay nhựa rời hứng nước tưới, nhấc ra rửa được — nước không đọng làm mục chân kệ hay để vệt ố trên sàn. Kê cạnh cửa sổ hướng Đông là chỗ nắng hợp nhất cho cây trong nhà.",
    dimensions: { long: 60, wide: 30, high: 90 },
    materials: ["Gỗ thông sấy", "Khay nhựa PP", "Sơn gốc nước"],
    colors: [
      { name: "Gỗ tự nhiên", hex: "#c4a882" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.6,
    reviewCount: 143,
    sold: 890,
    warrantyMonths: 12,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Số tầng", value: "3 tầng so le" },
      { label: "Khay hứng nước", value: "Có, tháo rời rửa được" },
      { label: "Tải trọng mỗi tầng", value: "15 kg" },
    ],
  }),
  p({
    slug: "bo-goi-tua-linen-mocha",
    name: "Bộ 4 gối tựa linen Mocha",
    category: "trang-tri",
    rooms: ["phong-khach", "phong-ngu"],
    price: 980000,
    oldPrice: 1200000,
    short: "Bốn vỏ gối tông trầm, đổi không khí phòng khách mà không phải bọc lại sofa.",
    description:
      "Muốn phòng khách trông khác đi mà không tốn nhiều thì thay gối tựa là cách rẻ nhất — bọc lại cả bộ sofa đắt gấp mấy chục lần. Bốn vỏ gồm hai màu nền và hai màu nhấn, chia theo tỉ lệ 60–30–10 nên ném lên sofa là hợp, không cần biết phối màu. Linen pha cotton, khoá kéo giấu, tháo giặt máy.",
    dimensions: { long: 45, wide: 45, high: 12 },
    materials: ["Vải linen pha cotton", "Khoá kéo giấu"],
    colors: [
      { name: "Nâu mocha", hex: "#8a6a4b" },
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xanh rêu", hex: "#5f6b53" },
    ],
    rating: 4.7,
    reviewCount: 205,
    sold: 1420,
    warrantyMonths: 0,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc cho đơn từ 1 triệu",
    specs: [
      { label: "Số lượng", value: "4 vỏ gối" },
      { label: "Kích thước", value: "45 × 45 cm" },
      { label: "Ruột gối", value: "Không kèm, mua riêng nếu cần" },
      { label: "Vệ sinh", value: "Giặt máy nước lạnh, phơi bóng râm" },
    ],
  }),

  /* ------------------------------- VĂN PHÒNG ------------------------------- */
  p({
    slug: "ban-nang-ha-dien-altus",
    name: "Bàn nâng hạ điện Altus 1m4",
    category: "van-phong",
    rooms: ["phong-lam-viec"],
    price: 9600000,
    isBestSeller: true,
    short: "Bấm nút đổi giữa ngồi và đứng, nhớ sẵn 4 độ cao.",
    description:
      "Hai motor nâng từ 72cm lên 120cm mất 12 giây, tải 80kg nên đặt hai màn hình với cả máy in vẫn không ì. Bảng điều khiển nhớ bốn mức, ấn một nút là về đúng độ cao quen của bạn, không phải canh lại mỗi lần. Ngồi liền tám tiếng là lý do đau lưng phổ biến nhất của dân văn phòng — đứng xen kẽ 15 phút mỗi giờ đỡ hẳn.",
    dimensions: { long: 140, wide: 70, high: 120 },
    materials: ["Mặt MDF phủ melamine", "Khung thép", "Motor đôi"],
    colors: [
      { name: "Sồi sáng", hex: "#c4a882" },
      { name: "Đen mờ", hex: "#2c2a27" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
    ],
    rating: 4.8,
    reviewCount: 134,
    sold: 690,
    warrantyMonths: 36,
    specs: [
      { label: "Dải chiều cao", value: "72 – 120 cm" },
      { label: "Tải trọng", value: "80 kg" },
      { label: "Bộ nhớ", value: "4 mức chiều cao" },
      { label: "Độ ồn", value: "< 50 dB" },
    ],
  }),

  p({
    slug: "ghe-xoay-boc-ni-tavi",
    name: "Ghế xoay bọc nỉ Tavi",
    category: "van-phong",
    rooms: ["phong-lam-viec", "phong-ngu"],
    price: 3900000,
    short: "Ghế làm việc nhìn như ghế bành nhỏ, kê phòng ngủ không lạc lõng.",
    description:
      "Ghế công thái học đa số nhìn rất máy móc, kê vào góc học trong phòng ngủ trông chỏi với đồ xung quanh. Tavi bọc nỉ màu trung tính, chân gỗ, nhìn như một cái ghế bành nhỏ — nhưng vẫn xoay đủ 360° và chỉnh cao thấp bằng ti hơi như ghế văn phòng thật.",
    dimensions: { long: 60, wide: 60, high: 95 },
    materials: ["Vải nỉ mềm", "Mút D30", "Chân gỗ sồi", "Ti hơi thép"],
    colors: [
      { name: "Be cát", hex: "#c9b7a2" },
      { name: "Xám khói", hex: "#8c8b86" },
      { name: "Xanh rêu", hex: "#5f6b53" },
    ],
    rating: 4.5,
    reviewCount: 97,
    sold: 610,
    leadTime: "Giao trong 2–3 ngày",
    specs: [
      { label: "Chỉnh chiều cao", value: "45 – 55 cm bằng ti hơi" },
      { label: "Xoay", value: "360°" },
      { label: "Bánh xe", value: "Bánh PU không xước sàn gỗ" },
      { label: "Lưu ý", value: "Không có tựa đầu và đỡ thắt lưng như ghế công thái học" },
    ],
  }),

  /* ---------------------------- ĐÈN CHIẾU SÁNG ---------------------------- */
  p({
    slug: "den-tha-ban-an-cone",
    name: "Đèn thả bàn ăn Cone (bộ 3)",
    category: "den-chieu-sang",
    rooms: ["phong-bep-an"],
    price: 2900000,
    short: "Ba chao nhôm, dây 1m5 cắt ngắn được khi lắp.",
    description:
      "Chao nhôm sơn tĩnh điện khép miệng, ánh sáng đổ thẳng xuống mặt bàn chứ không toé ngang vào mắt người ngồi đối diện. Dây dài 1m5, thợ cắt ngắn theo trần nhà bạn lúc lắp. Treo cách mặt bàn 75–85cm là vừa sáng và vừa mắt nhất.",
    dimensions: { long: 22, wide: 22, high: 25 },
    materials: ["Chao nhôm sơn tĩnh điện", "Đui E27", "Dây vải bọc"],
    colors: [
      { name: "Đen mờ", hex: "#2c2a27" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
      { name: "Đồng cổ", hex: "#8a6a3b" },
    ],
    rating: 4.7,
    reviewCount: 112,
    sold: 760,
    warrantyMonths: 12,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Số lượng", value: "3 đèn" },
      { label: "Đui đèn", value: "E27, chưa gồm bóng" },
      { label: "Chiều dài dây", value: "Tối đa 150 cm, cắt ngắn được" },
      { label: "Khuyến nghị lắp", value: "Cách mặt bàn 75 – 85 cm" },
    ],
  }),
  p({
    slug: "den-cay-doc-sach-arco",
    name: "Đèn cây đọc sách Arco",
    category: "den-chieu-sang",
    rooms: ["phong-khach", "phong-ngu"],
    price: 3400000,
    isBestSeller: true,
    short: "Cần vươn 90cm, rọi đúng ghế đọc mà khỏi khoan tường.",
    description:
      "Cần cong vươn ra 90cm nên đặt đế phía sau lưng ghế, ánh sáng rơi đúng trang sách chứ không đổ vào gáy. Không phải khoan tường bắt đèn, dọn nhà bê đi chỗ khác được. Đế gang nặng 6kg giữ cho khỏi lật. Ba mức sáng chỉnh bằng nút cảm ứng trên thân, màu 3000K vàng ấm đọc tối không rát mắt.",
    dimensions: { long: 90, wide: 30, high: 175 },
    materials: ["Đế gang", "Thân thép sơn tĩnh điện", "LED 3000K"],
    colors: [
      { name: "Đen mờ", hex: "#2c2a27" },
      { name: "Đồng cổ", hex: "#8a6a3b" },
    ],
    rating: 4.8,
    reviewCount: 129,
    sold: 810,
    warrantyMonths: 24,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Tầm vươn", value: "90 cm" },
      { label: "Nhiệt màu", value: "3000K — ánh sáng ấm" },
      { label: "Mức sáng", value: "3 mức, nút cảm ứng" },
      { label: "Trọng lượng đế", value: "6 kg" },
    ],
  }),
  p({
    slug: "den-ban-cam-ung-lumo",
    inStock: false,
    name: "Đèn bàn cảm ứng Lumo",
    category: "den-chieu-sang",
    rooms: ["phong-lam-viec", "phong-ngu"],
    price: 1190000,
    isNew: true,
    short: "Ba nhiệt màu, đế có sẵn cổng sạc USB-C 18W.",
    description:
      "Ba mức màu cho ba việc: 3000K vàng để đọc sách buổi tối, 4000K trung tính cho lúc bình thường, 5500K trắng khi cần tỉnh táo làm việc khuya. Đế gắn sẵn cổng USB-C 18W cắm sạc điện thoại, bớt được một cục sạc lằng nhằng trên bàn.",
    dimensions: { long: 38, wide: 15, high: 42 },
    materials: ["Nhôm anod", "LED chống nhấp nháy"],
    colors: [
      { name: "Trắng sữa", hex: "#e8e2d6" },
      { name: "Đen mờ", hex: "#2c2a27" },
    ],
    rating: 4.6,
    reviewCount: 96,
    sold: 620,
    warrantyMonths: 24,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Nhiệt màu", value: "3000K / 4000K / 5500K" },
      { label: "Cổng sạc", value: "USB-C 18W trên đế" },
      { label: "Chống nhấp nháy", value: "Có, đạt RG0" },
    ],
  }),
  p({
    slug: "den-tuong-doc-sach-arte",
    name: "Đèn tường đọc sách Arte",
    category: "den-chieu-sang",
    rooms: ["phong-ngu", "phong-khach"],
    price: 1650000,
    short: "Gắn tường đầu giường, đọc sách không làm chói người nằm bên.",
    description:
      "Chao đèn khép kín, ánh sáng ra thành một vệt hẹp rọi xuống trang sách, người nằm cạnh gần như không thấy sáng. Cần gập vào sát tường khi không dùng cho khỏi vướng đầu. Công tắc nằm ngay trên đế đèn, với tay là chạm được, không phải mò dây trong tối.",
    dimensions: { long: 45, wide: 12, high: 20 },
    materials: ["Thân thép sơn tĩnh điện", "LED 3000K"],
    colors: [
      { name: "Đen mờ", hex: "#2c2a27" },
      { name: "Trắng sữa", hex: "#e8e2d6" },
      { name: "Đồng cổ", hex: "#8a6a3b" },
    ],
    rating: 4.6,
    reviewCount: 78,
    sold: 540,
    warrantyMonths: 24,
    leadTime: "Giao trong 2–3 ngày",
    shipping: "Miễn phí giao toàn quốc",
    specs: [
      { label: "Nhiệt màu", value: "3000K — ánh sáng ấm" },
      { label: "Tầm vươn", value: "45 cm, cần gập được" },
      { label: "Công tắc", value: "Trên thân đèn" },
      { label: "Kèm theo", value: "Bộ nở bắt tường" },
    ],
  }),
];

/* ------------------------------- Truy vấn -------------------------------- */

/**
 * Đẩy hàng đã bán hết xuống cuối, giữ nguyên thứ tự của các món còn hàng.
 * Dùng ở mọi truy vấn để khách luôn thấy hàng mua được trước.
 */
export function conHangTruoc(list: Product[]) {
  return [...list].sort(
    (a, b) => Number(Boolean(b.inStock)) - Number(Boolean(a.inStock)),
  );
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return conHangTruoc(products.filter((item) => item.category === slug));
}

export function getProductsByRoom(slug: string) {
  return conHangTruoc(products.filter((item) => item.rooms.includes(slug)));
}

export function getBestSellers(limit = 8) {
  return conHangTruoc(products.filter((item) => item.isBestSeller)).slice(0, limit);
}

export function getNewArrivals(limit = 8) {
  return conHangTruoc(products.filter((item) => item.isNew)).slice(0, limit);
}

export function getOnSale(limit = 8) {
  return conHangTruoc(products.filter((item) => item.oldPrice)).slice(0, limit);
}

/** Sản phẩm liên quan: ưu tiên cùng danh mục, thiếu thì lấy cùng không gian */
export function getRelated(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
  const sameRoom = products.filter(
    (item) =>
      item.slug !== product.slug &&
      item.category !== product.category &&
      item.rooms.some((room) => product.rooms.includes(room)),
  );
  return conHangTruoc([...sameCategory, ...sameRoom]).slice(0, limit);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return conHangTruoc(
    products.filter((item) =>
      [item.name, item.short, item.description, ...item.materials]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ),
  );
}

export function priceRange() {
  const values = products.map((item) => item.price);
  return { min: Math.min(...values), max: Math.max(...values) };
}
