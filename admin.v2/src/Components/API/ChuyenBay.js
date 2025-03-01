import axios from "../axiosInstance.js";
import moment from "moment";

export const Get = async ({ id }) => {
  return await axios.get(`/flights/search?id=${id}`);
};
export const GetAll = async ({ page, type }) => {
  return await axios.get(`/flights/get_all?page=${page}&type=${type}`);
};

export const Update = async (data) => {
  const converFormatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
  };

  return await axios.post(`/flights/update`, {
    id: data.idCB,
    diemBay: data.diemBay,
    diemDen: data.diemDen,
    ngayBay: converFormatDate(data.ngayBay),
    gioBay: data.gioBay,
    ngayDen: converFormatDate(data.ngayDen),
    gioDen: data.gioDen,
    hangBay: data.hangBay,
    loaiChuyenBay: data.loaiChuyenBay,
    gia: data.gia,
    soGhePhoThong: parseInt(data.soGhePhoThong, 10),
    soGheThuongGia: parseInt(data.soGheThuongGia, 10),
  });
};
