const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const express = require("express");

const router = express.Router();

// APP INFO
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

router.post("/payment-zalopay", async (req, res) => {
  const embed_data = {
    redirecturl: "http://localhost:3001/",
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: 50000,
    description: `Lazada - Payment for the order #${transID}`,
      bank_code: "zalopayapp",
    callback_url: "localhost://4001/callack"
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  axios
    .post(config.endpoint, null, { params: order })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
});

router.post("/callback", async (req, res) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson["app_trans_id"]
        );

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
})

module.exports = router;