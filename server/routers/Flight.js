const express = require("express");
const router = express.Router();

const createFlightForThreeMonth = () => {
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

  const totalDays = 30;
  const outboundFlightsPerDay = 12;
  const returnFlightsPerDay = 11;

  for (let day = 0; day < totalDays; day++) {
    for (
      let outboundFlingtPerDay_ = 0;
      outboundFlingtPerDay_ < outboundFlightsPerDay;
      outboundFlingtPerDay_++
    ) {
        
    }
    for (
      let returnFlightsPerDay_ = 0;
      returnFlightsPerDay_ < returnFlightsPerDay;
      returnFlightsPerDay_++
    ) {}
  }
};

module.exports = router;
