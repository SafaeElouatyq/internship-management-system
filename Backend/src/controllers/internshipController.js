import {
  getAllInternships,
  getMyInternships,
  getInternshipById,
  getMyInternshipById,
  addInternship,
  updateInternship,
  deleteInternship,
  assignSupervisor,
  updateAdministrativeStatus,
} from "../services/internshipServie.js";

export const getInternships = async (req, res) => {
  try {
    const internships =
      req.user.role === "INTERNSHIP_MANAGER"
        ? await getAllInternships({
            student: req.query.student || "",
            company: req.query.company || "",
            status: req.query.status || "",
          })
        : await getMyInternships(req.user.id);

    res.status(200).json(internships);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getInternship = async (req, res) => {
  try {
    const internship =
      req.user.role === "INTERNSHIP_MANAGER"
        ? await getInternshipById(req.params.id)
        : await getMyInternshipById(req.params.id, req.user.id);

    res.status(200).json(internship);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  }
};

export const createInternship = async (req, res) => {
  try {
    const internship = await addInternship(req.body, req.user.id);

    res.status(201).json({
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const editInternship = async (req, res) => {
  try {
    const internship = await updateInternship(
      req.params.id,
      req.body,
      req.user.id,
    );

    res.status(200).json({
      message: "Internship updated successfully",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeInternship = async (req, res) => {
  try {
    await deleteInternship(req.params.id, req.user.id);

    res.status(200).json({
      message: "Internship deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const assignInternshipSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;

    const internship = await assignSupervisor(req.params.id, supervisorId);

    res.status(200).json({
      message: "Supervisor assigned successfully",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const verifyAdministrativeFile = async (req, res) => {
  try {
    const { administrativeStatus } = req.body;

    const internship = await updateAdministrativeStatus(
      req.params.id,
      administrativeStatus,
    );

    res.status(200).json({
      message: "Administrative file updated successfully",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
