import axios from "axios";

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshDone(success: boolean): void {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

const AUTH_EXCLUDED_URLS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

/**
 * Sets up global axios defaults and the 401-refresh interceptor.
 * Call once at app bootstrap before rendering.
 */
export function setupAxios(): void {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3002";
  axios.defaults.withCredentials = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const url: string | undefined = error.config?.url;
      const isAuthUrl = url && AUTH_EXCLUDED_URLS.some((u) => url.includes(u));

      if (status === 401 && !isAuthUrl && !error.config?._retried) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push((success: boolean) => {
              if (success) {
                error.config._retried = true;
                resolve(axios(error.config));
              } else {
                reject(error);
              }
            });
          });
        }

        isRefreshing = true;
        try {
          await axios.post("/api/auth/refresh");
          isRefreshing = false;
          onRefreshDone(true);
          error.config._retried = true;
          return axios(error.config);
        } catch {
          isRefreshing = false;
          onRefreshDone(false);
          localStorage.removeItem("user");
          localStorage.removeItem("activeTeamId");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );
}
