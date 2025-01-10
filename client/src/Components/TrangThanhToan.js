import React, { memo, useEffect, useState } from "react";
import Header from "./Header";
import InfoTicket from "./Plane/InfoTicket";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import axios from "axios";
import notify from "./Noti/notify";
import { ToastContainer } from "react-toastify";

function TrangThanhToan() {
  const location = useLocation();
  const data = location.state;

  const [notiMinues, setNotiMinues] = useState(true);
<<<<<<< HEAD
  const { urlAPI, checkPaymentStatus, userObj } = useContext(CONTEXT);
//
  if (!userObj) {
    window.location.href = `/`;
  }

  const getObjectTime_local = localStorage.getItem("objectCreateOrder");
  const getObjectTime_data = JSON.parse(getObjectTime_local);

=======
  const payment = localStorage.getItem("payment");
>>>>>>> mainv2
  useEffect(() => {
    if (!data || !payment) {
      window.location.href = `/`;
    }
  });

  const [isLoading, stateLoading] = useState(false);
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
    stateLoading(true);
    const payload = {
      amount: formatNumber(data.data.objectOrder.priceOrder.split(" ")[0]),
      orderId: data.data.objectOrder.idDH,
    };

    try {
      const response = await axios.post(
        `https://travrel-server.vercel.app/payment-momo`,
        payload
      );
      if (response.status === 200) {
        window.location.href = response.data.payUrl;
      }
    } catch (error) {
      notify("Error", "Có lỗi khi thanh toán, vui lòng thử lại");
      return;
    } finally {
      stateLoading(false);
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
                  <img
                    className="h-[23px]"
                    src="https://ik.imagekit.io/tvlk/image/imageResource/2023/12/12/1702364449716-d0093df3166e4ba84c56ad9dd75afcda.webp?tr=h-23,q-75"
                    alt=""
                  />
                </div>

                <div
                  className={`flex items-center cursor-pointer gap-x-3 p-4 ${isCheckPickPay ? "text-black" : "text-[#b8b2b2]"}`}
                  onClick={handleCheckPickPay}
                >
                  {isCheckPickPay ? (
                    <input
                      id="Thanh toán bằng PressPay"
                      type="radio"
                      disabled={false}
                      className="size-5"
                    />
                  ) : (
                    <input
                      id="Thanh toán bằng PressPay"
                      type="radio"
                      disabled
                      className="size-5"
                    />
                  )}

                  <label
                    htmlFor="Thanh toán bằng PressPay"
                    className="text-lg font-semibold"
                    onClick={handleCheckPickPay}
                  >
                    Thanh toán bằng MoMo
                  </label>
                </div>
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
                {isCheckPickPay && (
                  <div
                    className={`flex  p-3 ${isCheckPickPay ? "bg-orange-500 hover:bg-orange-400" : "bg-[#b8b2b2]"} select-none rounded-md mt-4 items-center justify-center cursor-pointer`}
                    onClick={handleReqPayMoMo}
                  >
                    <h1 className={`font-bold text-white text-xl`}>
                      Thanh toán bằng MoMo
                    </h1>
                  </div>
                )}

                {!isCheckPickPay && (
                  <div
                    className={`flex  p-3 ${isCheckPickPay ? "bg-orange-500 hover:bg-orange-400" : "bg-[#b8b2b2]"} select-none rounded-md mt-4 items-center justify-center cursor-not-allowed`}
                  >
                    <h1 className={`font-bold text-white text-xl`}>
                      Thanh toán bằng MoMo
                    </h1>
                  </div>
                )}
              </div>
            </div>

            {/* //! ticket */}
            <div className="flex flex-col">
              {Array.from(
                { length: data.data.objectOrder.dataTickets.length },
                (_, i) => (
                  <InfoTicket
                    key={i}
                    airport={data.data.objectOrder.dataTickets[i]}
                    // ticket={data.data.objectOrder.dataTickets[i]}
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
