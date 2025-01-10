import { memo } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { OptionSetting } from "./OptionSetting";
import History from "./HistoryTicket";
import { useLocation } from "react-router-dom";
import InterFaceLogin from "../Home/InterFaceLogin";
import { ToastContainer } from "react-toastify";

function Setting() {
  const location = useLocation();
  const isInfoAccount = location.pathname === "/Setting/InfoAccount";

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="w-full p-5 h-fit bg-slate-100">
        <div className="w-[80%] h-fit flex gap-x-3 m-auto justify-between">
          <div className="w-0 h-0 lg:w-[30%] lg:h-fit overflow-hidden rounded-lg border bg-white border-[#0194F3] shadow-2xl shadow-blue-500/50">
            <OptionSetting />
          </div>
          <div className="w-full lg:w-[65%] h-fit overflow-auto rounded-lg border bg-white shadow-2xl shadow-blue-500/50 border-[#0194F3]">
            {isInfoAccount ? (
              <InterFaceLogin registerTrue={true} />
            ) : (
              <History />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default memo(Setting);
