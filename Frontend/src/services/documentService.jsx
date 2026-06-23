import axios from "axios";
import {
  getAllInternshipDocuments,
  getDocumentUrl,
} from "./internshipDocumentService.jsx";

const API_URL = "http://localhost:5000/api/documents";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDocuments = async () => {
  const data = await getAllInternshipDocuments();
  return data.documents;
};

export const deleteDocument = async (documentId) => {
  const response = await axios.delete(`${API_URL}/${documentId}`, getToken());
  return response.data;
};

export { getDocumentUrl };
