import { getAllSupervisors } from "../services/supervisorService.js";

export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await getAllSupervisors();

    res.status(200).json(supervisors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
