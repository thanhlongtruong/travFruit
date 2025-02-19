import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Components/Utils/authAxios.js";
import notify from "../Components/Noti/notify";

export const CONTEXT = createContext({});
export const OrderProvider = ({ children }) => {
  const naviReload = useNavigate();

  //<<<<<<<<<<<<<<<<<<<<< Page Home

  const AirportsVN = useMemo(
    () => [
      {
        city: "Cần Thơ",
        ICAO: "VVCT",
        IATA: "VCA",
        airport: "Can Tho International Airport",
        location: "10°05′07″N 105°42′43″E",
      },
      {
        city: "Đà Nẵng",
        ICAO: "VVDN",
        IATA: "DAD",
        airport: "Da Nang International Airport",
        location: "16°02′38″N 108°11′58″E",
      },
      {
        city: "Hải Phòng",
        ICAO: "VVCI",
        IATA: "HPH",
        airport: "Cat Bi International Airport",
        location: "20°49′09″N 106°43′29″E",
      },
      {
        city: "Hà Nội",
        ICAO: "VVNB",
        IATA: "HAN",
        airport: "Noi Bai International Airport",
        location: "21°13′16″N 105°48′26″E",
      },
      {
        city: "TP.Hồ Chí Minh",
        ICAO: "VVTS",
        IATA: "SGN",
        airport: "Tan Son Nhat International Airport",
        location: "10°49′08″N 106°39′07″E",
      },
      {
        city: "Huế",
        ICAO: "VVPB",
        IATA: "HUI",
        airport: "Phu Bai International Airport",
        location: "16°24′06″N 107°42′10″E",
      },
      {
        city: "Nha Trang",
        ICAO: "VVCR",
        IATA: "CXR",
        airport: "Cam Ranh International Airport",
        location: "11°59′53″N 109°13′10″E",
      },
      {
        city: "Phú Quốc",
        ICAO: "VVPQ",
        IATA: "PQC",
        airport: "Phu Quoc International Airport",
        location: "10°10′18″N 103°59′28″E",
      },
      {
        city: "Hạ Long",
        ICAO: "VVVD",
        IATA: "VDO",
        airport: "Van Don International Airport",
        location: "21°07′04″N 107°24′51″E",
      },
      {
        city: "Vinh",
        ICAO: "VVVH",
        IATA: "VII",
        airport: "Vinh International Airport",
        location: "18°44′12.21″N 105°40′15.17″E",
      },
      {
        city: "Buôn Ma Thuột",
        ICAO: "VVBM",
        IATA: "BMV",
        airport: "Buon Ma Thuot Airport",
        location: "12°40′05″N 108°07′12″E",
      },
      {
        city: "Cà Mau",
        ICAO: "VVCM",
        IATA: "CAH",
        airport: "Ca Mau Airport",
        location: "09°10′32″N 105°10′46″E",
      },
      {
        city: "Côn Đảo",
        ICAO: "VVCS",
        IATA: "VCS",
        airport: "Con Dao Airport",
        location: "08°43′57″N 106°37′44″E",
      },
      {
        city: "Tam Kỳ và Quảng Ngãi",
        ICAO: "VVCA",
        IATA: "VCL",
        airport: "Chu Lai Airport",
        location: "15°24′22″N 108°42′20″E",
      },
      {
        city: "Đà Lạt",
        ICAO: "VVDL",
        IATA: "DLI",
        airport: "Lien Khuong Airport",
        location: "11°45′02″N 108°22′25″E",
      },
      {
        city: "Điện Biên Phủ",
        ICAO: "VVDB",
        IATA: "DIN",
        airport: "Dien Bien Airport",
        location: "21°23′50″N 103°00′28″E",
      },
      {
        city: "Đồng Hới",
        ICAO: "VVDH",
        IATA: "VDH",
        airport: "Dong Hoi Airport",
        location: "17°30′54″N 106°35′26″E",
      },
      {
        city: "Pleiku",
        ICAO: "VVPK",
        IATA: "PXU",
        airport: "Pleiku Airport",
        location: "14°00′16″N 108°01′02″E",
      },
      {
        city: "Quy Nhơn",
        ICAO: "VVPC",
        IATA: "UIH",
        airport: "Phu Cat Airport",
        location: "13°57′18″N 109°02′32″E",
      },
      {
        city: "Rạch Giá",
        ICAO: "VVRG",
        IATA: "VKG",
        airport: "Rach Gia Airport",
        location: "09°57′35″N 105°08′02″E",
      },
      {
        city: "Tuy Hòa",
        ICAO: "VVTH",
        IATA: "TBB",
        airport: "Tuy Hoa Airport",
        location: "13°02′58″N 109°20′01″E",
      },
      {
        city: "Vũng Tàu",
        ICAO: "VVVT",
        IATA: "VTG",
        airport: "Vung Tau Airport",
        location: "10°22′00″N 107°05′00″E",
      },
      {
        city: "Thanh Hóa",
        ICAO: "VVTX",
        IATA: "THD",
        airport: "Tho Xuan Airport",
        location: "19°54′06″N 105°28′04″E",
      },
    ],
    []
  );

  const [bayMotChieu, setBayMotChieu] = useState(true);
  const [editQuantityPassenger, setEditQuantityPassenger] = useState([1, 0, 0]);
  const [invalid_AirportFrom_AirportTo, setInvalid_AirportFrom_AirportTo] =
    useState([
      {
        status: false,
        noti: "Nơi đi và nơi đến không được trùng.",
      },
      {
        status: false,
        noti: "Có địa điểm chưa được chọn",
      },
    ]);
  const [showAirports, setShowAirports] = useState([false, false, false]);
  const [choosePassenger, setChoosePassenger] = useState(false);
  const [AirportTo, setAirportTo] = useState(
    `${AirportsVN[4].city} (${AirportsVN[4].IATA})`
  );
  const [AirportFrom, setAirportFrom] = useState(
    `${AirportsVN[6].city} (${AirportsVN[6].IATA})`
  );

  const handleShowAirports = useCallback(
    (indexs, booleans) => {
      if (choosePassenger) {
        setChoosePassenger(false);
      }
      setShowAirports((pre) => {
        const arrStateShowAirports = [...pre];

        indexs.forEach((index, i) => {
          arrStateShowAirports[index] = booleans[i];
        });

        return arrStateShowAirports;
      });
    },
    [choosePassenger]
  );

  const handleInputAirport = useCallback(
    (event, type) => {
      if (type === "From") {
        handleShowAirports([0, 1, 2], [true, true, false]);

        setAirportFrom(event.target.value);

        return;
      }

      if (type === "To") {
        handleShowAirports([0, 1, 2], [true, false, true]);

        setAirportTo(event.target.value);
      }
    },
    [handleShowAirports]
  );

  const handleChooseAirport = (airport, type) => {
    if (type === "Origin") {
      setAirportFrom(`${airport.city} (${airport.IATA})`);
    }
    if (type === "Destination") {
      setAirportTo(`${airport.city} (${airport.IATA})`);
    }
    handleShowAirports([0, 1, 2], [false, false, false]);
    handleInvalid_AirportFrom_AirportTo(1, false);
  };

  const handleSwapPlaceAirport = () => {
    setAirportFrom((pre) => {
      setAirportTo(pre);
      return AirportTo;
    });
  };

  const handleEditQuantityPassenger = (index, type) => {
    setEditQuantityPassenger((pre) => {
      const arrQuanPre = [...pre];

      if (type === "Increase" && arrQuanPre[index] >= 9) {
        return arrQuanPre;
      }
      if (index === 0 && type === "Reduce" && arrQuanPre[0] <= arrQuanPre[2]) {
        return arrQuanPre;
      }

      if (
        type === "Increase" &&
        index === 2 &&
        arrQuanPre[2] >= arrQuanPre[0]
      ) {
        return arrQuanPre;
      }
      if (
        ((index === 0 && arrQuanPre[0] <= 1) ||
          (index === 1 && arrQuanPre[1] <= 0) ||
          (index === 2 && arrQuanPre[2] <= 0)) &&
        type === "Reduce"
      ) {
        return arrQuanPre;
      }
      if (type === "Increase") {
        arrQuanPre[index] += 1;
      }
      if (type === "Reduce") {
        arrQuanPre[index] -= 1;
      }

      return arrQuanPre;
    });
  };

  const tomorrow = new Date();

  const [Departure_Return_Date, setDeparture_Return_Date] = useState([
    new Date(tomorrow.setDate(tomorrow.getDate() + 1)),
    new Date(tomorrow.setDate(tomorrow.getDate() + 2)),
  ]);

  const handlePickDeparture_Return_Date = (date, index) => {
    const date_ = date ?? new Date();

    setDeparture_Return_Date((pre) => {
      const preDeparture_Return_Date = [...pre];
      console.log(
        compareDateSkipTime(
          new Date(date_.getTime() + 1 * 24 * 60 * 60 * 1000)
        ).valueOf() ===
          compareDateSkipTime(new Date(preDeparture_Return_Date[1])).valueOf(),
        compareDateSkipTime(
          new Date(date_.getTime() + 1 * 24 * 60 * 60 * 1000)
        ),
        compareDateSkipTime(new Date(preDeparture_Return_Date[1]))
      );
      if (
        compareDateSkipTime(date_) >
          compareDateSkipTime(new Date(preDeparture_Return_Date[1])) &&
        index === 0
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      } else if (
        compareDateSkipTime(
          new Date(date_.getTime() + 1 * 24 * 60 * 60 * 1000)
        ).valueOf() ===
          compareDateSkipTime(
            new Date(preDeparture_Return_Date[1])
          ).valueOf() &&
        index === 0
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      } else if (
        compareDateSkipTime(date_).valueOf() ===
          compareDateSkipTime(preDeparture_Return_Date[1]).valueOf() &&
        index === 0
      ) {
        preDeparture_Return_Date[1] = new Date(
          date_.getTime() + 2 * 24 * 60 * 60 * 1000
        );
      }
      preDeparture_Return_Date[index] = date_;

      return preDeparture_Return_Date;
    });
  };

  const compareDateSkipTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleCheckAllInformationBeforeSearch = ({
    departure,
    arrival,
    dateDeparture,
    dateReturn,
  }) => {
    const check_departure = AirportsVN.some((items) =>
      departure.trim().includes(`${items.city} (${items.IATA})`)
    );

    const check_arrival = AirportsVN.some((items) =>
      arrival.trim().includes(`${items.city} (${items.IATA})`)
    );

    const IATA_departure = departure.match(/\(([^)]+)\)/);
    const IATA_arrival = arrival.match(/\(([^)]+)\)/);

    const Date_departure = convertDateToVNDate(dateDeparture).split(" ")[1];
    const Date_return = convertDateToVNDate(dateReturn).split(" ")[1];
    const [dayDeparture, monthDeparture, yearDeparture] =
      Date_departure.split("/");
    const [dayReturn, monthReturn, yearReturn] = Date_return.split("/");

    const formatDate_departure = `${dayDeparture}-${monthDeparture}-${yearDeparture}`;
    const formatDate_return = `${dayReturn}-${monthReturn}-${yearReturn}`;

    return {
      IATA_departure,
      IATA_arrival,
      formatDate_departure,
      formatDate_return,
      check_departure,
      check_arrival,
    };
  };

  const handleSearchFlight = async ({
    departure,
    arrival,
    dateDeparture,
    dateReturn,
    quantityPassenger,
  }) => {
    console.log(
      departure,
      arrival,
      dateDeparture,
      dateReturn,
      quantityPassenger
    );

    const resultCheck = handleCheckAllInformationBeforeSearch({
      departure,
      arrival,
      dateDeparture,
      dateReturn,
    });
    if (!resultCheck.check_departure || !resultCheck.check_arrival) {
      handleInvalid_AirportFrom_AirportTo(1, true);
      return;
    }
    if (invalid_AirportFrom_AirportTo[0].status) {
      return;
    }
    const params = new URLSearchParams({
      departure: departure,
      arrival: arrival,
      departureIATA: resultCheck.IATA_departure[1],
      arrivalIATA: resultCheck.IATA_arrival[1],
      departureDate: resultCheck.formatDate_departure,
      oneWayTicket: bayMotChieu,
      ...(bayMotChieu
        ? {}
        : {
            returnDate: resultCheck.formatDate_return,
          }),
      passengers: quantityPassenger,
    });
    naviReload(`/XemDanhSachChuyenBay?${params.toString()}`);
  };

  const handleInvalid_AirportFrom_AirportTo = (index, status) => {
    setInvalid_AirportFrom_AirportTo((pre) => {
      return pre.map((item, idx) => {
        if (idx === index) {
          return { ...item, status };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    const from = AirportFrom.trim().toLowerCase();
    const to = AirportTo.trim().toLowerCase();

    if (from.includes(to) && from !== "" && to !== "") {
      handleInvalid_AirportFrom_AirportTo(0, true);
    } else {
      handleInvalid_AirportFrom_AirportTo(0, false);
    }
  }, [AirportFrom, AirportTo]);

  const handleReplacePriceAirport = (price) => {
    const removeUnit = price.replace(" VND", "").replace(/\./g, "");
    return parseInt(removeUnit, 10);
  };
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //open dialog chỉnh số lượng và hạng
  const [isChonMuaClick, setChonMuaClick] = useState(false);
  const handleChonMuaClick = () => {
    setChonMuaClick(!isChonMuaClick);
  };

  // func handle logout
  const handleSetStateLogin_Logout = async () => {
    // setShowOptionSetting_LoginSuccess(!isShowOptionSetting_LoginSuccess);

    await axios.delete(`/user/logout`);
    localStorage.removeItem("user");
    setShowChatbot(false);
    naviReload("/");
    // Trường hợp 2: Dùng Http Only cookie > gọi api xử lý remove cookie
  };

  const funcRefreshToken = async () => {
    return await axios.put(`/user/refresh-token`);
  };

  const funcPayloadToken = async () => {
    const res = await axios.get(`/user/get`);
    localStorage.setItem("user", JSON.stringify(res.data));
    return;
  };

  // '0': Phút (0-59)
  // '10': Giờ (0-23)
  // '*': Ngày trong tháng (1-31)
  // '*': Tháng (1-12)
  // '*': Ngày trong tuần (0-6, 0 là Chủ Nhật)

  // state show interFaceLogin
  const [isShowInterfaceLogin, setShowInterfaceLogin] = useState(false);

  const [isShowOptionSetting_LoginSuccess, setShowOptionSetting_LoginSuccess] =
    useState(false);

  //! func show option login when login success
  const handleShowOptionSetting_LoginSuccess = () => {
    setShowOptionSetting_LoginSuccess(!isShowOptionSetting_LoginSuccess);
  };

  const [isStateSaveRegister, setStateRegister] = useState(false);

  const [isSubmitUpdate, setSubmitUpdate] = useState(false);

  //? set state open Window choose hạng vé
  const [openAdjustQuantity, setOpenAdjustQuantity] = useState(false);
  const [hideDetailItemFlight, setHideDetailItemFlight] = useState(true);
  const [DontActionOpenDetailItem, setDontActionOpenDetailItem] =
    useState(true);

  // hàm chuyển from list flight to input information
  const existUser = JSON.parse(localStorage.getItem("user")) ?? false;

  const handleMake_a_Reservation = async ({
    airportDeparture,
    airportReturn,
    quantityTicketsDeparture,
    quantityTicketsReturn,
    oneWayFlight,
  }) => {
    if (!existUser) {
      setShowInterfaceLogin(true);
      return;
    }

    try {
      naviReload("/XemDanhSachChuyenbBay/DatChoCuaToi", {
        state: {
          user: existUser,
          oneWayFlight: oneWayFlight,
          quantityTicketsDeparture: quantityTicketsDeparture,
          quantityTicketsReturn: quantityTicketsReturn,
          airportDeparture: airportDeparture,
          airportReturn: airportReturn,
        },
      });
      setOpenAdjustQuantity(false);
      setDontActionOpenDetailItem(true);
    } catch (error) {
      console.error("Error setting ticket:", error);
    }
  };

  useEffect(() => {
    const storage = localStorage.getItem("payment");
    if (storage) {
      const timeEndPayOrder = storage.split(" ")[3];
      const converTimeEnd = new Date(timeEndPayOrder);
      const newDate = new Date();
      if (converTimeEnd < newDate) {
        notify(
          "Error",
          `Đơn hàng ${storage.split(" ")[1]} đã được xóa vào lúc ${convertDateToVNDate(storage.split(" ")[3])} vì chưa thanh toán trước thời gian quy định`
        );
        localStorage.removeItem("payment");
      }
    }
  }, []);

  //---------------------------------------

  // ham chuyen ngay (createAt in db) sang format VN
  const convertDateToVNDate = (dateString) => {
    let vietnamDateTime = new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      //weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return vietnamDateTime;
  };

  const convertStringToOjectDate = useCallback((stringDate) => {
    // stringDate: YYYYMMDD
    const year = stringDate.slice(0, 4);
    const month = stringDate.slice(4, 6);
    const day = stringDate.slice(6, 8);

    return new Date(year, month - 1, day);
  }, []);

  //-----------------------flie FlightShowCalendar.js
  const [stateFlightShowCalendar, setStateFlightShowCalendar] = useState(false);

  // loading
  const [isLoading, setLoading] = useState(false);

  // state hien chat bot
  const [isShowChatbot, setShowChatbot] = useState(false);

  return (
    <CONTEXT.Provider
      value={{
        isShowChatbot,
        setShowChatbot,
        isLoading,
        setLoading,
        stateFlightShowCalendar,
        setStateFlightShowCalendar,
        handleReplacePriceAirport,
        convertStringToOjectDate,
        handleInvalid_AirportFrom_AirportTo,
        handleCheckAllInformationBeforeSearch,
        handleSearchFlight,
        handlePickDeparture_Return_Date,
        Departure_Return_Date,
        setDeparture_Return_Date,
        bayMotChieu,
        setBayMotChieu,
        handleEditQuantityPassenger,
        editQuantityPassenger,
        setEditQuantityPassenger,
        handleSwapPlaceAirport,
        handleChooseAirport,
        invalid_AirportFrom_AirportTo,
        setInvalid_AirportFrom_AirportTo,
        AirportsVN,
        AirportFrom,
        setAirportFrom,
        AirportTo,
        setAirportTo,
        handleInputAirport,
        choosePassenger,
        setChoosePassenger,
        handleShowAirports,
        showAirports,
        setShowAirports,
        funcPayloadToken,
        funcRefreshToken,
        isShowInterfaceLogin,
        setShowInterfaceLogin,
        convertDateToVNDate,
        naviReload,
        DontActionOpenDetailItem,
        hideDetailItemFlight,
        handleMake_a_Reservation,
        setHideDetailItemFlight,
        openAdjustQuantity,
        setOpenAdjustQuantity,
        isSubmitUpdate,
        setSubmitUpdate,
        setShowOptionSetting_LoginSuccess,
        isStateSaveRegister,
        setStateRegister,
        handleSetStateLogin_Logout,
        handleShowOptionSetting_LoginSuccess,
        isShowOptionSetting_LoginSuccess,
        isChonMuaClick,
        handleChonMuaClick,
      }}
    >
      {children}
    </CONTEXT.Provider>
  );
};
