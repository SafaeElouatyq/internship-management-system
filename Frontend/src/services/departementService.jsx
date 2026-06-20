import axios from "axios";

const API_URL = "http://localhost:5000/api/departments";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDepartments = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};