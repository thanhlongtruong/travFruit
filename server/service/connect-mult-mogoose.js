const mongoose = require("mongoose");

require("dotenv").config();

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, options);

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
      } else if (err.code === "ETIMEDOUT") {
        console.log("Connection timed out, retrying...");
      } else if (err.code === "ECONNREFUSED") {
        console.log("Connection refused, retrying...");
      }
      setTimeout(() => connectDB(uri), 5000);
    });

    process.on("SIGINT", async () => {
      try {
        await conn.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB disconnection:", err);
        process.exit(1);
      }
    });

    return conn;
  } catch (err) {
    console.error("Initial connection error:", err);
    setTimeout(() => connectDB(uri), 5000);
  }
}

const TravelDB = connectDB(process.env.MONGO_URI);
// const TravelDB = connectDB(process.env.MONGO_URI_TEST);

module.exports = { TravelDB };
