import { useMutation } from "@tanstack/react-query";
import { Create3M, Create3MVerify } from "./API/ChuyenBay";
import { toast, ToastContainer } from "react-toastify";
import { useToastOptions } from "./CustomToast";
import { bouncy } from "ldrs";
import CatchErrorAPI from "./CatchErrorAPI";
import { useEffect, useState } from "react";

function AdminCreateFlight3M() {
  bouncy.register();

  const [isVerify, setIsVerify] = useState(null);

  useEffect(() => {
    const handleURLParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verify = urlParams.get("verify");

      if (verify) {
        setIsVerify(verify);
      }
    };

    handleURLParams();
  }, []);

  const mutationCreate3MVerify = useMutation({
    mutationFn: Create3MVerify,
    onSuccess: (response) => {
      toast.success(`${response?.data?.message}`, useToastOptions);
    },
  });
  const mutationCreate3M = useMutation({
    mutationFn: Create3M,
    onSuccess: (response) => {
      toast.success(`${response?.data?.message}`, useToastOptions);
    },
  });
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl">TẠO CHUYẾN BAY CHO 3 THÁNG</h1>
      </div>
      <ul className="list-disc">
        <p>
          <span className="font-bold text-yellow-500">CAUTION:</span> dành cho
          tạo chuyến bay cho 3 tháng ~ 90 ngày
        </p>
        <li>Xóa tất cả chuyến bay trước đó.</li>
        <li>Chuyến bay sẽ tạo ngẫu nhiên với 7 chuyến/ngày.</li>
      </ul>
      <button
        className="bg-blue-500 text-white p-2 rounded-lg"
        onClick={() => {
          if (isVerify === null) {
            mutationCreate3MVerify.mutate();
          } else {
            mutationCreate3M.mutate({ verify: isVerify });
          }
        }}
      >
        {mutationCreate3MVerify.isPending || mutationCreate3M.isPending ? (
          <l-bouncy size="30" speed="1.75" color="white" />
        ) : isVerify === null ? (
          "Gửi verify qua email"
        ) : (
          "Xác nhận tạo chuyến bay"
        )}
      </button>
      {mutationCreate3MVerify.isError ||
        (mutationCreate3M.isError && (
          <CatchErrorAPI
            error={mutationCreate3MVerify.error || mutationCreate3M.error}
            handleAgain={() => {
              setIsVerify(null);
              const url = window.location.origin + window.location.pathname;
              window.history.replaceState(null, "", url);
              window.location.reload();
            }}
          />
        ))}
    </>
  );
}

export default AdminCreateFlight3M;
