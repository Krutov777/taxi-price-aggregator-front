import axiosInstance from "./api";
import TokenService from "./tokenService";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/auth/token" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            TokenService.updateLocalAccessToken(TokenService.getLocalRefreshToken());
            const rs = await axiosInstance.post("/auth/token");

            const { accessToken } = rs.data;

            store.dispatch('auth/token', accessToken);
            TokenService.updateLocalAccessToken(accessToken);

            return axiosInstance(originalConfig);
            // TokenService.updateLocalAccessToken(TokenService.getLocalRefreshToken());
            // await axiosInstance.post(
            //   "/auth/token"
            //   )
            //   .then(function (response) {
            //     const { accessToken } = response.data;
            //     store.dispatch('/auth/token', accessToken);
            //     TokenService.updateLocalAccessToken(accessToken);
            //     return axiosInstance(originalConfig);
            //   })
            //   .catch((e) => {
            //     if (e !== 200) {
            //     TokenService.removeUser();
            //     }
            // })
            
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;