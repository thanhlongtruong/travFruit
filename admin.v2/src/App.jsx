import { Route, Routes } from "react-router";
import AdminLogin from "./Components/AdminLogin";
import AdminHome from "./Components/AdminHome";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<AdminHome />} />

      <Route path="/" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
