import { useContext } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

const ChiTietTaiKhoan = ({ isVisible, onClose, account }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="justify-center bg-white p-6 rounded-lg sm:w-1/2 w-11/12 max-h-full overflow-y-scroll">
        <h2 className=" text-center text-xl font-bold mb-4">
          CHI TIẾT TÀI KHOẢN
        </h2>
        <p className="p-2">
          <strong>Số điện thoại:</strong> {account.numberPhone}
        </p>
        <p className="p-2">
          <strong>Mật khẩu:</strong> {account.password}
        </p>
        <p className="p-2">
          <strong>Họ tên khách hàng:</strong> {account.fullName}
        </p>
        <div className="p-2 flex">
          <p className="">
            <strong>Trạng thái tài khoản: </strong>
          </p>
          <p
            className={` ml-1 text-green-400 ${
              account.status === "Tài khoản đã bị khóa" ? "text-red-600" : ""
            }`}
          >
            {account.status}
          </p>
        </div>
        <p className="p-2">
          <strong>Giới tính:</strong> {account.gender}
        </p>
        <p className="p-2">
          <strong>Ngày sinh:</strong> {account.birthday}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
export default ChiTietTaiKhoan;
