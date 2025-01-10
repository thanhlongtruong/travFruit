import Header from "./Header";
import React, { useState, useEffect, useContext } from "react";
import ChiTietTaiKhoan from "./ChiTietTaiKhoan.js";
import { CONTEXT } from "../Context/ContextAdmin.js";

const QuanLyDanhSachTaiKhoan = () => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stateAccount, setStateAccount] = useState("");
  const [allAccount, setAllAccount] = useState([]);

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setIsModalVisible(true);
  };

  const fetchAccount = async () => {
    try {
      const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDanhSachTaiKhoan.js
        `https://adminverold.vercel.app/api/getUser`
=======
        `https://travrel-server.vercel.app/api/getUser`
>>>>>>> mainv2:admin/src/Components/QuanLyDanhSachTaiKhoan.js
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAccounts(data);
      setAllAccount(data);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  const toggleLockAccount = async (account) => {
    account.status =
      account.status === "Đang hoạt động"
        ? "Tài khoản đã bị khóa"
        : "Đang hoạt động";
    try {
      const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDanhSachTaiKhoan.js
        `https://adminverold.vercel.app/api/update_user/${account._id}`,
=======
        `https://travrel-server.vercel.app/api/update_user/${account._id}`,
>>>>>>> mainv2:admin/src/Components/QuanLyDanhSachTaiKhoan.js
        {
          method: "PATCH", // Phương thức HTTP
          headers: {
            "Content-Type": "application/json", // Kiểu nội dung của request
          },
          body: JSON.stringify({
            status: account.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchAccount();
    } catch (error) {
      console.log(error);
    }
  };

  const searchAcc = async () => {
    if (stateAccount === null) setAccounts(allAccount);
    else if (stateAccount.trim().length <= 0) setAccounts(allAccount);
    else {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/QuanLyDanhSachTaiKhoan.js
          `https://adminverold.vercel.app/api/get_user/find_id_user/${stateAccount}`
=======
          `https://travrel-server.vercel.app/api/get_user/find_id_user/${stateAccount}`
>>>>>>> mainv2:admin/src/Components/QuanLyDanhSachTaiKhoan.js
        );
        if (!response.ok) {
          setAccounts([]);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAccounts([]);
        setAccounts((f) => [...f, data]);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <Header />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl sm:text-xl">
          DANH SÁCH TÀI KHOẢN KHÁCH HÀNG
        </h1>
      </div>
      <div className="p-2 w-11/12 m-auto flex">
        <input
          className=" w-1/2 sm:w-[600px] h-[40px] border rounded-md shadow-sm focus:outline-none border-gray-400 focus"
          type="text"
          defaultValue={stateAccount}
          placeholder="Tìm kiếm tài khoản theo mã"
          onChange={(e) => setStateAccount(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 md:text-sm md:text-xs text-white font-medium rounded-md p-2 ml-3"
          onClick={searchAcc}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="flex w-full overflow-x-scroll">
        <table className="w-11/12 m-auto bg-white border border-black">
          <thead>
            <tr className="border">
              <th className="border border-black px-3 py-2">STT</th>
              <th className="border border-black px-3 py-2">UserID</th>
              <th className="border border-black px-3 py-2">Số điện thoại</th>
              <th className="border border-black px-3 py-2">Mật khẩu</th>
              <th className="border border-black px-3 py-2">
                Họ tên khách hàng
              </th>
              <th className="border border-black px-3 py-2">
                Trạng thái tài khoản
              </th>
              <th className="border border-black px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts &&
              accounts
                .filter((a) => a.numberPhone !== "0967994185")
                .map((account, index) => (
                  <tr className="text-center">
                    <td className="border border-black px-3 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-black px-3 py-2">
                      {account._id}
                    </td>
                    <td className="border border-black px-3 py-2">
                      {account.numberPhone}
                    </td>
                    <td className="border border-black px-3 py-2">
                      {account.password}
                    </td>
                    <td className="border border-black px-3 py-2">
                      {account.fullName}
                    </td>
                    <td
                      className={`border border-black px-3 py-2 font-medium text-green-400 ${
                        account.status === "Tài khoản đã bị khóa"
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {account.status}
                    </td>
                    <td className="border px-3 py-2 flex gap-5 justify-center">
                      <button
                        type="button"
                        className="w-[100px] h-10 border rounded-md bg-slate-500 text-white"
                        onClick={() => handleViewDetails(account)}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        type="button"
                        className={`w-[150px] p-2 h-10 rounded-md text-white ${
                          account.status === "Tài khoản đã bị khóa"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                        onClick={() => toggleLockAccount(account)}
                      >
                        {account.status === "Đang hoạt động"
                          ? "Khóa tài khoản"
                          : "Mở tài khoản"}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ChiTietTaiKhoan
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        account={selectedAccount}
      />
    </div>
  );
};

export default QuanLyDanhSachTaiKhoan;
