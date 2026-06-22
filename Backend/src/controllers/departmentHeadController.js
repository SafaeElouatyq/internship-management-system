import {
  assignAcademicSupervisor,
  getCompleteInternships,
  getDepartmentHeadSupervisors,
} from "../services/departmentHeadService.js";

export const getInternships = async (req, res) => {
  try {
    const internships = await getCompleteInternships();

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

export const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;

    const internship = await assignAcademicSupervisor(
      req.params.id,
      supervisorId,
    );

    res.status(200).json({
      message: "Supervisor assigned successfully",
      internship,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
