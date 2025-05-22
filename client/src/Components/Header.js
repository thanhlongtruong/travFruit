import { useContext, useEffect, useRef } from "react";
import { CONTEXT } from "../Context/ContextGlobal";
import { Link } from "react-router-dom";

function Header() {
  const {
    setShowInterfaceLogin,
    handleShowOptionSetting_LoginSuccess,
    setShowChatbot,
    isShowChatbot,
  } = useContext(CONTEXT);

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
          alt="logo travfruit"
          src="/logo-header-word.svg"
          className="h-[70px] w-[200px]"
        />

        <span className="uppercase">travfruit</span>
      </Link>

      <ul className="text-base font-semibold uppercase transition-all div-flex-adjust-justify-between w-fit gap-x-10 duration-0 text-[#444444]">
        {!url.includes("/XemDanhSachChuyenBay") &&
          !url.includes("/XemDanhSachChuyenBay/ThanhToan") && (
            <>
              <li>
                <Link
                  to="/about"
                  className="relative flex items-center justify-center p-2 cursor-pointer">
                  Thông tin về TravFruit
                </Link>
              </li>
              {existUser && !url.includes("/about") && (
                <>
                  <li
                    className="relative flex items-center justify-center p-2 cursor-pointer"
                    onClick={() => setShowChatbot(!isShowChatbot)}>
                    Trợ lý
                  </li>
                </>
              )}
            </>
          )}

        {!existUser && (
          <>
            <li className="--i:0">
              <button
                className={`div-flex-adjust-justify-between gap-1 rounded-md border-2 p-[6px] hover:border-[#0194f3] hover:text-white`}
                onClick={() => setShowInterfaceLogin(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#0194f3"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#0194f3"
                  className="size-5">
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
        {existUser && !url.includes("/about") && (
          <button
            className="rounded-md bg-[#0194f3] p-2 text-white"
            onClick={handleShowOptionSetting_LoginSuccess}>
            {existUser.fullName}
          </button>
        )}
      </ul>
    </header>
  );
}

export default Header;
