import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUsers = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, getToken());
  return response.data;
};

