import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAll,
  UpdateStatus,
  GetReservaton,
  GetWithIDFLight,
} from "./API/Account.js";
import { bouncy } from "ldrs";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Get as GetDH } from "./API/DonHang.js";
import CatchErrorAPI from "./CatchErrorAPI.jsx";

function AccountUsers() {
  const queryClient = useQueryClient();
  bouncy.register();
  const {
    isLoading,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAll,
    refetchOnWindowFocus: false,
  });

  const [inputSearch, setInputSearch] = useState("");
  const [isUser, setUser] = useState(users?.data || []);

  useEffect(() => {
    setUser(users?.data || []);
  }, [users]);

  const handleSearch = () => {
    if (inputSearch === "") {
      return;
    }
    if (valueInputRadioSearch === "user") {
      const result = users?.data?.filter(
        (user) => user.numberPhone === inputSearch || user._id === inputSearch
      );
      setUser(result || []);

      setShowDetailaccount(null);
    } else if (valueInputRadioSearch === "donhang") {
      mutationGetDH.mutate({ id: inputSearch });
      setShowDetailaccount(null);
    } else if (valueInputRadioSearch === "chuyenbay") {
      mutationGetWithIDFLight.mutate({ idF: inputSearch });
      setShowDetailaccount(null);
    }
  };

  const mutationGetDH = useMutation({
    mutationFn: GetDH,
    onSuccess: (data) => {
      const result = users?.data?.filter(
        (user) => user._id === data?.data?.order?.userId
      );

      setUser(result || []);
    },
  });
  const mutationGetWithIDFLight = useMutation({
    mutationFn: GetWithIDFLight,
    onSuccess: (data) => {
      const userID_data = data?.data?.map((donhang) => donhang.userId);

      const result = users?.data?.filter((user) =>
        userID_data?.includes(user._id)
      );
      setUser(result || []);
    },
    onError: (error) => {
      return (
        <div className="w-full h-full justify-center items-center flex uppercase">
          {error}
        </div>
      );
    },
  });

  const mutationUpdateStatus = useMutation({
    mutationFn: UpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setShowDetailaccount(null);
    },
    onError: (error) => {
      return (
        <div className="w-full h-full justify-center items-center flex uppercase">
          {error}
        </div>
      );
    },
  });

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isUserID, setUserID] = useState("");

  /* 1. trang thai hien option
  2. da huy
  3. da thanh toan
  4. chua thanh toan
  5. all
  */
  const [optionShow, setOptionShow] = useState([
    false,
    false,
    false,
    false,
    true,
  ]);

  const mutationGetReservaton = useMutation({
    mutationFn: GetReservaton,
    onSuccess: (response, data) => {
      queryClient.setQueryData(["userOrders", data.id], response.data.orders);
      setTotalPage(response.data.totalPage);
      setUserID(data.id);
    },
    onError: (error) => {
      return (
        <div className="w-full h-full justify-center items-center flex uppercase">
          {error}
        </div>
      );
    },
  });

  const handlePageClick = async (event) => {
    const types = ["Đã hủy", "Đã thanh toán", "Chưa thanh toán", "All"];
    const firstTrueIndex = optionShow.findIndex(
      (value, index) => value === true && index !== 0
    );

    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    await mutationGetReservaton.mutate({
      id: isUserID,
      page: selectedPage,
      type: types[firstTrueIndex - 1],
    });
  };

  const stateOptionShow = (indexes) => {
    setOptionShow((prev) =>
      prev.map((value, index) => {
        if (indexes.includes(index)) {
          return true;
        }
        return index !== 0 ? false : value;
      })
    );
  };

  const handleChooseOptionShow = async (index) => {
    const types = ["Đã hủy", "Đã thanh toán", "Chưa thanh toán", "All"];
    const page = 1;
    await mutationGetReservaton.mutate({
      id: isUserID,
      page: page,
      type: types[index],
    });

    stateOptionShow([index + 1]);
    setCurrentPage(0);
  };

  const convertDateToVNDate = (dateString) => {
    let vietnamDateTime = new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      //weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return vietnamDateTime;
  };

  const [isShowDetailaccount, setShowDetailaccount] = useState(null);
  const handleShowDetailaccount = useCallback(
    (index) => {
      setShowDetailaccount(isShowDetailaccount === index ? null : index);
      setHistoryVe(null);
    },

    [isShowDetailaccount]
  );

  const [historyVe, setHistoryVe] = useState(null);

  const handleHistoryVe = useCallback(
    (index) => {
      setHistoryVe(historyVe === index ? null : index);
    },
    [historyVe]
  );

  const [valueInputRadioSearch, setValueInputRadioSearch] = useState("user");

  if (isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <l-bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }
  if (error) {
    return (
      <div>Error: {JSON.stringify(error?.response?.data?.error || error)}</div>
    );
  }

  return (
    <>
      {isUser ? (
        <>
          <div className="justify-center flex m-960">
            <h1 className="font-bold text-2xl">
              DANH SÁCH TÀI KHOẢN KHÁCH HÀNG
            </h1>
          </div>
          <div className="p-2 w-11/12 m-auto flex">
            <input
              className="w-1/2 h-[40px] border-b rounded-md shadow-sm focus:outline-none border-b-gray-400 focus bg-transparent px-3"
              type="text"
              placeholder={valueInputRadioSearch}
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
              onClick={() => {
                setUser(users?.data);
                setInputSearch("");
              }}
            >
              Quay lại
            </button>
          </div>
          <div className="p-2 w-11/12 m-auto flex">
            <p className="mr-2">Tìm kiếm người dùng theo: </p>
            {Array.from({ length: 3 }, (_, i) => {
              const topics = ["id, sđt user", "id đơn hàng", "id chuyến bay"];
              const idInputs_htmlFor = ["user", "donhang", "chuyenbay"];
              const nameInputs = ["searchUser", "searchUser", "searchUser"];
              return (
                <ItemInputRadio
                  key={i}
                  topic={topics[i]}
                  idInput={idInputs_htmlFor[i]}
                  htmlFor={idInputs_htmlFor[i]}
                  nameInput={nameInputs[i]}
                  valueInput={idInputs_htmlFor[i]}
                  valueInputRadioSearch={valueInputRadioSearch}
                  setValueInputRadioSearch={setValueInputRadioSearch}
                />
              );
            })}
          </div>

          {mutationGetDH.isError ? (
            <CatchErrorAPI error={mutationGetDH.error} />
          ) : (
            <div className="flex w-full">
              <table className="w-11/12 m-auto bg-transparent">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Số điện thoại</th>
                    <th>Họ tên khách hàng</th>
                    <th>Trạng thái tài khoản</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {isUser?.length > 0 ? (
                    isUser.map((account, index) => (
                      <>
                        <tr className="text-center" key={account.numberPhone}>
                          <td>{index + 1}</td>
                          <td>{account.numberPhone}</td>

                          <td>{account.fullName}</td>
                          <td
                            className={`${
                              account.status === "Tài khoản đã bị khóa"
                                ? "text-red-600"
                                : "text-green-400"
                            }`}
                          >
                            {account.status}
                          </td>
                          <td className="">
                            <div>
                              <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => {
                                  handleShowDetailaccount(index);
                                  mutationGetReservaton.mutate({
                                    id: account._id,
                                  });
                                }}
                              >
                                Chi tiết
                              </button>
                              <span className="mx-1">|</span>
                              <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => {
                                  account.status === "Đang hoạt động"
                                    ? mutationUpdateStatus.mutate({
                                        id: account._id,
                                        status: "lock",
                                      })
                                    : mutationUpdateStatus.mutate({
                                        id: account._id,
                                        status: "unlock",
                                      });
                                }}
                              >
                                {account.status === "Đang hoạt động"
                                  ? "Khóa"
                                  : "Mở"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isShowDetailaccount === index && (
                          <>
                            <tr className="h-fit mb-4">
                              <td className="col-span-4" colSpan={5}>
                                <div className="mb-3 flex">
                                  <li>Thông tin tài khoản : {account._id}</li>

                                  <p className="ml-6">
                                    {" "}
                                    Ngày sinh: {account.birthday}, Giới tính:{" "}
                                    {account.gender}
                                  </p>
                                </div>

                                <div className=" w-full">
                                  <div className="flex gap-x-3">
                                    <li>Đơn hàng : </li>

                                    {Array.from({ length: 4 }, (_, i) => (
                                      <OptionShowHistoryOrder
                                        key={i}
                                        index={i}
                                        content={
                                          i === 0
                                            ? "Đã hủy"
                                            : i === 1
                                            ? "Đã thanh toán"
                                            : i === 2
                                            ? "Chưa thanh toán"
                                            : "Tất cả"
                                        }
                                        stateChoose={
                                          i === 0
                                            ? optionShow[1]
                                            : i === 1
                                            ? optionShow[2]
                                            : i === 2
                                            ? optionShow[3]
                                            : optionShow[4]
                                        }
                                        handleChooseOptionShow={
                                          handleChooseOptionShow
                                        }
                                      />
                                    ))}
                                  </div>
                                  {mutationGetReservaton.isPending && (
                                    <l-bouncy
                                      size="45"
                                      speed="1.75"
                                      color="white"
                                    />
                                  )}

                                  {mutationGetReservaton.isError && (
                                    <CatchErrorAPI
                                      error={mutationGetReservaton.error}
                                    />
                                  )}

                                  {mutationGetReservaton.isSuccess && (
                                    <>
                                      <ol className="flex gap-x-5">
                                        {queryClient.getQueryData([
                                          "userOrders",
                                          account._id,
                                        ])?.length > 0 ? (
                                          queryClient
                                            .getQueryData([
                                              "userOrders",
                                              account._id,
                                            ])
                                            ?.map((order, index) => (
                                              <li
                                                key={order._id}
                                                className="ml-6 w-1/2"
                                              >
                                                {index + 1}. {order._id}
                                                <div>
                                                  <p>
                                                    Số lượng vé:{" "}
                                                    {order.soLuongVe}
                                                  </p>
                                                  <p>
                                                    Tổng giá: {order.tongGia}
                                                  </p>
                                                  <p>
                                                    Trạng thái:{" "}
                                                    {order.trangThai}
                                                  </p>
                                                  <p>
                                                    Ngày đặt:{" "}
                                                    {convertDateToVNDate(
                                                      order.createdAt
                                                    )}
                                                  </p>
                                                  <button
                                                    className="hover:opacity-80 mt-4 flex gap-x-3"
                                                    onClick={() =>
                                                      handleHistoryVe(index)
                                                    }
                                                  >
                                                    Chi tiết vé
                                                    {historyVe !== index ? (
                                                      <ChevronDown />
                                                    ) : (
                                                      <ChevronUp />
                                                    )}
                                                  </button>
                                                  {(historyVe === index &&
                                                    order?.tickets[0]
                                                      ?.flights && (
                                                      <div>
                                                        {order.tickets?.map(
                                                          (ticket, index) => (
                                                            <div
                                                              key={ticket._id}
                                                            >
                                                              {index + 1}.{" "}
                                                              {ticket._id}
                                                              <p className="ml-7">
                                                                Họ và tên:{" "}
                                                                {ticket.Ten}
                                                              </p>
                                                              <p className="ml-7">
                                                                Ngày sinh:{" "}
                                                                {
                                                                  ticket.ngaySinh
                                                                }
                                                              </p>
                                                              <p className="ml-7">
                                                                Loại tuổi:{" "}
                                                                {
                                                                  ticket.loaiTuoi?.split(
                                                                    "thứ"
                                                                  )[0]
                                                                }
                                                              </p>
                                                              <p className="ml-7">
                                                                Hạng vé:{" "}
                                                                {ticket.hangVe}
                                                              </p>
                                                              <p className="ml-7">
                                                                Giá vé:{" "}
                                                                {ticket.giaVe}
                                                              </p>
                                                              <p className="ml-7">
                                                                MCB:{" "}
                                                                {
                                                                  ticket.maChuyenBay
                                                                }
                                                              </p>
                                                              <p className="ml-7">
                                                                CB từ:{" "}
                                                                {
                                                                  ticket.flights
                                                                    .diemBay
                                                                }{" "}
                                                                đến{" "}
                                                                {
                                                                  ticket.flights
                                                                    .diemDen
                                                                }{" "}
                                                                {
                                                                  ticket.flights
                                                                    .ngayBay
                                                                }{" "}
                                                                {
                                                                  ticket.flights
                                                                    .gioBay
                                                                }{" "}
                                                                {
                                                                  ticket.flights
                                                                    .hangBay
                                                                }{" "}
                                                                {
                                                                  ticket.flights
                                                                    .loaiChuyenBay
                                                                }{" "}
                                                              </p>
                                                              <p className="ml-7">
                                                                Trạng thái:{" "}
                                                                {
                                                                  ticket.trangThaiVe
                                                                }
                                                              </p>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    )) ?? (
                                                    <p className="mt-4 uppercase tracking-widest text-center w-full">
                                                      Chuyến bay không tồn tại
                                                    </p>
                                                  )}
                                                </div>
                                              </li>
                                            ))
                                        ) : (
                                          <p className="mt-4 uppercase tracking-widest text-center w-full">
                                            Trống
                                          </p>
                                        )}
                                      </ol>
                                      {queryClient.getQueryData([
                                        "userOrders",
                                        account._id,
                                      ])?.length > 0 && (
                                        <ReactPaginate
                                          className="flex justify-center gap-x-4 text-lg p-4"
                                          nextLabel="next >"
                                          onPageChange={handlePageClick}
                                          pageRangeDisplayed={3}
                                          marginPagesDisplayed={2}
                                          pageCount={totalPage}
                                          previousLabel="< previous"
                                          pageClassName="page-item"
                                          pageLinkClassName="page-link"
                                          previousClassName="page-item"
                                          previousLinkClassName="page-link"
                                          nextClassName="page-item"
                                          nextLinkClassName="page-link"
                                          breakLabel="..."
                                          breakClassName="page-item"
                                          breakLinkClassName="page-link"
                                          containerClassName="pagination"
                                          activeClassName="bg-blue-500 text-white rounded-md w-7 h-full text-center"
                                          renderOnZeroPageCount={null}
                                          forcePage={currentPage}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                      </>
                    ))
                  ) : (
                    <p className="mt-4 uppercase tracking-widest text-center w-full">
                      Trống
                    </p>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full justify-center items-center flex">
          <l-bouncy size="45" speed="1.75" color="white" />
        </div>
      )}
    </>
  );
}

function OptionShowHistoryOrder({
  index,
  content,
  stateChoose,
  handleChooseOptionShow,
}) {
  return (
    <>
      <button
        type="button"
        className={`${
          stateChoose ? "text-[#109AF4]" : "text-white"
        } hover:opacity-80`}
        onClick={() => handleChooseOptionShow(index)}
      >
        {content}
      </button>
      <span className="mx-1">|</span>
    </>
  );
}
OptionShowHistoryOrder.propTypes = {
  index: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  stateChoose: PropTypes.bool.isRequired,
  handleChooseOptionShow: PropTypes.func.isRequired,
};

function ItemInputRadio({
  topic,
  idInput,
  nameInput,
  valueInput,
  htmlFor,
  valueInputRadioSearch,
  setValueInputRadioSearch,
}) {
  return (
    <>
      <input
        className="cursor-pointer mr-2"
        type="radio"
        id={idInput}
        name={nameInput}
        value={valueInput}
        checked={valueInputRadioSearch === idInput}
        onClick={(e) => setValueInputRadioSearch(e.target.value)}
      />
      <label className="cursor-pointer" htmlFor={htmlFor}>
        {topic}
      </label>
      <span className="mx-2">|</span>
    </>
  );
}
ItemInputRadio.propTypes = {
  topic: PropTypes.string.isRequired,
  idInput: PropTypes.string.isRequired,
  nameInput: PropTypes.string.isRequired,
  valueInput: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  valueInputRadioSearch: PropTypes.string.isRequired,
  setValueInputRadioSearch: PropTypes.func.isRequired,
};
export default AccountUsers;
