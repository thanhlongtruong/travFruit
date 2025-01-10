const mongoose = require("mongoose");
const { OrderProvider } = require("../../client/src/Context/ContextGlobal");

const PaymentPersionalSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        OrderId: {
            type: String,
            required: true,
        },
        
    }
);

// PaymentPersionalSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model(
  "PaymentPersionalSchema",
  PaymentPersionalSchema
);
