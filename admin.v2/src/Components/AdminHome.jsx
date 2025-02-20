import { Link, useNavigate } from "react-router";
import PropTypes from "prop-types";
import AccountUsers from "./AccountUsers";
import AdminChuyenBay from "./AdminChuyenBay";
import { useMutation } from "@tanstack/react-query";
import { Logout } from "./API/Account";
import CatchErrorAPI from "./CatchErrorAPI";
export default function AdminHome({ type }) {
  const naviLogin = useNavigate();

  const mututionLogout = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      naviLogin("/");
    },
  });
  return (
    <>
      <div className="flex justify-between p-5 w-full h-screen bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png')] bg-center bg-no-repeat bg-cover overflow-hidden">
        <div className="flex flex-col font-medium  w-[17%] rounded-lg h-fit overflow-hidden font-mono">
          <p className="p-4 border-b">Quản lý</p>
          <Link to="/home" className="p-4 hover:opacity-80">
            Tài Khoản người dùng
          </Link>

          <Link to="/home/chuyenbay" className="p-4 hover:opacity-80">
            Chuyến bay
          </Link>

          <Link to="/QuanLyDonHang" className="p-4 hover:opacity-80">
            Go to client
          </Link>
          <Link
            to="https://github.com/thanhlongtruong/vercel-travrel"
            className="p-4 hover:opacity-80"
          >
            Go to Github
          </Link>
          <button
            onClick={mututionLogout.mutate}
            className="p-4 hover:opacity-80 text-left"
          >
            {mututionLogout.isPending ? (
              <l-bouncy size="30" speed="1.75" color="white" />
            ) : (
              "Đăng xuất"
            )}
          </button>
          {mututionLogout.isError && (
            <CatchErrorAPI error={mututionLogout.error} />
          )}
        </div>
        <div className="w-[81%] overflow-auto">
          {type === "accountuser" ? (
            <AccountUsers />
          ) : type === "chuyenbay" ? (
            <AdminChuyenBay />
          ) : (
            <AccountUsers />
          )}
        </div>
      </div>
    </>
  );
}

AdminHome.propTypes = {
  type: PropTypes.string.isRequired,
};
