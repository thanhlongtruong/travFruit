import Footer from "../Footer.js";
import { useContext, useEffect, memo } from "react";
import Header from "../Header.js";
import InterFaceLogin from "./InterFaceLogin.js";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import { LoginSuccess } from "../Setting/StateLoginSucces.js";
import { ToastContainer } from "react-toastify";
import axios from "../Utils/authAxios.js";
import notify from "../Noti/notify.js";
import Loading from "../Loading.js";
import FlightShowCalendar from "../FlightShowCalendar.js";
import FuncChatbot from "../Chatbot/FuncChatbot.js";
import ComponentSearchFlight from "../Plane/SearchFlight.js";

function ComponentHome() {
  const {
    isShowInterfaceLogin,
    isShowOptionSetting_LoginSuccess,
    setShowOptionSetting_LoginSuccess,
    handleShowAirports,
    bayMotChieu,
    stateFlightShowCalendar,
    isLoading,
    setLoading,
    isShowChatbot,
  } = useContext(CONTEXT);

  const handleOffOption = () => {
    if (isShowOptionSetting_LoginSuccess) {
      setShowOptionSetting_LoginSuccess(false);
    }
  };

  const handleTransactionStatus = async (orderId) => {
    try {
      setLoading(true);
      const reqTransaction = await axios.get(`/transaction-status/${orderId}`);
      if (reqTransaction.status === 200) {
        if (
          reqTransaction.data.message === "Thành công." ||
          reqTransaction.data.resultCode === 0
        ) {
          const reqChangeStatusOrder = await axios.post(
            `/order/update_status`,
            {
              status: 200,
              orderID: orderId,
            }
          );
          if (reqChangeStatusOrder.status === 200) {
            localStorage.removeItem("payment");
            notify("Success", `Đơn hàng ${orderId} thanh toán thành công`);
            // Xóa tất cả các query parameters
            const url = window.location.origin + window.location.pathname;
            // Thay đổi URL mà không tải lại trang
            window.history.replaceState(null, "", url);
            return;
          } else if (reqChangeStatusOrder.status === 404) {
            notify("Error", `Mã đơn hàng ${orderId} không tồn tại`);
            localStorage.removeItem("payment");
            return;
          } else {
            notify("Error", `Có lỗi cập nhập trạng thái đơn hàng ${orderId}`);
            return;
          }
        } else if (reqTransaction.data.resultCode === 1002) {
          notify(`Error", message: ${reqTransaction.data.message}`);
        }
      }
    } catch (error) {
      notify(`Error", "Có lỗi cập nhập trạng thái đơn hàng ${orderId}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Lấy query parameters từ URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);

    // Lấy giá trị của orderId
    const orderId = urlParams.get("orderId");
    const message = urlParams.get("message");

    if (orderId && message) {
      handleTransactionStatus(orderId);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer />

      {isShowInterfaceLogin && <InterFaceLogin />}
      {stateFlightShowCalendar && <FlightShowCalendar />}

      <div onClick={handleOffOption} className="relative w-full h-full">
        <Header />
        {isShowChatbot && <FuncChatbot />}
        {isShowOptionSetting_LoginSuccess && <LoginSuccess />}
        <div className="relative px-[50px] py-5 w-full h-screen bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png?tr=q-75')] bg-center bg-no-repeat bg-cover">
          <div
            className="border-2 border-[#0194f3] min-h-[400px] rounded-md bg-[#4444] z-0 w-full"
            onClick={() => handleShowAirports([0, 1, 2], [false, false, false])}
          >
            <div className="flex items-center mb-10 text-lg font-semibold text-white uppercase w-fit gap-x-6">
              <p className="p-2 bg-[#0194f3] rounded-br-md">
                <span className={`${!bayMotChieu ? "opacity-70" : ""}`}>
                  Một chiều
                </span>{" "}
                /{" "}
                <span className={`${bayMotChieu ? "opacity-70" : ""}`}>
                  Khứ hồi
                </span>
              </p>
            </div>

            <ComponentSearchFlight
              div1="px-12 mb-16"
              span="text-[19px] text-white"
              svgStroke="stroke-[#0194f3] size-8"
              div2_1="w-fit"
              div2="w-fit"
              textDatePicker="text-center"
              styleLocationShowListAirline={{
                left: "left-[412px]",
                top: "top-[78px]",
              }}
              topChoosePassenger="top-[78px]"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const Home = memo(ComponentHome);
