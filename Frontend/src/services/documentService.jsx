import axios from "axios";

const API_URL = "http://localhost:5000/api/documents";
const FILE_URL = "http://localhost:5000";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDocuments = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};

export const uploadDocument = async (name, file) => {
  const formData = new FormData();
  formData.append("name", name);
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

export const deleteDocument = async (documentId) => {
  const response = await axios.delete(
    `${API_URL}/${documentId}`,
    getToken(),
  );

  return response.data;
};

export const getDocumentUrl = (documentPath) => {
  return `${FILE_URL}${documentPath}`;
};
