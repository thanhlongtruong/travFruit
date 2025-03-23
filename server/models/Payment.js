const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  cbId: {
    type: String,
    required: true,
  },
  cbIdRe: {
    type: String,
    default: null
  },
  payUrl: {
    type: String,
    required: true,
  },
  typePay: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
