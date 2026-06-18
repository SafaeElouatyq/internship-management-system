import { getAllUsers,createUser } from "../services/userService.js";

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


export const addUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};