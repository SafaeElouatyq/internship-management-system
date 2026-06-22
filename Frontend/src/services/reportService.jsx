import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createReport = async (reportData) => {
  const response = await axios.post(API_URL, reportData, getToken());
  return response.data;
};

export const getMyReports = async () => {
  const response = await axios.get(`${API_URL}/my-reports`, getToken());
  return response.data;
};
