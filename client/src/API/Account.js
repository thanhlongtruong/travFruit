import axios from "../Components/Utils/authAxios.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Login = async (data) => {
  return await axios.post("/user/login", {
    numberPhone: data.phoneLogin,
    password: data.passwordLogin,
  });
};
export const Logout = async () => {
  return await axios.delete(`/user/logout`);
};
export const Get = async () => {
  return await axios.get("/user/get");
};
export const Register = async (data) => {
  return await axios.post("/user/register", {
    numberPhone: data.phone,
    fullName: data.fullName,
    gender: data.gender,
    birthday: data.birthday,
    password: data.password,
  });
};
const GetReservaton = async ({ queryKey }) => {
  const [_key, { page, type }] = queryKey;
  return await axios.get(`/user/reservation?page=${page}&type=${type}`);
};

export const useReservations = (page, type) => {
  return useQuery({
    queryKey: ["reservations", { page, type }],
    queryFn: GetReservaton,
    refetchOnWindowFocus: false,
  });
};
