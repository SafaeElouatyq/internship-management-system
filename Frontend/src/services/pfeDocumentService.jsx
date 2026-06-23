import axios from "axios";

const API_URL = "http://localhost:5000/api/pfe-documents";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyPfeDocuments = async () => {
  const response = await axios.get(`${API_URL}/my`, getToken());
  return response.data;
};

export const uploadPfeDocument = async (category, file) => {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("file", file);

  const response = await axios.post(API_URL, formData, {
    ...getToken(),
    headers: {
      ...getToken().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deletePfeDocument = async (documentId) => {
  const response = await axios.delete(`${API_URL}/${documentId}`, getToken());
  return response.data;
};

export const getSupervisorPfeDocuments = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/supervisor`, {
    ...getToken(),
    params: filters,
  });

  return response.data;
};

export const validatePfeDocument = async (
  documentId,
  validationStatus,
  supervisorComment,
) => {
  const response = await axios.patch(
    `${API_URL}/supervisor/${documentId}/validate`,
    { validationStatus, supervisorComment },
    getToken(),
  );

  return response.data;
};
