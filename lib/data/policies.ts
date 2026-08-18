import type { Policy } from "@/lib/types";

export const policies: Policy[] = [
  {
    slug: "giao-hang-lap-dat",
    title: "Chính sách giao hàng & lắp đặt",
    summary:
      "Miễn phí giao và lắp đặt nội thành Gia Lai – TP.HCM. Kỹ thuật viên lắp tại nhà, dọn sạch bao bì trước khi về.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Phạm vi và phí giao hàng",
        bullets: [
          "Nội thành Gia Lai và TP.HCM: miễn phí giao và lắp đặt cho mọi đơn hàng.",
          "Ngoại thành hai thành phố trên: miễn phí cho đơn từ 10 triệu, dưới mức này phụ thu 300.000đ.",
          "Các tỉnh thành khác: phí tính theo khối lượng và quãng đường, nhân viên báo trước khi xác nhận đơn. Đơn từ 20 triệu được miễn phí vận chuyển toàn quốc.",
          "Đồ trang trí nhỏ và đèn: miễn phí giao toàn quốc qua đơn vị chuyển phát.",
        ],
      },
      {
        heading: "Thời gian giao hàng",
        bullets: [
          "Hàng có sẵn: 2–5 ngày làm việc kể từ khi xác nhận đơn.",
          "Hàng đặt sản xuất: 7–21 ngày tuỳ sản phẩm, thời gian cụ thể ghi rõ trên trang chi tiết từng món.",
          "Chúng tôi gọi xác nhận khung giờ trước 1 ngày. Bạn có thể đổi lịch giao miễn phí nếu báo trước 24 giờ.",
        ],
      },
      {
        heading: "Lắp đặt tại nhà",
        paragraphs: [
          "Toàn bộ sản phẩm cần lắp ráp đều có kỹ thuật viên thực hiện tại nhà, đã tính trong giá bán. Đội lắp đặt mang theo thảm lót sàn, hút bụi khu vực làm việc và mang toàn bộ bao bì đi khi hoàn tất.",
        ],
        bullets: [
          "Thời gian lắp trung bình: sofa 15 phút, giường 30–45 phút, tủ quần áo 60–90 phút.",
          "Kỹ thuật viên hướng dẫn cách vận hành và bảo quản trước khi ra về.",
          "Chúng tôi chỉ nghiệm thu khi bạn đã kiểm tra và hài lòng.",
        ],
      },
      {
        heading: "Trường hợp thang máy không đủ kích thước",
        paragraphs: [
          "Nếu kiện hàng không lọt thang máy, chúng tôi hỗ trợ khiêng thang bộ miễn phí tới tầng 5. Từ tầng 6 trở lên phụ thu 50.000đ mỗi tầng mỗi kiện. Vui lòng báo trước tình trạng thang máy khi đặt hàng để chúng tôi bố trí đủ nhân sự.",
        ],
      },
      {
        heading: "Kiểm tra khi nhận hàng",
        bullets: [
          "Bạn có quyền mở kiện kiểm tra trước khi ký nhận.",
          "Nếu phát hiện lỗi, xước hay móp do vận chuyển, báo ngay tại chỗ — chúng tôi mang về và đổi mới, không tính phí.",
          "Sau khi ký nhận, lỗi hình thức bên ngoài vẫn được tiếp nhận trong 48 giờ nếu có ảnh chụp.",
        ],
      },
    ],
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    summary:
      "Đổi trả trong 7 ngày với hàng có sẵn còn nguyên trạng. Lỗi do nhà sản xuất được đổi mới hoặc hoàn tiền 100%.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Điều kiện đổi trả",
        bullets: [
          "Trong vòng 7 ngày kể từ ngày nhận hàng.",
          "Sản phẩm còn nguyên trạng, chưa qua sử dụng, không trầy xước hay ám mùi.",
          "Còn đủ bao bì, phụ kiện, tem mác và hoá đơn mua hàng.",
        ],
      },
      {
        heading: "Trường hợp được đổi mới hoặc hoàn tiền 100%",
        bullets: [
          "Hàng giao sai mẫu, sai màu, sai kích thước so với đơn đã xác nhận.",
          "Lỗi kỹ thuật từ nhà sản xuất: khung lỏng, mối ghép hở, motor không hoạt động, vải rách.",
          "Hư hỏng phát sinh trong quá trình vận chuyển và lắp đặt.",
        ],
        paragraphs: [
          "Với các trường hợp này chúng tôi chịu toàn bộ chi phí vận chuyển hai chiều và xử lý trong 3–7 ngày làm việc.",
        ],
      },
      {
        heading: "Trường hợp không áp dụng đổi trả",
        bullets: [
          "Sản phẩm đặt sản xuất riêng theo kích thước, màu sắc hoặc chất liệu khách yêu cầu.",
          "Sản phẩm đã qua sử dụng, có dấu hiệu va đập, ẩm mốc do bảo quản sai.",
          "Sản phẩm trong chương trình thanh lý, hàng trưng bày đã ghi rõ 'không áp dụng đổi trả'.",
          "Đồ trang trí nhỏ, gối, thảm đã bóc tem vệ sinh.",
        ],
      },
      {
        heading: "Đổi sang sản phẩm khác",
        paragraphs: [
          "Bạn được đổi sang sản phẩm khác cùng hoặc cao hơn giá trị, chỉ bù phần chênh lệch. Nếu sản phẩm mới rẻ hơn, phần chênh được hoàn lại. Mỗi đơn hàng được đổi một lần và chúng tôi hỗ trợ chi phí vận chuyển 50%.",
        ],
      },
      {
        heading: "Quy trình",
        bullets: [
          "Bước 1: Gọi hotline 0931 619 177 hoặc nhắn tin kèm mã đơn và ảnh sản phẩm.",
          "Bước 2: Chúng tôi phản hồi trong 24 giờ làm việc và hẹn lịch tới kiểm tra.",
          "Bước 3: Thu hồi sản phẩm và xử lý đổi mới hoặc hoàn tiền trong 3–7 ngày làm việc.",
          "Bước 4: Tiền hoàn về đúng phương thức bạn đã thanh toán.",
        ],
      },
    ],
  },
  {
    slug: "bao-hanh",
    title: "Chính sách bảo hành",
    summary:
      "Bảo hành 2 năm tiêu chuẩn, tới 5 năm với gỗ tự nhiên và da thật. Bảo trì miễn phí trọn đời sản phẩm.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Thời hạn bảo hành",
        bullets: [
          "Nội thất gỗ tự nhiên, sofa da thật: 5 năm phần khung.",
          "Bàn nâng hạ điện, ghế công thái học: 3 năm bao gồm motor và cơ cấu.",
          "Sofa vải, giường, tủ kệ, bàn ăn: 2 năm.",
          "Đèn chiếu sáng: 2 năm phần điện.",
          "Thảm, gương, tranh: 1 năm.",
          "Đồ gốm thủ công: không áp dụng bảo hành do đặc thù sản phẩm.",
        ],
      },
      {
        heading: "Bảo hành bao gồm",
        bullets: [
          "Lỗi kết cấu: khung gãy, mối ghép bung, chân lung lay không do va đập.",
          "Lỗi cơ cấu: ray kéo kẹt, bản lề hỏng, motor nâng hạ không chạy, cơ cấu ngả ghế hỏng.",
          "Lỗi bề mặt do sản xuất: bong veneer, nứt sơn, đường may bung.",
          "Lỗi linh kiện điện: driver LED, công tắc, cổng sạc.",
        ],
      },
      {
        heading: "Bảo hành không bao gồm",
        bullets: [
          "Hao mòn tự nhiên: phai màu vải theo thời gian, mút xẹp nhẹ sau nhiều năm dùng.",
          "Hư hỏng do va đập, kéo lê, quá tải trọng cho phép.",
          "Hư hỏng do ẩm mốc vì đặt nơi ngập nước hoặc ẩm thường xuyên.",
          "Hư hỏng do vật nuôi cào cắn, do trẻ vẽ bẩn.",
          "Sản phẩm đã tự ý tháo, sửa chữa hoặc thay linh kiện bên ngoài.",
        ],
      },
      {
        heading: "Bảo trì miễn phí trọn đời",
        paragraphs: [
          "Ngoài thời hạn bảo hành, chúng tôi vẫn hỗ trợ siết ốc, chỉnh cánh tủ, cân bằng chân bàn miễn phí trọn đời sản phẩm tại khu vực nội thành Gia Lai và TP.HCM. Bạn chỉ trả chi phí linh kiện nếu cần thay thế.",
        ],
      },
      {
        heading: "Cách kích hoạt bảo hành",
        paragraphs: [
          "Hoá đơn mua hàng chính là phiếu bảo hành. Bạn không cần đăng ký thêm — chỉ cần cung cấp số điện thoại đặt hàng, chúng tôi tra được toàn bộ lịch sử. Gọi 0931 619 177 để đặt lịch kỹ thuật viên.",
        ],
      },
    ],
  },
  {
    slug: "thanh-toan",
    title: "Chính sách thanh toán",
    summary:
      "Nhận tiền mặt khi giao hàng, chuyển khoản, thẻ và trả góp 0% qua thẻ tín dụng của 12 ngân hàng.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Các hình thức thanh toán",
        bullets: [
          "Tiền mặt khi nhận hàng (COD) — áp dụng cho đơn dưới 30 triệu.",
          "Chuyển khoản ngân hàng — đơn từ 30 triệu vui lòng đặt cọc 30% trước khi giao.",
          "Thẻ ATM nội địa, Visa, Mastercard, JCB qua máy POS mang tới tận nơi.",
          "Ví điện tử: MoMo, ZaloPay, VNPay.",
          "Trả góp 0% lãi suất kỳ hạn 3–12 tháng qua thẻ tín dụng.",
        ],
      },
      {
        heading: "Đặt cọc với hàng đặt sản xuất",
        paragraphs: [
          "Sản phẩm đặt sản xuất theo yêu cầu cần đặt cọc 50% giá trị đơn hàng để bắt đầu sản xuất, phần còn lại thanh toán khi nhận hàng. Tiền cọc được hoàn 100% nếu chúng tôi giao trễ quá 15 ngày so với cam kết.",
        ],
      },
      {
        heading: "Trả góp 0%",
        bullets: [
          "Áp dụng cho đơn hàng từ 3 triệu đồng.",
          "Hỗ trợ thẻ tín dụng của 12 ngân hàng: Vietcombank, Techcombank, VPBank, ACB, TPBank, VIB, MB, Sacombank, HSBC, Shinhan, Standard Chartered, Citibank.",
          "Kỳ hạn 3, 6, 9 hoặc 12 tháng tuỳ ngân hàng và giá trị đơn.",
          "Không phát sinh phí chuyển đổi, số tiền trả hàng tháng đúng bằng giá niêm yết chia đều.",
        ],
      },
      {
        heading: "Hoá đơn",
        paragraphs: [
          "Chúng tôi xuất hoá đơn điện tử cho mọi đơn hàng. Nếu cần xuất hoá đơn công ty, vui lòng cung cấp thông tin doanh nghiệp ngay khi đặt hàng — chúng tôi không xuất hoá đơn bổ sung sau khi đã hoàn tất đơn quá 30 ngày theo quy định thuế.",
        ],
      },
    ],
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật thông tin",
    summary:
      "Chúng tôi chỉ thu thập thông tin cần thiết để giao hàng và chăm sóc sau bán, không bán dữ liệu cho bên thứ ba.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Thông tin chúng tôi thu thập",
        bullets: [
          "Họ tên, số điện thoại, địa chỉ giao hàng — để thực hiện đơn hàng.",
          "Email — để gửi xác nhận đơn và thông tin bảo hành.",
          "Lịch sử mua hàng — để tra cứu bảo hành và hỗ trợ sau bán.",
          "Dữ liệu duyệt web ẩn danh — để cải thiện trải nghiệm trên website.",
        ],
      },
      {
        heading: "Mục đích sử dụng",
        bullets: [
          "Xử lý, giao và lắp đặt đơn hàng.",
          "Liên hệ xác nhận lịch giao và hỗ trợ kỹ thuật.",
          "Thực hiện nghĩa vụ bảo hành, đổi trả.",
          "Gửi thông tin khuyến mãi — chỉ khi bạn đồng ý và có thể huỷ bất cứ lúc nào.",
        ],
      },
      {
        heading: "Chia sẻ thông tin",
        paragraphs: [
          "Chúng tôi không bán, trao đổi hay cho thuê thông tin cá nhân của bạn. Dữ liệu chỉ được chia sẻ với đơn vị vận chuyển và đơn vị thanh toán ở mức tối thiểu cần thiết để hoàn tất đơn hàng, hoặc khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.",
        ],
      },
      {
        heading: "Lưu trữ và bảo mật",
        bullets: [
          "Dữ liệu được lưu trên máy chủ đặt tại Việt Nam, mã hoá khi truyền tải qua HTTPS.",
          "Thông tin thẻ thanh toán do đối tác cổng thanh toán xử lý, chúng tôi không lưu số thẻ.",
          "Thời gian lưu trữ: 5 năm kể từ giao dịch cuối, phục vụ nghĩa vụ bảo hành và kế toán.",
        ],
      },
      {
        heading: "Quyền của bạn",
        bullets: [
          "Yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình.",
          "Rút lại sự đồng ý nhận thông tin tiếp thị bất cứ lúc nào.",
          "Khiếu nại về việc sử dụng dữ liệu qua email lienhe@noithatht.vn.",
        ],
        paragraphs: [
          "Chúng tôi phản hồi mọi yêu cầu liên quan tới dữ liệu cá nhân trong vòng 5 ngày làm việc.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((item) => item.slug === slug);
}

/**
 * Tên rút gọn dùng ở footer và menu chính sách:
 * "Chính sách giao hàng & lắp đặt" -> "Giao hàng & lắp đặt".
 * Viết hoa chữ đầu ở đây thay vì dùng CSS ::first-letter, vì pseudo-element đó
 * không có tác dụng trên phần tử inline như thẻ link trong footer.
 */
export function policyShortTitle(policy: Policy) {
  const text = policy.title.replace(/^Chính sách\s+/i, "");
  return text.charAt(0).toLocaleUpperCase("vi-VN") + text.slice(1);
}
