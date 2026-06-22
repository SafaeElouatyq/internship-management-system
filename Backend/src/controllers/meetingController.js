import {
  createMeeting,
  getStudentMeetings,
  getSupervisorMeetings,
} from "../services/meetingService.js";

export const scheduleMeeting = async (req, res) => {
  try {
    const meeting = await createMeeting(req.user.id, req.body);

    res.status(201).json({
      message: "Réunion planifiée avec succès",
      meeting,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMeetingsForStudent = async (req, res) => {
  try {
    const meetings = await getStudentMeetings(req.user.id);

    res.status(200).json(meetings);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMeetingsForSupervisor = async (req, res) => {
  try {
    const data = await getSupervisorMeetings(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
