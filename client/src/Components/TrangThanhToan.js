import React, { memo, useContext, useEffect, useState } from "react";
import Header from "./Header";
import InfoTicket from "./Plane/InfoTicket";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import axios from "../Components/Utils/authAxios.js";
import notify from "./Noti/notify";
import { ToastContainer } from "react-toastify";
import { CONTEXT } from "../Context/ContextGlobal.js";

function TrangThanhToan() {
  const { isLoading, setLoading } = useContext(CONTEXT);
  const location = useLocation();
  const data = location.state;
  const [notiMinues, setNotiMinues] = useState(true);

  const payment = localStorage.getItem("payment");

  useEffect(() => {
    if (
      !data ||
      !payment ||
      payment.split(" ")[2]?.replace(/"/g, "") === "Pending"
    ) {
      window.location.href = `/`;
    }
  }, []);

  const [isCheckPickPay, setCheckPickPay] = useState(false);

  function formatNumber(num) {
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "");
    return parts.join("");
  }

  const handleCheckPickPay = () => {
    setCheckPickPay(!isCheckPickPay);
  };

  const handleReqPayMoMo = async () => {
    setLoading(true);
    const payload = {
      amount: formatNumber(data.data.objectOrder.priceOrder.split(" ")[0]),
      orderId: data.data.objectOrder.idDH,
    };

    try {
      const response = await axios.post(`/payment-momo`, payload);
      if (response.status === 200) {
        const respont_payment = await axios.post("/payment/update/payurl", {
          orderId: data.data.objectOrder.idDH,
          payUrl: response.data.payUrl,
        });
        if (respont_payment.status === 200) {
          localStorage.setItem(
            "payment",
            JSON.stringify(
              `${data.data.objectOrder.idDH} ${data.data.objectOrder.expiredAt} Pending`
            )
          );
          window.location.href = response.data.payUrl;
        }
      }
    } catch (error) {
      notify("Error", "Có lỗi khi thanh toán, vui lòng thử lại");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="w-full h-full bg-slate-50">
        {notiMinues && (
          <NotiMinutes
            setNotiMinues={setNotiMinues}
            time={data.data.timeEndPayOrder}
          />
        )}

        {isLoading && <Loading />}
        <div className="pt-[50px] pb-[50px] bg-slate-50 h-full flex justify-center">
          <div className="flex w-[70%] max-w-screen-xl gap-7 h-full">
            <div className="lg:w-[70%]">
              <div className="justify-center w-full p-5 font-medium text-center text-white bg-blue-600 rounded-t-xl">
                Đừng lo lắng, giá vẫn giữ nguyên. Hoàn tất thanh toán của bạn
                bằng{" "}
              </div>
              <div className="pt-[24px] pb-[24px] bg-white rounded-b-xl">
                <div className="flex justify-between p-4">
                  <h1 className="text-xl font-bold ">
                    Bạn muốn thanh toán thế nào ?
                  </h1>
                </div>

                <button
                  className={`w-full text-lg text-center font-semibold cursor-pointer p-4 ${isCheckPickPay ? "text-gray-700" : "text-[#b8b2b2]"}`}
                  onClick={handleCheckPickPay}
                >
                  Thanh toán bằng MoMo
                </button>
              </div>

              <div className="flex-col p-4 mt-8 bg-white rounded-xl">
                <div className="flex">
                  <h1 className="text-xl font-medium">
                    Tổng số tiền cần thanh toán
                  </h1>
                  <h1 className="ml-auto text-xl font-semibold text-blue-600">
                    {data.data.objectOrder.priceOrder}
                  </h1>
                </div>

                {/* //! thanh toán */}

                <div
                  className={`flex  p-3 ${isCheckPickPay ? "bg-orange-500 hover:bg-orange-400 cursor-pointer" : "bg-[#b8b2b2] select-none  cursor-not-allowed"}  rounded-md mt-4 items-center justify-center `}
                  onClick={isCheckPickPay ? handleReqPayMoMo : undefined}
                >
                  <h1 className={`font-bold text-white text-xl`}>
                    Thanh toán bằng MoMo
                  </h1>
                </div>
              </div>
            </div>

            {/* //! ticket */}
            <div className="flex flex-col">
              {Array.from(
                { length: data.data.objectOrder.dataTickets.length },
                (_, i) => (
                  <InfoTicket
                    key={i}
                    airport={{
                      loaiChuyenBay:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.loaiChuyenBay
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.loaiChuyenBay
                            : "",
                      diemBay:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.diemBay
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.diemBay
                            : "",
                      diemDen:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.diemDen
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.diemDen
                            : "",
                      gioBay:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.gioBay
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.gioBay
                            : "",
                      gioDen:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.gioDen
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.gioDen
                            : "",
                      ngayBay:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.ngayBay
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.ngayBay
                            : "",
                      ngayDen:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.ngayDen
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.ngayDen
                            : "",
                      hangBay:
                        data.data.airportDeparture._id ===
                        data.data.objectOrder.dataTickets[i].maChuyenBay
                          ? data.data.airportDeparture.hangBay
                          : data.data.airportReturn?._id ===
                              data.data.objectOrder.dataTickets[i].maChuyenBay
                            ? data.data.airportReturn.hangBay
                            : "",
                      loaiTuoi: data.data.objectOrder.dataTickets[i].loaiTuoi,
                      hangVe: data.data.objectOrder.dataTickets[i].hangVe,
                      giaVe: data.data.objectOrder.dataTickets[i].giaVe,
                      Ten: data.data.objectOrder.dataTickets[i].Ten,
                      ngaySinh: data.data.objectOrder.dataTickets[i].ngaySinh,
                    }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NotiMinutes({ setNotiMinues, time }) {
  return (
    <div className="w-screen h-screen fixed z-[100] bg-white/5 backdrop-brightness-75">
      <div className="fixed z-[100] gap-y-4 transform -translate-x-1/2 flex flex-col justify-center -translate-y-1/2 top-1/2 left-1/2">
        <p className="font-semibold bg-[#0194f3] text-white rounded-lg p-4 text-lg">
          {`Nếu bạn không thanh toán trước ${time} hệ thống sẽ tự
          động xóa đơn hàng của bạn. Xin cảm ơn!`}
        </p>
        <button
          className="font-semibold text-[#0194f3] bg-white w-[50%] mx-auto rounded-lg p-4 text-lg"
          onClick={() => setNotiMinues(false)}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default memo(TrangThanhToan);
