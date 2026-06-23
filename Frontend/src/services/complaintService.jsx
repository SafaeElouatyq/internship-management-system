import axios from "axios";

const API_URL = "http://localhost:5000/api/complaints";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyComplaints = async () => {
  const response = await axios.get(`${API_URL}/my-complaints`, getToken());
  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await axios.post(API_URL, complaintData, getToken());
  return response.data;
};
