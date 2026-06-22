import {
  getMyInternships,
  getMyInternshipById,
  addInternship,
  updateInternship,
  deleteInternship,
} from "../services/internshipServie.js";

export const getInternships = async (req, res) => {
  try {
    const internships = await getMyInternships(req.user.id);

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
    const internship = await getMyInternshipById(req.params.id, req.user.id);

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
