import { useContext, useEffect, useState } from "react";
import { CONTEXT } from "../Context/ContextAdmin.js";

export function Login() {
  const {
    handleShowInterfaceLogin,
    handleEventLogin,
    setUser,
    isInputPassword,
    setInputPassword,
    setGet_Id_User,
  } = useContext(CONTEXT);

  const [isValidPhone_Email, setIsValidPhone_Email] = useState(true);
  const [isPhone, setPhone] = useState("");
  const [isStatePhone, setStatePhone] = useState(false);
  const [isInput, setCheckInput] = useState("");
  const [isNotFindPhone, setNotFindPhone] = useState(false);

  const [isShowNotiFailRegister, setShowNotiFailRegister] = useState(false);
  const [isShowNotiSuccesRegister, setShowNotiSuccesRegister] = useState(false);
  const [isResetStateRes_to_Login, setResetStateRes_to_Login] = useState(false);

  useEffect(() => {
    if (isInput && isInput.length >= 1) {
      if (/^\d{10}$/.test(isInput) && isInput.trim().length === 10) {
        setStatePhone(true);
      } else {
        setStatePhone(false);
      }
    } else {
    }
  }, [isInput]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/FormCheck.js
          `https://adminverold.vercel.app/api/get_user/find_number_phone/${isInput}`
=======
          `https://travrel-server.vercel.app/api/get_user/find_number_phone/${isInput}`
>>>>>>> mainv2:admin/src/Components/FormCheck.js
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data);
        setIsValidPhone_Email(true);
        setGet_Id_User(data._id);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
        setIsValidPhone_Email(false);
      }
    };
    fetchAccount();
  }, [isInput, isResetStateRes_to_Login]);

  useEffect(() => {
    if (!isValidPhone_Email && isStatePhone) {
      setNotFindPhone(true);
    } else {
      setNotFindPhone(false);
    }
  }, [isValidPhone_Email, isStatePhone]);

  if (isShowNotiFailRegister) {
    setTimeout(() => {
      setShowNotiFailRegister(false);
    }, 2000);
  }
  if (isShowNotiSuccesRegister) {
    setTimeout(() => {
      setShowNotiSuccesRegister(false);
    }, 2000);
  }
  //Unscrollable screen
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Clean up by re-enabling scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed z-50 flex h-full w-full items-center justify-center bg-white/10 backdrop-brightness-75 ">
      <div
        onClick={handleShowInterfaceLogin}
        className="absolute z-20 w-full h-full"
      ></div>
      <div className="absolute z-40 lg:m-auto lg:h-fit h-full md:h-fit md:w-[450px] lg:w-[450px] rounded-lg bg-white p-4 w-full ">
        <div className="div-flex-adjust-justify-between flex h-14 w-full">
          <p className="w-[90%] text-2xl font-bold"> Đăng nhập</p>
          <div className="w-[10%]" onClick={handleShowInterfaceLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="my-2 mb-5">
          <p className="p-0 text-base font-medium text-slate-500">
            Số điện thoại di động
          </p>

          <input
            onChange={(e) => setCheckInput(e.target.value)}
            value={isInput}
            className="w-full rounded-md border-2 p-2 font-medium hover:border-cyan-400"
            placeholder="Ví dụ: +84901234567"
            size="10"
          ></input>

          <p className="p-0 text-base font-medium text-slate-500 mt-5">
            Mật khẩu
          </p>
          <input
            type="password"
            onChange={(e) => setInputPassword(e.target.value)}
            value={isInputPassword}
            className="w-full rounded-md border-2 p-2 font-medium hover:border-cyan-400"
            placeholder="Nhập mật khẩu ở đây"
          />
        </div>
        {!isValidPhone_Email && !isNotFindPhone && (
          <div className="w-full rounded-md bg-slate-200 p-2 text-center font-bold text-slate-400 select-none pointer-events-none">
            Tiếp tục
          </div>
        )}
        {isValidPhone_Email && (
          <div
            className="w-full rounded-md bg-orange-500 p-2 text-center font-bold text-white cursor-pointer"
            onClick={() => {
              handleEventLogin();
            }}
          >
            Đăng nhập
          </div>
        )}
      </div>
    </div>
  );
}
