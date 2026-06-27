import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaint,
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

export const listComplaints = async (req, res) => {
  try {
    const { status = "", student = "", search = "" } = req.query;
    const complaints = await getAllComplaints({ status, student, search });

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

export const getComplaint = async (req, res) => {
  try {
    const complaint = await getComplaintById(req.params.id);

    res.status(200).json({
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const editComplaint = async (req, res) => {
  try {
    const complaint = await updateComplaint(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: "Réclamation mise à jour avec succès",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
