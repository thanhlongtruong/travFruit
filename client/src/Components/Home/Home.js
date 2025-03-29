import Footer from "../Footer.js";
import { useContext, useEffect, memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Header.js";
import InterFaceLogin from "./InterFaceLogin.js";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import { LoginSuccess } from "../Setting/StateLoginSucces.js";
import FlightShowCalendar from "../FlightShowCalendar.js";
import FuncChatbot from "../Chatbot/FuncChatbot.js";
import ComponentSearchFlight from "../Plane/SearchFlight.js";
import { TransactionMoMo, TransactionPaypal } from "../../API/Payment.js";
import { useMutation } from "@tanstack/react-query";
import { UpdatepdateStatus } from "../../API/DonHang.js";
import { bouncy } from "ldrs";

function ComponentHome() {
  bouncy.register();
  const {
    isShowInterfaceLogin,
    isShowOptionSetting_LoginSuccess,
    setShowOptionSetting_LoginSuccess,
    handleShowAirports,
    bayMotChieu,
    stateFlightShowCalendar,
    isShowChatbot,
    showNotification,
  } = useContext(CONTEXT);

  const handleOffOption = () => {
    if (isShowOptionSetting_LoginSuccess) {
      setShowOptionSetting_LoginSuccess(false);
    }
  };

  const mutationUpdateStatus = useMutation({
    mutationFn: UpdatepdateStatus,
    onSuccess: (data) => {
      localStorage.removeItem("payment");
      showNotification(data.data.message, "Success");
      // Xóa tất cả các query parameters
      const url = window.location.origin + window.location.pathname;
      // Thay đổi URL mà không tải lại trang
      window.history.replaceState(null, "", url);
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với paypal",
        "Warn"
      );
    },
  });

  const mutationTransactionMoMo = useMutation({
    mutationFn: TransactionMoMo,
    onSuccess: (data) => {
      if (data.status === 200) {
        if (data.data.message === "Thành công." || data.data.resultCode === 0) {
          mutationUpdateStatus.mutate({
            status: "200",
            orderID: data.data.orderId,
            type: data.data.partnerCode,
          });
        } else if (data.data.resultCode === 1002) {
          showNotification(
            `Mã đơn hàng ${data.data.orderId} không tồn tại`,
            "Warn"
          );
        } else if (data.data.resultCode === 1005) {
          showNotification(data.data.message, "Warn");
        }
      }
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với MoMo",
        "Warn"
      );
    },
  });

  const mutationTransactionPaypal = useMutation({
    mutationFn: TransactionPaypal,
    onSuccess: (data) => {
      if (
        data.status === 200 &&
        data.data.captureDetails.status === "COMPLETED"
      ) {
        mutationUpdateStatus.mutate({
          status: "200",
          orderID: data.data.orderId,
          type: "Paypal",
        });
      }
    },
    onError: (error) => {
      showNotification(
        error?.response?.data?.message || "Lỗi khi thanh toán với paypal",
        "Warn"
      );
    },
  });

  useEffect(() => {
    const handleURLParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("orderId");
      const message = urlParams.get("message");
      const token = urlParams.get("token");
      const type = urlParams.get("type");

      if (
        orderId &&
        message &&
        mutationTransactionMoMo.isIdle &&
        mutationUpdateStatus.isIdle
      ) {
        mutationTransactionMoMo.mutate({ orderId });
      } else if (
        orderId &&
        token &&
        mutationTransactionPaypal.isIdle &&
        mutationUpdateStatus.isIdle
      ) {
        mutationTransactionPaypal.mutate({ orderId, token, type });
      }
    };

    handleURLParams();
  }, [
    mutationTransactionPaypal,
    mutationUpdateStatus,
    mutationTransactionMoMo,
  ]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://travfruitv3.vercel.app/" />
      </Helmet>
      {isShowInterfaceLogin && <InterFaceLogin />}
      {stateFlightShowCalendar && <FlightShowCalendar />}

      <div onClick={handleOffOption} className="relative w-full h-full">
        <Header />
        {isShowChatbot && <FuncChatbot />}
        {isShowOptionSetting_LoginSuccess && <LoginSuccess />}
        <div className="relative px-[50px] py-5 w-full h-screen bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png?tr=q-75')] bg-center bg-no-repeat bg-cover">
          <h1 className="font-mono font-bold tracking-wider text-black absolute bottom-0 right-0 uppercase">
            travfruit
          </h1>
          {(mutationTransactionPaypal.isPending ||
            mutationTransactionMoMo.isPending) && (
            <div className="w-screen h-screen fixed z-[500]">
              <div className="fixed z-[500] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <l-bouncy size="40" speed="1.75" color="white" />
              </div>
            </div>
          )}

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
