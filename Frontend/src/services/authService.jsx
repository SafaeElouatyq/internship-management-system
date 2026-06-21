import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/login`,
    credentials
  );

  return response.data;
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
    }
  );

  return response.data;
};
