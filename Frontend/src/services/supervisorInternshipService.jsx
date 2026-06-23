import axios from "axios";

const API_URL = "http://localhost:5000/api/supervisor";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAssignedInternships = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/internships`, {
    ...getToken(),
    params: filters,
  });

  return response.data;
};

export const getAssignedInternship = async (internshipId) => {
  const response = await axios.get(
    `${API_URL}/internships/${internshipId}`,
    getToken(),
  );

  return response.data;
};

export const validateSubject = async (internshipId, payload) => {
  const response = await axios.post(
    `${API_URL}/internships/${internshipId}/subject-validation`,
    payload,
    getToken(),
  );

  return response.data;
};

export const getSubjectValidations = async (internshipId) => {
  const response = await axios.get(
    `${API_URL}/internships/${internshipId}/subject-validations`,
    getToken(),
  );

  return response.data;
};
