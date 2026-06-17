import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/login`,
    credentials
  );

  return response.data;
};