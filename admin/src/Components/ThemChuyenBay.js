import React, { useState, useEffect, useContext } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

const ThemChuyenBay = ({ isVisible, onClose }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  const [isDiemDi, setIsDiemDi] = useState("");
  const [isNgayDi, setIsNgayDi] = useState("");
  const [isGioDi, setisGioDi] = useState("");
  const [isSoLuongVeThuongConLai, setIsSoLuongVeThuongConLai] = useState(0);
  const [isSoLuongVeThuongGiaConLai, setIsSoLuongVeThuongGiaConLai] =
    useState(0);
  const [isGiaChuyen, setisGiaChuyen] = useState(0);
  const [isDiemDen, setisDiemDen] = useState("");
  const [isNgayDen, setisNgayDen] = useState("");
  const [isGioDen, setisGioDen] = useState("");
  const [isSoHanhLy, setisSoHanhLy] = useState(0);
  const [errors, setErrors] = useState({});

  // Hàm gửi dữ liệu chuyến bay tới API
  // useEffect(() => {
  //   setIsDiemDi(isDiemDi.trim().length <= 0 ? false : true);
  // }, [isDiemDi]);
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isDiemDi.trim()) {
      newErrors.diemDi = "Điểm đi không được để trống";
    }
    if (!isDiemDen.trim()) {
      newErrors.diemDen = "Điểm đến không được để trống";
    }
    if (!isGiaChuyen) {
      newErrors.giaChuyen = "Giá chuyến không được để trống";
    } else if (isGiaChuyen < 0 || isGiaChuyen > 10000000) {
      newErrors.giaChuyen = "Giá chuyến phải từ 0 đến 10.000.000";
    }
    if (!isNgayDi) {
      newErrors.ngayDi = "Ngày đi không được để trống";
    }
    if (!isSoLuongVeThuongConLai) {
      newErrors.soGheThuong = "Số lượng vé không được để trống";
    } else if (isSoLuongVeThuongConLai <= 0) {
      newErrors.soGheThuong = "Số lượng vé phải lớn hơn 0";
    }
    if (!isSoLuongVeThuongGiaConLai) {
      newErrors.soGheThuongGia = "Số lượng vé không được để trống";
    } else if (isSoLuongVeThuongConLai <= 0) {
      newErrors.soGheThuongGia = "Số lượng vé phải lớn hơn 0";
    }
    if (!isSoHanhLy) {
      newErrors.soHanhLy = "Số lượng hành lý không được để trống";
    } else if (isSoHanhLy < 0) {
      newErrors.soHanhLy = "Số lượng hành lý phải lớn hơn 0";
    }
    if (!isNgayDen) {
      newErrors.ngayDen = "Ngày đến không được để trống";
    }
    if (!isGioDi) {
      newErrors.gioDi = "Giờ đi không được để trống";
    }
    if (!isGioDen) {
      newErrors.gioDen = "Giờ đến không được để trống";
    }
    if (isDiemDi === isDiemDen)
      newErrors.diemDen = "Điểm đến không được trùng điểm đi";
    if (isNgayDi > isNgayDen)
      newErrors.gioDen = "Ngày đến không được sớm hơn ngày di";
    else if (isNgayDi == isNgayDen && isGioDi >= isGioDen)
      newErrors.gioDen =
        "Cùng một ngày thì giờ đến không được trễ hay bằng giờ đi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitInfoRegister = async () => {
    if (!validateForm()) {
      return;
    }

    console.log("saaaaaaaaaa");
    const flight = {
      timeDi: isGioDi,
      dateDi: isNgayDi,
      timeDen: isGioDen,
      dateDen: isNgayDen,
      diemDi: isDiemDi,
      diemDen: isDiemDen,
      giaVeGoc: isGiaChuyen,
      soGheThuong: isSoLuongVeThuongConLai,
      soGheThuongGia: isSoLuongVeThuongConLai,
      khoiLuongQuyDinhTrenMotVe: isSoHanhLy,
    };
    try {
      const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/ThemChuyenBay.js
        "https://adminverold.vercel.app/api/add_flight",
=======
        "https://travrel-server.vercel.app/api/add_flight",
>>>>>>> mainv2:admin/src/Components/ThemChuyenBay.js
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Kiểu nội dung của request
          },
          body: JSON.stringify(flight),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json(); // Đọc phản hồi JSON
      onClose();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg lg:w-1/2 md:w-4/5 flex-col w-full max-h-full overflow-y-scroll">
        <h2 className="text-center text-xl font-bold mb-4 text-blue-600">
          THÊM CHUYẾN BAY
        </h2>

        <div className="flex justify-evenly w-full">
          <div className="flex-col w-1/2 overflow-wrap break-all">
            <p className="p-2">
              <strong>Điểm đi: </strong>
              <input
                type="text"
                name="DiemDi"
                value={isDiemDi}
                onChange={(e) => setIsDiemDi(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </p>
            {errors.diemDi && (
              <p className="text-red-500 mb-4 ml-4 text-sm">*{errors.diemDi}</p>
            )}
            <p className="p-2">
              <strong>Ngày đi: </strong>
              <input
                type="date"
                name="NgayDi"
                value={isNgayDi}
                onChange={(e) => setIsNgayDi(e.target.value)}
                className="border rounded p-1 w-full"
                min={getTodayDate()}
              />
            </p>
            {errors.ngayDi && (
              <p className="text-red-500 mb-4 ml-4 text-sm">*{errors.ngayDi}</p>
            )}
            <p className="p-2">
              <strong>Giờ đi: </strong>
              <input
                type="time"
                name="GioDi"
                value={isGioDi}
                onChange={(e) => setisGioDi(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </p>
            {errors.gioDi && (
              <p className="text-red-500 mb-4 ml-4 text-sm">*{errors.gioDi}</p>
            )}
            <p className="p-2">
              <strong>Số lượng vé thường còn lại: </strong>
              <input
                type="number"
                value={isSoLuongVeThuongConLai}
                onChange={(e) => setIsSoLuongVeThuongConLai(e.target.value)}
                className="border rounded p-1 w-full"
                min={0}
              />
            </p>
            {errors.soGheThuong && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.soGheThuong}
              </p>
            )}
            <p className="p-2">
              <strong>Số lượng vé thương gia còn lại: </strong>
              <input
                type="number"
                value={isSoLuongVeThuongGiaConLai}
                onChange={(e) => setIsSoLuongVeThuongGiaConLai(e.target.value)}
                className="border rounded p-1 w-full"
                min={0}
              />
            </p>
            {errors.soGheThuong && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.soGheThuongGia}
              </p>
            )}
          </div>
          <div className="flex-col w-1/2">
            <p className="p-2">
              <strong>Giá chuyến: </strong>
              <input
                type="number"
                name="GiaChuyen"
                value={isGiaChuyen}
                onChange={(e) => setisGiaChuyen(e.target.value)}
                className="border rounded p-1 w-full"
                min={0}
                max={10000000}
              />
            </p>
            {errors.giaChuyen && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.giaChuyen}
              </p>
            )}
            <p className="p-2">
              <strong>Điểm đến: </strong>
              <input
                type="text"
                value={isDiemDen}
                onChange={(e) => setisDiemDen(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </p>
            {errors.diemDen && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.diemDen}
              </p>
            )}
            <p className="p-2">
              <strong>Ngày đến: </strong>
              <input
                type="date"
                name="NgayDen"
                value={isNgayDen}
                onChange={(e) => setisNgayDen(e.target.value)}
                className="border rounded p-1 w-full"
                min={getTodayDate()}
              />
            </p>
            {errors.ngayDen && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.ngayDen}
              </p>
            )}
            <p className="p-2">
              <strong>Giờ đến: </strong>
              <input
                type="time"
                name="GioDen"
                value={isGioDen}
                onChange={(e) => setisGioDen(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </p>
            {errors.gioDen && (
              <p className="text-red-500 mb-4 ml-4 text-sm">*{errors.gioDen}</p>
            )}
            <p className="p-2">
              <strong>Số hành lý tối đa: </strong>
              <input
                type="number"
                name="SoHanhLyGToiThieu"
                value={isSoHanhLy}
                onChange={(e) => setisSoHanhLy(e.target.value)}
                className="border rounded p-1 w-full"
                min={0}
              />
            </p>
            {errors.soHanhLy && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.soHanhLy}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded font-medium mr-2"
          >
            Hủy
          </button>
          <button
            onClick={submitInfoRegister}
            className="bg-green-500 text-white px-4 py-2 rounded font-medium"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};
export default ThemChuyenBay;
