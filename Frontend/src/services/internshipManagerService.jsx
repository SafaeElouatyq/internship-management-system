import axios from "axios";

const INTERNSHIP_URL = "http://localhost:5000/api/internships";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInternships = async (filters = {}) => {
  const response = await axios.get(INTERNSHIP_URL, {
    ...getToken(),
    params: filters,
  });

  return response.data;
};

export const getInternship = async (internshipId) => {
  const response = await axios.get(
    `${INTERNSHIP_URL}/${internshipId}`,
    getToken(),
  );

  return response.data;
};

export const validateInternship = async (internshipId) => {
  const response = await axios.patch(
    `${INTERNSHIP_URL}/${internshipId}/validate`,
    {},
    getToken(),
  );

  return response.data;
};

export const rejectInternship = async (internshipId) => {
  const response = await axios.patch(
    `${INTERNSHIP_URL}/${internshipId}/reject`,
    {},
    getToken(),
  );

  return response.data;
};
