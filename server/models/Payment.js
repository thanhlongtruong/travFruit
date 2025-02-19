const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  payUrl: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

PaymentSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Payment", PaymentSchema);
