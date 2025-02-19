import Footer from "../Footer.js";
import { useContext, useEffect, memo, useState } from "react";
import Header from "../Header.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import { Lunar } from "lunar-javascript";
import InterFaceLogin from "./InterFaceLogin.js";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import { LoginSuccess } from "../Setting/StateLoginSucces.js";
import { ToastContainer } from "react-toastify";
import axios from "../Utils/authAxios.js";
import notify from "../Noti/notify.js";
import Loading from "../Loading.js";
import FlightShowCalendar from "../FlightShowCalendar.js";
import FuncChatbot from "../Chatbot/FuncChatbot.js";
import { InstructionSheet } from "../Utils/InstructionSheet.js";
registerLocale("vi", vi);

registerLocale("vi", vi);

function ComponentHome() {
  const {
    isShowInterfaceLogin,
    isShowOptionSetting_LoginSuccess,
    setShowOptionSetting_LoginSuccess,
    handleShowAirports,
    bayMotChieu,
    handleSearchFlight,
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

    const payment = localStorage.getItem("payment");

    if (orderId && message) {
      handleTransactionStatus(orderId);
    } else if (payment) {
      const exp = JSON.parse(payment).split(" ")[1];

      const timeNow = new Date();

      if (timeNow > new Date(exp)) {
        localStorage.removeItem("payment");
        return;
      }

      notify(
        "Warn",
        `Có đơn hàng chưa thanh toán, mã đơn hàng: ${payment.split(" ")[0].replace(/"/g, "")}`
      );
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

            <CSearchTicketFlight
              div1="px-12 mb-16"
              span="text-[19px] text-white"
              svgStroke="stroke-[#0194f3] size-8"
              div2_1="w-fit"
              div2="w-fit"
              textDatePicker="text-center"
              handleSearchFlight={handleSearchFlight}
              styleLocationShowListAirline={{
                left: "left-[412px]",
                top: "top-[78px]",
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function CSearchTicketFlight({
  div1,
  span,
  svgStroke,
  div2_1,
  div2,
  textDatePicker,
  handleSearchFlight,
  styleLocationShowListAirline,
}) {
  const {
    handleShowAirports,
    showAirports,
    choosePassenger,
    setChoosePassenger,
    handleInputAirport,
    AirportFrom,
    AirportTo,
    AirportsVN,
    invalid_AirportFrom_AirportTo,
    handleChooseAirport,
    handleSwapPlaceAirport,
    handleEditQuantityPassenger,
    editQuantityPassenger,
    bayMotChieu,
    Departure_Return_Date,
    handlePickDeparture_Return_Date,
    setBayMotChieu,
  } = useContext(CONTEXT);

  return (
    <>
      <div className={`flex justify-between w-auto h-fit ${div1}`}>
        <div className="flex items-center w-full gap-x-5 h-fit">
          <div className="w-fit relative">
            <div className="flex items-center gap-x-5 w-fit">
              <span className={`font-semibold uppercase ${span}`}>Nơi đi</span>
              <InstructionSheet
                content={`Có thể tìm kiếm theo: Tên thành phố, Tên sân bay, mã IATA. Vui lòng chọn địa điểm từ danh sách đề xuất`}
              />
            </div>
            <div
              className={`absolute -mb-5 text-sm font-semibold text-white transition-all duration-300 transform -translate-x-1/2 bg-gray-700 rounded whitespace-nowrap left-1/2 bottom-full  ${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "w-fit p-2" : "w-0 overflow-hidden"}`}
            >
              <p>{`${invalid_AirportFrom_AirportTo[0].status ? invalid_AirportFrom_AirportTo[0].noti : invalid_AirportFrom_AirportTo[1].status ? invalid_AirportFrom_AirportTo[1].noti : ""}`}</p>
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
            </div>
            <div className="flex items-center w-fit border-[#cdd0d1] border-b gap-x-3 p-2">
              <label htmlFor="Origin">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${svgStroke} cursor-pointer`}
                >
                  <path
                    d="M3 21H21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 9L15.1924 7.93585C17.317 7.22767 19.6563 7.95843 21 9.75L7.44513 14.0629C5.86627 14.5653 4.1791 13.6926 3.67674 12.1137C3.66772 12.0854 3.65912 12.0569 3.65094 12.0283L3 9.75L5.25 10.875L9 9.75L4.5 3H5.25L12 9Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </label>

              <input
                id="Origin"
                placeholder="Origin (Tên thành phố)"
                className={`w-[280px] h-full ${span} font-semibold text-white bg-transparent outline-none -tracking-tighter`}
                value={AirportFrom}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowAirports([0, 1, 2], [true, true, false]);
                }}
                onChange={(event) => {
                  handleInputAirport(event, "From");
                }}
              />
            </div>

            <FilterAirport
              showAirports={showAirports}
              Airport={AirportFrom}
              filteredAirports={AirportsVN}
              handleChooseAirport={handleChooseAirport}
              type={
                showAirports[0] && showAirports[1]
                  ? "Origin"
                  : showAirports[0] && showAirports[2]
                    ? "Destination"
                    : ""
              }
              AirportsVN={AirportsVN}
              AirportFrom={AirportFrom}
              AirportTo={AirportTo}
              styleLocationShowListAirline={styleLocationShowListAirline}
            />
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className={`${svgStroke} cursor-pointer`}
            onClick={handleSwapPlaceAirport}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>

          <div className="w-fit relative">
            <div className="flex items-center gap-x-3">
              <span className={`uppercase font-semibold ${span}`}>nơi Đến</span>
              <InstructionSheet
                content={`Có thể tìm kiếm theo: Tên thành phố, Tên sân bay, mã IATA. Vui lòng chọn địa điểm từ danh sách đề xuất`}
              />
            </div>
            <div
              className={`absolute -mb-5 text-sm font-semibold text-white transition-all duration-300 transform -translate-x-1/2 bg-gray-700 rounded whitespace-nowrap left-1/2 bottom-full  ${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "w-fit p-2" : "w-0 overflow-hidden"}`}
            >
              <p>{`${invalid_AirportFrom_AirportTo[0].status ? invalid_AirportFrom_AirportTo[0].noti : invalid_AirportFrom_AirportTo[1].status ? invalid_AirportFrom_AirportTo[1].noti : ""}`}</p>
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
            </div>
            <div className="flex items-center w-full p-2 border-[#cdd0d1] border-b gap-x-3">
              <label htmlFor="Destination">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${svgStroke} cursor-pointer`}
                >
                  <path
                    d="M3 21H21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 9L15.1924 7.93585C17.317 7.22767 19.6563 7.95843 21 9.75L7.44513 14.0629C5.86627 14.5653 4.1791 13.6926 3.67674 12.1137C3.66772 12.0854 3.65912 12.0569 3.65094 12.0283L3 9.75L5.25 10.875L9 9.75L4.5 3H5.25L12 9Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(28 10 10)"
                  ></path>
                </svg>
              </label>
              <input
                id="Destination"
                placeholder="Destination (Tên thành phố)"
                className={`w-[280px] h-full ${span} font-semibold text-white bg-transparent outline-none -tracking-tighter`}
                value={AirportTo}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowAirports([0, 1, 2], [true, false, true]);
                }}
                onChange={(event) => handleInputAirport(event, "To")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`flex h-full w-full ${div1} items-center`}>
        <div className={`flex items-end ${div2} gap-x-10 h-fit`}>
          <div className="relative flex flex-col h-fit w-fit">
            <span className={`select-none uppercase font-semibold ${span}`}>
              Hành khách
            </span>
            <div
              onClick={() => {
                setChoosePassenger(!choosePassenger);
                handleShowAirports([0, 1, 2], [false, false, false]);
              }}
              className="flex items-center p-2 text-white border-b cursor-pointer gap-x-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className={`${svgStroke} cursor-pointer`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>

              <span
                className={`w-full h-full ${span}} font-semibold text-white bg-transparent outline-none -tracking-tighter whitespace-nowrap`}
              >
                {editQuantityPassenger[0]} Người lớn, {editQuantityPassenger[1]}{" "}
                Trẻ em, {editQuantityPassenger[2]} Em bé
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            {choosePassenger && (
              <ul
                className="absolute p-3 bg-white top-[79px] w-fit"
                onClick={(e) => e.stopPropagation()}
              >
                <li className="flex text-[#0194f3] font-semibold justify-between mb-2 items-center">
                  <span className="select-none whitespace-nowrap">
                    Người lớn (Trên 12 tuổi)
                  </span>
                  <div className="flex w-[145px] justify-evenly">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(0, "Reduce")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="select-none">
                      {editQuantityPassenger[0]}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(0, "Increase")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                </li>
                <li className="flex text-[#0194f3] font-semibold justify-between mb-2">
                  <span className="select-none">Trẻ em (Dưới 12 tuổi)</span>
                  <div className="flex w-[145px] justify-evenly">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(1, "Reduce")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="select-none">
                      {editQuantityPassenger[1]}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(1, "Increase")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                </li>
                <li className="flex text-[#0194f3] font-semibold justify-between">
                  <span className="select-none">Em bé (Dưới 2 tuổi)</span>
                  <div className="flex w-[145px] justify-evenly">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(2, "Reduce")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="select-none">
                      {editQuantityPassenger[2]}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-7"
                      onClick={() => handleEditQuantityPassenger(2, "Increase")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                </li>
              </ul>
            )}
          </div>

          <div
            className={`flex flex-col border-[#cdd0d1] border-b ${div2_1} overflow-hidden gap-x-3 justify-center`}
          >
            <span
              className={`select-none uppercase font-semibold ${span} whitespace-nowrap`}
            >
              Ngày đi
            </span>
            <DatePicker
              selected={Departure_Return_Date[0]}
              onChange={(date) => handlePickDeparture_Return_Date(date, 0)}
              dateFormat={"dd/MM/yyyy"}
              minDate={(() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
              })()}
              maxDate={new Date("2030-01-01")}
              locale={"vi"}
              renderDayContents={(day, date) => {
                const lunarDate = Lunar.fromDate(date, 0);
                return (
                  <span>
                    {day} <br />
                    <small style={{ fontSize: "0.7em" }}>
                      {lunarDate.getDay()}/{lunarDate.getMonth()}
                    </small>
                  </span>
                );
              }}
              className={`flex ${span} font-semibold bg-transparent outline-none -tracking-tighter ${textDatePicker} whitespace-nowrap`}
            />
          </div>

          <div
            className={`flex flex-col h-fit ${div2_1}  gap-y-1 overflow-hidden`}
          >
            <button
              className="gap-x-3 w-fit flex items-center text-white font-semibold uppercase whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                setBayMotChieu(!bayMotChieu);
              }}
            >
              {bayMotChieu ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className="size-6 stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className="size-6 stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
              khứ hồi
            </button>

            <div
              className={`flex flex-col text-[25px] justify-center border-[#cdd0d1] border-b w-fit gap-x-3 ${bayMotChieu ? "opacity-0 select-none pointer-events-none" : ""}`}
            >
              <span
                className={`select-none uppercase font-semibold ${span} whitespace-nowrap`}
              >
                Ngày về
              </span>
              <DatePicker
                selected={Departure_Return_Date[1]}
                onChange={(date) => handlePickDeparture_Return_Date(date, 1)}
                dateFormat={"dd/MM/yyyy"}
                minDate={
                  new Date(
                    Departure_Return_Date[0].getTime() + 2 * 24 * 60 * 60 * 1000
                  )
                }
                maxDate={new Date("2030-01-01")}
                locale={"vi"}
                renderDayContents={(day, date) => {
                  const lunarDate = Lunar.fromDate(date);
                  return (
                    <span>
                      {day} <br />
                      <small style={{ fontSize: "0.7em" }}>
                        {lunarDate.getDay()}/{lunarDate.getMonth()}
                      </small>
                    </span>
                  );
                }}
                className={`flex font-semibold ${span} bg-transparent outline-none -tracking-tighter ${textDatePicker} whitespace-nowrap w-fit`}
              />
            </div>
          </div>
        </div>

        <button
          className={`${invalid_AirportFrom_AirportTo[0].status || invalid_AirportFrom_AirportTo[1].status ? "bg-slate-500 cursor-not-allowed" : "bg-[#ff5e1f] cursor-pointer"} p-5 rounded-2xl border-4 border-[rgba(205,208,209,0.50)] w-fit h-fit`}
          type="button"
          onClick={() =>
            handleSearchFlight({
              departure: AirportFrom,
              arrival: AirportTo,
              dateDeparture: Departure_Return_Date[0],
              dateReturn: Departure_Return_Date[1],
              quantityPassenger: editQuantityPassenger,
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="size-6 stroke-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

const FilterAirport = ({
  showAirports,
  filteredAirports,
  handleChooseAirport,
  type,
  AirportFrom,
  AirportTo,
  styleLocationShowListAirline,
}) => {
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Chuyển đổi sang dạng chuẩn
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu
  };

  return (
    <>
      <ul
        className={`${showAirports[0] && filteredAirports.length !== 0 ? "min-h-0 max-h-44 overflow-y-auto" : "w-0 h-0 overflow-hidden p-0"} ${styleLocationShowListAirline?.top} absolute z-10 ${type === "Origin" ? "left-0" : type === "Destination" ? styleLocationShowListAirline?.left : ""} font-semibold bg-white w-fit tracking-wider transition-all duration-1000`}
      >
        {filteredAirports
          .filter((item) => {
            const searchAirport =
              type === "Origin"
                ? AirportFrom.toLowerCase().trim()
                : AirportTo.toLowerCase().trim();
            const city = item.city.toLowerCase();
            const airport = item.airport.toLowerCase();
            const IATA = item.IATA.toLowerCase();

            return (
              (AirportFrom && city.includes(searchAirport)) ||
              removeAccents(city).includes(searchAirport) ||
              airport.includes(searchAirport) ||
              IATA.includes(searchAirport)
            );
          })
          .map((items) => (
            <li
              className="w-full h-full p-2 border-b cursor-pointer whitespace-nowrap hover:bg-slate-100"
              key={items.IATA}
              onClick={() => handleChooseAirport(items, type)}
            >
              {items.city + ", " + items.airport + " (" + items.IATA + ")"}
            </li>
          ))}
      </ul>
    </>
  );
};

export const Home = memo(ComponentHome);
export const SearchTicketFlight = memo(CSearchTicketFlight);
