require("dotenv").config();
const express = require("express");
const _ = require("lodash");
const ms = require("ms");
const User = require("../models/User");
const DonHang = require("../models/DonHang");
const { mongoose } = require("mongoose");
const { hashPass, comparePass } = require("../service/hashpass");
const { checkBody, arrayError } = require("../service/checkBodyRegister");
const { generateToken, verifyToken } = require("../service/authJWT");
const { authMiddleware } = require("../service/authMiddlleware");
const { sendNotification } = require("../Socket/connect-socket-client");

const router = express.Router();

router.post("/register", checkBody("register"), async (req, res) => {
  try {
    if (!arrayError(req, res).isEmpty()) {
      return res.status(400).send(arrayError(req, res).array());
    }
    const { numberPhone, fullName, gender, birthday, password } = req.body;
    const existedNumberPhone = await User.findOne({ numberPhone });
    if (existedNumberPhone) {
      res.status(409).send("This number phone invalid");
    } else {
      const newPass = await hashPass(password);

      await User.create({
        numberPhone,
        fullName,
        gender,
        birthday,
        password: newPass,
      });

      return res.status(200).json({ message: "Register Success" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/update",
  authMiddleware,
  checkBody("update"),
  async (req, res) => {
    try {
      if (!arrayError(req, res).isEmpty()) {
        return res.status(400).send(arrayError(req, res).array());
      }

      const accessTokenDecoded = req.jwtDecoded;
      const _id = accessTokenDecoded._id;

      const oldUser = await User.findById(_id);

      if (!oldUser) {
        return res.status(404).json({ message: "Id User not found" });
      }

      const { numberPhone, fullName, gender, birthday, password, newPassword } =
        req.body;

      const userBody = {
        numberPhone: numberPhone,
        fullName: fullName,
        gender: gender,
        birthday: birthday,
      };

      const userCurrent = {
        numberPhone: oldUser.numberPhone,
        fullName: oldUser.fullName,
        gender: oldUser.gender,
        birthday: oldUser.birthday,
      };

      const areEqual = _.isEqual(userBody, userCurrent);
      if (areEqual && !password && newPassword === "false") {
        return res.status(200).json({ message: "Update_NotChange Success" });
      }

      if (req.body.numberPhone) {
        const existedNumberPhone = await User.findOne({
          numberPhone: req.body.numberPhone,
          _id: { $ne: _id }, // Trừ _id hiện tại
        });
        if (existedNumberPhone) {
          return res.status(409).json({ message: "This phone already exists" });
        }
      }

      let passNewHash;
      if (password && newPassword !== "false") {
        const checkPass = await comparePass(password, oldUser.password);
        if (!checkPass) {
          return res.status(400).json({ message: "Old password Fail" });
        }
        passNewHash = await hashPass(newPassword);
      }

      const newUser = await User.findOneAndUpdate(
        { _id: _id },
        {
          numberPhone,
          fullName,
          gender,
          birthday,
          password: passNewHash || oldUser.password,
        }
      );

      if (!newUser) {
        return res.status(409).josn({ message: "Update Fail" });
      }

      return res.status(200).json({
        message: "success",
        data: {
          numberPhone: newUser.numberPhone,
          fullName: newUser.fullName,
          gender: newUser.gender,
          birthday: newUser.birthday,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/get_all", authMiddleware, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (_id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get", authMiddleware, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send(`Not found user`);
    }

    const user = await User.findById(_id);
    const resUser = {
      numberPhone: user.numberPhone,
      fullName: user.fullName,
      gender: user.gender,
      birthday: user.birthday,
    };

    return res.status(200).json(resUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/auth-login",async (req, res) => {
  try {
    const { numberPhone, password } = req.body;

    const user = await User.findOne({ numberPhone: numberPhone });
    if (!user) {
      return res.status(404).json({ message: "Number not found" });
    }
    if (user.status === "Tài khoản đã bị khóa") {
      return res.status(403).json({ message: "locked" });
    }
    const checkPass = await comparePass(password, user.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Password invalid" });
    }

    const payloadToken = {
      _id: user._id,
    };

    const accessToken = await generateToken(
      payloadToken,
      process.env.JWT_SECRET,
      "1h"
    );
    const refreshToken = await generateToken(
      payloadToken,
      process.env.REFRESH_TOKEN,
      "7d"
    );

    /*
    Xử lý trường hợp trả về http only cookie cho phía trình duyệt
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge - thời gian sống của cookie
    thời gian sống của cookie khác với thời gian sống của token
*/
    res.cookie("AcT", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: ms("7d"),
      path: "/",
    });
    res.cookie("RfT", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: ms("7d"),
      path: "/",
    });

    /*Nếu dùng cookie lưu token thì không cần lưu ở localStorage và ngược lại */
    // Return payload and tokens cho frontend và lưu vào localStorage
    res.status(200).json({
      payloadToken,
      accessToken,
      refreshToken,
    });

    // Gửi thông báo cho client
    sendNotification(numberPhone, message);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/get_reservation-flights", authMiddleware, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send(`Not found user`);
    }

    const page_size = 2;
    let page = req.query.page || 1;
    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    page = parseInt(page);
    let start = (page - 1) * page_size;

    const orders = await DonHang.aggregate([
      { $match: { userId: _id } },
      {
        $lookup: {
          from: "tickets",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [{ $match: { $expr: { $eq: ["$maDon", "$$orderId"] } } }],
          as: "tickets",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: start },
      { $limit: page_size },
    ]);

    const totalOrder = await DonHang.countDocuments({ userId: _id });

    return res.status(200).json({
      totalOrder: Math.ceil(totalOrder / page_size),
      orders: orders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", err: error });
  }
});

router.put("/refresh-token", async (req, res) => {
  try {
    //Cách 1: Cookie
    const refreshTokenFromCookie = req.cookies?.RfT;
    //Cách 2: localStorage
    // const refreshTokenFromLocalStorage = req.body?.refreshToken;
    // verify
    const refreshTokenDecoded = await verifyToken({
      token: refreshTokenFromCookie,
      secretSignature: process.env.REFRESH_TOKEN,
    });

    // middleware đã lưu thông tin user vào req.jwtDecoded
    const payload = {
      _id: refreshTokenDecoded._id,
    };

    // Tạo mới accessToken
    const accessToken = await generateToken(
      (payloadToken = payload),
      (key = process.env.JWT_SECRET),
      (exp = "1h")
    );

    // Res lại cookie accessToken mới cho cookie
    res.cookie("AcT", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: ms("7d"),
      path: "/",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/logout", (req, res) => {
  try {
    res.clearCookie("AcT", {
      path: "/",
      sameSite: "None",
      secure: true, // Đảm bảo rằng bạn đặt thuộc tính Secure
    });
    res.clearCookie("RfT", {
      path: "/",
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(200);
    return;
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
