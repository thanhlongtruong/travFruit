const axios = require("axios");
const express = require("express");
const crypto = require("crypto");

var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var partnerCode = "MOMO";
const router = express.Router();
//
router.post("/payment-momo", async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  const { amount, orderId } = req.body;

  var orderInfo = "pay with MoMo";
  // var redirectUrl = "https://vercel-travrelhome.vercel.app";
  var redirectUrl = "https://travfruit.vercel.app/";
  var ipnUrl = "https://travrel-server.vercel.app/callback";
  var requestType = "payWithMethod";

  var extraData = "";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    orderId +
    "&requestType=" +
    requestType;
  //puts raw signature

  //signature
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    requestId: orderId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  //Create the axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    if (!result.data) {
      return res.status(400).json({ message: "Error when call MoMo" });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Error when call MoMo", err });
  }
});

router.post("/callback", async (req, res) => {
  return res.status(200).json(req.body);
});

router.get("/transaction-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  let result = await axios(options);
  return res.status(200).json(result.data);
});

module.exports = router;
