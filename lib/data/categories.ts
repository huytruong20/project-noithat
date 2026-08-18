import type { Category, RoomCollection } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "sofa",
    name: "Sofa",
    tagline: "Trung tâm của phòng khách",
    blurb:
      "Sofa văng, sofa góc và sofa giường với khung gỗ sồi sấy, mút D40 đàn hồi cao. Bọc vải hoặc da tuỳ chọn, tháo giặt được.",
    tint: "#c9b7a2",
  },
  {
    slug: "ban-ghe",
    name: "Bàn ghế",
    tagline: "Ghế đơn, bàn trà, đôn",
    blurb:
      "Ghế thư giãn, ghế bành, bàn trà và đôn gỗ. Những món nhỏ tạo nhịp cho không gian mà không chiếm diện tích.",
    tint: "#b9a58c",
  },
  {
    slug: "giuong",
    name: "Giường ngủ",
    tagline: "Ngủ sâu mỗi đêm",
    blurb:
      "Giường gỗ tự nhiên và giường bọc nệm đầu giường, có phiên bản hộc kéo hoặc nâng hạ tận dụng không gian lưu trữ.",
    tint: "#a89d8d",
  },
  {
    slug: "tu-ke",
    name: "Tủ & kệ",
    tagline: "Cất gọn, bày đẹp",
    blurb:
      "Tủ quần áo, tủ giày, kệ tivi và kệ sách theo module — ghép mở rộng khi nhà bạn có thêm đồ.",
    tint: "#bfae97",
  },
  {
    slug: "ban-an",
    name: "Bàn ăn",
    tagline: "Nơi cả nhà ngồi lại",
    blurb:
      "Bàn ăn 4–8 chỗ mặt gỗ nguyên tấm, đá ceramic hoặc MDF phủ melamine chống ẩm, kèm bộ ghế đồng bộ.",
    tint: "#c4b49c",
  },
  {
    slug: "trang-tri",
    name: "Trang trí",
    tagline: "Chi tiết làm nên gu",
    blurb:
      "Thảm dệt, gương, bình gốm, tranh khung gỗ và vật dụng nhỏ giúp không gian bớt trống mà không rối.",
    tint: "#cbbca9",
  },
  {
    slug: "van-phong",
    name: "Văn phòng",
    tagline: "Làm việc không mỏi",
    blurb:
      "Bàn làm việc, bàn nâng hạ điện, ghế công thái học và tủ tài liệu cho góc làm việc tại nhà lẫn văn phòng công ty.",
    tint: "#a9a89e",
  },
  {
    slug: "den-chieu-sang",
    name: "Đèn chiếu sáng",
    tagline: "Ánh sáng đúng chỗ",
    blurb:
      "Đèn thả bàn ăn, đèn cây phòng khách và đèn bàn đọc sách. Nhiệt màu 3000K ấm, có bản đổi màu 3 chế độ.",
    tint: "#d0c3ab",
  },
];

export const roomCollections: RoomCollection[] = [
  {
    slug: "phong-khach",
    name: "Phòng khách",
    tagline: "Ấm, rộng và dễ tiếp khách",
    blurb:
      "Bộ sofa làm trục chính, bàn trà thấp giữ tầm nhìn thoáng, kệ tivi thấp kéo dài cảm giác rộng. Phối gỗ óc chó với vải màu cát.",
    tint: "#c9b7a2",
    categories: ["sofa", "ban-ghe", "tu-ke", "trang-tri", "den-chieu-sang"],
  },
  {
    slug: "phong-ngu",
    name: "Phòng ngủ",
    tagline: "Tối giản để dễ ngủ",
    blurb:
      "Giường đầu bọc nệm, hai tab đầu giường cân đối, tủ quần áo cánh lùa tiết kiệm lối đi. Ánh sáng vàng ấm dưới 3000K.",
    tint: "#b3a494",
    categories: ["giuong", "tu-ke", "den-chieu-sang", "trang-tri"],
  },
  {
    slug: "phong-bep-an",
    name: "Bếp & phòng ăn",
    tagline: "Bữa cơm gọn gàng",
    blurb:
      "Bàn ăn chịu nhiệt và chống ố, ghế dễ lau, đèn thả canh đúng tâm bàn ở độ cao 75–85cm tính từ mặt bàn.",
    tint: "#c4b49c",
    categories: ["ban-an", "ban-ghe", "tu-ke", "den-chieu-sang"],
  },
  {
    slug: "phong-lam-viec",
    name: "Phòng làm việc",
    tagline: "Ngồi 8 tiếng vẫn khoẻ",
    blurb:
      "Bàn nâng hạ đổi tư thế, ghế công thái học đỡ thắt lưng, kệ tài liệu trong tầm với. Đèn bàn chống chói cho buổi tối.",
    tint: "#a9a89e",
    categories: ["van-phong", "tu-ke", "den-chieu-sang"],
  },
  {
    slug: "can-ho-nho",
    name: "Căn hộ nhỏ",
    tagline: "Dưới 55m² vẫn đủ đầy",
    blurb:
      "Ưu tiên món đa năng: sofa giường, bàn ăn gấp mở, giường có hộc kéo. Chọn chân cao để sàn lộ ra, mắt thấy rộng hơn.",
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
