import axios from "axios";

const API_URL = "http://localhost:5000/api/final-decisions";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFinalDecisions = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};

export const createFinalDecision = async (decisionData) => {
  const response = await axios.post(API_URL, decisionData, getToken());
  return response.data;
};

export const getMyFinalDecision = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};
