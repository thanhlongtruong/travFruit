const mongoose = require("mongoose");

const FlightSchema = mongoose.Schema({
  loaiChuyenBay: {
    type: String,
    required: true,
  },
  diemBay: {
    type: Number,
    required: true,
  },
  diemDen: {
    type: String,
    required: true,
  },
  gioBay: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  ngayBay: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  hangBay: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  soGhePhoThong: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  soGheThuongGia: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  gia: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  trangThaiChuyenBay: {
    type: String,
    default: "Đang chờ thanh toán",
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

// TTL (Time to Life) index tự động xóa đơn hàng sau 1 giờ
DonHangSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Flight", DonHangSchema);
