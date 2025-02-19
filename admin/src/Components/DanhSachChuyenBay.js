import Header from "./Header";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import XemThongTinChuyenBay from "./XemThongTinChuyenBay";
import SuaThongTinChuyenBay from "./SuaChuyenBay";
import XoaChuyenBay from "./XoaChuyenBay";
import ThemChuyenBay from "./ThemChuyenBay";
import { CONTEXT } from "../Context/ContextAdmin.js";

const DanhSachChuyenBay = () => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  const naviReload = useNavigate();

  const { isEditModalVisible, setIsEditModalVisible } = useContext(CONTEXT);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isAddDialogVisible, setAddDialogVisible] = useState(false);
  const [stateChuyenBay, setStateChuyenBay] = useState("");
  const [listFlight, setListFlight] = useState([]);
  const [allFlight, setAllFlight] = useState([]);

  const handle = () => {
    setAddDialogVisible(false);
    naviReload(0);
  };

  const handleUpdateFlight = (flight) => {
    setSelectedFlight(flight);
    setIsEditModalVisible(true);
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/DanhSachChuyenBay.js
          "https://adminverold.vercel.app/api/get/all_flights"
=======
          "http://localhost:4001/api/get/all_flights"
>>>>>>> mainv2:admin/src/Components/DanhSachChuyenBay.js
        );

        if (!response.ok) {
          throw new Error("Network response not ok when get all flight");
        }
        const dataFlight = await response.json();
        setListFlight(dataFlight);
        setAllFlight(dataFlight);
      } catch (err) {
        console.error("Bug when get all flight", err.message);
      }
    };
    fetchFlight();
  }, []);

  const searchFlight = async () => {
    if (stateChuyenBay === null) setListFlight(allFlight);
    else if (stateChuyenBay.trim().length <= 0) setListFlight(allFlight);
    else {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/DanhSachChuyenBay.js
          `https://adminverold.vercel.app/api/get/flight/${stateChuyenBay}`
=======
          `http://localhost:4001/api/get/flight/${stateChuyenBay}`
>>>>>>> mainv2:admin/src/Components/DanhSachChuyenBay.js
        );
        if (!response.ok) {
          if (!stateChuyenBay) setListFlight(allFlight);
          else setListFlight([]);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setListFlight([]);
        setListFlight((f) => [...f, data]);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }
  };

  const handleDeleteFlight = (flight) => {
    setSelectedFlight(flight);
    setDeleteDialogVisible(true);
  };
  return (
    <div className="w-full">
      <Header />
      <div className="justify-center flex m-960 ">
        <h1 className="font-bold lg:text-2xl text-blue-600 absolute lg:left-1/2 transform -translate-x-1/2 md:text-xl sm:text-sm left-1/3  ">
          DANH SÁCH CHUYẾN BAY
        </h1>
        <button
          type="button"
          className="bg-green-600 text-white rounded-md lg:h-10 lg:w-[150px] font-medium text-sm ml-auto lg:mr-16 md: p-1 w-[130px] mr-28 mt-[50px] "
          onClick={() => setAddDialogVisible(true)}
        >
          Thêm chuyến bay
        </button>
      </div>
      <div className="p-2 w-11/12 m-auto flex">
        <input
          className=" w-1/2 sm:w-[600px] h-[40px] border rounded-md shadow-sm focus:outline-none border-gray-400 focus"
          type="text"
          value={stateChuyenBay}
          placeholder="Tìm kiếm chuyến bay theo mã chuyến bay"
          onChange={(e) => setStateChuyenBay(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 lg:text-sm md:text-xs text-white font-medium rounded-md p-2 ml-3"
          onClick={searchFlight}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="max-w-screen flex mt-4 overflow-x-scroll">
        <table className="lg:w-11/12 m-auto border-black bg-white md:w-[600px]">
          <thead>
            <tr className="border">
              <th className="border border-gray-400 px-3 py-2">STT</th>
              <th className="border border-gray-400 px-3 py-2">
                Mã chuyến bay
              </th>
              <th className="border border-gray-400 px-3 py-2">Điểm đi</th>
              <th className="border border-gray-400 px-3 py-2">Điểm đến</th>
              <th className="border border-gray-400 px-3 py-2">Ngày đi</th>
              <th className="border border-gray-400 px-3 py-2">Ngày đến</th>
              <th className="border border-gray-400 px-3 py-2">Giờ đi</th>
              <th className="border border-gray-400 px-3 py-2">Giờ đến</th>
              <th className="border border-gray-400 px-3 py-2 w-[300px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {listFlight &&
              listFlight.map((f, index) => (
                <tr key={f._id} className="text-center">
                  <td className="border border-gray-400 px-3 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">{f._id}</td>
                  <td className="border border-gray-400 px-3 py-2">
                    {f.diemDi}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {f.diemDen}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {f.dateDi}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {f.dateDen}
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {f.timeDi}
                  </td>

                  <td className="border border-gray-400 px-3 py-2">
                    {f.timeDen}
                  </td>
                  <td className="border-b border-r border-gray-400 px-1 py-3 flex gap-1 justify-center">
                    <button
                      type="button"
                      className="bg-gray-500 text-white rounded-md w-[120px] h-10 font-medium text-sm"
                      onClick={() => handleViewDetails(f)}
                    >
                      Xem thông tin
                    </button>
                    <button
                      type="button"
                      className="bg-blue-400 text-white rounded-md h-10 w-[60px] font-medium text-sm"
                      onClick={() => handleUpdateFlight(f)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white rounded-md h-10 w-[60px] font-medium text-sm"
                      onClick={() => handleDeleteFlight(f)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <XemThongTinChuyenBay
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        flight={selectedFlight}
      />
      <SuaThongTinChuyenBay
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          naviReload(0);
        }}
        flight={selectedFlight}
      />
      <XoaChuyenBay
        isVisible={isDeleteDialogVisible}
        onClose={() => {
          setDeleteDialogVisible(false);
          naviReload(0);
        }}
        flight={selectedFlight}
      />
      <ThemChuyenBay
        isVisible={isAddDialogVisible}
        onClose={() => handle()}
        // onAdd={handleAddFlight}
      />
    </div>
  );
};
export default DanhSachChuyenBay;
