import { useContext, useEffect, useRef } from "react";
import { CONTEXT } from "../Context/ContextGlobal";
import { Link } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

function Header() {
  const { setShowInterfaceLogin, handleShowOptionSetting_LoginSuccess } =
    useContext(CONTEXT);

  const { showNotificationSocket, setShowNotificationSocket } =
    useContext(SocketContext);

  const url = window.location.href;

  const existUser = JSON.parse(localStorage.getItem("user")) ?? false;

  const refHeader = useRef(null);
  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (!refHeader.current) return;
      const header = refHeader.current;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        header.classList.add("icon");
      } else {
        header.classList.remove("icon");
      }
      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const payment = localStorage.getItem("payment");

  return (
    <header ref={refHeader} className={``}>
      <Link to="/" className="logo-header">
        <img
          alt=""
          src="/logo-header-word.svg"
          className="h-[70px] w-[200px]"
        />

        <span>TRAVFRUIT</span>
      </Link>
      {!url.includes("/XemDanhSachChuyenbBay/DatChoCuaToi") &&
      !url.includes("/XemDanhSachChuyenbBay/DatChoCuaToi/ThanhToan") ? (
        <ul className="text-base font-semibold uppercase transition-all div-flex-adjust-justify-between w-fit gap-x-10 duration-0 text-[#444444]">
          {/* {existUser && (
            <>
              <li
                className="relative flex items-center justify-center p-2 cursor-pointer"
                onClick={() =>
                  setShowNotificationSocket(!showNotificationSocket)
                }
              >
                <span className="relative flex w-3 h-3 -right-3 -top-3">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
                  <span className="relative inline-flex w-3 h-3 rounded-full bg-sky-500"></span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute z-20 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                  />
                </svg>
              </li>
            </>
          )} */}

          {!existUser && (
            <>
              <li className="--i:0">
                <button
                  className={`div-flex-adjust-justify-between gap-1 rounded-md border-2 p-[6px] hover:border-[#0194f3] hover:text-white`}
                  onClick={() => setShowInterfaceLogin(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#0194f3"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#0194f3"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <p className="font-mono tracking-tight text-sky-500 drop-shadow-md shadow-black">
                    Đăng nhập/ Đăng ký
                  </p>
                </button>
              </li>
            </>
          )}
          {existUser && (
            <button
              className="rounded-md bg-[#0194f3] p-2 text-white"
              onClick={handleShowOptionSetting_LoginSuccess}
            >
              {existUser.fullName}
            </button>
          )}
        </ul>
      ) : (
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="bg-sky-400 rounded-full w-4 h-4 text-center text-white text-xs font-semibold">
              1
            </div>
            <p className="">Chọn chuyến bay</p>
          </div>
          <div className="border-t w-28 mb-5"></div>
          <div className="flex flex-col items-center">
            <span className="relative flex w-4 h-4">
              <span
                className={`absolute inline-flex w-full h-full rounded-full opacity-75 ${!payment && "animate-ping"} bg-sky-400 text-center`}
              ></span>
              <span className="relative w-4 h-4 rounded-full text-center text-white text-xs font-semibold bg-sky-400">
                2
              </span>
            </span>
            <p>Nhập thông tin hành khách</p>
          </div>
          <div className="border-t w-28 mb-5"></div>
          <div className="flex flex-col items-center">
            <span className="relative flex w-4 h-4">
              <span
                className={`absolute inline-flex w-full h-full rounded-full opacity-75 ${payment && "animate-ping"} bg-sky-400 text-center`}
              ></span>
              <span className="relative w-4 h-4 rounded-full text-center text-white text-xs font-semibold bg-sky-400">
                3
              </span>
            </span>
            <p>Thanh toán</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
