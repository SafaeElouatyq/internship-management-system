import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSupervisorReports = async () => {
  const response = await axios.get(`${API_URL}/supervisor`, getToken());
  return response.data;
};
