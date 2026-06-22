import axios from "axios";

const INTERNSHIP_URL = "http://localhost:5000/api/internships";
const SUPERVISOR_URL = "http://localhost:5000/api/supervisors";

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

export const getSupervisors = async () => {
  const response = await axios.get(SUPERVISOR_URL, getToken());
  return response.data;
};

export const assignSupervisor = async (internshipId, supervisorId) => {
  const response = await axios.put(
    `${INTERNSHIP_URL}/${internshipId}/assign-supervisor`,
    { supervisorId },
    getToken(),
  );

  return response.data;
};

export const updateAdministrativeStatus = async (
  internshipId,
  administrativeStatus,
) => {
  const response = await axios.put(
    `${INTERNSHIP_URL}/${internshipId}/administrative-status`,
    { administrativeStatus },
    getToken(),
  );

  return response.data;
};
