import type { Product, QaItem, StyleSlug } from "@/lib/types";
import { products } from "@/lib/data/products";
import { roomCollections } from "@/lib/data/categories";

/* ------------------------------ Phong cách ------------------------------ */

export const styles: { slug: StyleSlug; name: string; note: string }[] = [
  { slug: "hien-dai", name: "Hiện đại", note: "Đường nét gọn, ít hoa văn" },
  { slug: "bac-au", name: "Bắc Âu", note: "Gỗ sáng, chân thon, màu nhạt" },
  { slug: "toi-gian", name: "Tối giản", note: "Bỏ hết chi tiết thừa" },
  { slug: "indochine", name: "Đông Dương", note: "Gỗ trầm, hoa văn thủ công" },
  { slug: "cong-nghiep", name: "Industrial", note: "Khung kim loại lộ, thô mộc" },
  { slug: "co-dien", name: "Tân cổ điển", note: "Da, đồng, tỉ lệ bề thế" },
];

export function styleName(slug: StyleSlug) {
  return styles.find((style) => style.slug === slug)?.name ?? slug;
}

/* ------------------------------ Kích thước ------------------------------ */

/** Phân nhóm theo chiều ngang lớn nhất — số đo khách quan tâm khi đo chỗ kê */
export const sizeBuckets = [
  { key: "nho", label: "Nhỏ — dưới 100 cm", test: (v: number) => v < 100 },
  { key: "vua", label: "Vừa — 100 đến 180 cm", test: (v: number) => v >= 100 && v < 180 },
  { key: "lon", label: "Lớn — 180 đến 250 cm", test: (v: number) => v >= 180 && v < 250 },
  { key: "rat-lon", label: "Rất lớn — trên 250 cm", test: (v: number) => v >= 250 },
];

export function sizeOf(product: Product) {
  return product.dimensions.long;
}

/* --------------------------- Hoàn thiện bề mặt --------------------------- */

const finishRules: { pattern: RegExp; text: string }[] = [
  { pattern: /dầu lau/i, text: "Dầu lau gốc thực vật — giữ nguyên cảm giác thớ gỗ, xước nhẹ tự chà lại được" },
  { pattern: /sơn pu/i, text: "Sơn PU mờ — bề mặt mịn, chống ẩm, lau chùi dễ" },
  { pattern: /melamine/i, text: "Phủ melamine vân gỗ — bền xước, không phai màu" },
  { pattern: /veneer/i, text: "Veneer gỗ thật lát mỏng, phủ sơn bảo vệ" },
  { pattern: /sơn tĩnh điện/i, text: "Sơn tĩnh điện — chống gỉ, không bong tróc" },
  { pattern: /anod/i, text: "Nhôm anod hoá — không gỉ, bề mặt mờ chống bám vân tay" },
  { pattern: /men mộc/i, text: "Men mộc nhám nhẹ, nung nhiệt độ cao" },
  { pattern: /cường lực/i, text: "Kính cường lực, mài cạnh an toàn" },
];

export function finishOf(product: Product): string[] {
  const text = product.materials.join(" ");
  const found = finishRules.filter((rule) => rule.pattern.test(text)).map((r) => r.text);
  return found.length > 0
    ? found
    : ["Hoàn thiện tiêu chuẩn của xưởng, bề mặt nhẵn và đồng màu"];
}

/* --------------------------- Hướng dẫn bảo quản -------------------------- */

const careRules: { pattern: RegExp; tips: string[] }[] = [
  {
    pattern: /sồi|óc chó|cao su|thông|me tây|gỗ/i,
    tips: [
      "Lau bằng khăn ẩm vắt kỹ, không dội nước trực tiếp lên mặt gỗ.",
      "Tránh kê sát cửa sổ hướng Tây không rèm — nắng gắt làm bạc màu gỗ.",
      "Không đặt cốc nóng trực tiếp lên mặt gỗ, dùng lót ly để tránh vết vòng trắng.",
      "Mỗi 6–12 tháng lau lại một lớp dầu dưỡng gỗ để bề mặt không bị khô.",
    ],
  },
  {
    pattern: /vải|nỉ|nhung|linen|len/i,
    tips: [
      "Hút bụi hàng tuần bằng đầu bàn chải mềm, đi cả kẽ giữa đệm và tay vịn.",
      "Đổ nước hay thức ăn thì thấm ngay bằng khăn khô từ ngoài vào trong, tuyệt đối không chà mạnh.",
      "Vỏ bọc tháo được giặt máy chế độ nhẹ, nước dưới 30°C, không dùng thuốc tẩy.",
      "Phơi trong bóng râm nơi thoáng gió — nắng gắt làm bạc màu và co vải.",
    ],
  },
  {
    pattern: /\bda\b|microfiber/i,
    tips: [
      "Lau bụi hàng tuần bằng khăn khô mềm, không dùng khăn ướt sũng.",
      "Ba tháng một lần thoa kem dưỡng da chuyên dụng để da không bị khô nứt.",
      "Tránh xa nguồn nhiệt và ánh nắng trực tiếp, cách lò sưởi hoặc điều hoà ít nhất 50cm.",
      "Không dùng cồn, xăng thơm hay nước tẩy rửa đa năng lên bề mặt da.",
    ],
  },
  {
    pattern: /ceramic|đá/i,
    tips: [
      "Lau bằng khăn ẩm là sạch, không cần hoá chất chuyên dụng.",
      "Đặt nồi nóng trực tiếp được, nhưng vẫn nên tránh thay đổi nhiệt độ đột ngột.",
      "Không dùng miếng cọ kim loại — dễ để lại vệt xám trên bề mặt bóng.",
    ],
  },
  {
    pattern: /thép|nhôm|đồng|gang|sắt/i,
    tips: [
      "Lau khô sau khi vệ sinh, không để đọng nước ở chân tiếp xúc sàn.",
      "Kiểm tra và siết lại ốc mỗi 6 tháng, nhất là với đồ hay di chuyển.",
    ],
  },
  {
    pattern: /kính|gương/i,
    tips: [
      "Xịt nước lau kính lên khăn rồi lau, không xịt thẳng lên mặt kính để nước không chảy vào viền.",
      "Không dùng vật cứng cạo vết bẩn, dễ để lại xước vĩnh viễn.",
    ],
  },
  {
    pattern: /gốm/i,
    tips: [
      "Rửa bằng tay với nước ấm, không cho vào máy rửa bát.",
      "Đồ thủ công nên tránh va đập và thay đổi nhiệt độ đột ngột.",
    ],
  },
  {
    pattern: /led|motor|usb/i,
    tips: [
      "Rút điện trước khi vệ sinh, chỉ lau bằng khăn khô.",
      "Không tự tháo bộ nguồn hay motor — việc này làm mất hiệu lực bảo hành.",
    ],
  },
];

export function careTips(product: Product): string[] {
  if (product.careOverride) return product.careOverride;

  const text = product.materials.join(" ");
  const tips = careRules
    .filter((rule) => rule.pattern.test(text))
    .flatMap((rule) => rule.tips);

  const unique = Array.from(new Set(tips));
  return unique.length > 0
    ? unique
    : ["Lau bằng khăn mềm ẩm, tránh hoá chất tẩy mạnh và ánh nắng trực tiếp."];
}

/* ------------------------------ Phí lắp đặt ------------------------------ */

/** Đồ nhỏ không cần thợ lắp; đồ lớn đã tính công lắp vào giá bán */
const noAssemblyCategories = ["trang-tri", "den-chieu-sang"];

export function installNoteOf(product: Product) {
  if (product.installNote) return product.installNote;
  if (noAssemblyCategories.includes(product.category)) {
    return "Không cần lắp đặt";
  }
  return "Miễn phí — đã gồm trong giá";
}

/* -------------------------- Phù hợp không gian --------------------------- */

export function roomFitText(product: Product) {
  const names = product.rooms
    .map((slug) => roomCollections.find((room) => room.slug === slug)?.name)
    .filter(Boolean);

  const area = product.dimensions.long * product.dimensions.wide / 10000;
  const advice =
    area > 2
      ? "Món này chiếm diện tích đáng kể, nên bố trí ở phòng từ 18m² trở lên và chừa lối đi tối thiểu 75cm."
      : area > 0.8
        ? "Kích thước vừa phải, kê được ở phòng từ 12m² mà không làm nghẽn lối đi."
        : "Gọn, đặt được cả ở căn hộ nhỏ hoặc góc trống sẵn có.";

  return { rooms: names as string[], advice };
}

/* ------------------------------- Hỏi đáp -------------------------------- */

const genericQa: QaItem[] = [
  {
    question: "Hàng có sẵn hay phải đặt sản xuất?",
    answer:
      "Thời gian giao ghi ngay dưới giá bán. Ghi 'Giao trong 2–5 ngày' là hàng có sẵn tại kho; ghi 'Đặt sản xuất' nghĩa là xưởng làm theo đơn của bạn.",
    asker: "Minh Quân",
    daysAgo: 8,
  },
  {
    question: "Màu ngoài đời có giống ảnh trên web không?",
    answer:
      "Chấm màu trên web đúng với mã màu vải/gỗ thật, nhưng màn hình mỗi máy hiển thị lệch một chút. Nếu cần chắc chắn, ghé showroom xem mẫu thật hoặc nhắn hotline để chúng tôi gửi ảnh chụp thực tế dưới ánh sáng tự nhiên.",
    asker: "Thu Trang",
    daysAgo: 21,
  },
  {
    question: "Nếu kê vào nhà thấy không hợp thì đổi được không?",
    answer:
      "Hàng có sẵn còn nguyên trạng đổi trả trong 7 ngày, không cần lý do. Riêng hàng đặt sản xuất theo yêu cầu thì không áp dụng, nên hãy nhờ tư vấn đo giúp trước khi đặt.",
    asker: "Hoàng Long",
    daysAgo: 35,
  },
];

const categoryQa: Record<string, QaItem[]> = {
  sofa: [
    {
      question: "Nhà có trẻ nhỏ và mèo thì nên chọn vải hay da?",
      answer:
        "Mèo cào thì da thật và vải nhung tăm đều dễ hỏng. Nên chọn vải bố dệt dày hoặc vải nano chống nước — bám móng ít hơn và vết bẩn lau được. Ưu tiên bản có vỏ bọc tháo giặt.",
      asker: "Ngọc Diệp",
      daysAgo: 14,
    },
    {
      question: "Mút D40 nghĩa là gì, có bị xẹp không?",
      answer:
        "D40 là tỷ trọng 40kg/m³ — càng cao càng đàn hồi và giữ form lâu. Với mật độ này, đệm ngồi giữ form tốt trong khoảng 5–7 năm dùng hằng ngày. Đảo vị trí đệm định kỳ sẽ mòn đều hơn.",
      asker: "Anh Tuấn",
      daysAgo: 27,
    },
  ],
  giuong: [
    {
      question: "Giường này dùng được với nệm dày bao nhiêu?",
      answer:
        "Giát nan chịu được nệm dày tới 30cm. Nệm dày quá 25cm sẽ làm mặt nằm cao hơn đầu giường, nhìn mất cân đối — nên chọn nệm 20–25cm là đẹp nhất.",
      asker: "Phương Anh",
      daysAgo: 11,
    },
    {
      question: "Có mua riêng nệm ở đây được không?",
      answer:
        "Hiện chúng tôi chưa bán nệm. Bạn mua nệm ngoài theo đúng kích thước ghi trong thông số là lắp vừa, không cần đặt riêng.",
      asker: "Đức Anh",
      daysAgo: 30,
    },
  ],
  "van-phong": [
    {
      question: "Bàn nâng hạ có ồn không, dùng ở nhà buổi tối được không?",
      answer:
        "Độ ồn dưới 50dB, tương đương tiếng quạt trần số nhỏ. Nâng hạ buổi tối không làm phiền người ngủ phòng bên.",
      asker: "Việt Hưng",
      daysAgo: 9,
    },
    {
      question: "Người cao 1m5 dùng ghế công thái học này có vừa không?",
      answer:
        "Vừa. Ghế chỉnh được chiều cao mặt ngồi từ 42 đến 52cm và gối đỡ lưng chỉnh 4 hướng. Với người dưới 1m55, nên hạ mặt ngồi thấp nhất và dùng thêm kê chân để đùi song song mặt sàn.",
      asker: "Lan Chi",
      daysAgo: 19,
    },
  ],
  "ban-an": [
    {
      question: "Bàn 1m6 ngồi được mấy người?",
      answer:
        "Thoải mái cho 6 người (mỗi chỗ ngồi cần khoảng 60cm chiều ngang). Ngồi 8 người vẫn được nhưng hơi chật khi bày nhiều món.",
      asker: "Thanh Hằng",
      daysAgo: 16,
    },
  ],
  "tu-ke": [
    {
      question: "Tủ có bắt vít vào tường không?",
      answer:
        "Tủ cao trên 1m5 được kỹ thuật viên bắt thanh chống lật vào tường theo tiêu chuẩn an toàn, đặc biệt quan trọng với nhà có trẻ nhỏ. Phụ kiện này đã kèm sẵn, không tính thêm tiền.",
      asker: "Mai Phương",
      daysAgo: 13,
    },
  ],
};

export function qaFor(product: Product): QaItem[] {
  if (product.qa) return product.qa;
  return [...(categoryQa[product.category] ?? []), ...genericQa].slice(0, 4);
}

/* --------------------------- Thường mua kèm ----------------------------- */

/**
 * Gợi ý combo: lấy món bán chạy ở danh mục KHÁC nhưng dùng chung không gian.
 * Ví dụ mua sofa sẽ gợi ý bàn trà, thảm và đèn cây — đúng thứ khách hay mua thêm.
 */
export function frequentlyBoughtWith(product: Product, limit = 3): Product[] {
  if (product.bundleWith) {
    return product.bundleWith
      .map((slug) => products.find((item) => item.slug === slug))
      .filter((item): item is Product => Boolean(item))
      .slice(0, limit);
  }

  const candidates = products.filter(
    (item) =>
      item.slug !== product.slug &&
      item.category !== product.category &&
      item.inStock &&
      item.rooms.some((room) => product.rooms.includes(room)),
  );

  // Mỗi danh mục chỉ lấy một món, ưu tiên món bán chạy nhất
  const seen = new Set<string>();
  return candidates
    .sort((a, b) => b.sold - a.sold)
    .filter((item) => {
      if (seen.has(item.category)) return false;
      seen.add(item.category);
      return true;
    })
    .slice(0, limit);
}
