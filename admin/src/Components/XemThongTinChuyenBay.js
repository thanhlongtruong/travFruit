import { useContext } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

const XemThongTinChuyenBay = ({ isVisible, onClose, flight }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="justify-center bg-white p-6 rounded-lg lg:w-1/2 md:w-4/5 flex-col w-full max-h-full overflow-y-scroll">
        <h2 className="text-center text-xl font-bold mb-4 text-blue-600">
          THÔNG TIN CHUYẾN BAY
        </h2>
        <div className="flex justify-evenly w-full">
          <div className="flex-col w-[50%] overflow-wrap break-all">
            <p className="p-2">
              <strong>Mã chuyến bay: </strong> {flight._id}
            </p>
            <p className="p-2">
              <strong>Điểm đi: </strong> {flight.diemDi}
            </p>
            <p className="p-2">
              <strong>Ngày đi: </strong> {flight.dateDi}
            </p>
            <p className="p-2">
              <strong>Giờ đi: </strong> {flight.timeDi}
            </p>
            <p className="p-2">
              <strong>Số lượng vé thường còn lại: </strong> {flight.soGheThuong}
            </p>
            <p className="p-2">
              <strong>Số lượng vé thương gia còn lại: </strong>{" "}
              {flight.soGheThuongGia}
            </p>
          </div>
          <div className="flex-col w-[50%]">
            <p className="p-2">
              <strong>Giá chuyến: </strong> {flight.giaVeGoc}
            </p>
            <p className="p-2">
              <strong>Điểm đến: </strong> {flight.diemDen}
            </p>
            <p className="p-2">
              <strong>Ngày đến: </strong> {flight.dateDen}
            </p>
            <p className="p-2">
              <strong>Giờ đến: </strong> {flight.timeDen}
            </p>
            <p className="p-2">
              <strong>Số hành lý tối đa: </strong>{" "}
              {flight.khoiLuongQuyDinhTrenMotVe}
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded font-medium self-baseline"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default XemThongTinChuyenBay;
