import { CONTEXT } from "../../Context/ContextGlobal";
import { useEffect, useContext, useState, useCallback, memo } from "react";
import InfoTicket from "../Plane/InfoTicket.js";
import ReactLoading from "react-loading";
import Loading from "../Loading.js";
import { ToastContainer } from "react-toastify";
import notify from "../Noti/notify.js";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import axios from "../Utils/authAxios.js";
import { useLocation, useNavigate } from "react-router-dom";

function History() {
  const { isLoading, setLoading } = useContext(CONTEXT);
  const location = useLocation();
  const navigate = useNavigate();

  const [dataReservation, setDataReservation] = useState([]);

  //1. so page hien tai 2. tong so page
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  /* 1. trang thai hien option
  2. da huy
  3. da thanh toan
  4. chua thanh toan
  5. all
  */
  const [optionShow, setOptionShow] = useState([
    false,
    false,
    false,
    false,
    true,
  ]);

  // thay doi trang thai cua option hien don hang
  const stateOptionShow = (indexes) => {
    setOptionShow((prev) =>
      prev.map((value, index) => {
        if (indexes.includes(index)) {
          return true;
        }
        return index !== 0 ? false : value;
      })
    );
  };

  // 1. trang thai hien search 2. content search
  const [isSearch, setIsSearch] = useState([false, ""]);

  // const findOrderByOnChange = async () => {
  //   if (dataReservation !== null) {
  //     setDataReservation(
  //       dataReservation.filter((order) => {
  //         const tickets = order.tickets;

  //         return tickets.some((ticket) => {
  //           const [timePart, datePart] = convertDateToVNDate(
  //             order.createdAt
  //           ).split(" ");
  //           const [date, month, year] = datePart.split("/");
  //           const dateString = date + month + year;

  //           return (
  //             (ticket.maDon === isSearch[1]?.trim() ||
  //               ticket.phoneNumber === isSearch[1]?.trim() ||
  //               datePart === isSearch.trim() ||
  //               dateString.includes(isSearch[1]?.trim())) &&
  //             order._id === ticket.maDon
  //           );
  //         });
  //       })
  //     );
  //   }
  // };

  const getReservation = async (page, type) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/user/reservation?page=${page}&type=${type}`
      );

      if (res.status === 200) {
        const { orders, totalPage } = res.data;

        setDataReservation(orders);

        setTotalPage(totalPage);
      }
    } catch (err) {
      notify(
        "Warn",
        err?.response?.data?.message || "Xảy ra lỗi khi xem lịch sử đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get("page") || 1;
      const type = urlParams.get("type") || "All";
      setCurrentPage(Number(page) - 1);
      getReservation(page, type);
    };

    handlePage();
  }, []);

  const updateUrl = (page, type) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    params.set("type", type);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const handleChooseOptionShow = async (index) => {
    const types = ["Đã hủy", "Đã thanh toán", "Chưa thanh toán", "All"];
    const page = 1;

    await getReservation(page, types[index]);

    updateUrl(page, types[index]);
    stateOptionShow([index + 1]);
    setCurrentPage(0);
  };

  const handlePageClick = async (event) => {
    const types = ["Đã hủy", "Đã thanh toán", "Chưa thanh toán", "All"];
    const firstTrueIndex = optionShow.findIndex(
      (value, index) => value === true && index !== 0
    );

    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    updateUrl(selectedPage, types[firstTrueIndex - 1]);
    await getReservation(selectedPage, types[firstTrueIndex - 1]);
  };

  return (
    <>
      <ToastContainer />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="relative flex items-center w-full h-[42px] my-5 text-xl font-semibold select-none overflow-hidden">
            {/* <div
              className={`flex h-[42px] justify-center w-fit items-center right-[12%] absolute ${optionShow[0] ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              {isSearch[0] && (
                <input
                  type="search"
                  value={isSearch[1]}
                  className={`w-[420px] h-full p-2 outline-none border-b font-normal text-lg transition ${isSearch[1] ? "border-b-[#0194f3]" : ""}`}
                  placeholder="Ngày đặt đơn hàng hoặc mã đơn hàng"
                  onChange={(event) =>
                    setIsSearch((pre) => [pre[0], event.target.value])
                  }
                />
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className={`transition-transform duration-300 cursor-pointer size-7 stroke-[#0194f3] ${!isSearch[0] ? "-rotate-12" : "rotate-90"}`}
                onClick={() => {
                  setIsSearch((pre) => [!pre[0], pre[1]]);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div> */}

            <div
              className={`absolute w-fit transform -translate-x-1/2 left-[50%] whitespace-nowrap transition-opacity duration-300 ${optionShow[0] || isSearch[0] ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              Lịch sử đơn hàng
            </div>

            {!isSearch[0] && (
              <div
                className={`flex h-[42px] w-fit items-center absolute left-[12%]`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="transition-transform duration-300 cursor-pointer size-7 stroke-[#0194f3]"
                  style={!optionShow[0] ? { transform: "rotate(-90deg)" } : {}}
                  onClick={() =>
                    setOptionShow((pre) => [
                      !pre[0],
                      pre[1],
                      pre[2],
                      pre[3],
                      pre[4],
                    ])
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>

                <div
                  className={`ml-3 gap-x-3 w-[420px] h-[42px] transition-opacity duration-300 flex ${optionShow[0] ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  {Array.from({ length: 4 }, (_, i) => (
                    <OptionShowHistoryOrder
                      index={i}
                      content={
                        i === 0
                          ? "Đã hủy"
                          : i === 1
                            ? "Đã thanh toán"
                            : i === 2
                              ? "Chưa thanh toán"
                              : "All"
                      }
                      stateChoose={
                        i === 0
                          ? optionShow[1]
                          : i === 1
                            ? optionShow[2]
                            : i === 2
                              ? optionShow[3]
                              : optionShow[4]
                      }
                      handleChooseOptionShow={handleChooseOptionShow}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-5 pt-5 border-t">
            {dataReservation?.length > 0 ? (
              <HistoryDon
                dataReservation={dataReservation}
                isLoading={isLoading}
                setLoading={setLoading}
                isSearch={isSearch}
              />
            ) : (
              <div className="flex items-center select-none gap-11">
                <img
                  alt="nodata"
                  src="https://ik.imagekit.io/tvlk/image/imageResource/2020/07/10/1594367281441-5ec1b573d106b7aec243b19efa02ac56.svg?tr=h-96,q-75,w-96"
                />
                <p className="text-center text-gray-500 h-fit">
                  Không có đơn hàng nào.
                </p>
              </div>
            )}
          </div>
          {dataReservation?.length > 0 && (
            <ReactPaginate
              className="flex justify-center gap-x-4 text-lg font-mono border p-4"
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPage}
              previousLabel="< previous"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="bg-blue-500 text-white rounded-md w-7 h-full text-center"
              renderOnZeroPageCount={null}
              forcePage={currentPage}
            />
          )}
        </>
      )}
    </>
  );
}

function OptionShowHistoryOrder({
  index,
  content,
  stateChoose,
  handleChooseOptionShow,
}) {
  return (
    <button
      type="button"
      className={`${stateChoose ? "bg-[#109AF4] text-white" : "text-[#109AF4]"} select-none flex font-medium p-2 text-base rounded-xl border border-[#109AF4] transition duration-0 hover:duration-700 hover:ease-in-out`}
      onClick={() => handleChooseOptionShow(index)}
    >
      {content}
    </button>
  );
}

function HistoryDon({ isLoading, dataReservation, setLoading, isSearch }) {
  const { convertDateToVNDate, handleReplacePriceAirport, naviReload } =
    useContext(CONTEXT);

  const payment = JSON.parse(localStorage.getItem("payment"));

  const huyOrder = async (_id) => {
    setLoading(true);

    try {
      const response = await axios.post(`/order/update_status`, {
        status: 201,
        orderID: _id,
      });
      if (response.status === 200) {
        if (payment && payment.split(" ")[0].replace(/"/g, "") === _id) {
          localStorage.removeItem("payment");
        }
        window.location.reload();
      }
    } catch (error) {
      notify("Error", "Hủy đơn hàng không thành công, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const thanhToan = async (order) => {
    const airportDeparture = order.tickets.filter(
      (ticket) => ticket.flights?.loaiChuyenBay === "Chuyến bay đi"
    );
    const airportReturn = order.tickets.filter(
      (ticket) => ticket.flights?.loaiChuyenBay === "Chuyến bay khứ hồi"
    );

    try {
      setLoading(true);
      const response = await axios.post(`/payment/pending`, {
        orderId: order._id,
      });
      if (response.status === 200) {
        if (response.data.payment?.payUrl === "NO payURL") {
          const data = {
            timeEndPayOrder: convertDateToVNDate(order.expiredAt),
            objectOrder: {
              idDH: order._id,
              priceOrder: order.tongGia,
              createAt: order.createdAt,
              expiredAt: order.expiredAt,
              dataTickets: order.tickets,
            },
            airportDeparture: airportDeparture[0].flights,
            airportReturn:
              airportReturn.length > 0 ? airportReturn[0].flights : {},
          };
          naviReload("/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan", {
            state: {
              data: data,
            },
          });
        } else {
          window.location.href = response.data.payment.payUrl;
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const huyVeKhuHoi = async (order) => {
    setLoading(true);
    const tickets = order.tickets.filter(
      (ticket) => ticket.loaiChuyenBay === "Chuyến bay đi"
    );

    const priceNew =
      new Intl.NumberFormat("vi-VN").format(
        tickets.reduce((acc, item) => {
          const giaVeSo = handleReplacePriceAirport(
            item.giaVe.replace(/\./g, ",")
          );

          return acc + giaVeSo;
        }, 0)
      ) + " VND";

    try {
      const response = await axios.post(`/order/ccc`, {
        orderID: order._id,
        priceNew: priceNew,
      });
      if (response.status === 200) {
        await notify("Success", "Hủy vé khứ hồi thành công");
        window.location.reload();
      }
      if (response.status === 404) {
        notify("Warn", response.data.message);
      }
    } catch (error) {
      notify("Error", "Hủy đơn hàng không thành công, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const [historyVe, setHistoryVe] = useState(null);

  const handleHistoryVe = useCallback(
    (index) => {
      setHistoryVe(historyVe === index ? null : index);
    },
    [historyVe]
  );

  return (
    <>
      {dataReservation?.map((order, index) => (
        <div
          key={order._id}
          className={`w-full p-2 mb-5 hover:text-zinc-800 outline-slate-300 hover:duration-500 transition-all overflow-hidden duration-300 relative outline outline-1  rounded-lg select-none min-h-[110px]`}
        >
          <div>
            <div
              className="flex justify-between w-full cursor-pointer"
              onClick={() => handleHistoryVe(index)}
            >
              <div className="font-semibold w-full overflow-hidden">
                <p className="line-clamp-1">
                  Ngày đặt vé: {convertDateToVNDate(order.createdAt)}
                </p>
                <p className="line-clamp-1">Số lượng vé: {order.soLuongVe}</p>
                <p className="line-clamp-1">
                  Loại chuyến bay:
                  {order.tickets.some(
                    (ticket) => ticket.loaiChuyenBay === "Chuyến bay khứ hồi"
                  )
                    ? " Chuyến bay một chiều và khứ hồi"
                    : " Chuyến bay một chiều"}
                </p>
                <p className="line-clamp-1">Tổng giá: {order.tongGia}</p>
                <p className="line-clamp-1">
                  Trạng thái:{" "}
                  {order.trangThai === "Đã thanh toán" && (
                    <span className="text-[#0bc175]">{order.trangThai}</span>
                  )}
                  {order.trangThai === "Chưa thanh toán" && (
                    <span className="text-[#ffd000]">{order.trangThai}</span>
                  )}
                  {order.trangThai === "Đã hủy" && (
                    <span className="text-red-600">{order.trangThai}</span>
                  )}
                  {order.trangThai ===
                    "Chưa thanh toán chuyến đi (Đã hủy vé khứ hồi)" && (
                    <span className="text-[#0bc175]">{order.trangThai}</span>
                  )}
                </p>
                <p className="line-clamp-1">
                  {order.trangThai === "Chưa thanh toán" && (
                    <span className="text-red-500">
                      • {convertDateToVNDate(order.expiredAt)} đơn hàng sẽ bị
                      xóa nếu không thanh toán
                    </span>
                  )}
                </p>
              </div>
            </div>

            {historyVe === index && (
              <>
                <HistoryVe order={dataReservation[index]} />
              </>
            )}
          </div>

          {dataReservation[index].trangThai.includes("Chưa thanh toán") && (
            <div className="absolute z-10 flex top-2 right-2 gap-x-3">
              <button
                className={`font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                onClick={() => huyOrder(dataReservation[index]._id)}
              >
                Hủy đơn
              </button>
              {order.tickets.some(
                (ticket) =>
                  ticket.loaiChuyenBay === "Chuyến bay khứ hồi" &&
                  ticket.trangThaiVe !== "Đã hủy"
              ) && (
                <button
                  className={`font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white transition ease-in-out active:bg-slate-200 ${order.trangThai === "Đã hủy" || order.trangThai === "Đã thanh toán" ? "bg-slate-500 cursor-not-allowed" : "cursor-pointer bg-red-500"}`}
                  onClick={() => huyVeKhuHoi(dataReservation[index])}
                >
                  Hủy vé khứ hồi
                </button>
              )}

              <button
                className={`transition-all duration-500 font-semibold line-clamp-1 rounded-md text-[14px] p-2 self-center text-white ease-in-out active:bg-slate-200 bg-[#109AF4]`}
                onClick={() => thanhToan(dataReservation[index])}
              >
                {isLoading ? (
                  <ReactLoading
                    className="w-2 h-2 size-2"
                    type="bubbles"
                    color="#ffff"
                    height={20}
                    width={20}
                  />
                ) : (
                  "Thanh toán"
                )}
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function HistoryVe({ order }) {
  const [indexChooseTicket, setIndexChooseTicket] = useState(null);

  const hanldeChooseTicket = useCallback(
    (index) => {
      setIndexChooseTicket(indexChooseTicket === index ? null : index);
    },
    [indexChooseTicket]
  );

  return (
    <div className="flex w-full p-2 overflow-x-scroll gap-x-3">
      {order.tickets &&
        order.tickets.map((ticket, index) => (
          <div className={`flex w-fit h-fit}`}>
            <div
              className={`w-fit h-fit`}
              onClick={() => hanldeChooseTicket(index)}
            >
              <InfoTicket
                airport={{
                  loaiChuyenBay: ticket.flights.loaiChuyenBay,
                  diemBay: ticket.flights.diemBay,
                  diemDen: ticket.flights.diemDen,
                  gioBay: ticket.flights.gioBay,
                  gioDen: ticket.flights.gioDen,
                  ngayBay: ticket.flights.ngayBay,
                  ngayDen: ticket.flights.ngayDen,
                  hangBay: ticket.flights.hangBay,
                  loaiTuoi: ticket.loaiTuoi,
                  hangVe: ticket.hangVe,
                  giaVe: ticket.giaVe,
                  Ten: ticket.Ten,
                  ngaySinh: ticket.ngaySinh,
                  trangThaiVe: ticket.trangThaiVe,
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

export default memo(History);
