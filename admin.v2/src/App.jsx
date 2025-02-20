import { Route, Routes } from "react-router-dom";
import AdminLogin from "./Components/AdminLogin";
import AdminHome from "./Components/AdminHome";
import Page404 from "./Components/Page404";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "./Components/FallbackComponent";

function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Routes>
        <Route path="/home" element={<AdminHome type="accountuser" />} />
        <Route
          path="/home/chuyenbay"
          element={<AdminHome type="chuyenbay" />}
        />
        <Route path="/" element={<AdminLogin />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
