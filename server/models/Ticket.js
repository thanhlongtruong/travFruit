const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema(
  {
    Ten: {
      type: String,
      required: true,
    },
    ngaySinh: {
      type: String,
      required: true,
    },
    ageType: {
      type: String,
      required: true,
    },
    hangVe: {
      type: String,
    },
    giaVe: {
      type: String,
      required: true,
    },
    maDon: {
      type: String,
      required: true,
    },
    hangBay: {
      type: String,
      required: true,
    },
    loaiChuyenBay: {
      type: String,
      required: true,
    },
    diemBay: {
      type: String,
      required: true,
    },
    diemDen: {
      type: String,
      required: true,
    },
    gioBay: {
      type: String,
      required: true,
    },
    ngayBay: {
      type: String,
      required: true,
    },
    gioDen: {
      type: String,
      required: true,
    },
    trangThaiVe: {
      type: String,
      required: true,
      default: "Đang chờ thanh toán",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ticket", TicketSchema);
