import { getAllDepartments } from "../services/departmentService.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await getAllDepartments();

    res.status(200).json(departments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching departments",
    });
  }
};