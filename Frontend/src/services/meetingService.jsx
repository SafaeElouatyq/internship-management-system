import axios from "axios";

const API_URL = "http://localhost:5000/api/meetings";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getStudentMeetings = async () => {
  const response = await axios.get(`${API_URL}/student`, getToken());
  return response.data;
};
