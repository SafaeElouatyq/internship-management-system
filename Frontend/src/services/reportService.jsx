import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const buildReportFormData = (reportData, files = []) => {
  const formData = new FormData();

  Object.entries(reportData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  files.forEach((file) => {
    formData.append("attachments", file);
  });

  return formData;
};

export const createReport = async (reportData, files = []) => {
  const response = await axios.post(
    API_URL,
    buildReportFormData(reportData, files),
    {
      ...getToken(),
      headers: {
        ...getToken().headers,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const updateReport = async (reportId, reportData, files = []) => {
  const response = await axios.put(
    `${API_URL}/${reportId}`,
    buildReportFormData(reportData, files),
    {
      ...getToken(),
      headers: {
        ...getToken().headers,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await axios.delete(`${API_URL}/${reportId}`, getToken());
  return response.data;
};

export const getMyReports = async () => {
  const response = await axios.get(`${API_URL}/my-reports`, getToken());
  return response.data;
};

export const getMyReport = async (reportId) => {
  const response = await axios.get(`${API_URL}/${reportId}`, getToken());
  return response.data;
};
