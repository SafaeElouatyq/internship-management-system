import * as authService from "../services/authService.js";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    const result = await authService.login(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "Mot de passe requis",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    res.status(200).json({
      message: "Mot de passe changé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
