import { useNavigate } from "react-router-dom";
import Header from "./Header";
import React, { useContext, useEffect, useState } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

function QuanLyDonHang() {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  const [donHangs, setDonHangs] = useState([]);
  const [allDonHang, setAllDonHang] = useState([]);

  useEffect(() => {
    const fetchDonHang = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDonHang.js
          `https://adminverold.vercel.app/api/get/all_donhang`
=======
          `https://travrel-server.vercel.app/api/get/all_donhang`
>>>>>>> mainv2:admin/src/Components/QuanLyDonHang.js
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDonHangs(data);
        setAllDonHang(data);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };
    fetchDonHang();
  }, []);

  const navigateVe = useNavigate();
  const handleXemChiTietDon = async (maDon) => {
    console.log("alo");
    try {
      const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDonHang.js
        `https://adminverold.vercel.app/api/get_all_tickets`
=======
        `https://travrel-server.vercel.app/api/get_all_tickets`
>>>>>>> mainv2:admin/src/Components/QuanLyDonHang.js
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        navigateVe("/QuanLyVe", {
          state: {
            dtListVe: data.filter((v) => v.maDon.includes(maDon)),
          },
        });
      }
    } catch (error) {
      console.error("Get All Ticket", error);
    }
  };

  const [stateDon, setStateDon] = useState("");
  const searchDon = async () => {
    if (stateDon === null) setDonHangs(allDonHang);
    else if (stateDon.trim().length <= 0) setDonHangs(allDonHang);
    else {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDonHang.js
          `https://adminverold.vercel.app/api/get_donhang/${stateDon}`
=======
          `https://travrel-server.vercel.app/api/get_donhang/${stateDon}`
>>>>>>> mainv2:admin/src/Components/QuanLyDonHang.js
        );
        if (!response.ok) {
          if (!stateDon) setDonHangs(allDonHang);
          else setDonHangs([]);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDonHangs([]);
        setDonHangs((d) => [...d, data]);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <Header />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl text-blue-600">
          DANH SÁCH QUẢN LÝ ĐƠN HÀNG
        </h1>
      </div>
      <div className="py-2 w-11/12 m-auto flex">
        <input
          className=" w-1/2 sm:w-[600px] h-[40px] px-2 border rounded-md shadow-sm focus:outline-none border-gray-400 focus"
          type="text"
          defaultValue={stateDon}
          placeholder="Tìm kiếm theo mã đơn"
          onChange={(e) => setStateDon(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 lg:text-sm md:text-xs text-white font-medium rounded-md p-2 ml-3"
          onClick={searchDon}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="w-full flex-col mt-4 overflow-x-scroll">
        <table className="lg:w-11/12 md:w-[600px] m-auto border-black bg-white">
          <thead>
            <tr className="border">
              <th className="border border-gray-400 px-3 py-2">STT</th>
              <th className="border border-gray-400 px-3 py-2">Mã đơn</th>
              <th className="border border-gray-400 px-3 py-2">
                Mã khách hàng
              </th>
              <th className="border border-gray-400 px-3 py-2">Số lượng vé</th>
              <th className="border border-gray-400 px-3 py-2">Tổng tiền</th>
              <th className="border border-gray-400 px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {donHangs &&
              donHangs.map((donhang, index) => (
                <tr key={donhang._id} className="text-center">
                  <td className="border border-gray-400 px-3 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {donhang._id}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {donhang.userId}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {donhang.soLuongVe}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {donhang.tongGia}
                  </td>
                  <td className="border border-gray-400 px-1 py-2 flex gap-5 justify-center">
                    <button
                      type="button"
                      className="bg-gray-500 text-white rounded-md w-[120px] h-10 font-medium"
                      onClick={() => handleXemChiTietDon(donhang._id)}
                    >
                      Xem chi tiết đơn
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default QuanLyDonHang;
