import { getAllUsers } from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  }catch (error) {
  console.error(error);

  res.status(500).json({
    message: "Error fetching users",
  });
}
};