const express = require("express");
const DonHang = require("../models/DonHang.js");
const Ticket = require("../models/Ticket.js");
const Account = require("../models/User.js");
const Payment = require("../models/Payment.js");
const Flight = require("../models/Flight.js");
const { mongoose } = require("mongoose");

const router = express.Router();

// router create order, ticker and update flight
router.post("/create", async (req, res) => {
  const accessTokenDecoded = req.jwtDecoded;
  const _id = accessTokenDecoded._id;
  const {
    airportDeparture,
    airportReturn,
    totalQuantityTickets,
    totalPriceTickets,
    soGhePhoThongDeparture,
    soGheThuongGiaDeparture,
    soGhePhoThongReturn,
    soGheThuongGiaReturn,
    email,
  } = req.body;
  console.log(email);

  const now = new Date();
  const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

  let createOrder, createPayment, createTickets, createTicketsReturn;
  let updateFlight, updateFlightReturn;

  try {
    // 1️⃣ Tạo đơn hàng trước
    createOrder = await DonHang.create({
      userId: _id,
      soLuongVe: totalQuantityTickets,
      tongGia: totalPriceTickets,
      email,
      expiredAt: fifteenMinutesLater,
    });

    createPayment = await Payment.create({
      orderId: createOrder._id,
      userId: _id,
      cbId: airportDeparture[0]?.maChuyenBay,
      cbIdRe: airportReturn[0]?.maChuyenBay || null,
      payUrl: "NO payURL",
    });

    [createTickets, createTicketsReturn] = await Promise.all([
      Ticket.insertMany(
        airportDeparture.map((ticket) => ({
          ...ticket,
          maDon: createOrder._id,
        }))
      ),
      Ticket.insertMany(
        airportReturn.map((ticket) => ({
          ...ticket,
          maDon: createOrder._id,
        }))
      ),
    ]);

    const flightBeforeUpdate = await Flight.findById({
      _id: new mongoose.Types.ObjectId(createTickets[0]?.maChuyenBay),
    });
    const flightBeforeUpdateReturn =
      createTicketsReturn.length > 0
        ? await Flight.findById({
            _id: new mongoose.Types.ObjectId(
              createTicketsReturn[0]?.maChuyenBay
            ),
          })
        : null;

    updateFlight = await Flight.findByIdAndUpdate(
      createTickets[0]?.maChuyenBay,
      {
        $inc: {
          soGhePhoThong: -soGhePhoThongDeparture,
          soGheThuongGia: -soGheThuongGiaDeparture,
        },
      },
      { new: true }
    );

    if (
      (updateFlight && updateFlight?.soGhePhoThong < 0) ||
      updateFlight?.soGheThuongGia < 0
    ) {
      throw new Error(
        `Không đủ ghế chuyến bay đi, số ghế thường còn lại ${flightBeforeUpdate?.soGhePhoThong} và số ghế thương gia còn lại ${flightBeforeUpdate?.soGheThuongGia}`
      );
    }

    updateFlightReturn =
      createTicketsReturn.length > 0
        ? await Flight.findByIdAndUpdate(
            createTicketsReturn[0]?.maChuyenBay,
            {
              $inc: {
                soGhePhoThong: -soGhePhoThongReturn,
                soGheThuongGia: -soGheThuongGiaReturn,
              },
            },
            { new: true }
          )
        : null;

    if (
      (updateFlightReturn && updateFlightReturn?.soGhePhoThong < 0) ||
      updateFlightReturn?.soGheThuongGia < 0
    ) {
      throw new Error(
        `Không đủ ghế chuyến bay khứ hồi, số ghế thường còn lại ${flightBeforeUpdateReturn?.soGhePhoThong} và số ghế thương gia còn lại ${flightBeforeUpdateReturn?.soGheThuongGia}`
      );
    }

    return res.status(200).json({
      idDH: createOrder._id,
      priceOrder: totalPriceTickets,
      createAt: createOrder.createdAt,
      expiredAt: fifteenMinutesLater,
      dataTickets: [...createTickets, ...createTicketsReturn],
    });
  } catch (error) {
    await rollbackCreateOrder(
      createOrder?._id,
      createPayment?._id,
      updateFlight,
      updateFlightReturn,
      soGhePhoThongDeparture,
      soGheThuongGiaDeparture,
      soGhePhoThongReturn,
      soGheThuongGiaReturn
    );

    return res.status(500).json({
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tạo đơn hàng",
        stack: error.stack,
      },
    });
  }
});

async function rollbackCreateOrder(
  orderId,
  paymentId,
  updateFlight,
  updateFlightReturn,
  soGhePhoThongDeparture,
  soGheThuongGiaDeparture,
  soGhePhoThongReturn,
  soGheThuongGiaReturn
) {
  if (!orderId) return;
  await Promise.all([
    DonHang.findByIdAndDelete(orderId),
    paymentId ? Payment.findByIdAndDelete(paymentId) : null,
    Ticket.deleteMany({ maDon: orderId }),
  ]);
  if (updateFlight) {
    await Flight.findByIdAndUpdate(updateFlight?._id, {
      $inc: {
        soGhePhoThong: +soGhePhoThongDeparture,
        soGheThuongGia: +soGheThuongGiaDeparture,
      },
    });
  }
  if (updateFlightReturn) {
    await Flight.findByIdAndUpdate(updateFlightReturn?._id, {
      $inc: {
        soGhePhoThong: +soGhePhoThongReturn,
        soGheThuongGia: +soGheThuongGiaReturn,
      },
    });
  }
}

// router get all don hang
router.get("/get_all", async (req, res) => {
  const donhang = await DonHang.find().sort({ createdAt: -1 });
  res.status(200).json(donhang);
});

router.get("/get", async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại",
      });
    }

    const order = await DonHang.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query.orderID),
        },
      },
      {
        $lookup: {
          from: "tickets",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$maDon", "$$orderId"] } } },
            {
              $lookup: {
                from: "flights",
                let: { cbId: { $toObjectId: "$maChuyenBay" } },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$cbId"] } } }],
                as: "flights",
              },
            },
            {
              $unwind: {
                path: "$flights",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tickets",
        },
      },
    ]);
    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        order: [],
      });
    }
    return res.status(200).json({
      message: "Tìm đơn hàng thành công",
      order: order[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm đơn hàng",
        stack: error.stack,
      },
    });
  }
});

router.post("/get_pending", async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;
    const { orderID, flightID } = req.body;
    const account = await Account.findById(_id);
    if (!account) {
      return res.status(404).json({ message: "Account" });
    }
    const order = await DonHang.findOne({ _id: orderID });
    if (!order) {
      return res.status(404).json({ message: "Order" });
    }
    if (order.userId === _id) {
      const tickets = await Ticket.find({ maDon: orderID });
      if (!tickets) {
        return res.status(404).json({ message: "Tickets" });
      }

      const palyload_res = {
        orderID: orderID,
        price: order.tongGia,
        tickets: tickets,
        trangThai: order.trangThai,
        end: order.expiredAt,
      };
      return res.status(200).json(palyload_res);
    }
    return res.status(500).json({ message: "Internal server error" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

router.post("/update_status", async (req, res) => {
  try {
    const { status, orderID, flight } = req.body;

    let orderUpdate,
      ticketsUpdate,
      updateFlight,
      delPayment,
      updateFlightReturn;

    if (status === "200") {
      const checkValid = await DonHang.findById(orderID);
      if (!checkValid) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      } else if (checkValid.trangThai === "Đã thanh toán") {
        return res
          .status(200)
          .json({ message: "Đơn hàng đã thanh toán trước đó" });
      } else if (checkValid.trangThai === "Đã hủy") {
        return res.status(200).json({ message: "Đơn hàng đã hủy trước đó" });
      }
      orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
        trangThai: "Đã thanh toán",
        phuongThuc: req.body?.type || "",
        expiredAt: null,
      });
      ticketsUpdate = await Ticket.find({ maDon: orderUpdate?._id });

      if (ticketsUpdate.length > 0) {
        const bulkOps = ticketsUpdate.map((ticket) => ({
          updateOne: {
            filter: { _id: ticket._id },
            update: { $set: { trangThaiVe: "Đã thanh toán" } },
          },
        }));

        await Ticket.bulkWrite(bulkOps);
      }
      delPayment = await Payment.deleteOne({
        orderId: orderUpdate?._id,
      });

      return res.status(200).json({
        message: "Thanh toán đơn hàng thành công",
      });
    } else if (status === "201") {
      orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
        trangThai: "Đã hủy",
        tongGia: flight?.price,
        expiredAt: null,
      });
      ticketsUpdate = await Ticket.find({ maDon: orderID });

      if (ticketsUpdate.length > 0) {
        const bulkOps = ticketsUpdate.map((ticket) => ({
          updateOne: {
            filter: { _id: ticket._id },
            update: { $set: { trangThaiVe: "Đã hủy" } },
          },
        }));

        await Ticket.bulkWrite(bulkOps);
      }

      updateFlight = await Flight.findByIdAndUpdate(flight?.idDeparture, {
        $inc: {
          soGhePhoThong: +flight?.countTicketNormal,
          soGheThuongGia: +flight?.countTicketBusiness,
        },
      });

      updateFlightReturn =
        flight.countTicketNormalReturn + flight?.countTicketBusinessReturn > 0
          ? await Flight.findByIdAndUpdate(flight?.idReturn, {
              $inc: {
                soGhePhoThong: +flight?.countTicketNormalReturn,
                soGheThuongGia: +flight?.countTicketBusinessReturn,
              },
            })
          : null;

      delPayment = await Payment.findOneAndDelete({ orderId: orderID });

      return res.status(200).json({
        message: "Hủy đơn hàng thành công",
      });
    } else if (status === "202") {
      orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
        trangThai: "Chưa thanh toán chuyến đi (Đã hủy vé khứ hồi)",
        tongGia: flight?.priceNew,
      });
      const tickets = await Ticket.find({ maDon: orderID });

      if (tickets.length > 0) {
        const result = await Ticket.updateMany(
          { maDon: orderID, maChuyenBay: flight.id },
          { trangThaiVe: "Đã hủy" }
        );
      }
      updateFlight = await Flight.findByIdAndUpdate(flight.id, {
        $inc: {
          soGhePhoThong: +flight.countTicketNormal,
          soGheThuongGia: +flight.countTicketBusiness,
        },
      });
      return res.status(200).json({
        message: "Hủy vé khứ hồi thành công.",
      });
    }
    return res.status(400).json({
      message: "Trạng thái không hợp lệ",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi cập nhật đơn hàng",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
