import type { Policy } from "@/lib/types";

export const policies: Policy[] = [
  {
    slug: "giao-hang-lap-dat",
    title: "Chính sách giao hàng & lắp đặt",
    summary:
      "Nội thành Gia Lai và TP.HCM không tính tiền giao, không tính tiền lắp. Thợ lắp tại nhà và mang hết bao bì đi khi xong việc.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Phạm vi và phí giao hàng",
        bullets: [
          "Nội thành Gia Lai và TP.HCM: không mất đồng nào, đơn to nhỏ gì cũng vậy.",
          "Ngoại thành hai nơi này: đơn từ 10 triệu là miễn phí; chưa tới mức đó thì thêm 300.000đ.",
          "Tỉnh khác: tính theo cân nặng và quãng đường, nhân viên báo con số cụ thể trước khi bạn chốt đơn. Đơn từ 20 triệu thì cả nước đều miễn phí.",
          "Đèn và đồ trang trí nhỏ: gửi chuyển phát, cả nước không tính tiền ship.",
        ],
      },
      {
        heading: "Thời gian giao hàng",
        bullets: [
          "Hàng có sẵn trong kho: 2–5 ngày làm việc tính từ lúc chốt đơn.",
          "Hàng đóng theo yêu cầu: 7–21 ngày tuỳ món, số ngày cụ thể ghi ngay trên trang sản phẩm đó.",
          "Trước ngày giao một hôm chúng tôi gọi hỏi khung giờ nào bạn ở nhà. Bận thì đổi lịch, báo trước 24 giờ là không mất phí.",
        ],
      },
      {
        heading: "Lắp đặt tại nhà",
        paragraphs: [
          "Món nào cần lắp thì thợ tới nhà lắp, tiền công đã nằm trong giá bán rồi, không phát sinh thêm. Thợ mang bạt trải sàn trước khi làm, xong việc hút bụi khu vực vừa làm và khiêng hết thùng carton, xốp xuống xe.",
        ],
        bullets: [
          "Lắp mất bao lâu: sofa khoảng 15 phút, giường 30–45 phút, tủ quần áo 60–90 phút.",
          "Trước khi về, thợ chỉ bạn cách dùng và cách giữ cho bền.",
          "Bạn xem kỹ, ưng rồi mới ký nhận. Chưa ưng thì thợ chưa đi.",
        ],
      },
      {
        heading: "Trường hợp thang máy không đủ kích thước",
        paragraphs: [
          "Kiện hàng không lọt thang máy thì thợ khiêng bộ, tới tầng 5 không tính tiền. Từ tầng 6 trở lên mỗi tầng mỗi kiện thêm 50.000đ. Lúc đặt hàng bạn nói trước thang máy nhà mình rộng bao nhiêu để chúng tôi cắt đủ người, tránh tới nơi rồi phải quay về.",
        ],
      },
      {
        heading: "Kiểm tra khi nhận hàng",
        bullets: [
          "Cứ mở thùng xem thoải mái trước khi ký, không ai giục.",
          "Thấy xước, móp hay lỗi do đường vận chuyển thì nói luôn tại chỗ — thợ chở về đổi cái mới, bạn không mất thêm đồng nào.",
          "Ký rồi mới phát hiện lỗi bên ngoài thì trong 48 giờ vẫn báo được, chỉ cần có ảnh chụp.",
        ],
      },
    ],
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    summary:
      "Bảy ngày đầu, hàng còn nguyên như lúc nhận thì đổi trả được. Lỗi từ xưởng thì đổi cái mới hoặc trả lại đủ tiền.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Điều kiện đổi trả",
        bullets: [
          "Trong 7 ngày tính từ hôm nhận hàng.",
          "Đồ còn như lúc mới nhận: chưa dùng, không xước, không ám mùi thuốc lá hay thức ăn.",
          "Còn giữ thùng, phụ kiện đi kèm, tem mác và hoá đơn.",
        ],
      },
      {
        heading: "Trường hợp được đổi mới hoặc hoàn tiền 100%",
        bullets: [
          "Giao nhầm mẫu, nhầm màu, sai số đo so với đơn bạn đã chốt.",
          "Lỗi từ xưởng: khung lỏng lẻo, mối ghép hở khe, motor không chạy, vải bị rách.",
          "Hỏng trong lúc chở đi hoặc lúc thợ lắp.",
        ],
        paragraphs: [
          "Mấy trường hợp này chúng tôi chịu tiền xe cả lượt đi lẫn lượt về, giải quyết xong trong 3–7 ngày làm việc.",
        ],
      },
      {
        heading: "Trường hợp không áp dụng đổi trả",
        bullets: [
          "Hàng đóng riêng theo số đo, màu hay chất liệu bạn yêu cầu — làm xong không bán lại cho ai được.",
          "Hàng đã dùng, có vết va đập, hoặc mốc do để chỗ ẩm.",
          "Hàng thanh lý và hàng trưng bày, những món đã ghi sẵn 'không áp dụng đổi trả'.",
          "Gối, thảm, đồ trang trí nhỏ đã bóc tem vệ sinh.",
        ],
      },
      {
        heading: "Đổi sang sản phẩm khác",
        paragraphs: [
          "Đổi sang món khác bằng giá hoặc đắt hơn thì bù phần chênh. Món mới rẻ hơn thì chúng tôi trả lại tiền thừa. Mỗi đơn đổi được một lần, tiền xe chúng tôi đỡ cho một nửa.",
        ],
      },
      {
        heading: "Quy trình",
        bullets: [
          "Một: gọi 0931 619 177 hoặc nhắn tin, gửi kèm mã đơn với vài tấm ảnh chụp món hàng.",
          "Hai: trong 24 giờ làm việc chúng tôi trả lời và hẹn ngày tới tận nơi xem.",
          "Ba: chở hàng về, đổi mới hoặc hoàn tiền trong 3–7 ngày làm việc.",
          "Bốn: tiền trả lại đúng đường bạn đã thanh toán lúc mua.",
        ],
      },
    ],
  },
  {
    slug: "bao-hanh",
    title: "Chính sách bảo hành",
    summary:
      "Mặc định 2 năm, riêng gỗ tự nhiên và da thật là 5 năm. Hết hạn rồi vẫn gọi thợ tới sửa vặt được, không tính công.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Thời hạn bảo hành",
        bullets: [
          "Đồ gỗ tự nhiên và sofa da thật: 5 năm cho phần khung.",
          "Bàn nâng hạ điện, ghế công thái học: 3 năm, tính cả motor và bộ cơ.",
          "Sofa vải, giường, tủ kệ, bàn ăn: 2 năm.",
          "Đèn: 2 năm cho phần điện.",
          "Thảm, gương, tranh: 1 năm.",
          "Đồ gốm làm tay: không bảo hành, vì gốm vỡ là vỡ, không sửa lại được.",
        ],
      },
      {
        heading: "Bảo hành bao gồm",
        bullets: [
          "Phần khung: gãy, mối ghép bung ra, chân lung lay mà không phải do va đập.",
          "Phần cơ: ray kéo bị kẹt, bản lề hỏng, motor nâng hạ đứng máy, lẫy ngả ghế không ăn.",
          "Bề mặt lỗi từ lúc sản xuất: veneer bong, sơn nứt, đường chỉ may bung.",
          "Đồ điện: driver đèn LED, công tắc, cổng sạc.",
        ],
      },
      {
        heading: "Bảo hành không bao gồm",
        bullets: [
          "Cũ đi theo thời gian: vải bạc màu, mút xẹp nhẹ sau nhiều năm ngồi.",
          "Va đập, kéo lê trên sàn, hoặc chất nặng quá tải trọng ghi trên trang sản phẩm.",
          "Mốc do kê chỗ ngập nước hay ẩm quanh năm.",
          "Chó mèo cào cắn, trẻ vẽ bậy lên.",
          "Đồ đã tự tháo ra sửa hoặc thay linh kiện ở ngoài.",
        ],
      },
      {
        heading: "Bảo trì miễn phí trọn đời",
        paragraphs: [
          "Hết hạn bảo hành rồi, cần siết lại ốc, chỉnh cánh tủ cho khít hay cân lại chân bàn thì cứ gọi — thợ tới làm không lấy công, trong nội thành Gia Lai và TP.HCM, không giới hạn số lần. Chỉ khi phải thay linh kiện thì bạn trả tiền linh kiện đó.",
        ],
      },
      {
        heading: "Cách kích hoạt bảo hành",
        paragraphs: [
          "Không có phiếu bảo hành riêng, cũng không phải đăng ký gì. Hoá đơn mua hàng là đủ, mà mất hoá đơn cũng không sao — đọc số điện thoại lúc đặt là chúng tôi tra ra ngày mua với món đã mua. Gọi 0931 619 177 để hẹn thợ.",
        ],
      },
    ],
  },
  {
    slug: "thanh-toan",
    title: "Chính sách thanh toán",
    summary:
      "Trả tiền mặt lúc nhận, chuyển khoản, quẹt thẻ, hoặc chia nhỏ 0% lãi qua thẻ tín dụng của 12 ngân hàng.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Các hình thức thanh toán",
        bullets: [
          "Tiền mặt lúc nhận hàng — áp dụng cho đơn dưới 30 triệu.",
          "Chuyển khoản — đơn từ 30 triệu thì cọc trước 30% rồi mới xếp lịch giao.",
          "Quẹt thẻ ATM nội địa, Visa, Mastercard, JCB — thợ mang máy POS tới tận nhà.",
          "Ví điện tử: MoMo, ZaloPay, VNPay.",
          "Chia nhỏ 0% lãi qua thẻ tín dụng, kỳ hạn 3–12 tháng.",
        ],
      },
      {
        heading: "Đặt cọc với hàng đặt sản xuất",
        paragraphs: [
          "Hàng đóng riêng theo yêu cầu thì cọc 50% để xưởng vào gỗ, nửa còn lại trả khi nhận. Nếu chúng tôi giao trễ quá 15 ngày so với ngày đã hẹn, tiền cọc trả lại đủ 100%, bạn không phải đòi.",
        ],
      },
      {
        heading: "Trả góp 0%",
        bullets: [
          "Đơn từ 3 triệu trở lên mới dùng được.",
          "Nhận thẻ tín dụng của 12 ngân hàng: Vietcombank, Techcombank, VPBank, ACB, TPBank, VIB, MB, Sacombank, HSBC, Shinhan, Standard Chartered, Citibank.",
          "Chọn 3, 6, 9 hay 12 tháng, tuỳ ngân hàng và số tiền đơn hàng.",
          "Không có phí chuyển đổi giấu ở đâu cả: lấy giá niêm yết chia đều cho số tháng, ra bao nhiêu trả bấy nhiêu.",
        ],
      },
      {
        heading: "Hoá đơn",
        paragraphs: [
          "Đơn nào cũng có hoá đơn điện tử. Cần hoá đơn mang tên công ty thì đưa thông tin doanh nghiệp ngay lúc đặt — quá 30 ngày kể từ khi đơn hoàn tất thì luật thuế không cho xuất bù, chúng tôi cũng đành chịu.",
        ],
      },
    ],
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật thông tin",
    summary:
      "Chúng tôi chỉ hỏi những gì cần để giao được hàng và bảo hành về sau. Dữ liệu của bạn không đem bán cho ai.",
    updated: "01/07/2026",
    sections: [
      {
        heading: "Thông tin chúng tôi thu thập",
        bullets: [
          "Tên, số điện thoại, địa chỉ — không có thì không giao hàng tới nơi được.",
          "Email — để gửi xác nhận đơn và giấy tờ bảo hành.",
          "Những gì bạn đã mua — để sau này tra bảo hành mà không cần bạn giữ hoá đơn.",
          "Số liệu duyệt web không gắn tên ai — để biết trang nào khó dùng mà sửa.",
        ],
      },
      {
        heading: "Mục đích sử dụng",
        bullets: [
          "Làm đơn, chở hàng và lắp tại nhà bạn.",
          "Gọi hẹn giờ giao, gọi hỗ trợ khi đồ có vấn đề.",
          "Làm bảo hành và đổi trả khi cần.",
          "Nhắn tin khuyến mãi — chỉ khi bạn đồng ý, và muốn dừng lúc nào cũng được.",
        ],
      },
      {
        heading: "Chia sẻ thông tin",
        paragraphs: [
          "Chúng tôi không bán, không đổi, không cho thuê thông tin của bạn cho bất kỳ ai. Bên vận chuyển chỉ nhận đúng tên, số điện thoại và địa chỉ để giao được hàng; cổng thanh toán chỉ nhận đúng phần họ cần để trừ tiền. Ngoài ra chỉ giao nộp khi cơ quan nhà nước yêu cầu đúng thủ tục pháp luật.",
        ],
      },
      {
        heading: "Lưu trữ và bảo mật",
        bullets: [
          "Dữ liệu nằm trên máy chủ đặt ở Việt Nam, đường truyền mã hoá HTTPS.",
          "Số thẻ ngân hàng do cổng thanh toán giữ, chúng tôi không lưu lại con số nào.",
          "Giữ trong 5 năm tính từ lần mua gần nhất, để còn làm bảo hành và sổ sách kế toán.",
        ],
      },
      {
        heading: "Quyền của bạn",
        bullets: [
          "Đòi xem, sửa hoặc xoá hẳn thông tin của mình.",
          "Rút lại việc đồng ý nhận tin khuyến mãi, lúc nào cũng được.",
          "Khiếu nại nếu thấy dữ liệu bị dùng sai, gửi về lienhe@noithatht.vn.",
        ],
        paragraphs: [
          "Mọi yêu cầu liên quan tới dữ liệu cá nhân, chúng tôi trả lời trong 5 ngày làm việc.",
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
