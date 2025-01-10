import { useContext } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

const XemChiTietVeKH = ({ isVisible, onClose, ticket }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="justify-center max-h-full overflow-y-scroll bg-white p-6 rounded-lg sm:w-1/2 w-11/12 flex-col-reverse">
        <h2 className="text-center text-xl font-bold mb-4 text-blue-600">
          CHI TIẾT VÉ
        </h2>
        <div className="flex xl:flex-row flex-col justify-evenly w-[100%]">
          <div className="flex-col xl:w-[50%] w-full overflow-wrap break-all">
            <p className="p-2">
              <strong>Mã vé: </strong> {ticket._id}
            </p>
            <p className="p-2">
              <strong>Tên hàng khách: </strong> {ticket.Ten}
            </p>
            <p className="p-2">
              <strong>Số điện thoại: </strong> {ticket.phoneNumber}
            </p>
            <p className="p-2">
              <strong>Hạng vé: </strong> {ticket.hangVe}
            </p>
            <p className="p-2">
              <strong>Giá vé: </strong> {ticket.giaVe} VND
            </p>
          </div>
          <div className="flex-col xl:w-[50%] w-full overflow-wrap break-all">
            <p className="p-2">
              <strong>Mã chuyến bay: </strong> {ticket.chuyenBayId}
            </p>
            <p className="p-2">
              <strong>Mã đơn: </strong> {ticket.maDon}
            </p>
            <p className="p-2">
              <strong>Số hành lý: </strong> {ticket.soKyHanhLy} kg
            </p>
            <p className="p-2">
              <strong>Trạng thái vé: </strong> {ticket.trangThaiVe}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded font-medium"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
export default XemChiTietVeKH;
