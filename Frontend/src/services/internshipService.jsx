import axios from "axios";

const API_URL = "http://localhost:5000/api/internships";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInternships = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};

export const getInternship = async (internshipId) => {
  const response = await axios.get(`${API_URL}/${internshipId}`, getToken());
  return response.data;
};

export const createInternship = async (internshipData) => {
  const response = await axios.post(API_URL, internshipData, getToken());
  return response.data;
};

export const updateInternship = async (internshipId, internshipData) => {
  const response = await axios.put(
    `${API_URL}/${internshipId}`,
    internshipData,
    getToken(),
  );

  return response.data;
};

export const deleteInternship = async (internshipId) => {
  const response = await axios.delete(`${API_URL}/${internshipId}`, getToken());
  return response.data;
};
