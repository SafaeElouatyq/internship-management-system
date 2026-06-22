import {
  createComplaint,
  getMyComplaints,
} from "../services/complaintService.js";

export const addComplaint = async (req, res) => {
  try {
    const complaint = await createComplaint(req.user.id, req.body);

    res.status(201).json({
      message: "Réclamation envoyée avec succès",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await getMyComplaints(req.user.id);

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
