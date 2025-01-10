import axios from "axios";
// Khởi tạo đối tượng Axios (AuthorizedAxiosInstance) muc đích để  custom và cấu hình chung cho dự án

const createAuthorizedAxiosInstance = () => {
  const authorizedAxiosInstance = axios.create();
  authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 5; // 5 minutes
  authorizedAxiosInstance.defaults.withCredentials = true;

  authorizedAxiosInstance.interceptors.request.use(
    (config) => {
      // const accessToken = localStorage.getItem("accessToken");
      // if (accessToken) {
      //   // Cần thêm Bearer vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth2 trong việc xác định loại token đang sử dụng
      //   // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền.
      //   config.headers.Authorization = `Bearer ${accessToken}`;
      // }

      return config;
    },
    (error) => {
      // Làm gì đó với lỗi request
      return Promise.reject(error);
    }
  );

  authorizedAxiosInstance.interceptors.response.use(
    (response) => {
      // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
      // Làm gì đó với dữ liệu response
      return response;
    },
    async (error) => {
      // Nếu nhận 401 thì logout
      // if (error.response?.status === 401) {
      //   return handleSetStateLogin_Logout();
      // }

      // Nếu nhận 410 gọi refresh token
      const originalResquest = error.config;
      if (error.response?.status === 410 && !originalResquest._retry) {
        // originalResquest._retry = true để việc gọi refresh token chỉ gọi 1 lần cho 1 thời điểm
        originalResquest._retry = true;

        // Lấy refresh token
        try {
          const res = await funcRefreshToken();
          if (res) {
            // Nếu sử dụng localStorage
            // const { accessToken } = res.data;
            // localStorage.setItem("accessToken", accessToken);
            // authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            //Sử dụng cookies
            // return lại axios instance để gọi lại request ban đầu bị lỗi
            // return authorizedAxiosInstance(originalResquest);
            window.location.reload();
            return;
          }
        } catch (err) {
          handleSetStateLogin_Logout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
  return authorizedAxiosInstance;
};

const authorizedAxiosInstance = createAuthorizedAxiosInstance();

const handleSetStateLogin_Logout = async () => {
  // setShowOptionSetting_LoginSuccess(!isShowOptionSetting_LoginSuccess);

  localStorage.removeItem("user");
  localStorage.removeItem("dtSelect1Value");
  localStorage.removeItem("dtSelect2Value");
  localStorage.removeItem("dtNgayDi");

  const res = await authorizedAxiosInstance.delete(
    `https://travrel-server.vercel.app/user/logout`
  );
  if (res.status === 200) {
    window.location.href = "/";
  }
  // Trường hợp 2: Dùng Http Only cookie > gọi api xử lý remove cookie
};
const funcRefreshToken = async () => {
  return await authorizedAxiosInstance.put(
    `https://travrel-server.vercel.app/user/refresh-token`
  );
};

export { authorizedAxiosInstance };
