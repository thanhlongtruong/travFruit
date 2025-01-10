import { Route, Routes } from "react-router-dom";
import DatChoCuaToi from "./Components/Plane/DatChoCuaToi.js";
import { Home } from "./Components/Home/Home.js";
import Setting from "./Components/Setting/Setting.js";
import XemDanhSachChuyenBay from "./Components/Plane/XemDanhSachChuyenBay.js";
import TrangThanhToan from "./Components/TrangThanhToan.js";
import { Notification } from "./Components/Noti/NotificationSocket.js";

function App() {
  return (
    <>
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/XemDanhSachChuyenBay"
          element={<XemDanhSachChuyenBay />}
        />
        <Route path="/Setting/InfoAccount" element={<Setting />} />
        <Route path="/Setting/HistoryTicket" element={<Setting />} />
        <Route
          path="/XemDanhSachChuyenbBay/DatChoCuaToi"
          element={<DatChoCuaToi />}
        />
        <Route
          path="/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan"
          element={<TrangThanhToan />}
        />
      </Routes>
    </>
  );
}

export default App;
