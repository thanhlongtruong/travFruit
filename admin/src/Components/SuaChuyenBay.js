import { useState, useEffect, useContext, useCallback } from "react";
import { CONTEXT } from "../Context/ContextAdmin.js";

const SuaThongTinChuyenBay = ({ isVisible, onClose, flight }) => {
  const { isEditModalVisible, userObj } = useContext(CONTEXT);

  if (!userObj) {
    window.location.href = "/";
  }

  const [isDiemDi, setIsDiemDi] = useState("");
  const [isNgayDi, setIsNgayDi] = useState("");
  const [isGioDi, setIsGioDi] = useState("");
  const [isSoLuongVeThuongConLai, setIsSoLuongVeThuongConLai] = useState(0);
  const [isSoLuongVeThuongGiaConLai, setIsSoLuongVeThuongGiaConLai] =
    useState(0);
  const [isGiaChuyen, setIsGiaChuyen] = useState(0);
  const [isDiemDen, setIsDiemDen] = useState("");
  const [isNgayDen, setIsNgayDen] = useState("");
  const [isGioDen, setIsGioDen] = useState("");
  const [isSoHanhLy, setIsSoHanhLy] = useState(0);
  const [errors, setErrors] = useState({});

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (isEditModalVisible && flight) {
      setIsDiemDi(flight.diemDi || "");
      setIsNgayDi(flight.dateDi || "");
      setIsGioDi(flight.timeDi || "");
      setIsSoLuongVeThuongConLai(flight.soGheThuong || 0);
      setIsSoLuongVeThuongGiaConLai(flight.soGheThuongGia || 0);
      setIsGiaChuyen(flight.giaVeGoc || 0);
      setIsDiemDen(flight.diemDen || "");
      setIsNgayDen(flight.dateDen || "");
      setIsGioDen(flight.timeDen || "");
      setIsSoHanhLy(flight.khoiLuongQuyDinhTrenMotVe || 0);
    }
  }, [isEditModalVisible, flight]);

  const validateFields = () => {
    const newErrors = {};

    if (!isDiemDi.trim()) newErrors.diemDi = "Điểm đi không được để trống";
    if (!isDiemDen.trim()) newErrors.diemDen = "Điểm đến không được để trống";
    const giaChuyenValue = Number(isGiaChuyen);

    if (isNaN(giaChuyenValue)) {
      newErrors.giaChuyen = "Giá chuyến không hợp lệ";
    } else if (giaChuyenValue < 0 || giaChuyenValue > 10000000) {
      newErrors.giaChuyen = "Giá chuyến phải từ 0 đến 10.000.000";
    }
    if (!isNgayDi.trim()) newErrors.ngayDi = "Ngày đi không được để trống";
    const soLuongVeThuongValue = Number(isSoLuongVeThuongConLai);
    if (isNaN(soLuongVeThuongValue)) {
      newErrors.soGheThuong = "Số lượng vé thường không hợp lệ";
    } else if (soLuongVeThuongValue <= 0) {
      newErrors.soGheThuong = "Số lượng vé thường phải lớn hơn 0";
    }
    const soLuongVeThuongGiaValue = Number(isSoLuongVeThuongGiaConLai);
    if (isNaN(soLuongVeThuongGiaValue)) {
      newErrors.soGheThuongGia = "Số lượng vé thương gia không hợp lệ";
    } else if (soLuongVeThuongGiaValue <= 0) {
      newErrors.soGheThuongGia = "Số lượng vé thương gia phải lớn hơn 0";
    }
    const soHanhLyValue = Number(isSoHanhLy);
    if (isNaN(soHanhLyValue)) {
      newErrors.soHanhLy = "Số hành lý không hợp lệ";
    } else if (soHanhLyValue < 0) {
      newErrors.soHanhLy = "Số hành lý phải lớn hơn 0";
    }

    if (!isNgayDen.trim()) newErrors.ngayDen = "Ngày đến không được để trống";
    if (!isGioDi.trim()) newErrors.gioDi = "Giờ đi không được để trống";
    if (!isGioDen.trim()) newErrors.gioDen = "Giờ đến không được để trống";
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

  const submitUpdateChuyenBay = async () => {
    if (!validateFields()) return;

    const updatedFlight = {
      timeDi: isGioDi,
      dateDi: isNgayDi,
      timeDen: isGioDen,
      dateDen: isNgayDen,
      diemDi: isDiemDi,
      diemDen: isDiemDen,
      giaVeGoc: isGiaChuyen,
      soGheThuong: isSoLuongVeThuongConLai,
      soGheThuongGia: isSoLuongVeThuongGiaConLai,
      khoiLuongQuyDinhTrenMotVe: isSoHanhLy,
    };

    try {
      const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/SuaChuyenBay.js
        `https://adminverold.vercel.app/api/update/flight/${flight._id}`,
=======
        `https://travrel-server.vercel.app/api/update/flight/${flight._id}`,
>>>>>>> mainv2:admin/src/Components/SuaChuyenBay.js
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFlight),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Chuyến bay đã được cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="justify-center bg-white p-6 rounded-lg lg:w-1/2 md:w-4/5 flex-col w-full max-h-full overflow-y-scroll">
        <h2 className="text-center text-xl font-bold mb-4 text-blue-600">
          SỬA THÔNG TIN CHUYẾN BAY
        </h2>
        <div className="flex justify-evenly w-full">
          <div className="flex-col w-1/2 overflow-wrap break-all">
            <p className="p-2">
              <strong>Mã chuyến bay: </strong> {flight._id}
            </p>
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
                onChange={(e) => setIsGioDi(e.target.value)}
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
                name="SoLuongVeConLai"
                value={isSoLuongVeThuongConLai}
                onChange={(e) => setIsSoLuongVeThuongConLai(e.target.value)}
                className="border rounded p-1 w-full"
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
              />
            </p>
            {errors.soGheThuongGia && (
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
                onChange={(e) => setIsGiaChuyen(e.target.value)}
                className="border rounded p-1 w-full sm:w[2/4]"
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
                name="DiemDen"
                value={isDiemDen}
                onChange={(e) => setIsDiemDen(e.target.value)}
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
                onChange={(e) => setIsNgayDen(e.target.value)}
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
                onChange={(e) => setIsGioDen(e.target.value)}
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
                onChange={(e) => setIsSoHanhLy(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </p>
            {errors.soHanhLy && (
              <p className="text-red-500 mb-4 ml-4 text-sm">
                *{errors.soHanhLy}
              </p>
            )}
            <div className="flex justify-end mt-4 flex-col sm:flex-row">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded font-medium mr-2"
              >
                Hủy
              </button>
              <button
                onClick={submitUpdateChuyenBay}
                className="bg-green-500 text-white px-4 py-2 rounded font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuaThongTinChuyenBay;
