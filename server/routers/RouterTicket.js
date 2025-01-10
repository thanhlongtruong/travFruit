const express = require("express");
const Ticket = require("../models/Ticket.js");
const { mongoose } = require("mongoose");

const router = express.Router();

// router add ticket
router.post("/api/add_ticket", async (req, res) => {
  const {
    Ten,
    phoneNumber,
    soKyHanhLy,
    hangVe,
    giaVe,
    maDon,
    chuyenBayId,
    trangThaiVe,
  } = req.body;

  try {
    const ticket = await Ticket.create({
      Ten,
      phoneNumber,
      soKyHanhLy,
      hangVe,
      giaVe,
      maDon,
      chuyenBayId,
      trangThaiVe,
    });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// router get all ticket
router.get("/api/get_all_tickets", async (req, res) => {
  const ticket = await Ticket.find();
  res.status(200).json(ticket);
});

// router get a ticket
router.get("/api/get_ticket/:_id", async (req, res) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No ticket with id: ${_id}`);
  }
  const ticket = await Ticket.findById(_id);

  res.status(200).json(ticket);
});

// router update ticket
router.post("/update_ticket", async (req, res) => {
  const { tickets } = req.body;

  try {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ message: "Invalid tickets array" });
    }

    // Xử lý tất cả các tickets
    const updatedTickets = [];
    for (const ticket of tickets) {
      const { _id, trangThaiVe } = ticket;

      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error(`Invalid ticket ID: ${_id}`);
      }

      const updatedTicket = await Ticket.findOneAndUpdate(
        { _id },
        { trangThaiVe },
        { new: true }
      );

      if (!updatedTicket) {
        throw new Error(`Failed to update ticket with ID: ${_id}`);
      }

      updatedTickets.push(updatedTicket);
    }

    res.status(200).json({
      data: updatedTickets,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//router delete ticket
router.delete("/api/delete_ticket/:_id", async (req, res) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No ticket with id: ${_id}`);
  }
  const deleteTicket = await Ticket.findOneAndDelete({ _id: _id });
  if (!deleteTicket) {
    return res.status(400).json({ error: "DH not found or already deleted" });
  }
  const updated = await Ticket.find().sort({ createAt: -1 });
  res.status(200).json(updated);
});

module.exports = router;
