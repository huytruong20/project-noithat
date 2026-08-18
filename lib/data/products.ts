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
    short: "Sofa văng 3 chỗ khung sồi sấy, vỏ bọc tháo giặt được.",
    description:
      "Mila là mẫu bán chạy nhất của chúng tôi ba năm liền. Khung gỗ sồi sấy 12% độ ẩm nên không cong vênh trong mùa nồm miền Bắc. Đệm ngồi mút D40 dày 12cm giữ form sau nhiều năm sử dụng, phần tựa dùng mút D25 mềm hơn để lưng thoải mái. Toàn bộ vỏ bọc có khoá kéo giấu, tháo ra giặt máy ở chế độ nhẹ.",
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
    short: "Sofa góc trái/phải đổi được, kèm đôn chân rời.",
    description:
      "Orin dành cho phòng khách từ 20m² trở lên. Phần góc lắp được cả bên trái lẫn bên phải nên không cần đo trước khi đặt. Đôn chân rời có thể kéo ra làm chỗ ngồi phụ khi nhà đông khách, hoặc đẩy vào tạo mặt nằm dài 1m8.",
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
    short: "Kéo phẳng thành giường 1m4 trong 5 giây, có hộc chứa chăn.",
    description:
      "Koda là lời giải cho căn hộ nhỏ hay phòng khách kiêm phòng ngủ cho khách. Cơ cấu kéo trượt bằng thép sơn tĩnh điện, một tay kéo là mặt ngồi phẳng thành giường 1m4 × 1m9. Dưới mặt ngồi có hộc chứa sâu 18cm vừa đủ một bộ chăn gối mùa đông.",
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
    short: "Sofa 2 chỗ chỉ rộng 1m4, vừa phòng trọ và căn hộ studio.",
    description:
      "Yuki sinh ra cho những căn phòng mà sofa tiêu chuẩn kê vào là hết lối đi. Rộng đúng 1m4 nhưng mặt ngồi vẫn sâu 52cm nên ngồi không bị hụt. Chân gỗ tháo rời, khi chuyển nhà tháo ra là lọt thang máy nhỏ.",
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
    short: "Ba khối rời ghép tuỳ ý, đổi bố cục khi chuyển nhà không phải mua mới.",
    description:
      "Piko gồm ba khối độc lập nối bằng ngàm thép giấu dưới đệm. Xếp thẳng hàng thành sofa băng 2m4, xếp chữ L khi kê góc, hoặc tách rời thành ba ghế đơn khi nhà đông khách. Mua thêm khối lẻ sau này vẫn khớp — chúng tôi cam kết giữ chuẩn ngàm này lâu dài.",
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
    short: "Ghế bành ôm lưng, đặt cạnh cửa sổ làm góc đọc sách.",
    description:
      "Hana có lưng ghế ôm cong 105° — góc ngả được tính để ngồi đọc sách lâu không mỏi cổ. Đệm ngồi rộng 52cm đủ ngồi khoanh chân. Nhiều khách đặt Hana ở góc phòng ngủ cạnh cửa sổ.",
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
    short: "Ghế ngả 3 nấc kèm đôn gác chân rời.",
    description:
      "Oslo ngả được 3 nấc từ 100° đến 135° bằng cách gạt lẫy bên hông, không cần motor nên không lo hỏng điện. Đôn gác chân bọc cùng chất liệu, dùng riêng làm ghế đôn khi cần.",
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
    short: "Mặt gỗ sồi tròn 80cm, không góc nhọn — an toàn cho nhà có trẻ nhỏ.",
    description:
      "Bàn tròn không góc nhọn nên nhà có trẻ nhỏ dùng yên tâm, đồng thời dễ đi lại vòng quanh trong phòng khách hẹp. Mặt gỗ sồi phủ dầu lau tự nhiên, xước nhẹ có thể tự chà lại bằng giấy nhám mịn.",
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
    short: "Hai bàn lồng vào nhau, tách ra khi cần thêm mặt bàn.",
    description:
      "Bàn nhỏ trượt gọn dưới bàn lớn khi không dùng, kéo ra khi có khách. Mặt bàn lục giác tạo nhịp hình học nhẹ nhàng, chân thép mảnh 2cm không làm nặng không gian.",
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
    short: "Bộ 2 ghế gỗ sồi nguyên khối, xếp chồng được khi cất.",
    description:
      "Lưng ghế uốn cong ôm sống lưng, mặt ngồi lõm nhẹ nên ngồi ăn lâu không mỏi. Hai chiếc xếp chồng lên nhau được, tiết kiệm chỗ khi nhà ít khách. Gỗ sồi phủ dầu lau, xước nhẹ tự chà lại bằng giấy nhám mịn.",
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
    short: "Mặt kính cường lực trong, phòng nhỏ nhìn đỡ nặng mắt.",
    description:
      "Mặt kính trong cho ánh sáng và màu sàn xuyên qua, nên đặt trong phòng khách hẹp không tạo cảm giác bít. Kính cường lực 10mm mài cạnh vát, chịu được va chạm sinh hoạt hằng ngày. Tầng dưới bằng gỗ để tạp chí và điều khiển.",
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
    short: "Đầu giường bọc nệm cao 110cm, tựa lưng đọc sách thoải mái.",
    description:
      "Đầu giường bọc mút dày 8cm cao tới 110cm nên ngồi tựa đọc sách hay xem phim không cần thêm gối. Giát giường nan gỗ cong đàn hồi, chịu lực 400kg, thoáng khí chống ẩm mốc nệm.",
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
    short: "Gỗ sồi nguyên khối, mộng ghép truyền thống không dùng đinh.",
    description:
      "Taiga ghép mộng âm dương ở bốn góc — kiểu ghép truyền thống chắc hơn bắt vít, càng dùng càng khít. Gỗ sồi trắng nhập khẩu, vân thẳng đều, phủ dầu lau giữ nguyên cảm giác chạm vào thớ gỗ.",
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
    short: "4 hộc kéo dưới gầm, thêm 320 lít chỗ chứa mà không tốn diện tích.",
    description:
      "Bốn hộc kéo ray bi giảm chấn chia đều hai bên giường, tổng dung tích 320 lít — đủ cất chăn mùa đông, vali và đồ ít dùng. Giải pháp gọn cho căn hộ không có kho.",
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
    short: "Dáng thấp kéo dài, có lỗ luồn dây giấu gọn dây điện.",
    description:
      "Kệ cao 42cm — thấp hơn tầm mắt khi ngồi sofa nên tivi ở đúng độ cao xem không mỏi cổ. Mặt sau khoét hai lỗ luồn dây, bên trong có khay đi dây để không lộ mớ dây nguồn.",
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
    short: "Cánh nan thoáng khí, chứa 18 đôi mà chỉ sâu 26cm.",
    description:
      "Cánh dạng nan hở giúp giày khô nhanh và không ám mùi trong tủ kín. Chiều sâu chỉ 26cm nên kê sát tường lối vào vẫn không cản đường đi.",
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
    short: "Cánh mở toàn phần, nhìn thấy hết đồ trong một lần mở.",
    description:
      "Khác tủ cánh lùa chỉ mở được nửa tủ một lúc, ba cánh mở của Milo cho bạn thấy toàn bộ quần áo cùng lúc — tìm đồ nhanh hơn hẳn vào buổi sáng vội. Bản lề giảm chấn đóng êm, không đập. Cần chừa 60cm trước tủ để mở cánh thoải mái.",
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
    short: "Khung thép mảnh 5 tầng, chỉ chiếm 35cm chiều sâu.",
    description:
      "Khung thép ống 2cm để lộ, kết hợp mặt kệ gỗ — kiểu công nghiệp nhẹ nhàng, không nặng nề như tủ kín. Sâu 35cm nên kê được ở hành lang hẹp hay khoảng tường trống giữa hai phòng. Năm tầng đủ cho sách, chậu cây nhỏ và đồ trang trí.",
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
    short: "Một tấm gỗ liền, giữ nguyên đường vân và cạnh tự nhiên.",
    description:
      "Mặt bàn cắt từ một tấm gỗ me tây liền, giữ lại đường cạnh tự nhiên (live edge) nên không tấm nào giống tấm nào. Đã xử lý chống mối và sấy kỹ, phủ 3 lớp dầu chống thấm nước canh và dầu ăn.",
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
    short: "Mặt ceramic chịu nhiệt 300°C, đặt nồi nóng trực tiếp không sao.",
    description:
      "Mặt đá ceramic nung ở nhiệt độ cao, đặt nồi lẩu nóng trực tiếp lên không để lại vết. Không thấm nước mắm, cà phê hay nghệ — lau bằng khăn ẩm là sạch. Lựa chọn thực tế cho gia đình Việt hay ăn món nước.",
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
    short: "Trọn bộ bàn 1m2 và 4 ghế, hợp căn hộ 2 phòng ngủ.",
    description:
      "Bộ hoàn chỉnh không cần phối thêm. Ghế có lưng cong ôm sống lưng, mặt ngồi lõm nhẹ nên ngồi ăn lâu vẫn dễ chịu. Bàn 1m2 vừa đủ cho gia đình 4 người.",
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
    short: "Mở rộng từ 90cm lên 150cm khi có khách.",
    description:
      "Ngày thường gấp lại còn 90cm kê sát tường cho 2–4 người; cuối tuần đông khách mở cánh phụ thành 150cm ngồi được 6 người. Cơ cấu bản lề bướm chắc, thao tác một tay.",
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
    short: "Mâm xoay giữa bàn, cả nhà gắp món không phải với tay.",
    description:
      "Mâm xoay đường kính 60cm đặt giữa bàn, quay trên vòng bi nên đẩy nhẹ là xoay êm. Kiểu bàn quen thuộc của bữa cơm Việt nhiều món dùng chung — không ai phải với tay hay nhờ chuyền đĩa. Bàn tròn không góc nhọn, nhà có trẻ nhỏ dùng yên tâm.",
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
    short: "Len pha cotton dệt tay, hoa văn hình học tối giản.",
    description:
      "Thảm dệt tay nên hai tấm không bao giờ giống hệt nhau. Sợi len pha cotton mềm chân, dày 12mm đủ ấm mùa đông mà không bí mùa hè. Đế chống trượt khâu liền.",
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
    short: "Gương treo tường viền gỗ sồi, làm phòng nhỏ trông rộng hơn.",
    description:
      "Treo đối diện cửa sổ, gương hắt ánh sáng tự nhiên vào sâu trong phòng — mẹo cũ nhưng hiệu quả với căn hộ thiếu sáng. Kính 5mm phủ lớp chống mốc viền, dùng được cả trong phòng tắm.",
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
    short: "Ba tầng so le đón nắng đều, có khay hứng nước tưới.",
    description:
      "Ba tầng đặt so le nhau nên cây tầng dưới không bị tầng trên che nắng. Mỗi tầng có khay nhựa hứng nước tưới rời ra rửa được, không để nước đọng làm mục gỗ hay ố sàn. Đặt cạnh cửa sổ hướng Đông là chỗ nắng tốt nhất cho cây trong nhà.",
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
    short: "Bốn vỏ gối linen tông trầm, đổi màu sofa mà không phải bọc lại.",
    description:
      "Cách rẻ nhất để đổi không khí phòng khách: thay bốn cái gối tựa thay vì bọc lại cả bộ sofa. Bốn vỏ gồm hai màu nền và hai màu nhấn, phối theo quy tắc 60–30–10. Vải linen pha cotton mềm, có khoá kéo giấu, tháo giặt máy.",
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
    short: "Đổi giữa ngồi và đứng bằng một nút, nhớ 4 độ cao.",
    description:
      "Motor đôi nâng êm từ 72cm lên 120cm trong 12 giây, tải 80kg nên hai màn hình vẫn thoải mái. Bảng điều khiển nhớ 4 mức chiều cao, ấn một nút là về đúng tư thế quen. Ngồi liên tục 8 tiếng là nguyên nhân đau lưng phổ biến nhất của dân văn phòng — đứng xen kẽ 15 phút mỗi giờ giúp giảm rõ.",
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
    short: "Ghế làm việc dáng mềm, kê phòng ngủ không lạc lõng như ghế văn phòng.",
    description:
      "Phần lớn ghế công thái học nhìn rất kỹ thuật, kê vào góc học của phòng ngủ trông lệch hẳn với đồ xung quanh. Tavi bọc nỉ màu trung tính, chân gỗ, nhìn như một chiếc ghế bành nhỏ nhưng vẫn xoay 360° và chỉnh cao thấp bằng ti hơi.",
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
    short: "Ba chao nhôm, dây điều chỉnh chiều dài tới 1m5.",
    description:
      "Chao nhôm sơn tĩnh điện hắt sáng xuống đúng mặt bàn, không chói mắt người ngồi đối diện. Dây dài 1m5 cắt ngắn được khi lắp. Treo cách mặt bàn 75–85cm là đẹp và đủ sáng nhất.",
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
    short: "Cần vươn 90cm, rọi sáng ghế đọc mà không cần khoan tường.",
    description:
      "Cần cong vươn ra 90cm nên đặt đế sau lưng ghế, ánh sáng rơi đúng trang sách. Đế gang nặng 6kg chống lật. Ba mức sáng chỉnh bằng nút cảm ứng trên thân, nhiệt màu 3000K ấm không hại mắt buổi tối.",
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
    short: "Đổi 3 nhiệt màu, có cổng sạc USB-C trên đế.",
    description:
      "Ba nhiệt màu: 3000K để đọc sách buổi tối, 4000K trung tính và 5500K trắng cho lúc làm việc cần tỉnh táo. Đế tích hợp cổng USB-C 18W sạc điện thoại, bớt được một cục sạc trên bàn.",
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
    short: "Gắn tường đầu giường, đọc sách không làm chói người nằm cạnh.",
    description:
      "Chao đèn khép kín hắt sáng thành một vệt hẹp xuống trang sách, người nằm bên cạnh gần như không thấy chói. Cần gập được nên đẩy sát tường khi không dùng. Công tắc nằm ngay trên đế, không phải mò tìm trong tối.",
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
