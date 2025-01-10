const Ticket = require("../models/Ticket.js");

async function handleDelTickets_UpdateFlight(OrderID) {
  if (!OrderID) {
    return { status: false, message: "No order found" };
  }

  const tickets = await Ticket.find({ maDon: OrderID });
  if (!tickets.length) {
    return { status: false, message: "No tickets found" };
  }

  const DelTicket = await Ticket.deleteMany({
    _id: { $in: tickets },
  });

  if (!DelTicket) {
    return { status: false, message: "Cant del tickets" };
  }

  return { status: true, message: "Success" };
}

module.exports = handleDelTickets_UpdateFlight;
