import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const role = req.query.role || "";

    const users = await getAllUsers(search, role);

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors du chargement des utilisateurs",
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    res.status(200).json({
      message: "Utilisateur modifié avec succès",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    await deleteUser(req.params.id);

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
