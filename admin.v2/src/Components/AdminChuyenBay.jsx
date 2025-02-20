import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetAll, Get, Update } from "./API/ChuyenBay";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import moment from "moment";
import { Field, Label, Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { bouncy } from "ldrs";
import { GetWithIDFLight } from "./API/Account";
import CatchErrorAPI from "./CatchErrorAPI";

function AdminChuyenBay() {
  bouncy.register();
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlights, setFlights] = useState(0);
  const [inputSearch, setInputSearch] = useState("");

  const {
    isLoading,
    error,
    data: flights,
  } = useQuery({
    queryKey: ["flights"],
    queryFn: GetAll,
  });

  useEffect(() => {
    if (flights) {
      setTotalPage(flights?.data?.totalPage);
      setFlights(flights?.data?.flights);
    }
  }, [flights]);

  const mutationPageFlights = useMutation({
    mutationFn: GetAll,
    onSuccess: (response) => {
      setFlights(response?.data?.flights || []);
      setTotalPage(response.data.totalPage);
    },
  });

  const mutationGetFlights = useMutation({
    mutationFn: Get,
    onSuccess: (response) => {
      setCurrentPage(0);
      setTotalPage(0);
      setShowDetailFlight(null);
      setFlights(response?.data?.flight || []);
    },
  });
  const handlePageClick = async (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    await mutationPageFlights.mutate({
      page: selectedPage,
    });
  };

  const [isShowHideLoaiCB, setShowHideLoaiCB] = useState([true, true]);

  const handleShowHideLoaiCB = (index) => {
    console.log(index, isShowHideLoaiCB);
    setShowHideLoaiCB((pre) => {
      const arr = [...pre];
      arr[index] = !pre[index];
      return arr;
    });
  };

  const [isShowDetailFlight, setShowDetailFlight] = useState(null);

  const handleShowDetailFlight = useCallback(
    (index) => {
      setShowDetailFlight(isShowDetailFlight === index ? null : index);
    },
    [isShowDetailFlight]
  );
  const [showAirports, setShowAirports] = useState([false, false, false]);
  const [showAirline, setShowAirline] = useState(false);
  const handleShowAirports = (indexs, booleans) => {
    setShowAirports((pre) => {
      const arrStateShowAirports = [...pre];

      indexs.forEach((index, i) => {
        arrStateShowAirports[index] = booleans[i];
      });

      return arrStateShowAirports;
    });
  };

  const [enabledUpdate, setEnabledUpdate] = useState(false);

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

  if (isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <l-bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        Error: {JSON.stringify(error?.response?.data?.error || error.code)}
      </div>
    );
  }

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
        <h1 className="font-bold text-2xl">DANH SÁCH CHUYẾN BAY</h1>
      </div>
      <div className="p-2 w-11/12 m-auto flex">
        <input
          className="w-1/2 h-[40px] border-b rounded-md shadow-sm focus:outline-none border-b-gray-400 focus bg-transparent px-3"
          type="text"
          value={inputSearch}
          placeholder="Tìm kiếm theo id"
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
          onClick={() => mutationGetFlights.mutate({ id: inputSearch })}
        >
          {mutationGetFlights.isPending ? (
            <l-bouncy size="30" speed="1.75" color="white" />
          ) : (
            "Tìm kiếm"
          )}
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
          onClick={() => {
            setFlights(flights?.data?.flights);
            setInputSearch("");
            setTotalPage(flights?.data?.totalPage);
            setCurrentPage(0);
          }}
        >
          Quay lại
        </button>
      </div>

      {mutationGetFlights.isError || mutationPageFlights.isError ? (
        <CatchErrorAPI
          error={mutationGetFlights.error || mutationPageFlights.error}
        />
      ) : (
        <>
          {isFlights?.length > 0 ? (
            <>
              <div className="flex w-full">
                <table className="w-11/12 m-auto bg-transparent">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Nơi đi - Nơi đến</th>
                      <th>Thời gian đi</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFlights.map((flight, index) => (
                      <>
                        <tr
                          key={index}
                          className="cursor-pointer"
                          onClick={() => handleShowHideLoaiCB(index)}
                        >
                          <td colSpan={5} className="text-center">
                            <div className="flex w-full justify-center gap-x-5">
                              {flight._id}

                              {isShowHideLoaiCB[index] ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}
                            </div>
                          </td>
                        </tr>
                        {isFlights[index].flights.map((flight_, index_) => (
                          <>
                            <tr
                              key={index_}
                              className={`transition-all duration-700 ease-in-out transform ${
                                isShowHideLoaiCB[index]
                                  ? ""
                                  : "hidden opacity-0"
                              }`}
                            >
                              <td>{index_ + 1}</td>
                              <td>
                                {flight_.diemBay} - {flight_.diemDen}
                              </td>
                              <td>
                                {flight_.ngayBay} {flight_.gioBay}
                              </td>
                              <td>{flight_.gia}</td>
                              <td className="">
                                <div>
                                  <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => {
                                      handleShowDetailFlight(flight_._id);
                                    }}
                                  >
                                    Chi tiết
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {isShowDetailFlight === flight_._id && (
                              <tr
                                className="h-fit mb-4"
                                onClick={() => {
                                  handleShowAirports(
                                    [0, 1, 2],
                                    [false, false, false]
                                  );
                                  setShowAirline(false);
                                }}
                              >
                                <td className="col-span-4" colSpan={5}>
                                  <div className="mb-3">
                                    <div className="flex gap-x-4">
                                      <li>
                                        Thông tin chuyến bay {flight_._id}{" "}
                                      </li>{" "}
                                      <Field className="flex gap-x-4">
                                        <Label className="cursor-pointer">
                                          Update
                                        </Label>
                                        <Switch
                                          checked={enabledUpdate}
                                          onChange={setEnabledUpdate}
                                          className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-6 group-data-[checked]:bg-zinc-800"
                                          />
                                        </Switch>
                                      </Field>
                                    </div>
                                    <div className="ml-6">
                                      <p>
                                        Loại chuyến bay: {flight_.loaiChuyenBay}{" "}
                                      </p>
                                      <p>
                                        Thời gian đến: {flight_.ngayDen}{" "}
                                        {flight_.gioDen}
                                      </p>
                                      <p>Hãng bay: {flight_.hangBay}</p>
                                      <p>
                                        Số ghế phổ thông còn{" "}
                                        {flight_.soGhePhoThong}
                                      </p>
                                      <p>
                                        Số ghế thương gia còn{" "}
                                        {flight_.soGheThuongGia}
                                      </p>
                                      <p>
                                        Trạng thái chuyến bay:{" "}
                                        {flight_.trangThaiChuyenBay}
                                      </p>
                                      <p>
                                        Thời gian tạo:{" "}
                                        {convertDateToVNDate(flight_.createdAt)}
                                      </p>
                                      <p>
                                        Thời gian cập nhật:{" "}
                                        {convertDateToVNDate(flight_.updatedAt)}
                                      </p>
                                    </div>
                                  </div>
                                  {enabledUpdate && (
                                    <ItemInputUpdateFlight
                                      flight={flight_}
                                      showAirports={showAirports}
                                      handleShowAirports={handleShowAirports}
                                      showAirline={showAirline}
                                      setShowAirline={setShowAirline}
                                      setShowDetailFlight={setShowDetailFlight}
                                    />
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </>
          ) : (
            <div className="w-full h-full justify-center items-center flex">
              <l-bouncy size="45" speed="1.75" color="white" />
            </div>
          )}
        </>
      )}
    </>
  );
}
export default AdminChuyenBay;

function ItemInputUpdateFlight({
  flight,
  showAirports,
  handleShowAirports,
  showAirline,
  setShowAirline,
  setShowDetailFlight,
}) {
  const queryClient = useQueryClient();

  const useToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  function convertDateFormat(dateString, formatType) {
    if (formatType === "toSlash") {
      // Chuyển đổi từ dd-mm-yyyy sang mm/dd/yyyy
      return moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else if (formatType === "toDash") {
      // Chuyển đổi từ mm/dd/yyyy sang dd-mm-yyyy
      return moment(dateString, "MM/DD/YYYY").format("DD-MM-YYYY");
    } else {
      return "";
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: {
        idCB: flight._id,
        diemBay: flight.diemBay,
        diemDen: flight.diemDen,
        ngayBay: convertDateFormat(flight.ngayBay, "toSlash"),
        gioBay: flight.gioBay,
        ngayDen: convertDateFormat(flight.ngayDen, "toSlash"),
        gioDen: flight.gioDen,
        hangBay: flight.hangBay,
        loaiChuyenBay: flight.loaiChuyenBay,
        gia: flight.gia?.replace(/\./g, "").replace(" VND", ""),
        soGhePhoThong: flight.soGhePhoThong,
        soGheThuongGia: flight.soGheThuongGia,
      },
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { ngayBay, gioBay, ngayDen, gioDen } = watch("items");

  const prevNgayDenRef = useRef(ngayDen);

  useEffect(() => {
    if (ngayBay && gioBay && ngayDen && gioDen) {
      const timeBay = `${ngayBay} ${gioBay}`;
      const timeDen = `${ngayDen} ${gioDen}`;

      const converTimeBay = moment(timeBay);
      const converTimeDen = moment(timeDen);

      if (converTimeBay.isValid() && converTimeDen.isValid()) {
        const newNgayDen = converTimeBay.isAfter(converTimeDen)
          ? moment(ngayBay).add(1, "days").format("YYYY-MM-DD")
          : moment(ngayBay).format("YYYY-MM-DD");

        // Chỉ cập nhật nếu giá trị mới khác với giá trị trước đó
        if (newNgayDen !== prevNgayDenRef.current) {
          prevNgayDenRef.current = newNgayDen; // Cập nhật giá trị trước đó
          setValue("items.ngayDen", newNgayDen);
        }
      } else {
        console.warn("Một trong các thời gian không hợp lệ");
      }
    }
  }, [gioBay, gioDen, ngayBay]);

  const mutationUpdateFlight = useMutation({
    mutationFn: Update,
    onSuccess: (response) => {
      queryClient.invalidateQueries("flights");
      setShowDetailFlight(null);
      toast.success(
        `Update thành công chuyến bay ${response?.data?.flight._id}`,
        useToastOptions
      );
    },
  });

  // Kiem tra chuyen bay da co khach hang dat hay chua
  const mutationCheckFlight = useMutation({
    mutationFn: GetWithIDFLight,

    onError: (error) => {
      return (
        <div>
          Error: {JSON.stringify(error?.response?.data?.error || error)}
        </div>
      );
    },
  });

  const submitFormUpdate = async (data) => {
    const response = await mutationCheckFlight.mutateAsync({
      idF: data.items.idCB,
      trangThai: "Đã thanh toán",
    });
    if (response?.data?.length > 0) {
      toast.warning(
        `Cập nhật không thành công. Chuyến bay này đã có ${response?.data?.length} khách hàng thanh toán`,
        useToastOptions
      );
      return;
    }
    await mutationUpdateFlight.mutate(data?.items);
  };

  const topicUpdate = [
    "Nơi đi",
    "Nơi đến",
    "Ngày bay",
    "Giờ bay",
    "Ngày đến",
    "Giờ đến",
    "Hãng bay",
    "Loại chuyến bay",
    "Giá",
    "Số ghế phổ thông",
    "Số ghế thương gia",
  ];
  const nameRegister = [
    "items.diemBay",
    "items.diemDen",
    "items.ngayBay",
    "items.gioBay",
    "items.ngayDen",
    "items.gioDen",
    "items.hangBay",
    "items.loaiChuyenBay",
    "items.gia",
    "items.soGhePhoThong",
    "items.soGheThuongGia",
  ];

  const cities = [
    "cần thơ",
    "đà nẵng",
    "hải phòng",
    "hà nội",
    "tp.hồ chí minh",
    "huế",
    "nha trang",
    "phú quốc",
    "hạ long",
    "vinh",
    "buôn ma thuột",
    "cà mau",
    "côn đảo",
    "tam kỳ và quảng ngãi",
    "đà lạt",
    "điện biên phủ",
    "đồng hới",
    "pleiku",
    "quy nhơn",
    "rach giá",
    "tuy hòa",
    "vũng tàu",
    "thanh hóa",
  ];

  const AirportsVN = [
    {
      city: "Cần Thơ",
      ICAO: "VVCT",
      IATA: "VCA",
      airport: "Can Tho International Airport",
      location: "10°05′07″N 105°42′43″E",
    },
    {
      city: "Đà Nẵng",
      ICAO: "VVDN",
      IATA: "DAD",
      airport: "Da Nang International Airport",
      location: "16°02′38″N 108°11′58″E",
    },
    {
      city: "Hải Phòng",
      ICAO: "VVCI",
      IATA: "HPH",
      airport: "Cat Bi International Airport",
      location: "20°49′09″N 106°43′29″E",
    },
    {
      city: "Hà Nội",
      ICAO: "VVNB",
      IATA: "HAN",
      airport: "Noi Bai International Airport",
      location: "21°13′16″N 105°48′26″E",
    },
    {
      city: "TP.Hồ Chí Minh",
      ICAO: "VVTS",
      IATA: "SGN",
      airport: "Tan Son Nhat International Airport",
      location: "10°49′08″N 106°39′07″E",
    },
    {
      city: "Huế",
      ICAO: "VVPB",
      IATA: "HUI",
      airport: "Phu Bai International Airport",
      location: "16°24′06″N 107°42′10″E",
    },
    {
      city: "Nha Trang",
      ICAO: "VVCR",
      IATA: "CXR",
      airport: "Cam Ranh International Airport",
      location: "11°59′53″N 109°13′10″E",
    },
    {
      city: "Phú Quốc",
      ICAO: "VVPQ",
      IATA: "PQC",
      airport: "Phu Quoc International Airport",
      location: "10°10′18″N 103°59′28″E",
    },
    {
      city: "Hạ Long",
      ICAO: "VVVD",
      IATA: "VDO",
      airport: "Van Don International Airport",
      location: "21°07′04″N 107°24′51″E",
    },
    {
      city: "Vinh",
      ICAO: "VVVH",
      IATA: "VII",
      airport: "Vinh International Airport",
      location: "18°44′12.21″N 105°40′15.17″E",
    },
    {
      city: "Buôn Ma Thuột",
      ICAO: "VVBM",
      IATA: "BMV",
      airport: "Buon Ma Thuot Airport",
      location: "12°40′05″N 108°07′12″E",
    },
    {
      city: "Cà Mau",
      ICAO: "VVCM",
      IATA: "CAH",
      airport: "Ca Mau Airport",
      location: "09°10′32″N 105°10′46″E",
    },
    {
      city: "Côn Đảo",
      ICAO: "VVCS",
      IATA: "VCS",
      airport: "Con Dao Airport",
      location: "08°43′57″N 106°37′44″E",
    },
    {
      city: "Tam Kỳ và Quảng Ngãi",
      ICAO: "VVCA",
      IATA: "VCL",
      airport: "Chu Lai Airport",
      location: "15°24′22″N 108°42′20″E",
    },
    {
      city: "Đà Lạt",
      ICAO: "VVDL",
      IATA: "DLI",
      airport: "Lien Khuong Airport",
      location: "11°45′02″N 108°22′25″E",
    },
    {
      city: "Điện Biên Phủ",
      ICAO: "VVDB",
      IATA: "DIN",
      airport: "Dien Bien Airport",
      location: "21°23′50″N 103°00′28″E",
    },
    {
      city: "Đồng Hới",
      ICAO: "VVDH",
      IATA: "VDH",
      airport: "Dong Hoi Airport",
      location: "17°30′54″N 106°35′26″E",
    },
    {
      city: "Pleiku",
      ICAO: "VVPK",
      IATA: "PXU",
      airport: "Pleiku Airport",
      location: "14°00′16″N 108°01′02″E",
    },
    {
      city: "Quy Nhơn",
      ICAO: "VVPC",
      IATA: "UIH",
      airport: "Phu Cat Airport",
      location: "13°57′18″N 109°02′32″E",
    },
    {
      city: "Rạch Giá",
      ICAO: "VVRG",
      IATA: "VKG",
      airport: "Rach Gia Airport",
      location: "09°57′35″N 105°08′02″E",
    },
    {
      city: "Tuy Hòa",
      ICAO: "VVTH",
      IATA: "TBB",
      airport: "Tuy Hoa Airport",
      location: "13°02′58″N 109°20′01″E",
    },
    {
      city: "Vũng Tàu",
      ICAO: "VVVT",
      IATA: "VTG",
      airport: "Vung Tau Airport",
      location: "10°22′00″N 107°05′00″E",
    },
    {
      city: "Thanh Hóa",
      ICAO: "VVTX",
      IATA: "THD",
      airport: "Tho Xuan Airport",
      location: "19°54′06″N 105°28′04″E",
    },
  ];

  const typeInput = [
    "text",
    "text",
    "date",
    "time",
    "date",
    "time",
    "text",
    "text",
    "number",
    "number",
    "number",
  ];
  const Airlines = [
    "VietJet",
    "VNA",
    "Pacific Airlines",
    "BamBoo",
    "Vietravel Airlines",
  ];

  const validationRules = [
    {
      required: "* Nơi đi là bắt buộc",
      validate: {
        validCity: (value) => {
          return (
            cities.includes(value.toLowerCase()) ||
            "* Giá trị phải là một trong các thành phố."
          );
        },
        duplicateCity: (value) => {
          return (
            value !== watch("items.diemDen") ||
            "* Không được trùng với nơi đến."
          );
        },
      },
    },
    {
      required: "* Nơi đến là bắt buộc",
      validate: {
        validCity: (value) => {
          return (
            cities.includes(value.toLowerCase()) ||
            "* Giá trị phải là một trong các thành phố."
          );
        },
        duplicateCity: (value) => {
          return (
            value !== watch("items.diemBay") || "* Không được trùng với nơi đi."
          );
        },
      },
    },
    {
      required: "* Ngày đi là bắt buộc.",
      validate: {
        valida: (value) => {
          const today = moment();

          const valueCovert = moment(value);

          return (
            valueCovert.isAfter(today) ||
            "* Ngày bay phải hơn ngày hiện tại 1 ngày."
          );
        },
      },
    },
    { required: "* Giờ bay là bắt buộc." },
    {
      required: "* Ngày đến là bắt buộc.",
    },
    {
      required: "* Giờ đến là bắt buộc.",
    },
    {
      required: "* Hãng bay là bắt buộc.",
      validate: {
        validAirline: (value) => {
          return (
            Airlines.includes(value) ||
            "* Giá trị phải là một trong các hãng bay."
          );
        },
      },
    },
    {
      required: "* Loại chuyến bay là bắt buộc.",
      validate: {
        validLoaiCB: (value) => {
          const loaiCB = ["Chuyến bay đi", "Chuyến bay khứ hồi"];
          return (
            loaiCB.includes(value.trim()) ||
            "* Giá trị phải là một trong 2 lựa chọn."
          );
        },
      },
    },
    {
      required: "* Giá chuyến bay là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return (
            (regex.test(value) && !value.endsWith(".")) ||
            "* Chỉ nhập số tương ứng với giá tiền"
          );
        },
        validCurrency: (value) => {
          const convertValue = parseInt(value, 10);
          return (
            (convertValue >= 700000 && convertValue <= 7000000) ||
            "Giá tiền nằm trong khoảng 700000 - 7000000"
          );
        },
      },
    },
    {
      required: "* Số ghế phổ thông là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return regex.test(value) || "* Chỉ nhập số";
        },
        validSeats: (value) => {
          const convertValue = parseInt(value, 10);

          return (
            (convertValue >= 100 && convertValue <= 140) ||
            "* Số ghế phổ thông phải trong khoảng 100 - 140"
          );
        },
        validTotalSeats: (value) => {
          const convertValue = parseInt(value, 10);
          const seatBussiness = parseInt(watch("items.soGheThuongGia"), 10);

          return (
            convertValue + seatBussiness === 170 ||
            "* Tổng số ghế thường và thương gia phải 170 ghế."
          );
        },
      },
    },
    {
      required: "* Số ghế thương gia là bắt buộc.",
      validate: {
        validValue: (value) => {
          const regex = /^[0-9]+$/;
          return regex.test(value) || "* Chỉ nhập số";
        },
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit(submitFormUpdate)}>
      {Array.from({ length: 11 }, (_, i) => {
        return (
          <div className="mb-6 flex gap-x-5 relative" key={i}>
            <p>{topicUpdate[i]}: </p>
            <input
              className={`outline-none bg-transparent border-b ${
                (i === 4 || i === 7) && "cursor-not-allowed"
              }`}
              type={typeInput[i]}
              required
              disabled={i === 4 || i === 7 ? true : false}
              onClick={(e) => {
                if (i === 0 || i === 1) {
                  e.stopPropagation();
                  handleShowAirports(
                    [0, 1, 2],
                    [true, i === 0 ? true : false, i === 0 ? false : true]
                  );
                }
                if (i === 6) {
                  e.stopPropagation();
                  setShowAirline(true);
                }
              }}
              {...register(nameRegister[i], validationRules[i] || {})}
            />
            {((i === 0 && showAirports[1]) || (i === 1 && showAirports[2])) && (
              <>
                <FilterAirport
                  type={i === 0 ? "diemBay" : "diemDen"}
                  AirportsVN={AirportsVN}
                  diemBay={watch(`items.diemBay`)}
                  diemDen={watch(`items.diemDen`)}
                  watch={watch}
                  setValue={setValue}
                />
              </>
            )}
            {i === 6 && showAirline && (
              <FilterAirline
                airlines={Airlines}
                watch={watch}
                setValue={setValue}
              />
            )}

            {i === 7 && (
              <>
                <input
                  className="cursor-pointer"
                  type="radio"
                  id="flightOne"
                  name="flightType"
                  value="Chuyến bay đi"
                  checked={watch("items.loaiChuyenBay") === "Chuyến bay đi"}
                  onClick={(e) =>
                    setValue("items.loaiChuyenBay", e.target.value)
                  }
                />
                <label className="cursor-pointer" htmlFor="flightOne">
                  Chuyến bay đi
                </label>
                <span className="mx-1">|</span>
                <input
                  className="cursor-pointer"
                  type="radio"
                  id="flightTwo"
                  name="flightType"
                  value="Chuyến bay khứ hồi"
                  checked={
                    watch("items.loaiChuyenBay") === "Chuyến bay khứ hồi"
                  }
                  onClick={(e) =>
                    setValue("items.loaiChuyenBay", e.target.value)
                  }
                />
                <label className="cursor-pointer" htmlFor="flightTwo">
                  Chuyến bay khứ hồi
                </label>
              </>
            )}
            {i === 8 && <span>VND</span>}
            <span className="">
              {(i === 0 &&
                errors?.items?.diemBay &&
                errors?.items?.diemBay?.message) ||
                (i === 1 &&
                  errors?.items?.diemDen &&
                  errors?.items?.diemDen?.message) ||
                (i === 2 &&
                  errors?.items?.ngayBay &&
                  errors?.items?.ngayBay?.message) ||
                (i === 3 &&
                  errors?.items?.gioBay &&
                  errors?.items?.gioBay?.message) ||
                (i === 4 &&
                  errors?.items?.ngayDen &&
                  errors?.items?.ngayDen?.message) ||
                (i === 5 &&
                  errors?.items?.gioDen &&
                  errors?.items?.gioDen?.message) ||
                (i === 6 &&
                  errors?.items?.hangBay &&
                  errors?.items?.hangBay?.message) ||
                (i === 7 &&
                  errors?.items?.loaiChuyenBay &&
                  errors?.items?.loaiChuyenBay?.message) ||
                (i === 8 &&
                  errors?.items?.gia &&
                  errors?.items?.gia?.message) ||
                (i === 9 &&
                  errors?.items?.soGhePhoThong &&
                  errors?.items?.soGhePhoThong?.message) ||
                (i === 10 &&
                  errors?.items?.soGheThuongGia &&
                  errors?.items?.soGheThuongGia?.message)}
            </span>
          </div>
        );
      })}

      {mutationCheckFlight.isPending ? (
        <l-bouncy size="45" speed="1.75" color="white" />
      ) : (
        <>
          {mutationUpdateFlight.isError && (
            <CatchErrorAPI error={mutationUpdateFlight.error} />
          )}
          <button
            className="text-center uppercase tracking-widest w-fit m-auto p-1 rounded-md bg-blue-500"
            type="submit"
          >
            Update chuyến bay
          </button>
        </>
      )}
    </form>
  );
}

ItemInputUpdateFlight.propTypes = {
  flight: PropTypes.object.isRequired,
  showAirports: PropTypes.object.isRequired,
  handleShowAirports: PropTypes.func.isRequired,
  showAirline: PropTypes.bool.isRequired,
  setShowAirline: PropTypes.func.isRequired,
  setShowDetailFlight: PropTypes.func.isRequired,
};

const FilterAirport = ({ type, AirportsVN, watch, setValue }) => {
  const handleChooseAirport = (airport, type) => {
    if (type === "diemBay") {
      setValue("items.diemBay", airport.city);
    }
    if (type === "diemDen") {
      setValue("items.diemDen", airport.city);
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  return (
    <>
      <ul
        className={`bg-black absolute z-10 left-0 top-7
           max-h-44 font-semibold w-fit tracking-wider transition-all duration-1000 overflow-y-auto`}
      >
        {AirportsVN.filter((item) => {
          const searchAirport =
            type === "diemBay"
              ? watch("items.diemBay").toLowerCase().trim()
              : watch("items.diemDen").toLowerCase().trim();
          const city = item.city.toLowerCase();
          const airport = item.airport.toLowerCase();

          return (
            (watch("items.diemBay") && city.includes(searchAirport)) ||
            removeAccents(city).includes(searchAirport) ||
            airport.includes(searchAirport)
          );
        }).map((items) => (
          <li
            className="w-fit h-fit p-2 border-b cursor-pointer whitespace-nowrap"
            key={items.IATA}
            onClick={() => handleChooseAirport(items, type)}
          >
            {items.city + ", " + items.airport}
          </li>
        ))}
      </ul>
    </>
  );
};

FilterAirport.propTypes = {
  type: PropTypes.string.isRequired,
  AirportsVN: PropTypes.array.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

const FilterAirline = ({ airlines, watch, setValue }) => {
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleChooseAirline = (airline) => {
    setValue("items.hangBay", airline);
  };

  return (
    <>
      <ul
        className={`bg-black absolute z-10 left-0 top-7
           max-h-44 font-semibold w-fit tracking-wider transition-all duration-1000 overflow-y-auto`}
      >
        {airlines
          .filter((airline_) => {
            const search = watch("items.hangBay").toLowerCase().trim();

            return (
              airline_.includes(search) ||
              removeAccents(airline_.toLowerCase()).includes(search)
            );
          })
          .map((airline, index) => (
            <li
              className="w-fit h-fit p-2 border-b cursor-pointer whitespace-nowrap"
              key={index}
              onClick={() => handleChooseAirline(airline)}
            >
              {airline}
            </li>
          ))}
      </ul>
    </>
  );
};
FilterAirline.propTypes = {
  airlines: PropTypes.array.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};
