import { Helmet } from "react-helmet-async";
import Header from "./Header";

function About() {
  const topics = [
    {
      id: 1,
      title: "Thong tin ve travfruit🤨",
    },
    {
      id: 2,
      title: "Muc dich cua du an cua travfruit? 🤕",
    },
    {
      id: 3,
      title: "Cong nghe nao duoc su dung  vao travfruit? 😣",
    },
    {
      id: 4,
      title: "Tim travfruit ? 🤔",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Trang thong tin ve website travfruit</title>
        <meta
          name="description"
          content="Mo ta trang thong tin ve website travfruit"
        />
      </Helmet>
      <Header />
      <div className="w-full h-full font-mono bg-zinc-900 text-white flex pt-5  justify-between">
        <div className="flex flex-col font-medium  w-[23%] rounded-lg h-fit overflow-hidden sticky top-[100px]">
          <p className="p-4 border-b">Danh muc</p>
          {topics.map((topic) => (
            <a href={`/about#${topic.id}`} className="p-4 hover:opacity-80">
              {topic.title}
            </a>
          ))}
        </div>
        <div className="w-[75%] overflow-auto relative">
          <h1 className="font-mono font-bold tracking-wider text-black absolute bottom-0 right-0 uppercase">
            trang thong tin ve website travfruit
          </h1>
          {topics.map((topic) => (
            <div key={topic.id} className="p-4">
              <p id={topic.id} className="text-xl font-bold">
                {topic.title}
              </p>
              {topic.id === 1 && (
                <ul className="list-decimal list-inside">
                  <li>
                    Một chút về TravFruit
                    <ul className="list-disc list-inside">
                      <li>
                        UI trang web TravFruit được xây dựng theo Traveloka
                        (https://www.traveloka.com/vi-vn)
                      </li>
                      <li>
                        TravFruit là một website mô tả về quá trình đặt vé
                        chuyến bay.
                      </li>
                      <li>
                        Trang web gồm 7 page : Home - /, About - /about, Thông
                        tin tài khoản - /Setting/InfoAccount, Lịch sử đơn hàng -
                        /Setting/HistoryTicket, XemDanhSachChuyenbBay -
                        /XemDanhSachChuyenbBay, DatChoCuaToi -
                        /XemDanhSachChuyenbBay/DatChoCuaToi, ThanhToan -
                        /XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan,
                      </li>
                    </ul>
                  </li>

                  <li>
                    Thông tin về chuyến bay
                    <ul className="list-disc list-inside">
                      <li>
                        Tổng số chuyến bay được tạo là 1260 cho 3 tháng ~ 7
                        chuyến bay trong 1 ngày với 5 hãng bay (Vietjet, VNA,
                        Pacific Airlines, BamBoo, Vietravel Airlines) và giờ,
                        giá, số ghế ngẫu nhiên.
                      </li>
                      <li>
                        Hiện chuyến bay chỉ được điều chỉnh thông tin tại page
                        Admin của TravFruit.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Giá vé
                    <ul className="list-disc list-inside">
                      <li>
                        Giá vé thương gia của người lớn bằng giá vé phổ thông
                        (giá gốc chuyến bay) * 150%.
                      </li>
                      <li>
                        Giá vé của trẻ em bằng 75% giá vé của người lớn (tính
                        theo hạng vé).
                      </li>
                      <li>
                        Em bé được miễn phí nhưng phải ngồi chung với người lớn.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Thanh toán
                    <ul className="list-disc list-inside">
                      <li>
                        Thanh toán được thực hiện thông qua MoMo, Paypal, và
                        VietQR (VietQR được thanh toán bằng tiền thật).
                      </li>
                    </ul>
                  </li>
                  <li>
                    Đơn hàng
                    <ul className="list-disc list-inside">
                      <li>
                        Đơn hàng để chứa vé, vé chứa thông tin chuyến bay.
                      </li>
                      <li>
                        Đơn hàng sẽ được tự động xóa sau 15p kể từ lúc vào page
                        ThanhToan.
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
              {topic.id === 2 && (
                <ul className="list-disc list-inside">
                  <li>
                    TravFruit nhầm phục vụ vào chương trình học tại trường,
                    không có mục đích kinh doanh hay giả mạo.
                  </li>
                  <li>
                    Dự án đầu tiên và được áp dụng ReactJS (Create React App) để
                    tạo client.
                  </li>
                </ul>
              )}
              {topic.id === 3 && (
                <ul className="list-decimal list-inside">
                  <li>
                    Client
                    <ul className="list-disc list-inside">
                      <li>Web TravFruit sử dụng ReactJS, TailwindCSS, </li>
                      <li>
                        Thanh toán: MoMo, Paypal, VietQR - đối với VietQR được
                        thanh toán bằng tiền thật{" "}
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
              {topic.id === 4 && (
                <ul className="list-decimal list-inside">
                  <li>
                    https://github.com/thanhlongtruong/travFruit/tree/travFruit.v3
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default About;
