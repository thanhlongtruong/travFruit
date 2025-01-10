require("dotenv").config();
const { verifyToken } = require("./authJWT");

// Xác thực token từ phía client
const authMiddleware = async (req, res, next) => {
  // Cách 1: Lấy token trong request cookie phía client - withCredentials: true
  const accessToken = req.cookies?.AcT;
  
  if (!accessToken) {
    return res.status(401).json({ message: "Authorization::" });
  }

  //   Cách 2: Lấy token trong trường hợp phía FE lưu localStorage và gửi lên thông qua header authorization
  //   const accessTokenFrHeader = req.headers["authorization"];

//   if (!accessTokenFrHeader || !accessTokenFrHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "authorization" });
//   }

  try {
    //B1: Giải mã token Cách 1
    // const accessTokenDecoded = await verifyToken({
    //   accessToken,
    //   secretSignature: process.env.JWT_SECRET,
    // });
    //B1: Giải mã token Cách 2

    // const token = accessTokenFrHeader.substring(7);
    // console.log(accessTokenFrHeader, token);
    const accessTokenDecoded = await verifyToken({
      token: accessToken,
      secretSignature: process.env.JWT_SECRET,
    });
    //B2: Lưu thông tin user vào req.jwtDecoded
    req.jwtDecoded = accessTokenDecoded;
    //B3: Tiếp tục chạy middleware tiếp theo
    next();
  } catch (error) {
    // Token hết hạn
    // console.log(error.message);
    if (
      error.message?.includes("jwt expired") ||
      error.message?.includes("TokenExpiredError")
    ) {
      return res.status(410).json({ message: "TokenExpiredError" });
    }
    // Token không hợp lệ
    return res.status(401).json({ message: "TokenInvalid" });
  }
};

module.exports = { authMiddleware };
