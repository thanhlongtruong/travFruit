import { memo } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { OptionSetting } from "./OptionSetting";
import History from "./HistoryTicket";
import { useLocation } from "react-router-dom";
import InterFaceLogin from "../Home/InterFaceLogin";
import { ToastContainer } from "react-toastify";
import CountdownTimer from "../Utils/CountdownTimer";
import { useContext } from "react";
import { CONTEXT } from "../../Context/ContextGlobal";
import { Helmet } from "react-helmet-async";

function Setting() {
  const location = useLocation();
  const isInfoAccount = location.pathname === "/Setting/InfoAccount";

  const { QR_VietQR, setQR_VietQR, timeExpired_VietQR, orderId_VietQR } =
    useContext(CONTEXT);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ToastContainer />
      <Header />
      {QR_VietQR && timeExpired_VietQR && (
        <div
          className="w-full h-full bg-white/50 backdrop-brightness-75 fixed z-[100]"
          onClick={() => setQR_VietQR(null)}
        >
          <div className="w-96 h-96 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={QR_VietQR} alt="QR-VietQR" />
            <CountdownTimer
              targetTime={timeExpired_VietQR}
              orderId={orderId_VietQR}
            />
          </div>
        </div>
      )}
      <div className="w-full p-5 h-full bg-slate-100">
        <div className="w-[80%] h-full flex gap-x-3 m-auto justify-between">
          <div className="w-0 h-0 lg:w-[30%] lg:h-fit overflow-hidden rounded-lg border bg-white border-[#0194F3] shadow-2xl shadow-blue-500/50">
            <OptionSetting />
          </div>
          <div className="w-full lg:w-[65%] h-full overflow-auto rounded-lg border bg-white shadow-2xl shadow-blue-500/50 border-[#0194F3]">
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
