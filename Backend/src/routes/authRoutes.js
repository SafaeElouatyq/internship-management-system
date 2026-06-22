import { Router } from "express";
import { login, changePassword, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.patch("/change-password", authMiddleware, changePassword);

export default router;
