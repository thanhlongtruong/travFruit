const mongoose = require("mongoose");

require("dotenv").config();

function connectDB(uri) {
  mongoose.connect(uri);

  const conn = mongoose.connection;

  conn.on("connected", function () {
    console.log("Connect db success", this.name);
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
// const TravelDB = connectDB(process.env.MONGO_URI_TEST);

module.exports = { TravelDB };
