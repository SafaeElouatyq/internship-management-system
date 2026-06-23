import axios from "axios";

const INTERNSHIP_API_URL = "http://localhost:5000/api/internships";
const DOCUMENTS_API_URL = "http://localhost:5000/api/documents";
const FILE_URL = "http://localhost:5000";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInternshipDocuments = async (internshipId) => {
  const response = await axios.get(
    `${INTERNSHIP_API_URL}/${internshipId}/documents`,
    getToken(),
  );
  return response.data;
};

export const uploadDocument = async (internshipId, type, file) => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

  const response = await axios.post(
    `${INTERNSHIP_API_URL}/${internshipId}/documents`,
    formData,
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

export const deleteDocument = async (documentId) => {
  const response = await axios.delete(
    `${DOCUMENTS_API_URL}/${documentId}`,
    getToken(),
  );

  return response.data;
};

export const getAllInternshipDocuments = async () => {
  const response = await axios.get(DOCUMENTS_API_URL, getToken());
  return response.data;
};

export const getDocumentUrl = (fileUrl) => `${FILE_URL}${fileUrl}`;
