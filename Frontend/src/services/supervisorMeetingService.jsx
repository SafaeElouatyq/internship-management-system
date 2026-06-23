import axios from "axios";

const API_URL = "http://localhost:5000/api/meetings";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSupervisorMeetings = async () => {
  const response = await axios.get(`${API_URL}/supervisor`, getToken());
  return response.data;
};

export const getSupervisorMeeting = async (meetingId) => {
  const response = await axios.get(`${API_URL}/${meetingId}`, getToken());
  return response.data;
};

export const createMeeting = async (meetingData) => {
  const response = await axios.post(API_URL, meetingData, getToken());
  return response.data;
};

export const updateMeeting = async (meetingId, meetingData) => {
  const response = await axios.put(
    `${API_URL}/${meetingId}`,
    meetingData,
    getToken(),
  );
  return response.data;
};

export const deleteMeeting = async (meetingId) => {
  const response = await axios.delete(`${API_URL}/${meetingId}`, getToken());
  return response.data;
};
