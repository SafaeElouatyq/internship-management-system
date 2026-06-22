import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUsers = async (search = "", role = "") => {
  const response = await axios.get(API_URL, {
    ...getToken(),
    params: {
      search,
      role,
    },
  });

  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, getToken());
  return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/${userId}`, userData, getToken());
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/${userId}`, getToken());
    return response.data;
}
