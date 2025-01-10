import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function AdminLogin() {
const naviLogin = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [isInputting, setIsInputting] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(handleLogin)();
    }
  };

  // func login
  const handleLogin = (data) => {
    const validValues = "1234567890";
    if (validValues !== data.passwordLogin) {
      setError("passwordLogin", {
        type: "manual",
        message: "Mật khẩu không đúng",
      });
    } else {
      naviLogin("/home");
    }
  };

  return (
    <div
      className={`fixed items-center h-full overflow-hidden z-50 flex justify-center w-full bg-white`}
    >
      <div className="w-full h-full cursor-pointer"></div>
      <div
        className={`absolute z-40 h-fit w-[450px] m-auto
         rounded-lg bg-[#444] p-4`}
      >
        <div className="flex items-center w-full text-2xl font-medium mb-7 div-flex-adjust-justify-between h-14 text-slate-700">
          <div className={"Typewriter"}>
            <p>Đăng nhập</p>
          </div>
        </div>
        <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleLogin)}>
          <>
            <div className="w-full mb-6 inputBox">
              <input
                className={`${errors.phoneLogin ? "inputTagBug" : "inputTag"}`}
                required
                pattern="\d*"
                type="number"
                autoFocus
                {...register("phoneLogin", {
                  required: "Your phone",
                  minLength: {
                    value: 10,
                    message: "Phải đủ 10 số",
                  },

                  maxLength: {
                    value: 10,
                    message: "Phải đủ 10 số",
                  },
                  validate: (value) => {
                    const validValues = "0000000000";
                    return (
                      validValues.includes(value.toLowerCase()) ||
                      "Số điện thoại không đúng"
                    );
                  },
                })}
              />
              <span className={`spanTag`}>
                {errors.phoneLogin ? errors.phoneLogin.message : "Your phone"}
              </span>
            </div>

            <div className="w-full mb-6 inputBox">
              <input
                className={`${
                  errors.passwordLogin ? "inputTagBug" : "inputTag"
                }`}
                type="password"
                required
                {...register("passwordLogin", {
                  onChange: () => setIsInputting(true),
                  required: "Your password",
                  validate: (value) => {
                    if (!isInputting) {
                      const validValues = "1234567890";
                      return validValues === value || "Mật khẩu không đúng";
                    }
                    return true; // Nếu đang nhập thì không cần validate
                  },
                })}
              />
              <span className={`spanTag`}>
                {errors.passwordLogin
                  ? errors.passwordLogin.message
                  : "Your Password"}
              </span>
            </div>
          </>

          <div className="boxLogRes">
            <button className={`styleLogin`} type="submit">
              <p className="flex justify-center uppercase">Đăng nhập</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
