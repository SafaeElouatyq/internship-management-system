import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

export const changePassword = async (passwordData) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/change-password`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const initAuthInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      if (error.response?.status === 401 && !isLoginRequest) {
        logout();

        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }

      return Promise.reject(error);
    },
  );
};
