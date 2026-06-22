import axios from "axios";

const API_URL = "http://localhost:5000/api/department-head";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInternships = async () => {
  const response = await axios.get(`${API_URL}/internships`, getToken());
  return response.data;
};

export const getSupervisors = async () => {
  const response = await axios.get(`${API_URL}/supervisors`, getToken());
  return response.data;
};

export const assignSupervisor = async (internshipId, supervisorId) => {
  const response = await axios.put(
    `${API_URL}/internships/${internshipId}/assign-supervisor`,
    { supervisorId },
    getToken(),
  );

  return response.data;
};
