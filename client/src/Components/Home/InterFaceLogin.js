import { memo, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CONTEXT } from "../../Context/ContextGlobal";
import { Get, Login, Register, Update } from "../../API/Account.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bouncy } from "ldrs";

function InterFaceLogin({ registerTrue = false }) {
  const queryClient = useQueryClient();

  bouncy.register();
  const { setShowInterfaceLogin, showNotification } = useContext(CONTEXT);

  const user = JSON.parse(localStorage.getItem("user"));

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    setError: setErrorLogin,
    formState: { errors: errorsLogin },
  } = useForm();
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    reset: resetRegister,
    setError: setErrorRegister,
    formState: { errors: errorsRegister },
  } = useForm();
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setError: setErrorUpdate,
    formState: { errors: errorsUpdate },
  } = useForm();

  const [addSVG, setAddSVG] = useState([
    !registerTrue ? false : true,
    registerTrue ? true : false,
  ]);

  const [showChoosePassword, setShowChoosePassword] = useState(false);

  const refLogin = useRef(null);
  const refRegister = useRef(null);
  const refUpdate = useRef(null);

  //func keyboard
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowInterfaceLogin(false);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      !addSVG[0] && handleSubmitLogin(submitLogin)();
    }
  };

  const handleSwapClasses = (type) => {
    if (registerTrue) {
      return;
    }
    if (!refLogin.current) {
      return;
    }
    const btnLogin = refLogin.current?.className;
    const btnRegister = refRegister.current?.className;

    if (type === "Log" && btnLogin === "styleLogin") {
      return;
    } else {
      resetLogin();
    }
    if (type === "Res" && btnRegister === "styleLogin") {
      return;
    } else {
      resetRegister();
    }

    setAddSVG((prev) => [!prev[0], !prev[1]]);
    refLogin.current.className = btnRegister;
    refRegister.current.className = btnLogin;
  };

  const mutationLogin = useMutation({
    mutationFn: Login,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorLogin("phoneLogin", {
            message: "Số điện thoại này chưa đăng kí",
          });
        }
        if (error.response.status === 403) {
          setErrorLogin("phoneLogin", {
            message: "Số điện thoại này đã bị khóa",
          });
        }
        if (error.response.status === 400) {
          setErrorLogin("passwordLogin", {
            message: "Sai mật khẩu",
          });
        }
      } else {
        setErrorLogin("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });

  const mutationGet = useMutation({
    mutationFn: Get,
    mutationKey: ["user"],
    onSuccess: (response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
      setShowInterfaceLogin(false);
      showNotification("Đăng nhập thành công", "Success");
    },
  });

  const mutationRegister = useMutation({
    mutationFn: Register,
    onSuccess: (response) => {
      setShowInterfaceLogin(false);
      showNotification("Đăng kí thành công", "Success");
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorRegister("InternalServerError", {
            message: "Kiểm tra lại thông tin",
          });
        }
        if (error.response.status === 409) {
          setErrorRegister("phone", {
            message: "Số điện thoại đã tồn tại",
          });
        }
        if (error.response.status === 500) {
          setErrorRegister("InternalServerError", {
            message: "ServerError",
          });
        }
      } else {
        setErrorRegister("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });

  const submitLogin = async (data) => {
    const response = await mutationLogin.mutateAsync(data);
    if (response.status === 200) {
      await mutationGet.mutate();
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const submitRegister = async (data) => {
    const response = await mutationRegister.mutateAsync(data);
    if (response.status === 200) {
    }
  };

  const mutationUpdate = useMutation({
    mutationFn: Update,
    onSuccess: (response) => {
      if (response?.data?.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        queryClient.invalidateQueries("user");
      }
      showNotification("Cập nhật thông tin thành công", "Success");
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorUpdate("InternalServerError", {
            message: "Tài khoản không tồn tại",
          });
        }
        if (error.response.status === 409) {
          setErrorUpdate("phone", {
            message: "đã tồn tại",
          });
        }
        if (error.response.status === 400) {
          if (error.response.data.message === "Old password Fail") {
            setErrorUpdate("password", {
              message: "mật khẩu cũ sai",
            });
          }
        }
        if (error.response.status === 409) {
          setErrorUpdate("InternalServerError", {
            message: "Update Fail",
          });
        }
      } else {
        setErrorUpdate("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });
  const funcUpdate = async (data) => {
    const payload = {
      numberPhone: data.phone,
      fullName: data.fullName,
      gender: data.gender,
      birthday: data.birthday,
      password: showChoosePassword && data.password,
      newPassword: showChoosePassword && data.newPassword,
    };
    await mutationUpdate.mutateAsync(payload);
  };

  return (
    <>
      <div
        className={`${!registerTrue ? "fixed items-center h-full" : `relative items-start ${showChoosePassword ? "h-[519px]" : "h-[371px] "}`} overflow-hidden z-50 flex justify-center w-full`}
      >
        <div
          className={`absolute z-40 h-fit ${!registerTrue ? "w-[450px] m-auto" : "w-full"}  rounded-lg bg-[#444] p-4`}
        >
          <div className="flex items-center w-full text-2xl font-medium mb-7 div-flex-adjust-justify-between h-14 text-slate-700">
            <div
              className={"Typewriter"}
              {...(!addSVG[0]
                ? registerLogin
                : registerTrue
                  ? registerUpdate
                  : registerRegister)("InternalServerError")}
            >
              <p>
                {errorsRegister.InternalServerError
                  ? errorsRegister.InternalServerError.message
                  : errorsLogin.InternalServerError
                    ? errorsLogin.InternalServerError.message
                    : addSVG[0]
                      ? !registerTrue
                        ? "Đăng ký"
                        : "Thông tin tài khoản"
                      : "Đăng nhập"}
              </p>
            </div>

            <div
              className="w-[10%] cursor-pointer"
              onClick={() => setShowInterfaceLogin(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                className="transition duration-200 size-7 hover:stroke-rose-600 stroke-teal-400 hover:duration-500 animate-pulse hover:size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <form
            onKeyDown={handleKeyDown}
            onSubmit={
              registerTrue
                ? handleSubmitUpdate(funcUpdate)
                : !addSVG[0]
                  ? handleSubmitLogin(submitLogin)
                  : handleSubmitRegister(submitRegister)
            }
          >
            {!addSVG[0] ? (
              <>
                <div className="w-full mb-6 inputBox">
                  <input
                    className={`${errorsLogin.phoneLogin ? "inputTagBug" : "inputTag"}`}
                    type="number"
                    required
                    autoFocus
                    {...registerLogin("phoneLogin", {
                      required: "Your phone",
                      minLength: {
                        value: 10,
                        message: "Phải đủ 10 số",
                      },

                      maxLength: {
                        value: 10,
                        message: "Phải đủ 10 số",
                      },
                    })}
                  />
                  <span className={`spanTag`}>
                    {errorsLogin.phoneLogin
                      ? errorsLogin.phoneLogin.message
                      : "Your phone"}
                  </span>
                </div>

                <div className="w-full mb-6 inputBox">
                  <input
                    className={`${errorsLogin.passwordLogin ? "inputTagBug" : "inputTag"}`}
                    type="password"
                    required
                    {...registerLogin("passwordLogin", {
                      required: "Your password",
                    })}
                  />
                  <span className={`spanTag`}>
                    {errorsLogin.passwordLogin
                      ? errorsLogin.passwordLogin.message
                      : "Your Password"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <>
                  <div
                    className={`${registerTrue ? "flex justify-between" : "flex flex-col"}`}
                  >
                    <div
                      className={`${registerTrue ? "w-[60%]" : "w-full"} mb-6 inputBox`}
                    >
                      <input
                        className={`${errorsRegister.fullName ? "inputTagBug" : errorsUpdate.fullName ? "inputTagBug" : "inputTag"}`}
                        type="text"
                        defaultValue={user?.fullName}
                        required
                        {...(registerTrue ? registerUpdate : registerRegister)(
                          "fullName",
                          {
                            required: "full name",
                            minLength: {
                              value: 2,
                              message: "Ít nhất 2 kí tự",
                            },
                            maxLength: {
                              value: 50,
                              message: "Nhiều nhất 50 kí tự",
                            },
                            pattern: {
                              value: /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
                              message: "Nhập chữ",
                            },
                          }
                        )}
                      />
                      <span className={`spanTag`}>
                        {errorsRegister.fullName
                          ? errorsRegister.fullName.message
                          : errorsUpdate.fullName
                            ? errorsUpdate.fullName.message
                            : "FULL NAME"}
                      </span>
                    </div>
                    <div
                      className={`${registerTrue ? "w-[30%]" : "w-full"} mb-6 inputBox`}
                    >
                      <input
                        className={`${errorsRegister.phone ? "inputTagBug" : errorsUpdate.phone ? "inputTagBug" : "inputTag"}`}
                        type="number"
                        defaultValue={user?.numberPhone}
                        required
                        {...(registerTrue ? registerUpdate : registerRegister)(
                          "phone",
                          {
                            required: "Your phone",
                            minLength: {
                              value: 10,
                              message: "Phải đủ 10 số",
                            },

                            maxLength: {
                              value: 10,
                              message: "Phải đủ 10 số",
                            },
                          }
                        )}
                      />
                      <span className={`spanTag`}>
                        {errorsRegister.phone
                          ? errorsRegister.phone.message
                          : errorsUpdate.phone
                            ? errorsUpdate.phone.message
                            : "Your phone"}
                      </span>
                    </div>
                  </div>
                </>

                <div className="flex justify-between">
                  <div className="mb-6 inputBox w-[50%]">
                    <input
                      className={`${errorsRegister.gender ? "inputTagBug" : errorsUpdate.gender ? "inputTagBug" : "inputTag"}`}
                      type="text"
                      defaultValue={user?.gender}
                      required
                      {...(registerTrue ? registerUpdate : registerRegister)(
                        "gender",
                        {
                          validate: (value) => {
                            const validValues = [
                              "nam",
                              "nữ",
                              "nu",
                              "female",
                              "male",
                            ];
                            return (
                              validValues.includes(value.toLowerCase()) ||
                              "nam/nu/female/male"
                            );
                          },
                          required: "giới tính",
                          minLength: {
                            value: 2,
                            message: "nam/nu/female/male",
                          },
                        }
                      )}
                    />
                    <span className={`spanTag`}>
                      {errorsRegister.gender
                        ? errorsRegister.gender.message
                        : errorsUpdate.gender
                          ? errorsUpdate.gender.message
                          : "Giới tính"}
                    </span>
                  </div>
                  <div className="mb-6 inputBox w-[40%]">
                    <input
                      className={`${errorsRegister.birthday ? "inputTagBug" : errorsUpdate.birthday ? "inputTagBug" : "inputExist"}`}
                      type="date"
                      defaultValue={user?.birthday}
                      required
                      {...(registerTrue ? registerUpdate : registerRegister)(
                        "birthday",
                        {
                          required: "birthday",
                          validate: {
                            validAge: (value) => {
                              const today = new Date();
                              const birthDate = new Date(value);
                              const age =
                                today.getFullYear() - birthDate.getFullYear();
                              const isBirthdayPassed =
                                today.getMonth() > birthDate.getMonth() ||
                                (today.getMonth() === birthDate.getMonth() &&
                                  today.getDate() >= birthDate.getDate());

                              return (
                                (age >= 12 && age <= 80 && isBirthdayPassed) ||
                                "12 đến 80 tuổi"
                              );
                            },
                          },
                        }
                      )}
                    />
                    <span className={`spanTag`}>
                      {errorsRegister.birthday
                        ? errorsRegister.birthday.message
                        : errorsUpdate.birthday
                          ? errorsUpdate.birthday.message
                          : "birthday"}
                    </span>
                  </div>
                </div>

                {registerTrue && (
                  <button
                    className={`p-2 border-teal-400 text-teal-400 mb-6 transition-all duration-200 border rounded-md font-semibold hover:text-white`}
                    ref={refUpdate}
                    type="button"
                    onClick={() => setShowChoosePassword(!showChoosePassword)}
                  >
                    <p className="flex justify-center uppercase">
                      Đổi mật khẩu
                    </p>
                  </button>
                )}

                {!registerTrue ? (
                  <div className="w-full mb-6 inputBox">
                    <input
                      className={`${errorsRegister.password ? "inputTagBug" : "inputTag"}`}
                      type="password"
                      required
                      {...registerRegister("password", {
                        required: "password",
                        minLength: {
                          value: 8,
                          message: "Ít nhất 8 kí tự",
                        },
                      })}
                    />

                    <span className={`spanTag`}>
                      {errorsRegister.password
                        ? errorsRegister.password.message
                        : "password"}
                    </span>
                  </div>
                ) : (
                  <>
                    {showChoosePassword && (
                      <>
                        <div className="w-full mb-6 inputBox">
                          <input
                            className={`${errorsUpdate.password ? "inputTagBug" : "inputTag"}`}
                            type="password"
                            required
                            {...registerUpdate("password", {
                              required: "old password",
                            })}
                          />

                          <span className={`spanTag`}>
                            {errorsUpdate.password
                              ? errorsUpdate.password.message
                              : "old password"}
                          </span>
                        </div>

                        <div className="w-full mb-6 inputBox">
                          <input
                            className={`${errorsUpdate.newPassword ? "inputTagBug" : "inputTag"}`}
                            type="password"
                            required
                            {...registerUpdate("newPassword", {
                              required: "New password",
                              minLength: {
                                value: 8,
                                message: "Ít nhất 8 kí tự",
                              },
                            })}
                          />
                          <span className={`spanTag`}>
                            {errorsUpdate.newPassword
                              ? errorsUpdate.newPassword.message
                              : "new password"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <div className="boxLogRes">
              {registerTrue ? (
                <>
                  <button
                    className={`styleLogin flex justify-center`}
                    type="submit"
                    ref={refUpdate}
                  >
                    {mutationUpdate.isPending ? (
                      <>
                        <l-bouncy size="35" speed="1.75" color="white" />
                      </>
                    ) : (
                      <p className="uppercase">
                        Cập nhật thông tin tài khoản &#160;
                        {showChoosePassword ? <span>và đổi mật khẩu</span> : ""}
                      </p>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    ref={refLogin}
                    className={`styleLogin`}
                    type="submit"
                    onClick={() => handleSwapClasses("Log")}
                  >
                    <p className="flex justify-center uppercase">
                      {addSVG[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6 animate-bounce-hozi"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      )}
                      {mutationLogin.isPending || mutationGet.isPending ? (
                        <l-bouncy size="35" speed="1.75" color="white" />
                      ) : (
                        "Đăng nhập"
                      )}
                    </p>
                  </button>
                  <button
                    ref={refRegister}
                    className={`styleRes`}
                    type="submit"
                    onClick={() => handleSwapClasses("Res")}
                  >
                    <p className="flex justify-center uppercase">
                      {mutationRegister.isPending ? (
                        <l-bouncy size="35" speed="1.75" color="white" />
                      ) : (
                        "Đăng kí"
                      )}

                      {!addSVG[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6 animate-bounce-hozi"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      )}
                    </p>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default memo(InterFaceLogin);
