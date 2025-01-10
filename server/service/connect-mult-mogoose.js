const mongoose = require("mongoose");
const DonHang = require("../models/DonHang.js");
const handleDelTickets_UpdateFlight = require("./delTickets_UpdateFlight.js");

require("dotenv").config();

function connectDB(uri) {
  mongoose.connect(uri);

  const conn = mongoose.connection;

  conn.on("connected", function () {
    console.log("Connect db success", this.name);
    const watchDonHang = DonHang.watch();
    watchDonHang.on("change", async (change) => {
      if (change.operationType === "delete") {
        const deletedOrderId = change.documentKey._id;

        const handlDel = await handleDelTickets_UpdateFlight(deletedOrderId);
        if (!handlDel.status) {
          return console.log(handlDel.message);
        }
        return console.log(handlDel.message);
      }
    });

    watchDonHang.on("error", (error) => {
      console.error("ChangeStream error:", error);
      // Logic để tự động kết nối lại
      setTimeout(() => connectDB(uri), 5000); // Thử kết nối lại sau 5 giây
    });
  });

  conn.on("disconnected", function () {
    console.log("Disconnect db success", this.name);
    setTimeout(() => connectDB(uri), 5000);
  });

  conn.on("error", (err) => {
    console.log("Connect db fail", err);
    if (err.code === "ECONNRESET") {
      console.log("Connection reset by peer, retrying...");
      setTimeout(() => connectDB(uri), 5000);
    } else {
      setTimeout(() => connectDB(uri), 5000);
    }
  });

  process.on("SIGINT", async () => {
    await conn.close();
    process.exit(0);
  });

  return conn;
}

const TravelDB = connectDB(process.env.MONGO_URI);

module.exports = { TravelDB };
