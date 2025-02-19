const express = require("express");
const moment = require("moment");
const router = express.Router();
const Flight = require("../models/Flight.js");
const { route } = require("./Account.js");
const { authorization } = require("../middleware/authorization");
const { mongoose } = require("mongoose");
const _ = require("lodash");

const AirportVN = [
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
];

const Airline = [
  "VietJet",
  "VNA",
  "Pacific Airlines",
  "BamBoo",
  "Vietravel Airlines",
];
const loaiCB = ["Chuyến bay đi", "Chuyến bay khứ hồi"];

router.get("/create/three-months", async (req, res) => {
  try {
    await Flight.deleteMany({});

    const flightRestrictions = {
      "Cần Thơ": ["Côn Đảo", "Buôn Ma Thuột", "Rạch Giá", "Cà Mau"],
      "Côn Đảo": ["Cần Thơ", "Huế", "Đà Nẵng", "Vinh"],
      "Buôn Ma Thuột": ["Côn Đảo", "Cà Mau", "Rạch Giá", "Hạ Long"],
      "Cà Mau": ["Côn Đảo", "Buôn Ma Thuột", "Quy Nhơn"],
      "Rạch Giá": ["Côn Đảo", "Buôn Ma Thuột"],
      "Hạ Long": ["Côn Đảo", "Buôn Ma Thuột"],
    };

    const currentDate = moment().add(1, "days");

    const totalSeats = 170;
    const totalDays = 90;
    const flingtPerDay = 7;

    for (let day = 0; day < totalDays; day++) {
      for (
        let flingtPerDay_ = 0;
        flingtPerDay_ < flingtPerDay;
        flingtPerDay_++
      ) {
        const economySeats = Math.floor(Math.random() * (140 - 100 + 1)) + 100;
        const businessSeats = totalSeats - economySeats;

        let airlineIndex = Math.floor(Math.random() * Airline.length);
        let departureCityIndex = Math.floor(Math.random() * AirportVN.length);
        let arrivalCityIndex;

        do {
          arrivalCityIndex = Math.floor(Math.random() * AirportVN.length);
        } while (
          arrivalCityIndex === departureCityIndex ||
          flightRestrictions[AirportVN[departureCityIndex].city]?.includes(
            AirportVN[arrivalCityIndex].city
          )
        );

        const outboundFlightsTime = moment(currentDate).add(day, "days");

        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);

        outboundFlightsTime.hours(randomHour);
        outboundFlightsTime.minutes(randomMinute);

        const date = outboundFlightsTime.format("DD-MM-YYYY");
        const time = outboundFlightsTime.format("HH:mm");

        const flightDurationHours = Math.floor(Math.random() * 3) + 1;
        const flightDurationMinutes = Math.floor(Math.random() * 60);

        const arrivalTime = moment(outboundFlightsTime)
          .add(flightDurationHours, "hours")
          .add(flightDurationMinutes, "minutes");

        const arrivalDate = arrivalTime.format("DD-MM-YYYY");
        const arrivalHour = arrivalTime.format("HH:mm");

        const arrivalDay = arrivalTime.isBefore(outboundFlightsTime)
          ? moment(arrivalTime).add(1, "days").format("DD-MM-YYYY")
          : arrivalDate;

        const outboundFlights = {
          loaiChuyenBay: "Chuyến bay đi",
          diemBay: AirportVN[departureCityIndex].city,
          diemDen: AirportVN[arrivalCityIndex].city,
          ngayBay: date,
          gioBay: time,
          gioDen: arrivalHour,
          ngayDen: arrivalDay,
          hangBay: Airline[airlineIndex],
          soGhePhoThong: economySeats,
          soGheThuongGia: businessSeats,
          gia:
            (
              Math.floor(Math.random() * (7000000 - 700000 + 1)) + 700000
            ).toLocaleString("vi-VN") + " VND",
          trangThaiChuyenBay: "Đang hoạt động",
        };

        const ouboundFlightEntry = new Flight(outboundFlights);
        await ouboundFlightEntry.save();
        //==========================================================

        const economySeats_returnFlight =
          Math.floor(Math.random() * (140 - 100 + 1)) + 100;
        const businessSeats_returnFlight = totalSeats - economySeats;
        let airlineIndex_returnFlight = Math.floor(
          Math.random() * Airline.length
        );

        const returnFlightsTime = moment(outboundFlightsTime).add(
          Math.floor(Math.random() * 5) + 2,
          "days"
        );
        const returnRandomHour = Math.floor(Math.random() * 24);
        const returnRandomMinute = Math.floor(Math.random() * 60);

        returnFlightsTime.hours(returnRandomHour);
        returnFlightsTime.minutes(returnRandomMinute);

        const returnDate = returnFlightsTime.format("DD-MM-YYYY");
        const returnTime = returnFlightsTime.format("HH:mm");

        const returnFlightDurationHours = Math.floor(Math.random() * 3) + 1;
        const returnFlightDurationMinutes = Math.floor(Math.random() * 60);

        const returnArrivalTime = moment(returnFlightsTime)
          .add(returnFlightDurationHours, "hours")
          .add(returnFlightDurationMinutes, "minutes");

        const returnArrivalDate = returnArrivalTime.format("DD-MM-YYYY");
        const returnArrivalHour = returnArrivalTime.format("HH:mm");

        const formattedReturnArrivalDate = moment(
          returnArrivalDate,
          "DD-MM-YYYY"
        );

       const returnArrivalDay = returnArrivalTime.isBefore(
         formattedReturnArrivalDate
       )
         ? returnArrivalTime.add(1, "days").format("DD-MM-YYYY")
         : returnArrivalDate;

        const returnFlight = {
          loaiChuyenBay: "Chuyến bay khứ hồi",
          diemBay: AirportVN[arrivalCityIndex].city,
          diemDen: AirportVN[departureCityIndex].city,
          ngayBay: returnDate,
          gioBay: returnTime,
          gioDen: returnArrivalHour,
          ngayDen: returnArrivalDay,
          hangBay: Airline[airlineIndex_returnFlight],
          soGhePhoThong: economySeats_returnFlight,
          soGheThuongGia: businessSeats_returnFlight,
          gia:
            (
              Math.floor(Math.random() * (7000000 - 700000 + 1)) + 700000
            ).toLocaleString("vi-VN") + " VND",
          trangThaiChuyenBay: "Đang hoạt động",
        };

        const returnFlightEntry = new Flight(returnFlight);
        await returnFlightEntry.save();
      }
    }
    return res.status(200).json({
      message: "Tạo chuyến bay đi và chuyến bay khứ hồi cho 3 tháng thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tạo chuyến bay",
        stack: error.stack,
      },
    });
  }
});

router.get("/get_all", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (_id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const page_size = 7;
    let page = req.query.page || 1;
    if (isNaN(page) || page <= 0) {
      page = 1;
    }
    page = parseInt(page);
    let start = (page - 1) * page_size;

    const { type } = req.query;
    const matchCondition = {};
    if (
      type?.trim().toLowerCase() === "chuyến bay đi" ||
      type?.trim().toLowerCase() === "chuyến bay khứ hồi"
    ) {
      matchCondition.loaiChuyenBay =
        type?.trim().toLowerCase() === "chuyến bay đi"
          ? "Chuyến bay đi"
          : "Chuyến bay khứ hồi";
    }
    const getFlights = async (loaiChuyenBay) => {
      return await Flight.aggregate([
        { $match: { loaiChuyenBay, ...matchCondition } },
        { $skip: start },
        { $limit: 7 },
        {
          $group: {
            _id: "$loaiChuyenBay",
            flights: { $push: "$$ROOT" },
          },
        },
      ]);
    };
    let flights = matchCondition?.loaiChuyenBay
      ? await getFlights(matchCondition.loaiChuyenBay)
      : [
          ...(await getFlights("Chuyến bay đi")),
          ...(await getFlights("Chuyến bay khứ hồi")),
        ];

    const countFlight = await Flight.countDocuments(matchCondition);

    if (flights.length <= 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chuyến bay nào", flights });
    }
    return res.status(200).json({
      message: "Tìm chuyến bay thành công",
      page: page,
      totalPage: Math.ceil(countFlight / (page_size * 2)),
      flights: flights,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xem chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi xem chuyến bay",
        stack: error.stack,
      },
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const {
      departure,
      arrival,
      departureDate,
      oneWayTicket,
      returnDate,
      passengers,
      id,
    } = req.query;

    const decodedDeparture = decodeURIComponent(departure).split(" (")[0];
    const decodedArrival = decodeURIComponent(arrival).split(" (")[0];

    let departureFlights = [];
    let returnFlights = [];
    if (oneWayTicket === "true") {
      departureFlights = await Flight.find({
        diemBay: decodedDeparture,
        diemDen: decodedArrival,
        ngayBay: departureDate,
        loaiChuyenBay: "Chuyến bay đi",
      });
    }
    if (oneWayTicket === "false") {
      departureFlights = await Flight.find({
        diemBay: decodedDeparture,
        diemDen: decodedArrival,
        ngayBay: departureDate,
        loaiChuyenBay: "Chuyến bay đi",
      });

      returnFlights = await Flight.find({
        diemBay: decodedArrival,
        diemDen: decodedDeparture,
        ngayBay: returnDate,
        loaiChuyenBay: "Chuyến bay khứ hồi",
      });
    }

    if (id) {
      const flight = await Flight.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },

        {
          $group: {
            _id: "$loaiChuyenBay",
            flights: { $push: "$$ROOT" },
          },
        },
      ]);

      return res.status(200).json({ flight });
    }

    const flights = {
      departureFlights,
      returnFlights,
    };

    if (departureFlights.length <= 0 && returnFlights.length <= 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chuyến bay nào", flights });
    }

    res.status(200).json({
      message: `Tìm thấy ${departureFlights.length} chuyến bay đi ${
        oneWayTicket === "false"
          ? `và ${returnFlights.length} chuyến bay khứ hồi`
          : ""
      }`,
      flights,
    });
    return;
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tìm chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi xem chuyến bay",
        stack: error.stack,
      },
    });
  }
});

router.get("/show/calendar", async (req, res) => {
  try {
    const { date } = req.query;

    const [month, year] = date.split("/").map(Number);

    const startDate = moment()
      .year(year)
      .month(month - 1)
      .startOf("month")
      .format("DD-MM-YYYY");
    const endDate = moment()
      .year(year)
      .month(month)
      .startOf("month")
      .format("DD-MM-YYYY");

    const flights = await Flight.aggregate([
      { $sort: { loaiChuyenBay: -1 } },
      {
        $project: {
          _id: 1,
          ngayBay: 1,
          diemBay: 1,
          diemDen: 1,
          loaiChuyenBay: 1,
        },
      },
    ]);

    const filteredFlights = flights.filter((flight) => {
      const ngayBay = moment(flight.ngayBay, "DD-MM-YYYY");
      return ngayBay.isBetween(
        moment(startDate, "DD-MM-YYYY"),
        moment(endDate, "DD-MM-YYYY"),
        null,
        "[]"
      );
    });

    return res.status(200).json({
      message: "Tìm chuyến bay thành công",
      totalFlight: filteredFlights.length,
      flights: filteredFlights,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xem chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi xem chuyến bay",
        stack: error.stack,
      },
    });
  }
});

router.post("/update", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    if (accessTokenDecoded._id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const converCurrency = (amout) => {
      return amout.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    const regex = /^[0-9]+$/;

    const {
      id,
      diemBay,
      diemDen,
      ngayBay,
      gioBay,
      ngayDen,
      gioDen,
      hangBay,
      loaiChuyenBay,
      gia,
      soGhePhoThong,
      soGheThuongGia,
    } = req.body;

    const flight = await Flight.findById(id);
    // Danh sách các lỗi
    const errors = [];
    if (!flight) {
      errors.push("Không tìm thấy id chuyến bay");
    }
    if (!AirportVN.some((airport) => airport.city === diemBay)) {
      errors.push(
        `Điểm bay không hợp lệ, điểm bay hợp lệ : ${AirportVN.map(
          (airport) => airport.city
        )}`
      );
    }
    if (!AirportVN.some((airport) => airport.city === diemDen)) {
      errors.push(
        `Điểm đến không hợp lệ, điểm đến hợp lệ : ${AirportVN.map(
          (airport) => airport.city
        )}`
      );
    }
    if (diemDen === diemBay) {
      errors.push(`Điểm đến không được trùng với điểm bay.`);
    }
    if (!moment(ngayBay, "DD-MM-YYYY", true).isValid()) {
      errors.push("Ngày bay không hợp lệ, format: DD-MM-YYYY.");
    }
    if (!moment(ngayDen, "DD-MM-YYYY", true).isValid()) {
      errors.push("Ngày đến không hợp lệ, format: DD-MM-YYYY.");
    }
    if (!moment(gioBay, "HH:mm", true).isValid()) {
      errors.push("Giờ bay không hợp lệ, format: HH:mm.");
    }
    if (!moment(gioDen, "HH:mm", true).isValid()) {
      errors.push("Giờ đến không hợp lệ, format: HH:mm.");
    }
    if (!Airline.includes(hangBay)) {
      errors.push(
        "Hãng bay không hợp lệ, bao gồm các hãng: VietJet, VNA, Pacific Airlines, BamBoo, Vietravel Airlines."
      );
    }
    if (!loaiCB.includes(loaiChuyenBay.trim())) {
      errors.push(
        "Loại chuyến bay không hợp lệ, bao gồm: Chuyến bay đi hoặc Chuyến bay khứ hồi."
      );
    }
    if (!regex.test(gia.trim())) {
      errors.push(
        "Giá chuyến bay không hợp lệ, giá chỉ nhập số tương ứng với giá tiền."
      );
    }
    if (
      typeof soGhePhoThong !== "number" ||
      typeof soGheThuongGia !== "number"
    ) {
      errors.push(
        "Kiểu dữ liệu của số ghế phổ thông và số ghế thuong gia phải là 'number'."
      );
    }
    if (
      soGhePhoThong < 100 ||
      soGhePhoThong > 140 ||
      soGhePhoThong + soGheThuongGia !== 170
    ) {
      errors.push(
        "Số ghế phổ thông không hợp lệ, Số ghế phổ thông >= 100 và <= 140 và tổng số ghế phổ thông và số ghế thương gia phải = 170."
      );
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors: errors });
    }

    const dataBody = {
      diemBay: diemBay,
      diemDen: diemDen,
      ngayBay: ngayBay,
      gioBay: gioBay,
      ngayDen: ngayDen,
      gioDen: gioDen,
      hangBay: hangBay,
      loaiChuyenBay: loaiChuyenBay,
      gia: gia,
      soGhePhoThong: soGhePhoThong,
      soGheThuongGia: soGheThuongGia,
    };

    const flightCurrent = {
      diemBay: flight.diemBay,
      diemDen: flight.diemDen,
      ngayBay: flight.ngayBay,
      gioBay: flight.gioBay,
      ngayDen: flight.ngayDen,
      gioDen: flight.gioDen,
      hangBay: flight.hangBay,
      loaiChuyenBay: flight.loaiChuyenBay,
      gia: flight.gia?.replace(/\./g, "").replace(" VND", ""),
      soGhePhoThong: flight.soGhePhoThong,
      soGheThuongGia: flight.soGheThuongGia,
    };

    const isEqual = _.isEqual(dataBody, flightCurrent);
    if (isEqual) {
      return res.status(200).json({
        message: "Thông tin chuyến bay không thay đổi gì",
        flight: flight,
      });
    }

    const newFlight = await Flight.findOneAndUpdate(
      { _id: id },
      { ...req.body, gia: converCurrency(gia) }
    );

    return res
      .status(200)
      .json({ message: "Update chuyến bay thành công", flight: newFlight });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi update chuyến bay",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi update chuyến bay",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
