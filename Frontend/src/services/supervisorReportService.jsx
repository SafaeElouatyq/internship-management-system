import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSupervisorReports = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/supervisor`, {
    ...getToken(),
    params: filters,
  });

  return response.data;
};

export const getSupervisorReport = async (reportId) => {
  const response = await axios.get(
    `${API_URL}/supervisor/${reportId}`,
    getToken(),
  );

  return response.data;
};

export const updateSupervisorReportComment = async (reportId, supervisorComment) => {
  const response = await axios.patch(
    `${API_URL}/supervisor/${reportId}/comment`,
    { supervisorComment },
    getToken(),
  );

  return response.data;
};
