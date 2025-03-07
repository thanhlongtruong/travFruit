const express = require("express");
const DonHang = require("../models/DonHang.js");
const Ticket = require("../models/Ticket.js");
const Account = require("../models/User.js");
const handleDelTickets_UpdateFlight = require("../service/delTickets_UpdateFlight.js");
const e = require("express");

const router = express.Router();

router.post("/ccc", async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;
    const { orderID, priceNew } = req.body;

    const account = await Account.findById(_id);
    if (!account) {
      return res.status(404).json({ message: "Account" });
    }

    const orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
      trangThai: "Đang chờ thanh toán chuyến đi (Đã hủy vé khứ hồi)",
      tongGia: priceNew,
    });

    if (!orderUpdate) {
        return res.status(404).json({ message: "Order not found" });
    }
    
    const tickets = await Ticket.find({ maDon: orderID });

    if (tickets.length > 0) {
      const result = await Ticket.updateMany(
        { maDon: orderID, loaiChuyenBay: "Chuyến bay khứ hồi" },
        { trangThaiVe: "Đã hủy" }
      );
      if (result) {
        return res
          .status(200)
          .json({ message: "Cancel return ticket successfully" });
      }
    } else {
      return res.status(404).json({ message: "No tickets found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update_status", async (req, res) => {
  const { status, orderID } = req.body;

  const getFunctionUpdate = await updateStatusDonHang(status, orderID);
  if (getFunctionUpdate.state === "Order false") {
    return res.status(404).json(getFunctionUpdate.message);
  }
  if (getFunctionUpdate.state === "true") {
    return res.status(200).json(getFunctionUpdate.message);
  }
  if (getFunctionUpdate.state === "Invalid status") {
    return res.status(400).json(getFunctionUpdate.message);
  }
  if (getFunctionUpdate.state === "err") {
    return res.status(400).json(getFunctionUpdate.message);
  }
});

// router delete order and ticker and update flight
router.post("/order-ticket_delete", async (req, res) => {
  const { idDh } = req.body;

  try {
    const deleteOrder = await DonHang.findByIdAndDelete(idDh);

    if (!deleteOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    const handlDel = await handleDelTickets_UpdateFlight(idDh);

    if (handlDel.status === false) {
      return res.status(400).json(handlDel.message);
    }
    if (handlDel.status === true) {
      return res.status(200).json(handlDel.message);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// router create order, ticker and update flight
router.post("/order-ticket_create", async (req, res) => {
  const accessTokenDecoded = req.jwtDecoded;
  const _id = accessTokenDecoded._id;
  const {
    airportDeparture,
    airportReturn,
    totalQuantityTickets,
    totalPriceTickets,
  } = req.body;

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  try {
    const createOrder = await DonHang.create({
      userId: _id,
      soLuongVe: totalQuantityTickets,
      tongGia: totalPriceTickets,
      createdAt: now,
      expiredAt: oneHourLater,
    });

    if (!createOrder) {
      return res.status(500).json({ message: "Create Order Fail" });
    }

    const arrTickets = airportDeparture.map((ticket) => ({
      ...ticket,
      maDon: createOrder._id,
    }));
    const arrTicketsReturn = airportReturn.map((ticket) => ({
      ...ticket,
      maDon: createOrder._id,
    }));

    const createTickets = await Ticket.insertMany(arrTickets);
    const createTicketsReturn = await Ticket.insertMany(arrTicketsReturn);

    if (!createTickets || !createTicketsReturn) {
      return res.status(500).json({ message: "Create tickets fail" });
    }
    const allTickets = createTickets.concat(createTicketsReturn);
    return res.status(200).json({
      idDH: createOrder._id,
      priceOrder: totalPriceTickets,
      createAt: createOrder.createdAt,
      expiredAt: oneHourLater,
      dataTickets: allTickets,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error::" });
  }
});

// router get all don hang
router.get("/get_all", async (req, res) => {
  const donhang = await DonHang.find().sort({ createdAt: -1 });
  res.status(200).json(donhang);
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

// router.post("/get_accounts_pending", async (req, res) => {
//   const accessTokenDecoded = req.jwtDecoded;
//   const _id = accessTokenDecoded._id;

//   const order = await DonHang.find({ userId: _id});
// })

async function updateStatusDonHang(status, orderID) {
  try {
    if (status === 200) {
      const orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
        trangThai: "Đã thanh toán",
        expiredAt: null,
      });

      if (!orderUpdate) {
        return { state: "Order false", message: "Order not found" };
      }

      // Find and update tickets associated with the order
      const ticketsToUpdate = await Ticket.find({ maDon: orderID });

      if (ticketsToUpdate.length > 0) {
        const bulkOps = ticketsToUpdate.map((ticket) => ({
          updateOne: {
            filter: { _id: ticket._id },
            update: { $set: { trangThaiVe: "Đã thanh toán" } },
          },
        }));

        await Ticket.bulkWrite(bulkOps);
      }

      return {
        state: "true",
        message: "Order and tickets Paid successfully",
      };
    } else if (status === 201) {
      const orderUpdate = await DonHang.findByIdAndUpdate(orderID, {
        trangThai: "Đã hủy",
        expiredAt: null,
      });

      if (!orderUpdate) {
        return { state: "Order false", message: "Order not found" };
      }

      // Find and update tickets associated with the order
      const ticketsToUpdate = await Ticket.find({ maDon: orderID });

      if (ticketsToUpdate.length > 0) {
        const bulkOps = ticketsToUpdate.map((ticket) => ({
          updateOne: {
            filter: { _id: ticket._id },
            update: { $set: { trangThaiVe: "Đã hủy" } },
          },
        }));

        await Ticket.bulkWrite(bulkOps);
      }

      return {
        state: "true",
        message: "Order and tickets updated successfully",
      };
    } else {
      return {
        state: "Invalid status",
        message: "Invalid status",
      };
    }
  } catch (err) {
    return {
      state: "err",
      message: err.message,
    };
  }
}
module.exports = router;
