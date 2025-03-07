import React, { useState, useEffect, memo, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../Header";
import { Link, useLocation } from "react-router-dom";
import InfoTicket from "./InfoTicket";
import { CONTEXT } from "../../Context/ContextGlobal";
import notify from "../Noti/notify";
import { ToastContainer } from "react-toastify";
import { authorizedAxiosInstance } from "../Utils/authAxios";

function DatChoCuaToi() {
  const dataTicketLocation = useLocation();

  const payment = localStorage.getItem("payment");
  if (dataTicketLocation === null || !dataTicketLocation.state || payment) {
    window.location.href = "/";
  }

  const {
    user,
    oneWayFlight,
    quantityTicketsDeparture,
    quantityTicketsReturn,
    airportDeparture,
    airportReturn,
    ngayBay,
  } = dataTicketLocation.state;

  const {
    convertDateToVNDate,
    naviReload,
    AirportFrom,
    AirportTo,
    Departure_Return_Date,
    convertStringToOjectDate,
    handleReplacePriceAirport,
  } = useContext(CONTEXT);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: Array(
        quantityTicketsDeparture.quantityTicketsOfAdult[0] +
          quantityTicketsDeparture.quantityTicketsOfAdult[1] +
          quantityTicketsDeparture.quantityTicketsOfChild[0] +
          quantityTicketsDeparture.quantityTicketsOfChild[1] +
          quantityTicketsDeparture.quantityTicketsOfBaby
      ).fill({
        ageType: "",
        Ten: "",
        ngaySinh: "",
        hangVe: "",
        giaVe: 0,
        hangBay: `${airportDeparture.hangBay} - ${airportDeparture.loaiMayBay} - ${airportDeparture.soHieu}`,
        loaiChuyenBay: "Chuyến bay đi",
        diemBay: AirportFrom,
        diemDen: AirportTo,
        gioBay: airportDeparture.gioBay,
        ngayBay: convertDateToVNDate(ngayBay[0]).split(" ")[1],
        gioDen: airportDeparture.gioDen,
      }),
      ...(oneWayFlight
        ? {}
        : {
            itemsB: Array(
              quantityTicketsReturn.quantityTicketsOfAdult[0] +
                quantityTicketsReturn.quantityTicketsOfAdult[1] +
                quantityTicketsReturn.quantityTicketsOfChild[0] +
                quantityTicketsReturn.quantityTicketsOfChild[1] +
                quantityTicketsReturn.quantityTicketsOfBaby
            ).fill({
              ageType: "",
              Ten: "",
              ngaySinh: "",
              hangVe: "",
              giaVe: 0,
              hangBay: `${airportReturn.hangBay} - ${airportReturn.loaiMayBay} - ${airportReturn.soHieu}`,
              loaiChuyenBay: "Chuyến bay khứ hồi",
              diemBay: AirportTo,
              diemDen: AirportFrom,
              gioBay: airportReturn.gioBay,
              ngayBay: convertDateToVNDate(ngayBay[1]).split(" ")[1],
              gioDen: airportReturn.gioDen,
            }),
          }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: fieldsB } = useFieldArray({
    control,
    name: "itemsB",
  });

  const [
    loadingCreateOrder_Ticket_UpdateFlight,
    setLoadingCreateOrder_Ticket_UpdateFlight,
  ] = useState(false);

  const funcCreateOrder_Ticket_updateFlight = async (data) => {
    try {
      setLoadingCreateOrder_Ticket_UpdateFlight(true);
      const array = Object.values(data);

      const payload = {
        airportDeparture: array[0],
        airportReturn: array[1],
        totalQuantityTickets:
          quantityTicketsDeparture.quantityTicketsOfAdult[0] +
          quantityTicketsDeparture.quantityTicketsOfAdult[1] +
          quantityTicketsDeparture.quantityTicketsOfChild[0] +
          quantityTicketsDeparture.quantityTicketsOfChild[1] +
          (quantityTicketsDeparture.quantityTicketsOfBaby || 0) +
          (airportReturn
            ? quantityTicketsReturn.quantityTicketsOfAdult[0] +
              quantityTicketsReturn.quantityTicketsOfAdult[1] +
              quantityTicketsReturn.quantityTicketsOfChild[0] +
              quantityTicketsReturn.quantityTicketsOfChild[1] +
              (quantityTicketsReturn.quantityTicketsOfBaby || 0)
            : 0),
        totalPriceTickets:
          new Intl.NumberFormat("vi-VN").format(
            data.items.reduce((acc, item) => {
              const giaVeSo = handleReplacePriceAirport(
                item.giaVe.replace(/\./g, ",")
              );

              return acc + giaVeSo;
            }, 0) +
              (data.itemsB || []).reduce((acc, item) => {
                const giaVeSo = handleReplacePriceAirport(
                  item.giaVe.replace(/\./g, ",")
                );

                return acc + giaVeSo;
              }, 0)
          ) + " VND",
      };

      const res = await authorizedAxiosInstance.post(
        "https://travrel-server.vercel.app/order/order-ticket_create",
        payload
      );

      if (res.status === 200) {
        const timeEnd = convertDateToVNDate(res.data.expiredAt);
        const data = {
          timeEndPayOrder: timeEnd,
          objectOrder: res.data,
        };

        localStorage.setItem(
          "payment",
          JSON.stringify(`${res.data.idDH} ${res.data.expiredAt}`)
        );
        naviReload("/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan", {
          state: {
            data: data,
          },
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          notify("Warn", error.response.data.message);
        }
      } else {
        notify("Error", "Có lỗi xảy ra, vui lòng thử lại");
      }
      return;
    } finally {
      setLoadingCreateOrder_Ticket_UpdateFlight(false);
    }
  };

  const [hideAirportsDeparture, setHideAirportsDeparture] = useState(false);
  const [hideAirportsReturn, setHideAirportsReturn] = useState(false);

  const handleCopyPassengerAirportDepartureToReturn = () => {
    fieldsB.forEach((item, index) => {
      setValue(`itemsB.${index}.Ten`, watch(`items.${index}.Ten`));
      setValue(`itemsB.${index}.ngaySinh`, watch(`items.${index}.ngaySinh`));
    });
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="w-[90%] h-fit m-auto">
        <div className="w-full">
          <h3 className="text-2xl font-bold mt-[12px] mb-[12px]">
            Thông tin đặt chỗ của tôi
          </h3>

          <div className="flex justify-between w-full items-start my-10">
            <Link
              to="/Setting/InfoAccount"
              className="relative flex w-1/3 p-6 bg-white rounded-md shadow-lg h-fit"
            >
              <div className="flex">
                <div className="w-10 h-10 rounded-[100%] bg-blue-500">
                  <img
                    className="p-[8px]"
                    src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/1/10e771009e605099270565bf161c5ac4.svg"
                    alt=""
                  />
                </div>
                <div className=" mt-[-5px] ml-4">
                  <h3 className="font-bold">{user?.fullName}</h3>
                  <h2 className="text-sm font-medium text-gray-500">
                    Tài khoản cá nhân
                  </h2>
                </div>
              </div>
              <div className="absolute right-0 top-[-20px] p-2">
                <img
                  alt=""
                  className="w-[110px] h-[110px]"
                  src="https://ik.imagekit.io/tvlk/image/imageResource/2018/07/27/1532667628823-8d3fb51a3735f35d48dfcd223d2f8bde.svg?tr=q-75,w-170"
                />
              </div>
            </Link>

            <div className="text-xl font-bold w-3/5">
              <div className="mt-[16px]  bg-white shadow-lg rounded-md">
                <div className="p-4 flex h-[52px] shadow-sm gap-x-3">
                  <h3 className="text-base w-fit">
                    Thông tin liên hệ (nhận vé/phiếu thanh toán)
                  </h3>
                  <div className="relative">
                    <div className="cursor-pointer icon-hover-trigger">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#0194F3"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-1/2 transform text-wrap -translate-x-1/2 bottom-full mb-2 w-[300px] p-2 text-sm text-white bg-gray-700 rounded transition-opacity duration-300 opacity-0 hover-note">
                      <p>
                        - Thông tin liên hệ được lấy từ thông tin tài khoản của
                        bạn.
                      </p>

                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
                    </div>
                  </div>

                  <style jsx="true">{`
                    .icon-hover-trigger:hover + .hover-note {
                      opacity: 1;
                    }
                  `}</style>
                </div>
                <div className="p-4 flex gap-3">
                  <div className="inputBox w-fit">
                    <input
                      className={`inputTag`}
                      type="text"
                      value={user?.fullName}
                    />
                    <span className={`spanTag`}>HỌ VÀ TÊN</span>
                  </div>
                  <div className="inputBox w-fit">
                    <input
                      className={`inputTag`}
                      type="text"
                      value={user?.numberPhone}
                    />
                    <span className={`spanTag`}>Số điện thoại</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(funcCreateOrder_Ticket_updateFlight)}
            className=""
          >
            {!oneWayFlight && (
              <button
                type="button"
                className="flex w-full border-b"
                onClick={() => setHideAirportsDeparture(!hideAirportsDeparture)}
              >
                <h1 className="text-center w-full text-xl uppercase font-bold mb-3">
                  -------Chuyến bay đi-------
                </h1>
                {!hideAirportsDeparture ? (
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
                      d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                    />
                  </svg>
                ) : (
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
                      d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                    />
                  </svg>
                )}
              </button>
            )}
            {fields.map((item, index) => (
              <div
                key={airportDeparture.soHieu + index}
                className={`flex justify-between mb-6 transition-all duration-0 ${hideAirportsDeparture ? "h-0 overflow-hidden duration-500" : ""}`}
              >
                <InfoTicket
                  airport={{
                    loaiChuyenBay: "Chuyến bay đi",
                    diemBay: AirportFrom,
                    diemDen: AirportTo,
                    gioBay: airportDeparture.gioBay,
                    ngayBay: convertDateToVNDate(
                      Departure_Return_Date[0]
                    ).split(" ")[1],
                    hangBay: `${airportDeparture.hangBay} - ${airportDeparture.loaiMayBay} - ${airportDeparture.soHieu}`,
                    ageType: watch(`items.${index}.ageType`),
                    hangVe: watch(`items.${index}.hangVe`),
                    giaVe: watch(`items.${index}.giaVe`),
                  }}
                />
                <ThongTinHanhKhach
                  register={register}
                  index={index}
                  item="items"
                  passenger={quantityTicketsDeparture}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  airport={airportDeparture}
                  handleReplacePriceAirport={handleReplacePriceAirport}
                />
              </div>
            ))}

            {!oneWayFlight && (
              <>
                <div className="flex w-full border-b">
                  <h1 className="text-center w-full text-xl uppercase font-bold mb-3">
                    -------Chuyến bay khứ hồi-------
                  </h1>
                  <div className="flex gap-x-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                      onClick={handleCopyPassengerAirportDepartureToReturn}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                      onClick={() => setHideAirportsReturn(!hideAirportsReturn)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={`${!hideAirportsReturn ? "M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" : "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"}`}
                      />
                    </svg>
                  </div>
                </div>
                {fieldsB.map((item, index) => (
                  <div
                    key={airportReturn.soHieu + index}
                    className={`flex justify-between mb-6 transition-all duration-0 ${hideAirportsReturn ? "h-0 overflow-hidden duration-500" : "h-fit duration-500"}`}
                  >
                    <InfoTicket
                      airport={{
                        loaiChuyenBay: "Chuyến bay khứ hồi",
                        diemBay: AirportTo,
                        diemDen: AirportFrom,
                        gioBay: airportReturn.gioBay,
                        ageType: watch(`itemsB.${index}.ageType`),
                        ngayBay: convertDateToVNDate(
                          Departure_Return_Date[1]
                        ).split(" ")[1],
                        hangBay: `${airportReturn.hangBay} - ${airportReturn.loaiMayBay} - ${airportReturn.soHieu}`,
                        loaiMayBay: airportReturn.loaiMayBay,
                        soHieu: airportReturn.soHieu,
                        hangVe: watch(`itemsB.${index}.hangVe`),
                        giaVe: watch(`itemsB.${index}.giaVe`),
                      }}
                    />
                    <ThongTinHanhKhach
                      register={register}
                      index={index}
                      item="itemsB"
                      passenger={quantityTicketsReturn}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                      airport={airportReturn}
                      handleReplacePriceAirport={handleReplacePriceAirport}
                    />
                  </div>
                ))}
              </>
            )}

            <button
              type={
                loadingCreateOrder_Ticket_UpdateFlight ? "button" : "submit"
              }
              className="flex p-3 bg-[#0194F3] text-white mt-3 float-right font-semibold rounded-lg gap-x-3 items-center justify-center"
            >
              {loadingCreateOrder_Ticket_UpdateFlight ? (
                <svg
                  className="w-5 h-5 mr-3 border-r-2 border-white rounded-full animate-spin"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                <>
                  Thanh toán
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default memo(DatChoCuaToi);

function ThongTinHanhKhach({
  register,
  index,
  item,
  errors,
  setValue,
  watch,
  airport,
  passenger,
  handleReplacePriceAirport,
}) {
  useEffect(() => {
    setValue(
      `${item}.${index}.hangVe`,
      passenger.quantityTicketsOfAdult[0] > 0 &&
        index + 1 <= passenger.quantityTicketsOfAdult[0]
        ? "Vé thường"
        : passenger.quantityTicketsOfAdult[1] > 0 &&
            index <
              passenger.quantityTicketsOfAdult[0] +
                passenger.quantityTicketsOfAdult[1]
          ? "Vé thương gia"
          : passenger.quantityTicketsOfChild[0] > 0 &&
              index <
                passenger.quantityTicketsOfChild[0] +
                  passenger.quantityTicketsOfAdult[0] +
                  passenger.quantityTicketsOfAdult[1]
            ? "Vé thường"
            : passenger.quantityTicketsOfChild[1] > 0
              ? "Vé thương gia"
              : "",
      { shouldValidate: true }
    );

    setValue(
      `${item}.${index}.ageType`,
      passenger.quantityTicketsOfAdult[0] +
        passenger.quantityTicketsOfAdult[1] >
        0 &&
        index + 1 <=
          passenger.quantityTicketsOfAdult[0] +
            passenger.quantityTicketsOfAdult[1]
        ? `người lớn thứ ${index + 1}`
        : passenger.quantityTicketsOfChild[0] +
              passenger.quantityTicketsOfChild[1] >
              0 &&
            index <
              passenger.quantityTicketsOfChild[0] +
                passenger.quantityTicketsOfChild[1] +
                passenger.quantityTicketsOfAdult[0] +
                passenger.quantityTicketsOfAdult[1]
          ? `trẻ em thứ ${
              index -
              (passenger.quantityTicketsOfAdult[0] +
                passenger.quantityTicketsOfAdult[1]) +
              1
            }`
          : passenger.quantityTicketsOfBaby > 0 &&
              index <
                passenger.quantityTicketsOfBaby +
                  passenger.quantityTicketsOfChild[0] +
                  passenger.quantityTicketsOfChild[1] +
                  passenger.quantityTicketsOfAdult[0] +
                  passenger.quantityTicketsOfAdult[1]
            ? `em bé thứ ${
                index -
                (passenger.quantityTicketsOfChild[0] +
                  passenger.quantityTicketsOfChild[1] +
                  passenger.quantityTicketsOfAdult[0] +
                  passenger.quantityTicketsOfAdult[1]) +
                1
              }`
            : "aaa"
    );

    setValue(
      `${item}.${index}.giaVe`,
      watch(`${item}.${index}.ageType`).split(" thứ")[0] === "người lớn" &&
        watch(`${item}.${index}.hangVe`) === "Vé thường"
        ? new Intl.NumberFormat("vi-VN").format(
            handleReplacePriceAirport(airport.gia)
          ) + " VND"
        : watch(`${item}.${index}.ageType`).split(" thứ")[0] === "người lớn" &&
            watch(`${item}.${index}.hangVe`) === "Vé thương gia"
          ? new Intl.NumberFormat("vi-VN").format(
              handleReplacePriceAirport(airport.gia) * 1.5
            ) + " VND"
          : watch(`${item}.${index}.ageType`).split(" thứ")[0] === "trẻ em" &&
              watch(`${item}.${index}.hangVe`) === "Vé thường"
            ? new Intl.NumberFormat("vi-VN").format(
                handleReplacePriceAirport(airport.gia) * 0.75
              ) + " VND"
            : watch(`${item}.${index}.ageType`).split(" thứ")[0] === "trẻ em" &&
                watch(`${item}.${index}.hangVe`) === "Vé thương gia"
              ? new Intl.NumberFormat("vi-VN").format(
                  handleReplacePriceAirport(airport.gia) * 0.75 * 1.5
                ) + " VND"
              : watch(`${item}.${index}.ageType`).split(" thứ")[0] === "em bé"
                ? "0 VND"
                : ""
    );
  }, [
    index,
    setValue,
    passenger,
    airport,
    watch,
    handleReplacePriceAirport,
    item,
  ]);

  return (
    <div className="bg-white shadow-lg rounded-md p-5 w-2/3">
      <h3 className="text-xl font-bold mb-6">
        Thông tin vé cho {watch(`${item}.${index}.ageType`)}{" "}
      </h3>

      <div className="flex gap-x-5 mb-6 text-base font-semibold">
        <div className="inputBox lg:w-[45%]">
          <input
            className={`${errors?.[item]?.[index]?.Ten ? "inputTagBug" : "inputTag"}`}
            type="text"
            required
            {...register(`${item}.${index}.Ten`, {
              required: "full name",
              minLength: {
                value: 2,
                message: "Ít nhất 2 kí tự",
              },
              maxLength: {
                value: 70,
                message: "Nhiều nhất 70 kí tự",
              },
              pattern: {
                value: /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
                message: "Nhập chữ",
              },
            })}
          />
          <span className={`spanTag`}>
            {errors?.[item]?.[index]?.Ten
              ? errors?.[item]?.[index].Ten.message
              : `FULL NAME [${watch(`${item}.${index}.Ten`).length}/70]`}
          </span>
        </div>
        <div className="mb-6 inputBox w-[40%]">
          <input
            className={`${errors[item]?.[index]?.ngaySinh ? "inputTagBug" : "inputExist"}`}
            type="date"
            // defaultValue={airport.da?.birthday}
            required
            {...register(`${item}.${index}.ngaySinh`, {
              required: "birthday",
              validate: {
                validAge: (value) => {
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const isBirthdayPassed =
                    today.getMonth() > birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() &&
                      today.getDate() >= birthDate.getDate());
                  if (
                    watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
                    "người lớn"
                  ) {
                    return (
                      age > 12 ||
                      (age === 12 && isBirthdayPassed) ||
                      "Người lớn phải trên 12 tuổi"
                    );
                  }
                  if (
                    watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
                    "trẻ em"
                  ) {
                    return (
                      (age <= 12 && age >= 2) ||
                      (age <= 12 && age >= 2 && isBirthdayPassed) ||
                      "Trẻ em dưới 12 tuổi và trên 2 tuổi"
                    );
                  }
                  if (
                    watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
                    "em bé"
                  ) {
                    return (
                      (age < 2 && isBirthdayPassed) ||
                      "Em bé phải dưới 2 tuổi và không quá hiện tại"
                    );
                  }

                  return true;
                },
              },
            })}
          />
          <span className={`spanTag whitespace-nowrap`}>
            {errors[item]?.[index]?.ngaySinh
              ? errors[item]?.[index]?.ngaySinh.message
              : "Ngày sinh"}
          </span>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <button
          className={`border-2 rounded-lg h-fit flex justify-center gap-x-4 w-[47%] p-2  mb-6 ${watch(`${item}.${index}.hangVe`) === "Vé thường" ? "border-[#0194F3] " : "border-gray-300 opacity-50 cursor-not-allowed"} `}
          type="button"
        >
          <img
            alt=""
            className="w-16 bg-cover h-14"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519148670-d3ca3132946e435bd467ccc096730670.png"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold">Vé thường</span>
            <span className="text-lg font-semibold text-[#FF5E1F]">
              {watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
              "người lớn"
                ? new Intl.NumberFormat("vi-VN").format(
                    handleReplacePriceAirport(airport.gia)
                  )
                : watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
                    "trẻ em"
                  ? new Intl.NumberFormat("vi-VN").format(
                      handleReplacePriceAirport(airport.gia) * 0.75
                    )
                  : "0"}{" "}
              {" VND"}
              <span className="text-sm font-semibold text-[#a0a0a0]">
                / khách
              </span>
            </span>
          </div>
        </button>
        <button
          type="button"
          className={`border-2 rounded-lg h-fit flex gap-x-4 w-[47%] justify-center p-2 ${watch(`${item}.${index}.hangVe`) === "Vé thương gia" ? "border-[#0194F3]" : "border-gray-300 opacity-50 cursor-not-allowed"}`}
        >
          <img
            alt=""
            className="w-16 bg-cover h-14"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/23/1671789427394-4441a4e3f0b96ea01dccf4a620bad996.png"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold whitespace-nowrap">
              Vé thương gia
            </span>
            <span className="text-lg font-semibold text-[#FF5E1F]">
              {watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
              "người lớn"
                ? new Intl.NumberFormat("vi-VN").format(
                    handleReplacePriceAirport(airport.gia) * 1.5
                  )
                : watch(`${item}.${index}.ageType`).split(" thứ")[0] ===
                    "trẻ em"
                  ? new Intl.NumberFormat("vi-VN").format(
                      handleReplacePriceAirport(airport.gia) * 0.75 * 1.5
                    )
                  : "0"}{" "}
              {" VND"}
              <span className="text-sm font-semibold text-[#a0a0a0]">
                /khách
              </span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
