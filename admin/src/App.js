import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import AdminHome from "./Components/AdminHome.js";
import QuanLyDanhSachTaiKhoan from "./Components/QuanLyDanhSachTaiKhoan.js";
import DanhSachChuyenBay from "./Components/DanhSachChuyenBay.js";
import { Login } from "./Components/FormCheck.js";
import QuanLyVe from "./Components/QuanLyVe.js";
import QuanLyDonHang from "./Components/QuanLyDonHang.js";

function App() {
  return (
    <Routes>
      <Route path="/AdminHome" element={<AdminHome />} />
      <Route
        path="/QuanLyDanhSachTaiKhoan"
        element={<QuanLyDanhSachTaiKhoan />}
      />
      <Route path="/DanhSachChuyenBay_Admin" element={<DanhSachChuyenBay />} />
      <Route path="/QuanLyVe" element={<QuanLyVe />} />
      <Route path="/QuanLyDonHang" element={<QuanLyDonHang />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
