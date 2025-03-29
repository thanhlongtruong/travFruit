// require("dotenv").config();
// const nodemailer = require("nodemailer");

// //unique string
// const { v4: uuidv4 } = require("uuid");

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_EMAIL_PASSWORD,
//   },
// });

// //testing success
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to send emails");
//     console.log(success);
//   }
// });
