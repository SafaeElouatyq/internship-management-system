import {
  getAssignedInternships,
  getAssignedInternshipById,
} from "../services/supervisorInternshipService.js";

export const getSupervisorInternships = async (req, res) => {
  try {
    const data = await getAssignedInternships(req.user.id, {
      student: req.query.student || "",
      status: req.query.status || "",
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorInternship = async (req, res) => {
  try {
    const internship = await getAssignedInternshipById(
      req.user.id,
      req.params.id,
    );

    res.status(200).json(internship);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  }
};
