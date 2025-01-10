import Header from "./Header";
import React, { useContext, useEffect, useState } from "react";
import XemChiTietVeKH from "./XemChiTietVeKH.js";
import { useLocation } from "react-router-dom";
import { CONTEXT } from "../Context/ContextAdmin.js";

function QuanLyVe() {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  const ticketLocation = useLocation();
  const { dtListVe } = ticketLocation.state;

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [tickets, setTickets] = useState;

  // useEffect(() => {
  //   const newArray = [...tickets];
  //   newArray.concat(dtTickets);
  //   setTickets(newArray);
  // }, []);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  return (
    <div className="w-full">
      <Header />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl text-blue-600">
          DANH SÁCH QUẢN LÝ VÉ
        </h1>
      </div>
      <div className="w-full flex mt-4 overflow-x-scroll">
        <table className="w-11/12 m-auto border-black bg-white">
          <thead>
            <tr className="border">
              <th className="border border-gray-400 px-3 py-2">STT</th>
              <th className="border border-gray-400 px-3 py-2">Mã số vé</th>
              <th className="border border-gray-400 px-3 py-2">Hạng vé</th>
              <th className="border border-gray-400 px-3 py-2">
                Mã số chuyến bay
              </th>
              <th className="border border-gray-400 px-3 py-2 bg-">Mã đơn</th>
              <th className="border border-gray-400 px-3 py-2">Giá vé</th>
              <th className="border border-gray-400 px-3 py-2">Trạng thái</th>
              <th className="border border-gray-400 px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dtListVe.map((ticket, index) => (
              <tr key={ticket._id} className="text-center">
                <td className="border border-gray-400 px-3 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  {ticket._id}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  {ticket.hangVe}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  {ticket.chuyenBayId}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  {ticket.maDon}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  {ticket.giaVe}
                </td>
                {ticket.trangThaiVe === "Đang chờ thanh toán" && (
                  <td
                    className={`border border-gray-400 px-3 py-2 text-yellow-500`}
                  >
                    {ticket.trangThaiVe}
                  </td>
                )}
                {ticket.trangThaiVe === "Đã thanh toán" && (
                  <td
                    className={`border border-gray-400 px-3 py-2 text-green-500`}
                  >
                    {ticket.trangThaiVe}
                  </td>
                )}
                {ticket.trangThaiVe === "Đã hủy" && (
                  <td
                    className={`border border-gray-400 px-3 py-2 text-red-500`}
                  >
                    {ticket.trangThaiVe}
                  </td>
                )}
                {ticket.trangThaiVe === "Đã hoàn tiền" && (
                  <td
                    className={`border border-gray-400 px-3 py-2 text-purple-500`}
                  >
                    {ticket.trangThaiVe}
                  </td>
                )}
                <td className="border border-gray-400 px-3 py-2 gap-5">
                  <button
                    type="button"
                    className="bg-gray-500 text-white rounded-md w-[120px] h-10 font-medium"
                    onClick={() => handleViewDetails(ticket)}
                  >
                    Xem chi tiết vé
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <XemChiTietVeKH
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        ticket={selectedTicket}
      />
    </div>
  );
}
export default QuanLyVe;
