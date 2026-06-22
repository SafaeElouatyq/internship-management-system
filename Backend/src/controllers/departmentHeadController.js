import {
  getValidatedInternships,
  getDepartmentHeadSupervisors,
} from "../services/departmentHeadService.js";

export const getInternships = async (req, res) => {
  try {
    const internships = await getValidatedInternships();

    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await getDepartmentHeadSupervisors();

    res.status(200).json(supervisors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

