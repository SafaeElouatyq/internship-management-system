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

export const createMeeting = async (meetingData) => {
  const response = await axios.post(API_URL, meetingData, getToken());
  return response.data;
};
