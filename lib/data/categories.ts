import type { Category, RoomCollection } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "sofa",
    name: "Sofa",
    tagline: "Chỗ ngồi chính của cả nhà",
    blurb:
      "Văng, góc chữ L và loại kéo ra thành giường. Khung sồi sấy còn 8–12% ẩm, đệm mút D40 ngồi mười năm chưa xẹp. Vỏ bọc tháo ra giặt máy được.",
    tint: "#c9b7a2",
  },
  {
    slug: "ban-ghe",
    name: "Bàn ghế",
    tagline: "Món nhỏ, đặt vào là khác hẳn",
    blurb:
      "Ghế bành, ghế thư giãn, bàn trà và đôn gỗ. Toàn món dưới 80cm bề ngang — kê thêm vào góc trống mà lối đi vẫn rộng.",
    tint: "#b9a58c",
  },
  {
    slug: "giuong",
    name: "Giường ngủ",
    tagline: "Nằm êm, cất được đồ",
    blurb:
      "Giường gỗ nguyên tấm và giường bọc nệm đầu cao. Bản hộc kéo chứa thêm được 4–6 bộ chăn ga, bản nâng hạ mở cả mặt giường lên.",
    tint: "#a89d8d",
  },
  {
    slug: "tu-ke",
    name: "Tủ & kệ",
    tagline: "Đồ tăng thì ghép thêm ngăn",
    blurb:
      "Tủ quần áo, tủ giày, kệ tivi, kệ sách. Loại module ghép nối được nên năm sau có thêm đồ thì mua thêm khoang, không phải bỏ cả bộ.",
    tint: "#bfae97",
  },
  {
    slug: "ban-an",
    name: "Bàn ăn",
    tagline: "Bốn tới tám người ngồi vừa",
    blurb:
      "Mặt gỗ nguyên tấm, đá ceramic chịu nhiệt 300°C hoặc MDF phủ melamine lau nước không phồng. Đặt bàn là có ghế cùng bộ, không phải đi tìm.",
    tint: "#c4b49c",
  },
  {
    slug: "trang-tri",
    name: "Trang trí",
    tagline: "Thêm vài món cho phòng có hồn",
    blurb:
      "Thảm, gương, bình gốm, tranh khung gỗ. Chọn tông trung tính nên đặt cạnh đồ cũ trong nhà vẫn hợp, không chỏi màu.",
    tint: "#cbbca9",
  },
  {
    slug: "van-phong",
    name: "Văn phòng",
    tagline: "Ngồi tám tiếng không đau lưng",
    blurb:
      "Bàn thường, bàn nâng hạ điện đổi tư thế đứng ngồi, ghế tựa lưng theo dáng cột sống, tủ hồ sơ có bánh xe. Đặt lẻ một bộ hay cả tầng văn phòng đều được.",
    tint: "#a9a89e",
  },
  {
    slug: "den-chieu-sang",
    name: "Đèn chiếu sáng",
    tagline: "Sáng đủ chỗ cần, không chói mắt",
    blurb:
      "Đèn thả bàn ăn, đèn cây cạnh sofa, đèn bàn đọc sách. Mặc định 3000K vàng ấm, một số mẫu bấm đổi được ba mức từ vàng sang trắng.",
    tint: "#d0c3ab",
  },
];

export const roomCollections: RoomCollection[] = [
  {
    slug: "phong-khach",
    name: "Phòng khách",
    tagline: "Đủ chỗ ngồi mà không chật",
    blurb:
      "Lấy sofa làm trục, bàn trà chọn loại thấp dưới 42cm để nhìn xuyên qua được, kệ tivi nằm ngang kéo dài mắt nhìn. Gỗ óc chó đi với vải màu cát.",
    tint: "#c9b7a2",
    categories: ["sofa", "ban-ghe", "tu-ke", "trang-tri", "den-chieu-sang"],
  },
  {
    slug: "phong-ngu",
    name: "Phòng ngủ",
    tagline: "Ít đồ, ngủ nhanh hơn",
    blurb:
      "Đầu giường bọc nệm tựa lưng đọc sách, hai tab hai bên cho cân, tủ cánh lùa không cần chừa 60cm mở cánh. Đèn để 3000K trở xuống cho dễ buồn ngủ.",
    tint: "#b3a494",
    categories: ["giuong", "tu-ke", "den-chieu-sang", "trang-tri"],
  },
  {
    slug: "phong-bep-an",
    name: "Bếp & phòng ăn",
    tagline: "Đặt nồi nóng lên cũng không sao",
    blurb:
      "Mặt bàn chịu nhiệt, đổ nước mắm lau là sạch. Ghế bọc da công nghiệp không ngấm dầu mỡ. Đèn thả treo cách mặt bàn 75–85cm, ngồi đối diện không chói.",
    tint: "#c4b49c",
    categories: ["ban-an", "ban-ghe", "tu-ke", "den-chieu-sang"],
  },
  {
    slug: "phong-lam-viec",
    name: "Phòng làm việc",
    tagline: "Làm cả ngày không mỏi vai",
    blurb:
      "Bàn nâng hạ để đứng làm 15 phút mỗi giờ, ghế có gối đỡ thắt lưng, kệ hồ sơ đặt trong tầm với khỏi phải đứng lên. Đèn bàn hắt sáng gián tiếp cho ca tối.",
    tint: "#a9a89e",
    categories: ["van-phong", "tu-ke", "den-chieu-sang"],
  },
  {
    slug: "can-ho-nho",
    name: "Căn hộ nhỏ",
    tagline: "Dưới 55m² vẫn kê đủ",
    blurb:
      "Chọn món kiêm hai việc: sofa kéo thành giường, bàn ăn gấp cánh, giường có hộc. Đồ chân cao hở sàn 15cm trở lên khiến phòng nhìn rộng hơn thật.",
    tint: "#bdb3a4",
    categories: ["sofa", "ban-an", "giuong", "tu-ke"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getRoom(slug: string) {
  return roomCollections.find((r) => r.slug === slug);
}
