require("dotenv").config();
const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const router = express.Router();
const Flight = require("../models/Flight.js");
const { authorization } = require("../middleware/authorization");
const { mongoose } = require("mongoose");
const _ = require("lodash");
const rateLimit = require("express-rate-limit");
const Payment = require("../models/Payment.js");
const Ticket = require("../models/Ticket.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const isValidDateFormat = require("../service/checkFormatDate.js");
const { converCurrency } = require("../service/formatNumber.js");
const Create3MFlightVerification = require("../models/Create3MFlightVerification.js");
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

const flightRestrictions = {
  "Cần Thơ": ["Côn Đảo", "Buôn Ma Thuột", "Rạch Giá", "Cà Mau"],
  "Côn Đảo": ["Cần Thơ", "Huế", "Đà Nẵng", "Vinh"],
  "Buôn Ma Thuột": ["Côn Đảo", "Cà Mau", "Rạch Giá", "Hạ Long"],
  "Cà Mau": ["Côn Đảo", "Buôn Ma Thuột", "Quy Nhơn"],
  "Rạch Giá": ["Côn Đảo", "Buôn Ma Thuột"],
  "Hạ Long": ["Côn Đảo", "Buôn Ma Thuột"],
};

router.post("/create", authorization, checkAdmin, async (req, res) => {
  try {
    const {
      diemBay,
      diemDen,
      ngayBay,
      gioBay,
      ngayDen,
      gioDen,
      hangBay,
      loaiChuyenBay,
      soGhePhoThong,
      soGheThuongGia,
      gia,
    } = req.body;

    const errors = middleCheckFlight({
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
    });
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors: errors });
    }

    const flight = new Flight({
      diemBay,
      diemDen,
      ngayBay,
      gioBay,
      ngayDen,
      gioDen,
      hangBay,
      loaiChuyenBay,
      soGhePhoThong,
      soGheThuongGia,
      gia: converCurrency(gia),
    });

    await flight.save();

    return res.status(200).json({
      message: "Tạo chuyến bay thành công",
      flight,
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

const nodemailer = require("nodemailer");

//unique string
const { v4: uuidv4 } = require("uuid");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

//testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to send emails");
    console.log(success);
  }
});

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    return req.headers["authorization"] || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Bạn đã vượt quá giới hạn request. Vui lòng thử lại sau 24h.",
    });
  },
});

router.get(
  "/create/three-months/send-verify",
  authorization,
  checkAdmin,
  apiLimiter,
  async (req, res) => {
    const currentUrl = "https://travfruitv3admin.vercel.app";
    const uniqueString = uuidv4();

    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: "truongthanhlong15042004@gmail.com",
      subject: "Tạo chuyến bay 3 tháng",
      html: `<p>Nếu bạn muốn tạo chuyến bay cho 3 tháng mới thì nhấn vào link sau: <a href="${currentUrl}/home/chuyenbay/create3month?verify=${uniqueString}">HERE</a>. Đường dẫn này sẽ xóa tất cả chuyến bay trước đó và tạo các chuyến bay mới.Có thời hạn 5 phút</p>`,
    };

    const saltRounds = 10;
    try {
      const checkCreate3MFlightVerification =
        await Create3MFlightVerification.find({});
      if (checkCreate3MFlightVerification.length > 0) {
        return res.status(400).json({
          message: "Bạn đã gửi yêu cầu trước đó. Vui lòng kiểm tra email.",
        });
      }

      const hashUniqueString = await bcrypt.hash(uniqueString, saltRounds);
      const verification = new Create3MFlightVerification({
        uniqueString: hashUniqueString,
      });
      verification
        .save()
        .then(() => {
          transporter.sendMail(mailOption, (error, info) => {
            if (error) {
              return res.status(500).json({
                message: "Lỗi khi gửi email",
                error: {
                  name: error.name,
                  message: error.message || "Lỗi khi gửi email",
                  stack: error.stack,
                },
              });
            }
            return res.status(200).json({
              message: "Đã gửi email xác nhận. Vui lòng kiểm tra email",
              info,
            });
          });
        })
        .catch(() => {
          return res.status(500).json({
            message: "Lỗi khi lưu unique string",
            error: {
              name: error.name,
              message: error.message || "Lỗi khi lưu unique string",
              stack: error.stack,
            },
          });
        });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi khi hash email",
        error: {
          name: error.name,
          message: error.message || "Lỗi khi hash email",
          stack: error.stack,
        },
      });
    }
  }
);

router.get(
  "/create/three-months",
  authorization,
  checkAdmin,
  apiLimiter,
  async (req, res) => {
    try {
      // await Flight.deleteMany({});
      const { verify } = req.query;
      if (!verify) {
        return res.status(400).json({
          message: "Không tồn tại verify",
        });
      }
      const verification = await Create3MFlightVerification.findOne();
      if (!verification) {
        return res.status(400).json({
          message: "Verify không tồn tại hoặc đã hết hạn",
        });
      }
      const checkVerify = await bcrypt.compare(
        verify,
        verification.uniqueString
      );
      if (!checkVerify) {
        return res.status(400).json({
          message: "Verify không chính xác",
        });
      }
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
          const economySeats =
            Math.floor(Math.random() * (140 - 100 + 1)) + 100;
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

          // const ouboundFlightEntry = new Flight(outboundFlights);
          // await ouboundFlightEntry.save();
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

          // const returnFlightEntry = new Flight(returnFlight);
          // await returnFlightEntry.save();
        }
      }
      return res.status(200).json({
        message:
          "Tạo chuyến bay đi và chuyến bay khứ hồi cho 3 tháng thành công",
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
  }
);

router.get("/get_all", authorization, checkAdmin, async (req, res) => {
  try {
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

router.get("/search", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    const {
      departure,
      arrival,
      departureDate,
      oneWayTicket,
      returnDate,
      value,
      type,
    } = req.query;

    const decodedDeparture = decodeURIComponent(departure).split(" (")[0];
    const decodedArrival = decodeURIComponent(arrival).split(" (")[0];

    if (value && type) {
      if (type === "ngaybay") {
        const isValid = isValidDateFormat(value);
        if (!isValid) {
          return res
            .status(400)
            .json({ message: "Format không hợp lệ -> DD-MM-YYYY" });
        }
      }
      const flight = await Flight.aggregate([
        {
          $match:
            type === "_id"
              ? { _id: new mongoose.Types.ObjectId(value) }
              : { ngayBay: value },
        },

        {
          $group: {
            _id: "$loaiChuyenBay",
            flights: { $push: "$$ROOT" },
          },
        },
      ]);
      if (!flight.length) {
        return res.status(404).json({ message: "Không tìm thấy chuyến bay" });
      }

      return res.status(200).json({ flight });
    }

    const flightQueries = [
      Flight.find({
        diemBay: decodedDeparture,
        diemDen: decodedArrival,
        ngayBay: departureDate,
        loaiChuyenBay: "Chuyến bay đi",
      }),
    ];

    if (oneWayTicket === "false") {
      flightQueries.push(
        Flight.find({
          diemBay: decodedArrival,
          diemDen: decodedDeparture,
          ngayBay: returnDate,
          loaiChuyenBay: "Chuyến bay khứ hồi",
        })
      );
    }

    let [departureFlights, returnFlights = []] = await Promise.all(
      flightQueries
    );

    if (!departureFlights.length && !returnFlights.length) {
      return res.status(404).json({
        message: "Không tìm thấy chuyến bay nào",
        flights: { departureFlights, returnFlights },
      });
    }

    const departureFlights_id = departureFlights.map((flight) =>
      flight._id.toString()
    );

    const findPayments = await Payment.find({
      cbId: { $in: departureFlights_id },
    });

    const returnFlights_id =
      findPayments.length > 0
        ? findPayments.map((payment) => payment.cbIdRe)
        : [];

    const findPaymentsRe = await Payment.find({
      cbIdRe: { $in: returnFlights_id },
    });

    const findTickets = await Ticket.find({
      maChuyenBay: { $in: findPayments.map((payment) => payment.cbId) },
      maDon: { $in: findPayments.map((payment) => payment.orderId) },
    });

    const findTicketsRe =
      findPaymentsRe.length > 0
        ? await Ticket.find({
            maChuyenBay: { $in: findPayments.map((payment) => payment.cbIdRe) },
            maDon: { $in: findPaymentsRe.map((payment) => payment.orderId) },
          })
        : [];

    const countTicketDepar = findPayments.map((payment) => {
      return findTickets.filter(
        (ticket) =>
          ticket.hangVe === "Vé phổ thông" &&
          ticket.maChuyenBay === payment.cbId
      ).length;
    });

    const countTicketDeparBus = findPayments.map((payment) => {
      return findTickets.filter(
        (ticket) =>
          ticket.hangVe === "Vé thương gia" &&
          ticket.maChuyenBay === payment.cbId
      ).length;
    });

    const countTicketRe =
      findPaymentsRe.length > 0
        ? findPaymentsRe.map((payment) => {
            return findTicketsRe.filter(
              (ticket) =>
                ticket.hangVe === "Vé phổ thông" &&
                ticket.maChuyenBay === payment.cbIdRe
            ).length;
          })
        : [];

    const countTicketReBus =
      findPaymentsRe.length > 0
        ? findPaymentsRe.map((payment) => {
            return findTicketsRe.filter(
              (ticket) =>
                ticket.hangVe === "Vé thương gia" &&
                ticket.maChuyenBay === payment.cbIdRe
            ).length;
          })
        : [];

    const paymentExpiredDepar = findPayments.filter(
      (payment) =>
        new Date(payment.createdAt.getTime() + 15 * 60 * 1000) < new Date()
    );
    const paymentExpiredRe =
      findPaymentsRe.length > 0
        ? findPaymentsRe.filter(
            (payment) =>
              new Date(payment.createdAt.getTime() + 15 * 60 * 1000) <
              new Date()
          )
        : [];

    const paymentExpired_concat = paymentExpiredDepar.concat(paymentExpiredRe);

    if (paymentExpired_concat.length > 0) {
      await Promise.all([
        Ticket.deleteMany({
          maDon: {
            $in: paymentExpired_concat.map((payment) => payment.orderId),
          },
        }),
        Payment.deleteMany({
          orderId: {
            $in: paymentExpired_concat.map((payment) => payment.orderId),
          },
        }),
        Flight.bulkWrite(
          paymentExpiredDepar.map((p, i) => ({
            updateOne: {
              filter: { _id: new mongoose.Types.ObjectId(p.cbId) },
              update: {
                $inc: {
                  soGhePhoThong: countTicketDepar[i] || 0,
                  soGheThuongGia: countTicketDeparBus[i] || 0,
                },
              },
            },
          }))
        ),
        Flight.bulkWrite(
          paymentExpiredRe.map((p, i) => ({
            updateOne: {
              filter: { _id: new mongoose.Types.ObjectId(p.cbIdRe) },
              update: {
                $inc: {
                  soGhePhoThong: countTicketRe[i] || 0,
                  soGheThuongGia: countTicketReBus[i] || 0,
                },
              },
            },
          }))
        ),
      ]);

      departureFlights = await Flight.find({
        diemBay: decodedDeparture,
        diemDen: decodedArrival,
        ngayBay: departureDate,
        loaiChuyenBay: "Chuyến bay đi",
      });

      returnFlights =
        oneWayTicket === "false"
          ? await Flight.find({
              diemBay: decodedArrival,
              diemDen: decodedDeparture,
              ngayBay: returnDate,
              loaiChuyenBay: "Chuyến bay khứ hồi",
            })
          : [];
    }

    let payment = null;

    const checkPayment_user = await Payment.find({
      userId: _id,
    });

    let checkPayment_userStillValid = checkPayment_user.filter(
      (payment) =>
        new Date(payment.createdAt.getTime() + 15 * 60 * 1000) > new Date()
    );

    let checkPayment_userExpired = checkPayment_user.filter(
      (payment) =>
        new Date(payment.createdAt.getTime() + 15 * 60 * 1000) < new Date()
    );

    if (checkPayment_userStillValid.length > 0) {
      payment = `${
        checkPayment_user[0].orderId
      } ${checkPayment_user[0].createdAt.toISOString()}`;
    } else if (checkPayment_userExpired.length > 0) {
      payment = null;
    }
    return res.status(200).json({
      message: `Tìm thấy ${departureFlights.length} chuyến bay đi ${
        oneWayTicket === "false"
          ? `và ${returnFlights.length} chuyến bay khứ hồi`
          : ""
      }`,
      payment,
      flights: { departureFlights, returnFlights },
    });
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

const middleCheckFlight = ({
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
}) => {
  const regex = /^[0-9]+$/;

  const errors = [];

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
  if (typeof soGhePhoThong !== "number" || typeof soGheThuongGia !== "number") {
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

  return errors;
};

router.post("/update", authorization, checkAdmin, async (req, res) => {
  try {
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
    if (!flight) {
      return res.status(404).json({ message: "Không tìm thấy id chuyến bay" });
    }
    // Danh sách các lỗi
    const errors = middleCheckFlight({
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
    });

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
      { ...req.body, gia: converCurrency(gia) },
      { new: true }
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
