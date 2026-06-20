import axios from "axios";

const API_URL = "http://localhost:5000/api/roles";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getRoles = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};