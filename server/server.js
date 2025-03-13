require("dotenv").config();
require("./service/connect-mult-mogoose.js");
const express = require("express");

const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const RouterAccount = require("./routers/Account.js");
const RouterTicket = require("./routers/RouterTicket.js");
const RouterFlight = require("./routers/RouterFlight.js");
const RouterBotHandleFlight = require("./routers/RouterBotHandleFlight.js");
const RouterDH = require("./routers/RouterOrder.js");
const RouterPayment = require("./routers/PayMomo.js");
const RouterZaloPay = require("./routers/ZaloPay.js");
const RouterVnpay = require("./routers/Vnpay.js");
const RouterScrape = require("./scrapers/routerScrapeFlight.js");
const cors = require("cors");
const { authorization } = require("./middleware/authorization.js");
const http = require("http");
const { CreateServer } = require("./Socket/connect-socket-client.js");
const { sessionMiddleware } = require("./service/sessionMiddleware.js");

const app = express();

// use Cookie
app.use(cookieParser());

/* Allow CORS
CORS sẽ cho phép nhận cookie từ request*/
const allowedOrigins = [
  "https://travfruit.netlify.app/",
  "https://travfruit.netlify.app",
  "https://travfruit.vercel.app/",
  "https://travfruit.vercel.app",
  "https://travfruitadmin.vercel.app/",
  "https://travfruitadmin.vercel.app",
  "https://travfruitadmin.netlify.app/",
  "https://travfruitadmin.netlify.app",
  "http://localhost:3000/",
  "http://localhost:3000",
  "http://localhost:5173/",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(sessionMiddleware);

app.use(helmet());
app.use(express.json());

app.use(RouterScrape);
app.use(RouterPayment);
app.use(RouterZaloPay);
app.use(RouterVnpay);
app.use("/flights", RouterFlight);
app.use("/bot/flights", RouterBotHandleFlight);
app.use("/user", RouterAccount);
app.use(authorization, RouterTicket);
app.use("/order", authorization, RouterDH);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

const server = http.createServer(app);
CreateServer(server, allowedOrigins);

server.listen(process.env.PORT, () => {
  console.log("Listening port 4001");
});
